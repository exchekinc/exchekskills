# exchek-mcp

Local-first MCP server bundled with the **exchekskills** plugin (v3.0.0).

Outbound network is limited to two authoritative sources:

| Host | Why |
|---|---|
| `www.ecfr.gov` | Live regulatory text (15 CFR & 22 CFR parts). Cached for 24h. |
| `data.trade.gov` | Live Consolidated Screening List. Cannot be cached — screening must be live. |

There is **no ExChek-hosted dependency**. Even if `api.exchek.us` is offline, every tool keeps working.

## Tools

See `index.mjs` for the full list and JSON schemas. Highlights:

- `ecfr_get_part`, `ecfr_search`, `ecfr_currency_check` — regulatory data + drift detection.
- `csl_search`, `csl_sources` — live screening (needs `trade_gov_api_key` plugin config).
- `sanitize_input` — zero-width / bidi / homoglyph / injection scrubber. Skills must call this on every user-supplied field.
- `cui_gate` — records the canonical CUI / classified / § 126.18 gate.
- `validate_disclosure` — checks the AI Tool Usage block against schema v1.0.0.
- `audit_log`, `audit_verify`, `audit_tail` — HMAC-chained tamper-evident log under `${CLAUDE_PLUGIN_DATA}/audit.jsonl`.
- `report_to_docx` — wraps the canonical converter; produces `.docx` + `.json` sibling.

## Storage

Everything writable lives under `${CLAUDE_PLUGIN_DATA}` (created by Claude Code / Cowork the first time the variable is referenced). On macOS that resolves to `~/Library/Application Support/Claude-3p/.../plugins/data/exchekskills-*/` for Cowork. Owner-only permissions (`0600`).

## Install

The plugin's `SessionStart` hook runs `npm install` inside `${CLAUDE_PLUGIN_DATA}` whenever `package.json` changes, so users never run anything by hand. To test the server in isolation:

```bash
cd servers/exchek-mcp
npm install
node index.mjs   # speaks MCP over stdio
```
