// Wraps the canonical report-to-docx.mjs converter as an MCP tool.
// Sanitises the path argument to avoid command-injection (we use spawn with
// argv, never a shell), and rejects paths with shell metacharacters or newlines.

import { spawn } from "node:child_process";
import { writeFile, mkdir, stat } from "node:fs/promises";
import { resolve, dirname, basename, join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || resolve(new URL("../../..", import.meta.url).pathname);
const CONVERTER = resolve(PLUGIN_ROOT, "skills/exchek-skill-docx/scripts/report-to-docx.mjs");

function rejectShellMeta(path) {
  if (typeof path !== "string" || path.length === 0) {
    throw new Error("path must be a non-empty string");
  }
  if (/[;|&$`\n\r<>]/.test(path)) {
    throw new Error("path contains shell metacharacters or newlines");
  }
}

export async function convert({ markdown, metadata, output_dir, basename: name } = {}) {
  if (typeof markdown !== "string" || markdown.length === 0) {
    throw new Error("markdown is required");
  }
  const outDir = output_dir ? resolve(output_dir) : join(tmpdir(), "exchek-reports");
  rejectShellMeta(outDir);
  await mkdir(outDir, { recursive: true });

  const safeBase = (name || `ExChek-Report-${new Date().toISOString().slice(0, 10)}-${randomUUID().slice(0, 8)}`)
    .replace(/[^A-Za-z0-9._-]/g, "-");
  const tempMd = join(outDir, `.${safeBase}.tmp.md`);
  const tempMeta = metadata ? join(outDir, `.${safeBase}.tmp.meta.json`) : null;

  await writeFile(tempMd, markdown, "utf8");
  if (tempMeta) await writeFile(tempMeta, JSON.stringify(metadata, null, 2), "utf8");

  const args = [CONVERTER, tempMd];
  if (tempMeta) args.push(tempMeta);

  const code = await new Promise((res, rej) => {
    const p = spawn(process.execPath, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    });
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", rej);
    p.on("close", (c) => (c === 0 ? res(c) : rej(new Error(`converter exit ${c}: ${stderr}`))));
  });

  const docx = tempMd.replace(/\.tmp\.md$/, ".tmp.docx");
  const json = tempMd.replace(/\.tmp\.md$/, ".tmp.json");
  const finalDocx = join(outDir, `${safeBase}.docx`);
  const finalJson = join(outDir, `${safeBase}.json`);

  const { rename, unlink } = await import("node:fs/promises");
  await rename(docx, finalDocx);
  try { await rename(json, finalJson); } catch { /* converter may not always emit json */ }
  await unlink(tempMd).catch(() => {});
  if (tempMeta) await unlink(tempMeta).catch(() => {});

  const docxStat = await stat(finalDocx);
  return {
    docx_path: finalDocx,
    json_path: finalJson,
    bytes: docxStat.size,
    exit_code: code,
  };
}
