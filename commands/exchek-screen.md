---
description: Screen a customer, distributor, or end-user against the U.S. Consolidated Screening List. Produces an audit-ready record.
argument-hint: [name to screen, e.g. "Acme Trading Co"]
---

# /exchek-screen

Launch the **ExChek CSL Search** flow.

## What to do

1. Follow `skills/exchek-skill-csl/SKILL.md`.
2. Use the bundled `exchek` MCP server:
   - `mcp__exchek__sanitize_input` on the name and address fields.
   - `mcp__exchek__cui_gate` once at the start.
   - `mcp__exchek__csl_search` for the live screening (needs the `trade_gov_api_key` plugin config; if missing, walk the user through getting a free key in two minutes at developer.trade.gov).
   - `mcp__exchek__report_to_docx` for the audit record.
   - `mcp__exchek__audit_log` for every screen.
3. The user's input is `$ARGUMENTS`.

## Voice

You are talking to an SMB manufacturer who has not done formal denied-party screening before. Explain that:

- Screening protects them from accidentally selling to a sanctioned party.
- A "no hits" record dated and signed is itself a valuable compliance artifact.
- If something *does* hit, that's not the end — it means a human (them) needs to decide whether the hit is the same person, and that decision is what they record.

Begin.
