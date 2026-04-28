---
description: Check whether you need a U.S. export license for this ECCN to this destination. Plain-English answer with the regulation citations.
argument-hint: [ECCN destination, e.g. "5A002 to Germany"]
---

# /exchek-license

Launch the **ExChek License Determination** flow.

Follow `skills/exchek-skill-license/SKILL.md`. Use `mcp__exchek__ecfr_get_part` for parts 738, 740, 742, 744, 746. Use `mcp__exchek__ecfr_currency_check` to flag drift. Use `mcp__exchek__sanitize_input`, `mcp__exchek__cui_gate`, `mcp__exchek__report_to_docx`, `mcp__exchek__audit_log`.

User input: `$ARGUMENTS`.

Voice: SMB manufacturer trying to ship a real product to a real customer. The user wants a yes/no/maybe with the cite, not a regulatory lecture. Then offer the audit-ready memo.

Begin.
