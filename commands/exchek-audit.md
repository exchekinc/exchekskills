---
description: Self-audit your past shipments against current export rules. Re-screen parties, re-check ECCNs, surface anything that has drifted.
argument-hint: [path to CSV of shipments, optional]
---

# /exchek-audit

Launch the **ExChek Audit / Lookback** flow.

For larger jobs, dispatch the `exchek-audit-runner` agent (it's bundled with this plugin) so the lookback runs in its own context window.

Follow `skills/exchek-skill-audit-lookback/SKILL.md`. Use `mcp__exchek__csl_search` per party row, `mcp__exchek__ecfr_get_part` for ECCN re-checks, `mcp__exchek__ecfr_currency_check` to compare against shipment dates, `mcp__exchek__report_to_docx` for the findings report, and `mcp__exchek__audit_log` for every row processed.

User input (CSV path or instruction): `$ARGUMENTS`.

Voice: SMB manufacturer who shipped 30–500 things in the last year and just got asked by a customer or insurer "do you do export compliance?". Make this fast and finite — give them a number ("0 issues" or "3 rows need a second look") before any narrative.

Begin.
