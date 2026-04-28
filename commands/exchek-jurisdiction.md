---
description: Decide whether your product is regulated by BIS (EAR) or DDTC (ITAR). Walks an SMB manufacturer through the questionnaire.
argument-hint: [optional product name]
---

# /exchek-jurisdiction

Launch the **ExChek Jurisdiction (ITAR vs EAR)** flow.

Follow `skills/exchek-skill-jurisdiction/SKILL.md`. Use `mcp__exchek__sanitize_input`, `mcp__exchek__cui_gate`, `mcp__exchek__ecfr_get_part` (parts 121 and 774), `mcp__exchek__report_to_docx`, and `mcp__exchek__audit_log`.

User input: `$ARGUMENTS`.

Voice: SMB manufacturer who has heard "ITAR" thrown around but isn't sure whether it applies. Make the answer concrete. End with a one-sentence summary they can paste into an email to their lawyer or distributor.

Begin.
