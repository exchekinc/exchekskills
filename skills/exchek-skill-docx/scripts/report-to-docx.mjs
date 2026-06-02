#!/usr/bin/env node
/**
 * Convert an ExChek markdown report (.md) to client-ready Word (.docx),
 * and emit a structured JSON sibling (<basename>.json) for downstream
 * CRM/SIEM/GRC ingestion. See references/json-output-schema.md (v1.0.0)
 * in any ExChek skill for the canonical schema.
 *
 * Canonical implementation — single source of truth for all ExChek skills.
 * Usage: node report-to-docx.mjs <path-to-report.md> [metadata.json]
 *   <path-to-report.md>   — markdown report (required)
 *   [metadata.json]       — optional structured metadata per json-output-schema.md.
 * Output: <basename>.docx (or, if the docx engine is unavailable, <basename>.html
 *   as a graceful fallback) AND <basename>.json in the same directory.
 *
 * Robustness (v3.4.2): docx is imported dynamically and the render is wrapped so a
 * missing/broken docx install degrades to an HTML fallback instead of crashing; the
 * JSON sibling is always written first; astral-plane characters (>U+FFFF, e.g. emoji)
 * are stripped to avoid the JSZip surrogate-pair corruption present in docx < 9.6.0.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath, pathToFileURL } from "url";

// docx is loaded dynamically in main() (see module docstring). Assigned on success.
let Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType;

const __dirname = dirname(fileURLToPath(import.meta.url));

const MAX_PARAGRAPH_LENGTH_FOR_H3 = 120;
// US letter (12240 twips) minus 1-inch margins (1440 each side) = 9360 twips usable width.
const PAGE_USABLE_WIDTH_TWIPS = 9360;
const MIN_DOCX_VERSION = "9.6.0"; // 9.6.0 fixed the JSZip >U+FFFF corruption bug.

/** Compare dotted numeric versions. Returns -1 / 0 / 1. */
function compareVersion(a, b) {
  const pa = String(a).split(".").map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return 0;
}

/** Remove astral-plane characters (>U+FFFF: emoji, math alphanumerics, etc.). They
 *  trigger the docx<9.6.0 surrogate-pair corruption and have no place in a legal memo.
 *  BMP punctuation (en/em dashes, smart quotes, bullets) is left intact. */
function stripAstral(text) {
  if (typeof text !== "string") return text;
  return text.replace(/[\u{10000}-\u{10FFFF}]/gu, "");
}

/** Parse inline **bold** and *italic* into runs; strips markdown. */
function parseInlineFormatting(text) {
  if (!text || typeof text !== "string") return [{ text: "", bold: false, italic: false }];
  const runs = [];
  const byBold = text.split(/\*\*/);
  for (let i = 0; i < byBold.length; i++) {
    const bold = i % 2 === 1;
    const segment = byBold[i];
    const byItalic = segment.split(/\*+/);
    for (let j = 0; j < byItalic.length; j++) {
      const italic = j % 2 === 1;
      const t = byItalic[j].trim();
      if (t) runs.push({ text: t, bold, italic });
    }
  }
  if (runs.length === 0) runs.push({ text: text.replace(/\*\*/g, "").replace(/\*/g, ""), bold: false, italic: false });
  return runs;
}

function isTableSeparator(line) {
  return /^\|[\s\-:]+\|/.test(line.trim()) || /^\|\s*\-+\s*\|/.test(line.trim());
}

function parseTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.includes("|", 1)) return null;
  const cells = trimmed
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
  return cells;
}

