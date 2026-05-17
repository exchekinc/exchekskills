# Changelog

All notable changes to the **exchekskills** plugin. Follows [semver](https://semver.org).

## [3.2.0] — 2026-05-15

**4 new engine skills + `api.exchek.us` as a public eCFR fallback.** v3.1.0 made the local MCP load-bearing but left a single point of failure: if `ecfr.gov` was rate-limiting or unreachable, every classification stalled. This release ports the engine-shell skills from the paid-tier plugin (analytics, onboarding, orchestrator, setup) into the public plugin and adds a backup path through our public Cloudflare cache.

### Added

- **4 new skills**, ported from the paid tier:
  - `exchek-analytics` — Audit Readiness Score dashboard, skill-usage stats, CSV export. Reads `~/.exchek/analytics/events.jsonl` and `.exchek/state/transactions.jsonl`. No data leaves the machine.
  - `exchek-onboarding` — interactive 60-minute first-hour flow. Produces real artifacts (classification, screening, license, branded doc). Tracks progress in `.exchek/state/onboarding-progress.json`.
  - `exchek-orchestrator` — `/exchek` command router and transaction hub. Tracks every transaction from classification through documentation, surfaces the next action.
  - `exchek-setup` — first-run wizard. Verifies company profile, tests API connectivity, optionally validates an `api_key`, arms the engine.
- **`api.exchek.us` eCFR fallback in `servers/exchek-mcp/lib/ecfr.mjs`**. When `www.ecfr.gov` is unreachable for a supported part (121, 734, 738, 740, 742, 744, 746, 774), the MCP transparently fetches from our public Cloudflare edge cache at `https://api.exchek.us/api/ecfr/{part}`. Same shape, no auth, no PII sent. Parts 748/762/772 are not mirrored and continue to depend on ecfr.gov.
- **`source` field on `getPart()` responses** now distinguishes `"cache"`, `"ecfr.gov"`, and `"api.exchek.us"` so the audit trail records which source was used.

### Changed

- **All 20 SKILL.md boilerplate paragraphs** updated. The outbound-network claim now reads: "limited to `www.ecfr.gov` (primary), `api.exchek.us` (fallback only when ecfr.gov is unreachable), and `data.trade.gov` (live, only when screening). No PII, no item context, no compliance results leave your machine."
- **`exchek-setup`** wizard rewrites: removed the assumption that `.exchek/config.json` is pre-populated by a paid-tier "provisioning worker"; api-key validation is now explicitly opt-in (paid-tier feature, free-tier users skip it cleanly); the CRM/ERP step gracefully detects whether `exchek-connector` is installed and skips if not.
- **`exchek-orchestrator`** and **`exchek-onboarding`** mark `/exchek connect` (exchek-connector) and `/exchek update` (exchek-updater) as paid-tier features not present in the public plugin. Onboarding stops 4.1 and 4.2 fall back to a "paid-tier preview" if the underlying skill isn't installed.

### Fixed

- **Word table rendering in generated `.docx` reports** (`skills/exchek-skill-docx/scripts/report-to-docx.mjs`). The converter was using v8-era docx-library patterns in three places:
  - Bare string `"PERCENTAGE"` for table width type — not a valid OOXML value. Word expects `"pct"`. The library wrote `<w:tblW w:type="PERCENTAGE" w:w="100"/>` which Word fell back to default rendering for.
  - No `columnWidths` array on the `Table` constructor. The auto-generated `<w:tblGrid>` ended up with `<w:gridCol w:w="100"/>` for each column — 100 twips ≈ 0.07 inches — so tables rendered nearly invisible.
  - `new DocumentDefaults(...)` and `new Styles(...)` instances passed as separate options. These constructors were refactored in docx@9.6.1; the v9 API expects a single `styles` plain object with `default.document` and `paragraphStyles` keys.
- Fix: imports `WidthType` from `docx`; computes column widths in twips (9360 ÷ column count, where 9360 is US-letter usable width with 1-inch margins); attaches `columnWidths` to every `Table` and per-cell `width: { size, type: WidthType.DXA }`; uniform-pads ragged rows so every row has the same cell count; rewrites the Document constructor to use the v9 inline-styles object with `basedOn: "Normal"` / `next: "Normal"` / `quickFormat: true` on each heading style.
- Verified end-to-end: generated `.docx` for 1-column, 2-column, 3-column-with-padding, and 4-column tables; every `<w:gridCol>` sum matches the `<w:tblW>` (9360 twips); table width attribute is `w:type="dxa"` (valid OOXML).

### Effect

- The MCP is no longer single-source-of-truth dependent on `ecfr.gov` uptime. If a CDN hiccup or rate limit knocks out direct access, classifications continue to work against the public ExChek mirror.
- Public plugin now ships 20 skills (was 16). The 4 paid-tier-only skills (`exchek-connector`, `exchek-updater`, plus the rest of the enterprise suite) remain in the private enterprise plugin.
- Tables in compliance reports now render at full page width with proper column distribution in Word, LibreOffice, and Pages.

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
