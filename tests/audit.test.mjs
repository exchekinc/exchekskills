import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, appendFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Use a fixed env key so the HMAC chain is deterministic and dir-independent.
process.env.CLAUDE_PLUGIN_OPTION_AUDIT_KEY = "x".repeat(40);
const audit = await import("../servers/exchek-mcp/lib/audit.mjs");

function freshDataDir() {
  const dir = mkdtempSync(join(tmpdir(), "exchek-audit-"));
  process.env.CLAUDE_PLUGIN_DATA = dir;
  return dir;
}

test("append builds a verifiable HMAC chain", async () => {
  freshDataDir();
  await audit.append({ event_type: "gate-passed", summary: "cui gate" });
  await audit.append({ event_type: "hitl-confirmed" });
  const v = await audit.verify();
  assert.equal(v.ok, true);
  assert.equal(v.lines, 2);
  assert.equal(v.broken_at, null);
});

test("an unsigned line breaks the chain (the pre-3.4.1 PostToolUse-hook bug)", async () => {
  const dir = freshDataDir();
  await audit.append({ event_type: "gate-passed" });
  // Reproduce exactly what the old hook wrote: a plain line with no prev_hmac/hmac.
  appendFileSync(join(dir, "audit.jsonl"), JSON.stringify({ ts: "x", event: "report_emitted" }) + "\n");
  const v = await audit.verify();
  assert.equal(v.ok, false);
  assert.equal(v.broken_at, 1);
});

test("seal() is read-only: verifies and writes a sidecar, never the chain", async () => {
  const dir = freshDataDir();
  await audit.append({ event_type: "report_emitted", tool: "report_to_docx" });
  const before = readFileSync(join(dir, "audit.jsonl"), "utf8");
  const r = await audit.seal();
  assert.equal(r.sealed, true);
  assert.equal(r.verified, true);
  // The chained log is untouched by seal()…
  assert.equal(readFileSync(join(dir, "audit.jsonl"), "utf8"), before);
  // …and the seal record went to the sidecar.
  assert.ok(existsSync(join(dir, "audit-seals.jsonl")));
  const seals = readFileSync(join(dir, "audit-seals.jsonl"), "utf8").trim().split("\n");
  assert.equal(JSON.parse(seals[seals.length - 1]).verified, true);
});

test("seal() records a broken chain as verified:false without altering it", async () => {
  const dir = freshDataDir();
  await audit.append({ event_type: "gate-passed" });
  appendFileSync(join(dir, "audit.jsonl"), JSON.stringify({ ts: "x", event: "tampered" }) + "\n");
  const r = await audit.seal();
  assert.equal(r.sealed, true);
  assert.equal(r.verified, false);
});