function parseReportToBlocks(md) {
  const lines = md.split(/\r?\n/);
  const blocks = [];
  let i = 0;
  let seenFirstEqualsUnderline = false;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Markdown headings: # H1, ## H2, ### H3 (before paragraph merge)
    const hashMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (hashMatch) {
      const level = hashMatch[1].length;
      const title = hashMatch[2].trim();
      if (level === 1) blocks.push({ type: "heading1", text: title });
      else if (level === 2) blocks.push({ type: "heading2", text: title });
      else blocks.push({ type: "heading3", text: title });
      i++;
      continue;
    }

    // Markdown table: collect consecutive |...| lines (skip separator row)
    if (trimmed.startsWith("|") && trimmed.includes("|", 1)) {
      const tableRows = [];
      while (i < lines.length) {
        const rowLine = lines[i].trim();
        if (!rowLine.startsWith("|")) break;
        if (isTableSeparator(rowLine)) {
          i++;
          continue;
        }
        const cells = parseTableRow(lines[i]);
        if (cells) tableRows.push(cells);
        i++;
      }
      if (tableRows.length > 0) blocks.push({ type: "table", rows: tableRows });
      continue;
    }

    // Line of = only: first occurrence = underline for main title (H1); rest are separators, skip
    if (/^=+$/.test(trimmed)) {
      if (!seenFirstEqualsUnderline) {
        const prev = blocks[blocks.length - 1];
        if (prev?.type === "paragraph" && prev.text) {
          prev.type = "heading1";
        }
        seenFirstEqualsUnderline = true;
      }
      i++;
      continue;
    }

    // Numbered section header
    if (/^\d+(\.\d+)?\.\s+.+/.test(trimmed)) {
      blocks.push({ type: "heading2", text: trimmed });
      i++;
      continue;
    }

    // Subsection underline: promote short single-line paragraph to H3
    if (/^-+$/.test(trimmed) && trimmed.length > 10) {
      const prev = blocks[blocks.length - 1];
      if (
        prev?.type === "paragraph" &&
        prev.text &&
        prev.text.length <= MAX_PARAGRAPH_LENGTH_FOR_H3
      ) {
        prev.type = "heading3";
      }
      i++;
      continue;
    }

    // List item
    if (trimmed.startsWith("- ")) {
      blocks.push({ type: "list", text: trimmed.slice(2) });
      i++;
      continue;
    }

    // Plain paragraph (collect consecutive non-special lines)
    let para = trimmed;
    i++;
    while (i < lines.length) {
      const nextLine = lines[i];
      const nextTrimmed = nextLine?.trim();
      if (!nextTrimmed) break;
      if (nextTrimmed.startsWith("|")) break;
      if (nextTrimmed.match(/^#{1,3}\s+/)) break;
      if (nextTrimmed.startsWith("- ") || /^=+$/.test(nextTrimmed) || /^-+$/.test(nextTrimmed)) break;
      if (/^\d+(\.\d+)?\.\s+.+/.test(nextTrimmed)) break;
      para += " " + nextTrimmed;
      i++;
    }
    blocks.push({ type: "paragraph", text: para });
  }

  return blocks;
}

function runsToParagraphChildren(runs, prefix = "") {
  const runOpts = runs.map((r) => new TextRun({ text: r.text, bold: r.bold, italics: r.italic }));
  if (prefix) runOpts.unshift(new TextRun({ text: prefix }));
  return runOpts;
}

function buildDocument(blocks) {
  const children = [];

  for (const block of blocks) {
    const text = block.text || "";

    switch (block.type) {
      case "heading1":
        if (text) {
          children.push(
            new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 } })
          );
        }
        break;
      case "heading2":
        if (text) {
          children.push(
            new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } })
          );
        }
        break;
      case "heading3":
        if (text) {
          children.push(
            new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 120, after: 60 } })
          );
        }
        break;
      case "list":
        if (text) {
          const listRuns = parseInlineFormatting(text);
          children.push(
            new Paragraph({
              children: runsToParagraphChildren(listRuns, "• "),
              indent: { left: 720 },
              spacing: { after: 60 },
            })
          );
        }
        break;
      case "table":
        if (block.rows && block.rows.length > 0) {
          // Determine column count from the widest row; pad short rows so every
          // row has the same cell count (Word requires uniform grid).
          const columnCount = Math.max(...block.rows.map((r) => r.length));
          const columnWidth = Math.floor(PAGE_USABLE_WIDTH_TWIPS / columnCount);
          const columnWidths = Array(columnCount).fill(columnWidth);

          const tableRows = block.rows.map((cells) => {
            const padded = cells.concat(Array(columnCount - cells.length).fill(""));
            return new TableRow({
              children: padded.map(
                (cellText) =>
                  new TableCell({
                    width: { size: columnWidth, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        children: parseInlineFormatting(cellText).map((r) =>
                          new TextRun({ text: r.text, bold: r.bold, italics: r.italic })
                        ),
                        spacing: { after: 60 },
                      }),
                    ],
                  })
              ),
            });
          });
          children.push(
            new Table({ rows: tableRows, width: { size: PAGE_USABLE_WIDTH_TWIPS, type: WidthType.DXA }, columnWidths })
          );
          children.push(new Paragraph({ children: [new TextRun({ text: "" })], spacing: { after: 120 } }));
        }
        break;
      default:
        if (text) {
          const runs = parseInlineFormatting(text);
          children.push(new Paragraph({ children: runsToParagraphChildren(runs), spacing: { after: 120 } }));
        }
    }
  }

  return new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 }, // 11pt body (half-points)
          paragraph: { spacing: { after: 120, line: 276 } },
        },
      },
      paragraphStyles: [
        { id: "Normal", name: "Normal", run: { font: "Calibri", size: 22 } },
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Calibri", size: 28, bold: true }, paragraph: { spacing: { before: 240, after: 120 } } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Calibri", size: 24, bold: true }, paragraph: { spacing: { before: 240, after: 120 } } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Calibri", size: 22, bold: true }, paragraph: { spacing: { before: 120, after: 60 } } },
      ],
    },
    sections: [{ properties: {}, children }],
  });
}

