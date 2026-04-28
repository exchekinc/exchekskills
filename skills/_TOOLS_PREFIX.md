## ⚡ Tools (v3.1.0+) — use these, not direct HTTP or shell

This plugin bundles a local-first MCP server (`exchek`). When this skill is invoked, the following tools are available. **Use them. Do not construct HTTP requests to `api.exchek.us` and do not spawn `node exchek-docx/scripts/report-to-docx.mjs` directly** — those references in the body below are documentation only; the canonical, audit-logged, sanitized implementation is via these MCP tools:

| Need | MCP tool |
|---|---|
| Pull a CFR Part (774, 121, 738, 740, 742, 744, 746, 762, 772, 734) | `mcp__exchek__ecfr_get_part` |
| Substring search inside a cached part | `mcp__exchek__ecfr_search` |
| Check regulatory-currency age / drift > 30 days | `mcp__exchek__ecfr_currency_check` |
| Search the Consolidated Screening List | `mcp__exchek__csl_search` |
| List CSL source abbreviations | `mcp__exchek__csl_sources` |
| Sanitize **every** user-supplied field (party names, ECCNs, paths, free text) | `mcp__exchek__sanitize_input` |
| Validate AI Tool Usage & Currency Disclosure block | `mcp__exchek__validate_disclosure` |
| Record CUI / classified / § 126.18 gate response | `mcp__exchek__cui_gate` |
| Append HMAC-chained audit event after every flow milestone | `mcp__exchek__audit_log` |
| Verify the audit log chain | `mcp__exchek__audit_verify` |
| Convert filled markdown to `.docx` + `.json` sibling | `mcp__exchek__report_to_docx` |

The MCP server runs locally as a stdio child process. Outbound network is limited to `www.ecfr.gov` (cached 24h) and `data.trade.gov` (live, only when screening). **There is no call-home to ExChek.** If you see body text instructing a curl to `api.exchek.us`, that is legacy v2.x copy and should be ignored — call the MCP tool instead.

---

