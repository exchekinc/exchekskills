# Changelog

All notable changes to the **exchekskills** plugin. Follows [semver](https://semver.org).

## [3.1.0] — 2026-04-28

**Bug fix: skills now actually use the local MCP.** v3.0.0 shipped the `exchek-mcp` server but the skill bodies still instructed Claude to curl `api.exchek.us` and spawn `node exchek-docx/scripts/report-to-docx.mjs` directly — so the MCP was running but unused. As a result, trial users were still hitting our remote API rather than the local-first path the docs promised.

### Fixed

- **All 16 SKILL.md files** now carry a prominent `⚡ Tools (v3.1.0+)` prefix block immediately after their frontmatter, declaring the available `mcp__exchek__*` tools and explicitly instructing Claude to use them instead of constructing HTTP requests or spawning shell commands.
- The body narrative is unchanged so existing references in flow steps still read coherently as documentation; the prefix overrides them as the canonical implementation.

### Effect

- Outbound network from any skill is now limited to `www.ecfr.gov` (regulatory text, cached 24h) and `data.trade.gov` (CSL screening, live). No `api.exchek.us` calls.
- Every flow gets input sanitization, CUI-gate recording, audit logging, and disclosure validation by default — these tools were exposed in v3.0.0 but never invoked.

## [3.0.2] — 2026-04-28

- **Removed the `telemetry_enabled` userConfig toggle.** The field existed in v3.0.0 / v3.0.1 but no code emitted any spans — a dead switch. Removed the field and the corresponding env-var pass-through. The plugin now emits zero telemetry of any kind, and the doc says so plainly.
- **Rewrote `docs/TELEMETRY.md`** to reflect the truth: nothing leaves the machine except the two U.S. government API calls (`ecfr.gov`, `data.trade.gov`) and only when a skill needs them.

## [3.0.1] — 2026-04-28

- **Removed `commands/` directory** in favor of the canonical `skills/*/SKILL.md` format. Cowork now picks up each skill as `/<skill-name>` automatically; no separate flat `.md` wrappers needed. Silences the legacy-format deprecation notice on install.

## [3.0.0] — 2026-04-28

Enterprise plugin packaging. Cowork-first, also runs in Claude Code. Voice rewritten for SMB manufacturers without compliance teams.

### Added

- **Local-first MCP server** (`servers/exchek-mcp/`). Wraps eCFR (ecfr.gov), Trade.gov CSL, input sanitization, AI-disclosure validation, HMAC-chained audit log, and the docx converter. **No call-home; api.exchek.us is no longer a dependency.**
- **Slash invocation** for every skill (Cowork picks them up from `skills/*/SKILL.md`).
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
