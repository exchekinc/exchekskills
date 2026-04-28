// HMAC-chained append-only audit log. Aligned with the Cowork audit.jsonl
// pattern: each line is a JSON object whose `prev_hmac` field is the HMAC of
// the previous line. Tampering with any earlier line breaks the chain and is
// detectable by `verify()`.
//
// The HMAC key is read from CLAUDE_PLUGIN_OPTION_AUDIT_KEY (sensitive userConfig).
// If unset, a random key is generated on first run and persisted to
// ${CLAUDE_PLUGIN_DATA}/audit.key with owner-only permissions. Users on Cowork
// who want OS-keychain storage should set the audit key via /plugin config.

import { createHmac, randomBytes } from "node:crypto";
import { appendFile, readFile, writeFile, stat, mkdir, chmod } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

function dataDir() {
  return process.env.CLAUDE_PLUGIN_DATA || join(process.env.HOME || "/tmp", ".exchek-mcp-data");
}
function logPath() { return join(dataDir(), "audit.jsonl"); }
function keyPath() { return join(dataDir(), "audit.key"); }

let cachedKey = null;
async function getKey() {
  if (cachedKey) return cachedKey;
  const supplied = process.env.CLAUDE_PLUGIN_OPTION_AUDIT_KEY;
  if (supplied && supplied.length >= 32) {
    cachedKey = Buffer.from(supplied, "utf8");
    return cachedKey;
  }
  await mkdir(dataDir(), { recursive: true });
  if (existsSync(keyPath())) {
    cachedKey = await readFile(keyPath());
    return cachedKey;
  }
  cachedKey = randomBytes(32);
  await writeFile(keyPath(), cachedKey, { mode: 0o600 });
  await chmod(keyPath(), 0o600);
  return cachedKey;
}

async function lastHmac() {
  try {
    const buf = await readFile(logPath(), "utf8");
    const lines = buf.trimEnd().split("\n").filter(Boolean);
    if (lines.length === 0) return null;
    const last = JSON.parse(lines[lines.length - 1]);
    return last.hmac || null;
  } catch {
    return null;
  }
}

export async function append(event) {
  await mkdir(dataDir(), { recursive: true });
  const key = await getKey();
  const prev = await lastHmac();
  const entry = {
    ts: new Date().toISOString(),
    prev_hmac: prev,
    event_type: event.event_type || "unspecified",
    skill: event.skill || null,
    tool: event.tool || null,
    actor: event.actor || "claude",
    summary: typeof event.summary === "string" ? event.summary.slice(0, 500) : null,
    metadata: event.metadata || null,
  };
  const payload = JSON.stringify(entry);
  const hmac = createHmac("sha256", key).update(payload).digest("hex");
  const line = JSON.stringify({ ...entry, hmac }) + "\n";
  await appendFile(logPath(), line, { mode: 0o600 });
  return { ok: true, hmac, ts: entry.ts };
}

export async function verify() {
  const key = await getKey();
  let body;
  try { body = await readFile(logPath(), "utf8"); } catch { return { ok: true, lines: 0, broken_at: null }; }
  const lines = body.trimEnd().split("\n").filter(Boolean);
  let prev = null;
  for (let i = 0; i < lines.length; i++) {
    const obj = JSON.parse(lines[i]);
    const { hmac, ...rest } = obj;
    if (rest.prev_hmac !== prev) {
      return { ok: false, lines: lines.length, broken_at: i, reason: "prev_hmac_mismatch" };
    }
    const expected = createHmac("sha256", key).update(JSON.stringify(rest)).digest("hex");
    if (expected !== hmac) {
      return { ok: false, lines: lines.length, broken_at: i, reason: "hmac_mismatch" };
    }
    prev = hmac;
  }
  return { ok: true, lines: lines.length, broken_at: null };
}

export async function tail(n = 50) {
  try {
    const body = await readFile(logPath(), "utf8");
    const lines = body.trimEnd().split("\n").filter(Boolean).slice(-n);
    return lines.map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

export async function size() {
  try { const s = await stat(logPath()); return { bytes: s.size, mtime: s.mtime.toISOString() }; }
  catch { return { bytes: 0, mtime: null }; }
}
