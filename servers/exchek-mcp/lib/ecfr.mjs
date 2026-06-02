// Local-first eCFR data fetcher.
// Primary: ecfr.gov (authoritative). Fallback: api.exchek.us (public Cloudflare
// edge cache of the same data, no auth, no PII). Cached locally under
// ${CLAUDE_PLUGIN_DATA}/ecfr/ for 24h. The fallback is automatic and the source
// used (cache / ecfr.gov / api.exchek.us) is recorded on every response. Users
// who prefer the hosted path can instead select the separate "exchek-api" MCP
// server (https://api.exchek.us/mcp) via the data-source gate.
//
// The eCFR developer API exposes:
//   GET https://www.ecfr.gov/api/versioner/v1/structure/current/title-15.json
//   GET https://www.ecfr.gov/api/versioner/v1/structure/current/title-22.json
//   GET https://www.ecfr.gov/api/versioner/v1/full/{date}/title-{n}.xml?part={part}
//
// The ExChek API mirror exposes the part subtree directly, for all 11 supported
// parts (121, 734, 738, 740, 742, 744, 746, 748, 762, 772, 774):
//   GET https://api.exchek.us/api/ecfr/{part}
//
// We cache structure JSON for 24 hours, then refresh.

import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

export const TITLE_FOR_PART = {
  "121": 22,
  "732": 15, "734": 15, "738": 15, "740": 15, "742": 15, "744": 15, "746": 15,
  "748": 15, "762": 15, "772": 15, "774": 15,
};

// Parts mirrored by api.exchek.us (per GET /api/ecfr/meta — all 11 supported parts).
export const EXCHEK_API_PARTS = new Set([
  "121", "734", "738", "740", "742", "744", "746", "748", "762", "772", "774",
]);
const EXCHEK_API_BASE = "https://api.exchek.us";

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

  // Primary: ecfr.gov full title structure, extract the requested part subtree.
  // Fallback: api.exchek.us part endpoint when ecfr.gov is unreachable AND the part is mirrored.
  let partNode = null;
  let source = null;
  let primaryError = null;
  try {
    const url = `https://www.ecfr.gov/api/versioner/v1/structure/current/title-${title}.json`;
    const titleJson = await fetchWithTimeout(url);
    const tree = JSON.parse(titleJson);
    partNode = findPart(tree, partKey);
    if (!partNode) {
      throw new Error(`Part ${partKey} not found in title ${title} structure.`);
    }
    source = "ecfr.gov";
  } catch (e) {
    primaryError = e;
    if (EXCHEK_API_PARTS.has(partKey)) {
      const url = `${EXCHEK_API_BASE}/api/ecfr/${partKey}`;
      const body = await fetchWithTimeout(url);
      partNode = JSON.parse(body);
      source = "api.exchek.us";
    } else {
      throw primaryError;
    }
  }

  await writeCached(filename, JSON.stringify(partNode));
  return {
    part: partKey,
    title,
    source,
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

// Resolve the most recent amendment date eCFR has on file for a part.
async function latestVersionDate(title, part) {
  try {
    const url = `https://www.ecfr.gov/api/versioner/v1/versions/title-${title}.json?part=${part}`;
    const body = await fetchWithTimeout(url);
    const data = JSON.parse(body);
    const dates = (data.content_versions || [])
      .map((v) => v.date)
      .filter(Boolean)
      .sort();
    if (dates.length) return dates[dates.length - 1];
  } catch {
    /* fall through to today */
  }
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// Crude but dependable XML→text for eCFR full-text payloads.
function stripXml(xml) {
  let s = xml.replace(/<[^>]+>/g, " ");
  const named = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#xA7;": "§", "&#167;": "§" };
  for (const [k, v] of Object.entries(named)) s = s.split(k).join(v);
  s = s.replace(/&#x([0-9A-Fa-f]+);/g, (_, h) => {
    try { return String.fromCodePoint(parseInt(h, 16)); } catch { return " "; }
  });
  s = s.replace(/&#(\d+);/g, (_, d) => {
    try { return String.fromCodePoint(parseInt(d, 10)); } catch { return " "; }
  });
  s = s.replace(/&[a-z]+;/gi, " ");
  return s.replace(/[ \t]+/g, " ").replace(/\s*\n\s*\n+/g, "\n").trim();
}

const MAX_FULL_TEXT_CHARS = 60000;

/**
 * Fetch the full regulatory TEXT of a part from ecfr.gov (the structure tools
 * only return the hierarchy). Used for content that lives in section/appendix
 * prose — e.g. the red-flag list in Supplement No. 3 to Part 732. Cached 24h.
 *
 * @param {string} part   Part number (must be in TITLE_FOR_PART).
 * @param {object} opts
 * @param {string} [opts.contains]  If given, return the slice starting at the first
 *                                  occurrence of this marker (e.g. "Supplement No. 3").
 * @param {number} [opts.max]       Max characters to return (default 60000).
 * Note: ecfr.gov only — api.exchek.us does not expose full text and does not mirror Part 732.
 */
export async function getFullText(part, { contains = null, max = MAX_FULL_TEXT_CHARS } = {}) {
  const partKey = String(part);
  const title = TITLE_FOR_PART[partKey];
  if (!title) {
    throw new Error(`Unsupported eCFR part: ${partKey}. Supported: ${Object.keys(TITLE_FOR_PART).join(", ")}`);
  }
  const filename = `title-${title}-part-${partKey}-full.xml`;

  let xml = null;
  let fetched_at = null;
  const cached = await readCached(filename);
  if (cached && cached.fresh) {
    xml = cached.body;
    fetched_at = cached.fetched_at;
  } else {
    const date = await latestVersionDate(title, partKey);
    const url = `https://www.ecfr.gov/api/versioner/v1/full/${date}/title-${title}.xml?part=${partKey}`;
    xml = await fetchWithTimeout(url, 30000);
    await writeCached(filename, xml);
    fetched_at = new Date().toISOString();
  }

  let text = stripXml(xml);
  let sliced = false;
  if (contains) {
    const idx = text.indexOf(contains);
    if (idx >= 0) {
      text = text.slice(idx);
      sliced = true;
    }
  }
  const truncated = text.length > max;
  return {
    part: partKey,
    title,
    source: cached && cached.fresh ? "cache" : "ecfr.gov",
    fetched_at,
    contains: contains || null,
    sliced,
    truncated,
    text: text.slice(0, max),
  };
}