const SCHEMA_VERSION = "1.0.0";

function buildJsonSibling(metadataPath, docxOutPath) {
  const docxBase = basename(docxOutPath).replace(/\.docx$/i, "");
  const docxFile = basename(docxOutPath);
  const nowIso = new Date().toISOString();

  let payload = {};
  if (metadataPath) {
    const resolvedMeta = resolve(process.cwd(), metadataPath);
    if (!existsSync(resolvedMeta)) {
      throw new Error(`Metadata file not found: ${resolvedMeta}`);
    }
    const raw = readFileSync(resolvedMeta, "utf8");
    try {
      payload = JSON.parse(raw);
    } catch (e) {
      throw new Error(`Metadata file is not valid JSON: ${resolvedMeta} — ${e.message}`);
    }
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      throw new Error(`Metadata must be a JSON object at the top level: ${resolvedMeta}`);
    }
  }

  if (!payload.schema_version) payload.schema_version = SCHEMA_VERSION;
  if (!payload.generated || typeof payload.generated !== "object") payload.generated = {};
  if (!payload.generated.at) payload.generated.at = nowIso;

  payload.report = { ...(payload.report || {}), docx_basename: docxBase, docx_path_relative: docxFile };
  return payload;
}

// ---- HTML fallback (pure string templating; no dependencies) --------------------

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineToHtml(text) {
  return parseInlineFormatting(text)
    .map((r) => {
      let html = escapeHtml(r.text);
      if (r.bold) html = `<strong>${html}</strong>`;
      if (r.italic) html = `<em>${html}</em>`;
      return html;
    })
    .join("");
}

/** Render the same parsed blocks to a self-contained HTML document that Word opens
 *  cleanly (File → Open). Used only when the docx engine is unavailable. */
