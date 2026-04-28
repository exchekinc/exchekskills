# Contributing

Most contributions to **exchekskills** come from one of three places: regulatory updates (a part changed, a list moved), bug fixes in the MCP server, or new skills covering an export-control corner we haven't yet.

## What to do before opening a PR

1. **Open an issue first** if the change is more than a typo or a one-line fix. ExChek skills are used to produce audit-ready compliance memos. Drive-by changes that alter regulatory citations or the canonical AI-disclosure schema can break downstream users' records.
2. **Run the MCP smoke test**: `cd servers/exchek-mcp && npm install && node index.mjs <<<'{"jsonrpc":"2.0","id":1,"method":"tools/list"}'` should print the tool list.
3. **Validate the plugin manifest**: `claude plugin validate` from the repo root.

## What we will and won't merge

| Change type | Disposition |
|---|---|
| Regulatory update (eCFR cite changed) | Always welcome. Include the new cite + the date eCFR changed. |
| New SMB-friendly skill | Welcome. Must include: `SKILL.md`, `skill.yaml`, `templates/`, `references/`, and follow the canonical 7-step flow (CUI gate → privacy attestation → untrusted-input handling → regulatory data pull → HITL → dual .docx + .json output → drift caveat). |
| MCP server bug fix | Always welcome. Include a `node --test` case in `tests/` if at all possible. |
| Voice change to SMB manufacturer audience | Welcome — see `docs/COMMUNICATIONS_KIT.md` for the target voice. |
| Voice change toward jargon-heavy compliance-officer audience | Decline by default. We have a target reader and they don't have a compliance team. |
| New paid integration | Decline. ExChek is free. The only paid dependency we'd consider is one the user already has a relationship with (e.g. their own CRM). |
| Telemetry on by default | Decline. Telemetry is opt-in, period. |

## Code style

- JavaScript: vanilla ES modules, `.mjs`, no TypeScript build step. The MCP server has to be readable by an SMB owner who wants to see what's running on their laptop.
- Markdown: Github-flavored, no HTML, no images that aren't essential.
- File names: `kebab-case.mjs` for code; `SCREAMING-SNAKE.md` for top-level docs; `Title Case.md` for templates.

## License

By contributing, you agree your contribution is licensed under the same terms as the rest of the repo (see `LICENSE.md`).

## Reporting security issues

Email `matt@exchek.us`. Do not file a public issue.
