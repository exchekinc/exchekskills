// Local-first eCFR data fetcher.
// Pulls part structure straight from ecfr.gov (the authoritative source) and
// caches under ${CLAUDE_PLUGIN_DATA}/ecfr/. No ExChek-hosted dependency.
//
// The eCFR developer API exposes:
//   GET https://www.ecfr.gov/api/versioner/v1/structure/current/title-15.json
//   GET https://www.ecfr.gov/api/versioner/v1/structure/current/title-22.json
//   GET https://www.ecfr.gov/api/versioner/v1/full/{date}/title-{n}.xml?part={part}
//
// We cache structure JSON for 24 hours, then refresh.

import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const TITLE_FOR_PART = {
  "121": 22,
  "734": 15, "738": 15, "740": 15, "742": 15, "744": 15, "746": 15,
  "748": 15, "762": 15, "772": 15, "774": 15,
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const STALE_AFTER_MS = 30 * 24 * 60 * 60 * 1000; // 30 days = regulatory-drift caveat.

function cacheDir() {
  const root = process.env.CLAUDE_PLUGIN_DATA || join(process.env.HOME || "/tmp", ".exchek-mcp-data");
  return join(root, "ecfr");
}

async function ensureCacheDir() {
  await mkdir(cacheDir(), { recursive: true });
}

async function readCached(filename) {
  try {
    const path = join(cacheDir(), filename);
    const s = await stat(path);
    const age = Date.now() - s.mtimeMs;
    const fresh = age < CACHE_TTL_MS;
    const stale = age > STALE_AFTER_MS;
    const body = await readFile(path, "utf8");
    return { body, fetched_at: s.mtime.toISOString(), fresh, stale };
  } catch {
    return null;
  }
}

async function writeCached(filename, body) {
  await ensureCacheDir();
  await writeFile(join(cacheDir(), filename), body, "utf8");
}

async function fetchWithTimeout(url, ms = 15000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "exchek-mcp/3.0 (local-first; +https://github.com/exchekinc/exchekskills)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

export async function getPart(part, { force_refresh = false } = {}) {
  const partKey = String(part);
  const title = TITLE_FOR_PART[partKey];
  if (!title) {
    throw new Error(`Unsupported eCFR part: ${partKey}. Supported: ${Object.keys(TITLE_FOR_PART).join(", ")}`);
  }
  const filename = `title-${title}-part-${partKey}-structure.json`;

  if (!force_refresh) {
    const cached = await readCached(filename);
    if (cached && cached.fresh) {
      return {
        part: partKey,
        title,
        source: "cache",
        fetched_at: cached.fetched_at,
        stale: cached.stale,
        body: JSON.parse(cached.body),
      };
    }
  }

  // Fetch the title structure and extract the requested part subtree to keep payloads small.
  const url = `https://www.ecfr.gov/api/versioner/v1/structure/current/title-${title}.json`;
  const titleJson = await fetchWithTimeout(url);
  const tree = JSON.parse(titleJson);
  const partNode = findPart(tree, partKey);
  if (!partNode) {
    throw new Error(`Part ${partKey} not found in title ${title} structure.`);
  }
  const body = JSON.stringify(partNode);
  await writeCached(filename, body);
  return {
    part: partKey,
    title,
    source: "ecfr.gov",
    fetched_at: new Date().toISOString(),
    stale: false,
    body: partNode,
  };
}

function findPart(node, partId) {
  if (!node) return null;
  if (node.type === "part" && String(node.identifier) === String(partId)) return node;
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findPart(child, partId);
      if (found) return found;
    }
  }
  return null;
}

export async function searchPart(part, query) {
  const { body, fetched_at, source } = await getPart(part);
  const q = String(query || "").trim().toLowerCase();
  if (!q) return { part: String(part), query, hits: [], fetched_at, source };

  const hits = [];
  walk(body, (node, path) => {
    const label = (node.label || node.label_description || "").toString();
    const description = (node.description || "").toString();
    const hay = `${label} ${description}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        identifier: node.identifier || null,
        label,
        type: node.type || null,
        path: path.join(" > "),
      });
    }
  });
  return { part: String(part), query, hit_count: hits.length, hits: hits.slice(0, 200), fetched_at, source };
}

function walk(node, fn, path = []) {
  if (!node || typeof node !== "object") return;
  fn(node, path);
  if (Array.isArray(node.children)) {
    const next = [...path, node.label || node.identifier || node.type || "?"];
    for (const c of node.children) walk(c, fn, next);
  }
}

export function regulatoryCurrencyAge(fetchedAtIso) {
  const ageMs = Date.now() - new Date(fetchedAtIso).getTime();
  const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));
  return {
    fetched_at: fetchedAtIso,
    age_days: ageDays,
    drift_warning: ageDays > 30,
    canonical_caveat:
      ageDays > 30
        ? "Determination is older than 30 days. Re-run before relying on it."
        : "Within 30-day regulatory currency window.",
  };
}
