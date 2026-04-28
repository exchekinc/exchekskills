import { test } from "node:test";
import assert from "node:assert/strict";
import { validateDisclosure } from "../servers/exchek-mcp/lib/disclosure.mjs";

test("rejects empty disclosure", () => {
  const r = validateDisclosure(null);
  assert.equal(r.ok, false);
  assert.ok(r.missing.length > 0);
});

test("flags missing required fields", () => {
  const r = validateDisclosure({ skill_name: "exchek-classify" });
  assert.equal(r.ok, false);
  assert.ok(r.missing.includes("model_id"));
});

test("accepts a complete disclosure", () => {
  const r = validateDisclosure({
    skill_name: "exchek-classify",
    skill_version: "2.1.0",
    model_id: "claude-opus-4-7",
    platform: "cowork",
    generated_at_iso8601: new Date().toISOString(),
    input_hash_sha256: "abc",
    regulatory_currency: { sources: [{ name: "ecfr-774", fetched_at_iso8601: new Date().toISOString() }] },
    hitl_confirmed_at_iso8601: new Date().toISOString(),
  });
  assert.equal(r.ok, true);
});

test("warns on >30d age", () => {
  const old = new Date(Date.now() - 40 * 86400000).toISOString();
  const r = validateDisclosure({
    skill_name: "x", skill_version: "1", model_id: "m", platform: "p",
    generated_at_iso8601: old, input_hash_sha256: "x",
    regulatory_currency: { sources: [{ name: "n", fetched_at_iso8601: old }] },
    hitl_confirmed_at_iso8601: old,
  });
  assert.ok(r.warnings.includes("determination_older_than_30d"));
});