function blocksToHtml(blocks, title = "ExChek Report") {
  const body = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === "list") {
      const items = [];
      while (i < blocks.length && blocks[i].type === "list") {
        items.push(`<li>${inlineToHtml(blocks[i].text || "")}</li>`);
        i++;
      }
      body.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    switch (b.type) {
      case "heading1": body.push(`<h1>${inlineToHtml(b.text || "")}</h1>`); break;
      case "heading2": body.push(`<h2>${inlineToHtml(b.text || "")}</h2>`); break;
      case "heading3": body.push(`<h3>${inlineToHtml(b.text || "")}</h3>`); break;
      case "table": {
        const cols = Math.max(...b.rows.map((r) => r.length));
        const rows = b.rows
          .map((cells) => {
            const padded = cells.concat(Array(cols - cells.length).fill(""));
            return `<tr>${padded.map((c) => `<td>${inlineToHtml(c)}</td>`).join("")}</tr>`;
          })
          .join("");
        body.push(`<table>${rows}</table>`);
        break;
      }
      default: body.push(`<p>${inlineToHtml(b.text || "")}</p>`);
    }
    i++;
  }
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.3;max-width:7.5in;margin:1in auto;}
h1{font-size:14pt;} h2{font-size:12pt;} h3{font-size:11pt;}
table{border-collapse:collapse;width:100%;margin:8pt 0;}
td{border:1px solid #999;padding:4pt 6pt;vertical-align:top;}
</style></head><body>
${body.join("\n")}
</body></html>
`;
}

// ---- CLI -------------------------------------------------------------------------

async function main() {
  const mdPath = process.argv[2];
  const metadataPath = process.argv[3];
  if (!mdPath) {
    console.error("Usage: node report-to-docx.mjs <path-to-report.md> [metadata.json]");
    process.exit(1);
  }

  const resolved = resolve(process.cwd(), mdPath);
  let md;
  try {
    md = readFileSync(resolved, "utf8");
  } catch (e) {
    console.error("Could not read file:", resolved, e.message);
    process.exit(1);
  }

  md = stripAstral(md); // defense against the docx<9.6.0 corruption class
  const blocks = parseReportToBlocks(md);
  const docxOutPath = resolved.replace(/\.md$/i, ".docx");
  const htmlOutPath = resolved.replace(/\.md$/i, ".html");
  const jsonOutPath = resolved.replace(/\.md$/i, ".json");

  // Always write the JSON sibling first so the structured record exists even if
  // document rendering fails. A JSON failure is logged but never aborts the run.
  try {
    const jsonPayload = buildJsonSibling(metadataPath, docxOutPath);
    writeFileSync(jsonOutPath, JSON.stringify(jsonPayload, null, 2) + "\n");
    console.log("Wrote:", jsonOutPath);
  } catch (e) {
    console.error("JSON sibling not written:", e.message);
  }

  // Try the docx engine; on ANY failure (missing/broken install, render error),
  // fall back to a self-contained HTML the user can open in Word. Never crash.
  let docxOk = false;
  try {
    // Load docx via createRequire (CJS), NOT `import("docx")`: ESM resolution ignores
    // NODE_PATH, but the MCP server points the spawned converter at the installed docx
    // via NODE_PATH — and CJS `require` honors it (and the upward node_modules walk).
    const { createRequire } = await import("node:module");
    const requireDocx = createRequire(import.meta.url);
    ({ Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } = requireDocx("docx"));
    try {
      const v = requireDocx("docx/package.json").version;
      if (compareVersion(v, MIN_DOCX_VERSION) < 0) {
        console.error(`WARNING: docx ${v} is below ${MIN_DOCX_VERSION} (known .docx-corruption bug). Pin docx >= ${MIN_DOCX_VERSION}.`);
      }
    } catch { /* version probe is best-effort */ }
    const doc = buildDocument(blocks);
    const buffer = await Packer.toBuffer(doc);
    writeFileSync(docxOutPath, buffer);
    console.log("Wrote:", docxOutPath);
    docxOk = true;
  } catch (e) {
    console.error("docx engine unavailable; using HTML fallback:", e.message);
  }

  if (!docxOk) {
    const html = blocksToHtml(blocks, basename(docxOutPath).replace(/\.docx$/i, ""));
    writeFileSync(htmlOutPath, html);
    console.log("FALLBACK_HTML:", htmlOutPath);
  }
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  main().catch((err) => {
    console.error("Fatal:", err && err.message ? err.message : err);
    process.exit(1);
  });
}

export { parseReportToBlocks, buildDocument, buildJsonSibling, blocksToHtml, stripAstral, compareVersion };
