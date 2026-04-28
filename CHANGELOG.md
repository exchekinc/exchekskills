# Changelog

All notable changes to the **exchekskills** plugin. Follows [semver](https://semver.org).

## [3.0.0] — 2026-04-28

Enterprise plugin packaging. Cowork-first, also runs in Claude Code. Voice rewritten for SMB manufacturers without compliance teams.

### Added

- **Local-first MCP server** (`servers/exchek-mcp/`). Wraps eCFR (ecfr.gov), Trade.gov CSL, input sanitization, AI-disclosure validation, HMAC-chained audit log, and the docx converter. **No call-home; api.exchek.us is no longer a dependency.**
- **Commands**: `/exchek-classify`, `/exchek-screen`, `/exchek-jurisdiction`, `/exchek-license`, `/exchek-audit`.
- **Agents**: `exchek-audit-runner` (long-running CSV audit), `exchek-classification-reviewer` (independent second-opinion).
- **Hooks**: `SessionStart` installs MCP dependencies into `${CLAUDE_PLUGIN_DATA}` on first run and on `package.json` changes; `PreToolUse` ensures the audit log file exists; `PostToolUse` records report emission.
- **userConfig**: `platform_tier`, `trade_gov_api_key` (sensitive, OS keychain), `audit_key` (sensitive), `telemetry_enabled` (off by default), `default_report_dir`.
- **Docs**: `docs/SECURITY.md`, `docs/TELEMETRY.md`, `docs/DATA_STORAGE.md`, `docs/COMMUNICATIONS_KIT.md`, `docs/CHAMPION_KIT.md`. All in SMB-manufacturer voice.

### Changed

- `.claude-plugin/plugin.json`: bumped to v3.0.0; declared `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `userConfig`.
- Skills now reference MCP tools (`mcp__exchek__*`) instead of bare HTTPS calls. Skill bodies unchanged for v3.0.0; full SMB-voice rewrite is queued for v3.1.0.

### Notes

- The audit log is HMAC-chained. Verify with `mcp__exchek__audit_verify`.
- Telemetry is opt-in. ExChek never receives any telemetry; if enabled, spans go to your own OTLP collector via Cowork's `otlpEndpoint`.

## [2.1.0] — 2026-04-21

- Documented canonical 7-step audit-ready flow across all 16 skills.
- Inlined full canonical AI-disclosure placeholders in templates.
- Comprehensive license rewrite with adversarial protections.

## [2.0.x] and earlier

See git history.
