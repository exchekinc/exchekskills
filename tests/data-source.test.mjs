import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveRegulatorySource,
  LOCAL_ROUTES,
  API_ROUTES,
} from "../servers/exchek-mcp/lib/datasource.mjs";
import { EXCHEK_API_PARTS } from "../servers/exchek-mcp/lib/ecfr.mjs";

test("defaults to ask mode (unset env), recommending the API", () => {
  const r = resolveRegulatorySource(undefined);
  assert.equal(r.mode, "ask");
  assert.equal(r.ask, true);
  assert.equal(r.recommended, "api");
  // In ask mode the active routes point at the recommended (API) source.
  assert.equal(r.routes.server, "exchek-api");
  // Both options are always offered.
  assert.equal(r.options.local.server, "exchek");
  assert.equal(r.options.api.server, "exchek-api");
});

test("pins to local mode without asking", () => {
  const r = resolveRegulatorySource("local");
  assert.equal(r.mode, "local");
  assert.equal(r.ask, false);
  assert.equal(r.routes.server, "exchek");
  assert.equal(r.routes.get_part, "mcp__exchek__ecfr_get_part");
  assert.equal(r.routes.part_arg_type, "string");
});

test("pins to api mode without asking", () => {
  const r = resolveRegulatorySource("api");
  assert.equal(r.mode, "api");
  assert.equal(r.ask, false);
  assert.equal(r.routes.server, "exchek-api");
  assert.equal(r.routes.get_part, "mcp__exchek-api__get_ecfr_part");
  assert.equal(r.routes.part_arg_type, "integer");
});

test("invalid / garbage env falls back to ask", () => {
  for (const bad of ["zzz", "", "  ", "LOCALHOST", "remote", "ZZZ", null]) {
    assert.equal(resolveRegulatorySource(bad).mode, "ask", `expected '${bad}' to fall back to ask`);
  }
});

test("env value is case- and whitespace-insensitive", () => {
  assert.equal(resolveRegulatorySource("  LOCAL  ").mode, "local");
  assert.equal(resolveRegulatorySource("Api").mode, "api");
});

test("screening/audit/docx stay local in every mode", () => {
  for (const mode of [undefined, "ask", "local", "api"]) {
    const r = resolveRegulatorySource(mode);
    assert.equal(r.always_local.csl_search, "mcp__exchek__csl_search");
    assert.equal(r.always_local.report_to_docx, "mcp__exchek__report_to_docx");
    assert.equal(r.always_local.cui_gate, "mcp__exchek__cui_gate");
  }
});

test("the local mirror covers all 11 api.exchek.us parts", () => {
  const expected = ["121", "734", "738", "740", "742", "744", "746", "748", "762", "772", "774"];
  for (const p of expected) {
    assert.ok(EXCHEK_API_PARTS.has(p), `mirror should include part ${p}`);
  }
  assert.equal(EXCHEK_API_PARTS.size, expected.length);
});

test("route constants name the correct servers", () => {
  assert.equal(LOCAL_ROUTES.server, "exchek");
  assert.equal(API_ROUTES.server, "exchek-api");
  assert.equal(API_ROUTES.search_title, "mcp__exchek-api__search_ecfr_title");
  assert.equal(LOCAL_ROUTES.search_title, null); // title-wide search is API-only
});
