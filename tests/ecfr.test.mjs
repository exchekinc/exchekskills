import { test } from "node:test";
import assert from "node:assert/strict";
import { TITLE_FOR_PART, getFullText } from "../servers/exchek-mcp/lib/ecfr.mjs";

test("Part 732 (red flags) is now a supported part on title 15", () => {
  assert.equal(TITLE_FOR_PART["732"], 15);
});

test("USML Part 121 maps to title 22; CCL Part 774 to title 15", () => {
  assert.equal(TITLE_FOR_PART["121"], 22);
  assert.equal(TITLE_FOR_PART["774"], 15);
});

test("supported full-text parts cover all 11 API parts plus 732", () => {
  for (const p of ["121", "732", "734", "738", "740", "742", "744", "746", "748", "762", "772", "774"]) {
    assert.ok(p in TITLE_FOR_PART, `part ${p} should be supported`);
  }
});

test("getFullText rejects an unsupported part before any network call", async () => {
  await assert.rejects(() => getFullText("999"), /Unsupported eCFR part/);
});
