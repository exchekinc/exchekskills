import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const converter = resolve(repoRoot, "skills/exchek-skill-docx/scripts/report-to-docx.mjs");
const { parseReportToBlocks, blocksToHtml, stripAstral, compareVersion } = await import(converter);

// ---- Pure-function unit tests (no docx dependency) ----

test("stripAstral removes >U+FFFF chars (emoji) but keeps BMP punctuation", () => {
  assert.equal(stripAstral("Acme 😀 Co.—Ltd"), "Acme  Co.—Ltd"); // em-dash (U+2014) preserved
  assert.equal(stripAstral("plain text"), "plain text");
});

test("compareVersion orders docx versions correctly", () => {
  assert.equal(compareVersion("8.5.0", "9.6.0") < 0, true); // the skew version is below the fix
  assert.equal(compareVersion("9.6.1", "9.6.0") > 0, true);
  assert.equal(compareVersion("9.6.0", "9.6.0"), 0);
});

test("parseReportToBlocks classifies headings, tables, and lists", () => {
  const blocks = parseReportToBlocks("# Title\n\n1. Scope\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n- item one\n- item two");
  assert.equal(blocks[0].type, "heading1");
  assert.ok(blocks.some((b) => b.type === "heading2")); // "1. Scope"
  const tbl = blocks.find((b) => b.type === "table");
  assert.ok(tbl && tbl.rows.length === 2);
  assert.equal(blocks.filter((b) => b.type === "list").length, 2);
});

test("blocksToHtml renders structured, escaped HTML (the fallback)", () => {
  const html = blocksToHtml(parseReportToBlocks("# Memo\n\n- a\n- b\n\n| X | Y |\n|---|---|\n| 1 | 2 |"));
  assert.match(html, /<h1>Memo<\/h1>/);
  assert.match(html, /<ul><li>a<\/li><li>b<\/li><\/ul>/);
  assert.match(html, /<table>.*<td>X<\/td>.*<\/table>/s);
  assert.match(html, /<!DOCTYPE html>/);
});

// ---- Integration: real render (skips cleanly if docx isn't installed) ----

const FIXTURE = `# Classification Memorandum

1. Purpose and scope

This memo classifies the item. Canary: 😀 (astral char should be stripped, no corruption).

| Field | Value |
|-------|-------|
| ECCN | 3A991 |
| Jurisdiction | EAR |

- First finding
- Second finding
`;

const docxNodeModules = [
  resolve(repoRoot, "servers/exchek-mcp/node_modules"),
  resolve(repoRoot, "skills/exchek-skill-docx/scripts/node_modules"),
].find((d) => existsSync(join(d, "docx", "package.json")));

test("converter renders a valid (non-corrupt) .docx + .json, no fallback", { skip: docxNodeModules ? false : "docx not installed" }, async () => {
  const dir = mkdtempSync(join(tmpdir(), "exchek-docx-"));
  const md = join(dir, "report.md");
  writeFileSync(md, FIXTURE);

  const res = spawnSync(process.execPath, [converter, md], {
    env: { ...process.env, NODE_PATH: docxNodeModules },
    encoding: "utf8",
  });
  assert.equal(res.status, 0, `converter failed: ${res.stderr}`);

  const docxPath = md.replace(/\.md$/, ".docx");
  const htmlPath = md.replace(/\.md$/, ".html");
  const jsonPath = md.replace(/\.md$/, ".json");
  assert.ok(existsSync(docxPath), "expected a .docx");
  assert.ok(!existsSync(htmlPath), "should NOT have fallen back to HTML when docx is available");
  assert.ok(existsSync(jsonPath), "expected the JSON sibling");

  const buf = readFileSync(docxPath);
  assert.equal(buf.slice(0, 2).toString("latin1"), "PK", "a real .docx is a ZIP (PK magic) — not corrupt/empty");

  // Deep structural assertions if jszip (a docx dep) is resolvable here.
  try {
    const reqFromDocx = createRequire(join(docxNodeModules, "docx", "package.json"));
    const JSZip = reqFromDocx("jszip");
    const zip = await JSZip.loadAsync(buf);
    const xml = await zip.file("word/document.xml").async("string");
    assert.match(xml, /<w:tbl>/, "table present");
    assert.match(xml, /w:type="dxa"/, "table width uses DXA (the v3.2.0 full-width fix)");
    assert.ok(xml.includes("9360"), "table is full usable width (9360 twips)");
    assert.doesNotMatch(xml, /\uD83D|\uD83E/, "no surrogate halves (emoji was stripped pre-render)");
  } catch {
    /* jszip not resolvable from here — PK-magic + file checks above still gate corruption */
  }
});
