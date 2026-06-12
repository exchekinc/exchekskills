# Changelog

All notable changes to the **exchekskills** plugin. Follows [semver](https://semver.org).

## [3.6.1] — 2026-06-12

**See it before you pay for it.** The Enterprise PDF flow is now draft → review → finalize: watermarked previews are free and unlimited, and only the final render the user explicitly approves consumes a credit. Born from a real session where a first render charged before the user could catch a wrong CAGE attribution and a missing exhibit — that can't happen anymore.

### Added
- **Free draft previews** — `create_classification_pdf` accepts `draft: true` (REST: `POST /pdf/classification?draft=1`): every page watermarked "DRAFT — NOT FINAL", no credit consumed, nothing stored. The skill now REQUIRES a reviewed draft (document-control block, CAGE attribution, exhibits, parties, ECCN) and an explicit "finalize" approval before the paid render.
- **One-hour download links** — every render response includes `https://api.exchek.us/pdf/dl/<token>`, so surfaces that can't accept PDF bytes in chat (claude.ai web) still deliver the document. Finals additionally land in the dashboard vault when document storage is on.
- **Setup check** — `exchek-classify` now checks for `.exchek/state/setup-complete.json` on file-access surfaces and offers to run exchek-setup (engine config + edition choice) first; on web/connector surfaces the step-1 deliverable question is the edition moment.

### Fixed
- Stale checkout link in the render error table now points at https://app.exchek.us.

## [3.6.0] — 2026-06-12

**One engine, two editions — and the dashboard talks back.** Donations are gone; ExChek now has a clean free/Enterprise split that every skill respects, and the skills plug into the full app.exchek.us workspace: products registry, continuous screening, regulatory radar, and pinned team notes.

### Added
- **Edition choice** — new `edition` plugin setting (`ask`/`free`/`enterprise`) plus a setup step that lays out the value of each and records the answer in `.exchek/config.json`. Free means free: no Enterprise asks mid-flow, at most a single one-line wrap-up mention (which the user can switch off). Enterprise means the official PDF and dashboard sync are offered by default.
- **Products registry integration** — `exchek-classify` checks `get_prior_classification` before collecting specs ("you classified this as 6A003 on May 2 — reuse or re-verify?") and saves confirmed determinations with `record_product_classification` (upsert by generic label; covered by the same consent and label discipline as transaction sync — see the expanded [transaction-sync reference](skills/exchek-skill-classify/references/transaction-sync.md)).
- **Continuous monitoring from screening** — after a CSL screen, `exchek-csl` (with credentials and explicit consent — registering a party stores its name, and the skill says so) offers `record_screening`: the party joins the Screening Center for weekly/daily re-screens with email alerts. `get_party_status` runs first, so already-monitored parties are recognized instead of re-registered.
- **Regulatory radar** — the free, no-auth `get_rule_changes` tool (recent BIS/DDTC/OFAC rulemaking with the ECCNs/CFR parts each rule touches) now powers: a one-line radar brief on the `/exchek` dashboard, rule-aware re-verification in `exchek-classify`, and the delta-since-date mode of `exchek-audit-lookback`, which starts from the actual rulemaking record instead of memory.
- **Team notes in classification** — `exchek-classify` pulls `get_regulatory_notes` for the ECCNs/parts under consideration and cites the team's pinned guidance as organizational context.
- **Pipeline-stage sync everywhere** — `exchek-license`, `exchek-jurisdiction`, `exchek-export-docs`, and `exchek-red-flag-assessment` can now mirror their stage to the dashboard (same three gates: CUI, credentials, consent), so the Transactions pipeline fills in from whichever skill did the work.

### Changed
- **Donations removed everywhere** — the donation step, the multi-chain addresses, and every "optional donation" mention are gone from all skills, references, and the license. The post-workflow moment now belongs to the work: each skill closes by offering the logical next compliance step, with at most one quiet, dismissible Enterprise line for uncredentialed runs.
- `ENTERPRISE.md` documents the full dashboard suite (Transactions, Screening Center, Products registry, Regulatory Radar, eCFR Workbench + notes, vault, Audit-Readiness Score, Team) included with every Enterprise account.
- Stale links fixed: checkout now points at https://app.exchek.us; the ETHOS Enterprise link points at exchek.us/enterprise.

### Fixed
- `exchek-red-flag-assessment` no longer hardcodes a count/date for Supplement No. 3 to Part 732 — it instructs a live pull instead.

## [3.5.4] — 2026-06-11

**The dashboard fills itself.** `exchek-classify` can now mirror compliance-pipeline *status* to the app.exchek.us Transactions page as it works — opt-in, metadata-only, and silent for free users.

- New plugin setting `transaction_sync` (`ask` default / `on` / `off`). Three gates before any event is recorded: the Step 0 CUI gate (absolute — flagged engagements never sync and are never even asked), an authenticated ExChek connection, and user consent folded into the step 1 question set.
- New reference [transaction-sync.md](skills/exchek-skill-classify/references/transaction-sync.md): the complete allowed-fields list, label discipline (category words only — with right/wrong examples), the milestone→event map (jurisdiction, classify, screen, memo render), fire-and-forget failure handling, and the user's revocation controls.
- Events recorded: jurisdiction (EAR/ITAR) at confirmation, classify (final ECCN) at approval, screen (list name or hit class — never the party) when screening runs or `pending` when deferred, and a `note` with the DOC number after an Enterprise render.
- Orchestrator passes its `tx_XXX` id through so dashboard transactions line up with the local audit log; license/export-docs stages stay with their own skills.

## [3.5.3] — 2026-06-11

**Sign in instead of pasting keys.** The ExChek API now has an OAuth-authenticated MCP endpoint (`https://api.exchek.us/mcp/pro`) backed by the new account portal at **app.exchek.us** (credits, top-ups, key rotation, connected apps, render history).

- `exchek-classify` credential resolution now prefers the OAuth connector on claude.ai/Claude Desktop (add `/mcp/pro` → sign-in window → consent — no key handling), then the `enterprise_api_key` plugin setting, then `EXCHEK_API_KEY`, then a pasted key (never on claude.ai/Desktop).
- Purchase/management links point at https://app.exchek.us instead of the bare checkout URL.
- ENTERPRISE.md documents both MCP auth modes.

## [3.5.2] — 2026-06-11

**Paid option surfaced at startup; payment-first enforcement.** Feedback from first live run of 3.5.1:

- `exchek-classify` step 1 now asks the deliverable question up front (free Word report vs. official ExChek PDF at \$1/report) alongside the folder/format questions, including how to buy credits — instead of springing it at report time. Step 6 executes the stored choice.
- **Payment first, then variables**: the skill must verify the Enterprise key *before* fetching the contract or building a payload, and must never offer to approximate the paid document without one. Matches the API change that gates `GET /pdf/classification/contract` and `get_classification_pdf_contract` behind the key (402 + purchase link otherwise; contract fetches never consume credits).

## [3.5.1] — 2026-06-10

**Official PDF memorandum (Option 2, ExChek Enterprise).** Classification now offers two deliverables at report time: the existing free local Word document (Option 1, default — unchanged, fully offline), or the official branded 21-page ExChek classification-memorandum PDF rendered by the ExChek API at a flat **$1 per report** (Option 2, prepaid credits, no subscription).

- `exchek-classify`: Flow step 6 asks the one-question deliverable choice; new **Official PDF memorandum** section and [references/pdf-rendering.md](skills/exchek-skill-classify/references/pdf-rendering.md) cover key setup, the variable contract (`GET https://api.exchek.us/pdf/classification/contract` / `get_classification_pdf_contract`), REST and MCP render calls, and error handling. Rendering is stateless (render-and-discard); the CUI/Classified gate explicitly excludes Option 2 — air-gapped memos stay on Option 1.
- Plugin: new optional `enterprise_api_key` setting; when set, the bundled `exchek-api` MCP connection sends it as the Authorization header so `create_classification_pdf` works without any per-call key handling. Keys come from https://api.exchek.us/enterprise/checkout.
- `exchek-orchestrator`: routing note — the deliverable question belongs to the classify skill; the hub must not pre-empt it.

## [3.5.0] — 2026-06-04

**Reports always render visible tables, and the classification memo is upgraded to best-in-class.** Fixes the recurring customer defect where report tables rendered without visible borders (in both Claude Code and Cowork), and strengthens the Classification Report to the standard a trade-compliance attorney would produce.

### Fixed

- **`.docx` tables now always render with visible borders.** Two root causes: (1) the converter relied on docx-js *default* borders, which render inconsistently; (2) in Cowork the converter never runs (no local node/MCP), so agents improvised and regressed to borderless defaults — notably python-docx's default `Table Normal` style, which has **no** borders. The converter now sets borders explicitly, and the docx skill now carries a mandatory spec for the Cowork path (below).

### Added

- **Converter (`report-to-docx.mjs`):** explicit `BorderStyle.SINGLE` on every table and cell, bold + `D9D9D9`-shaded header row (repeating across page breaks), explicit cell margins, and an explicit US-Letter section (12240×15840, 1″ margins) that guarantees the 9360-twip column math.
- **`exchek-skill-docx` SKILL.md — mandatory "Table & layout requirements for a directly-built .docx"** for environments without the converter (Cowork/browser): visible borders, dual DXA widths summing to 9360, header shading, cell margins, US-Letter — plus an explicit callout of the python-docx `Table Normal`→`Table Grid` trap and a copy-paste **delivery-gate** check the agent runs before sending the file.
- **Classification Report template + best-practices reference — best-in-class upgrades:** structured **§ 772.1 "specially designed" catch-and-release** (paragraph (a) catch → (b)(1)–(6) release, prong by prong) usable in Steps 4 and 5; a **determination-confidence** field (High/Med/Low) with a decision rule routing Medium/Low to a CCATS; a **controlling-parameter comparison** (quoted CCL threshold ↔ item spec ↔ meets?); an inline **CCL-version pin**; and **Appendix A — draft CCATS submission** (§ 748.3 SNAP-R Block 22(a)/24).
- **Regression gate:** `tests/docx.test.mjs` now asserts explicit non-nil `<w:tblBorders>` on all sides, cell borders, `D9D9D9` header shading, cell margins, and US-Letter page size, so visible tables can't silently regress again. JSON sibling schema gains `confidence`, `ccats_recommended`, and `specially_designed`.

### Changed

- **`report-to-docx.mjs` no longer trusts docx-js default table borders** — all styling is explicit (see Added). The HTML fallback is unchanged.
- **Section 9 data-source line corrected** in the classification template: the *local* server is `ecfr.gov`-primary with `api.exchek.us` fallback (the prior text had it backwards); the *hosted* API MCP uses `api.exchek.us`.
- MCP server `VERSION` + `package.json` aligned to 3.5.0. `claude plugin validate --strict` passes; 30/30 tests pass.
- **Docs accuracy — hosted-API operational logging disclosed.** `TELEMETRY.md` and `DATA_SOURCES.md`
  previously implied the hosted `api.exchek.us` endpoint kept no records ("still emitting no telemetry",
  "zero telemetry either way"). The **plugin** still emits zero telemetry and that is unchanged — but
  the hosted API (an opt-in data source) keeps minimal, anonymous operational logs like any web service:
  the tool/endpoint invoked, the CFR part requested, and per-session request counts. The docs now state
  this precisely and confirm what is **never** logged (search terms, skill arguments, item context,
  party names, results, PII), plus how to avoid it entirely (`regulatory_source: local`). No code change;
  aligns the disclosure with the hosted API's logging (exchekinc/Exchekwebsitecloudflare#24).
- **LICENSE v2.0 — friendly-fire fixes (DRAFT, pending IP-counsel review).** Four clauses that were
  prohibiting things ExChek's own strategy and users depend on were narrowed, and two structural
  improvements added. The adversarial armor (no-compete 2(c), no white-label, trademark reservation,
  security/attack prohibitions, monitoring, Delaware venue, $100 cap) is unchanged. Fixes: **(1)** new
  §1A authorizes service-provider use (broker/consultant on behalf of clients) and attribution-preserving
  integrations that install the free public engine — without weakening 2(b)/2(c); **(2)** §2(i) now
  permits bona-fide agent-native/automated use within published rate limits, prohibiting only abuse,
  over-limit, circumvention, or derivative-dataset/competing use; **(3)** §2(e) reverse-engineering is
  scoped to competing-product/non-public-logic purposes, with a good-faith integration-development
  carve-out; **(4)** §2(f)/§3(e) now permit retaining outputs in your own compliance records (aligning
  with the 15 CFR §762.6(a) five-year retention duty), and new §4A disclaims ownership of public-domain
  U.S. Government text (17 U.S.C. §105) while preserving rights over ExChek's formatting/mappings/logic.
  §5 trade-secret claim scoped to non-public material; §9(a) adds 30-day notice for unilateral license
  changes (immediate termination preserved for breach/security). Version/date header added.

## [3.4.4] — 2026-06-04

**Claude Cowork compatibility.** The plugin advertises "Works in Cowork," but two things assumed a local shell/Node runtime that Cowork (browser) doesn't have. This release makes the plugin degrade gracefully in Cowork instead of erroring, and documents the in-browser data path. No change to Claude Code behavior.

### Fixed

- **Hooks no longer error or block in Cowork.** All three hooks ran local shell commands (`diff`/`cp`/`npm install`, `touch`/`chmod`, `node … seal`) that can't execute in Cowork's browser runtime. Each hook now guards on the tool it needs and exits 0 when it's absent:
  - `SessionStart` (local-MCP dependency install) early-exits unless `npm` is on PATH and `CLAUDE_PLUGIN_DATA` is set, and always ends `; true` so a failed install can't block session start.
  - `PreToolUse` (ensure the audit-log file exists) early-exits when `CLAUDE_PLUGIN_DATA` is unset and is `|| true`-guarded so it can never block `report_to_docx`/`csl_search`.
  - `SessionEnd` (audit-chain seal) early-exits unless `node` is on PATH (it was already `|| true`).
  - On Claude Code (npm/node present) behavior is unchanged; on Cowork the hooks no-op cleanly.

### Changed

- **`regulatory_source` userConfig now documents the Cowork path.** Description spells out that the local Node MCP can't spawn in browser Cowork, so users should choose `api` (the hosted `api.exchek.us` MCP — eCFR + skill data, no local dependency), and that the local-only tools (CSL screening, audit log, Word `.docx` export) require Claude Code or a desktop runtime. Both MCP servers (`exchek` stdio, `exchek-api` http) remain declared; the manifest has no per-platform gating field, so Cowork simply uses whichever server starts (the HTTP one).
- MCP server `VERSION` + `package.json` aligned to 3.4.4.

### Known limitation (not yet addressed)

- `userConfig.default_report_dir` (`type: "directory"`) and the keychain-backed `sensitive` fields assume a local filesystem/OS keychain. Their Cowork behavior is a separate, larger change (Cowork-native storage) and is intentionally out of scope here.

## [3.4.3] — 2026-06-04

**Marketplace listability fix.** The plugin failed `claude plugin validate` and the marketplace file was missing required fields — so the directory listing and the `/plugin marketplace add` path were both broken. This release makes the plugin pass validation cleanly and the marketplace render correctly. No skill or MCP behavior changes.

### Fixed

- **`claude plugin validate` now passes.** `.claude-plugin/plugin.json` declared `"agents": "./agents/"` — but the `agents` manifest field expects file path(s), not a directory, so the manifest hard-errored with `agents: Invalid input` and the whole plugin failed validation (the review pipeline runs this same check). Removed the redundant `skills`, `agents`, and `hooks` path fields entirely: all three named **default locations** (`skills/`, `agents/`, `hooks/hooks.json`) that Claude Code auto-discovers, so declaring them added nothing — and per the schema, an explicit `skills: "./skills/"` actually caused the default `skills/` directory to be **scanned twice**. Components are unchanged; they're now found by auto-discovery. The inline `mcpServers` config stays (it is not a default-location file).
- **`.claude-plugin/marketplace.json` was missing both required top-level fields** (`name` and `owner`) and the entry was missing `displayName`. A marketplace file without `name`/`owner` is invalid, which broke `/plugin marketplace add exchekinc/exchekskills`. Rebuilt the file with the required `name` (`exchek`) and `owner` block, and enriched the plugin entry with `displayName` ("ExChek Export Compliance"), `author`, `homepage`, `category`, and the customer-facing description.

### Changed

- **`displayName: "ExChek Export Compliance"`** added to `plugin.json` so the human-readable name (not the kebab-case `exchekskills`) shows in the `/plugin` picker and marketplace UI.
- MCP server `VERSION` + `package.json` aligned to 3.4.3.

## [3.4.2] — 2026-06-02

**Docx generator stabilization (Tier 1).** The report converter kept breaking — root-caused to a **docx version skew + a known corruption bug**, not an API change. Fixes the breakage and adds a never-fail fallback. (Tiers 2–3 — inverting to a schema-validated JSON source of truth and a frozen counsel-approved template — are planned separately.)

### Fixed

- **ESM ↔ `NODE_PATH` resolution mismatch (likely the biggest real-world cause).** The MCP points the spawned converter at the installed `docx` via `NODE_PATH`, but the converter used `import … from "docx"` — and **ESM `import` ignores `NODE_PATH`** (only CommonJS honors it). So on any machine where `docx` wasn't *also* in the converter's own upward `node_modules`, the import simply failed. The converter now loads `docx` via **`createRequire(...)` (CommonJS, which honors `NODE_PATH`)** against docx's CJS build, so the plugin's existing install mechanism actually works. Verified end-to-end: with `NODE_PATH` set as in production, the converter now produces a valid `.docx` (ZIP/`PK` magic).
- **docx version skew + corruption bug.** `servers/exchek-mcp/package.json` declared `docx: ^8.5.0` while the converter pins `9.6.1`; whichever resolved first won, and **docx < 9.6.0 has a JSZip surrogate-pair bug** that corrupts any `.docx` containing a character above U+FFFF (emoji/exotic symbols an LLM may emit). Pinned the MCP server to **`docx` `9.6.1` exact** (matches the converter, above the 9.6.0 fix) and regenerated the lockfile, eliminating both the skew and the corruption exposure.

### Added

- **Graceful, never-fail rendering.** `report-to-docx.mjs` now imports `docx` **dynamically** and wraps the render: on any failure (missing/broken install, render error) it produces a self-contained **HTML** report (opens in Word via File → Open) instead of crashing. The JSON sibling is always written first, and on fallback the **markdown source is kept too** — the user always gets a complete, openable deliverable. The MCP `report_to_docx` returns `{ fallback: true, html_path, md_path, json_path, note }` so the skill can tell the user plainly.
- **docx version self-check** (warns when the resolved `docx` is below 9.6.0) and an **astral-character strip** (removes >U+FFFF codepoints before rendering — defense-in-depth against the corruption class; a legal memo shouldn't contain emoji anyway).
- **`tests/docx.test.mjs`** — unit tests for the parser, the HTML fallback, and the astral strip (no `docx` needed), plus a render-and-unzip structural test (full-width DXA tables, uniform grid, heading styles, a high-Unicode canary) that **skips cleanly if `docx` isn't installed**. The converter's pure functions are now exported and `main()` is guarded so the module is importable.

### Changed

- MCP server `VERSION` + `package.json` aligned to 3.4.2.

## [3.4.1] — 2026-06-02

**Audit-trail integrity fix + strongest model on the high-stakes reviewer.** Tuning the plugin to the latest Claude Code/model capabilities, Cowork-first (everything stays automatic — no CLI for the user).

### Fixed

- **Audit log no longer self-corrupts on report emission.** The `PostToolUse` hook appended a **plain, unsigned** line (`{"ts":…,"event":"report_emitted"}`) to `audit.jsonl`, which has no `prev_hmac`/`hmac` — so `mcp__exchek__audit_verify` would (correctly) report the chain as broken after every report. Fixed by **logging the `report_emitted` event from inside the MCP's `report_to_docx` tool**, where the HMAC key lives, so the event is a valid link in the chain. The unsigned hook write was removed.

### Changed

- **`exchek-classification-reviewer` agent → `model: opus`, `effort: high`** (was `sonnet`/`medium`). The independent second opinion on a legal determination is exactly where the most capable model pays off; the bulk `exchek-audit-runner` stays on `sonnet`. Uses the `opus` alias so it tracks the latest Opus automatically.
- **MCP server + package versions aligned to 3.4.1** (`servers/exchek-mcp/index.mjs` `VERSION`, `package.json`); corrected the package description that still claimed "No call-home."

### Added

- **Read-only `SessionEnd` seal.** A new `SessionEnd` hook runs `node …/lib/audit.mjs seal`, which **verifies** the chain and appends a timestamped record to a sidecar `audit-seals.jsonl` — it never writes to the HMAC chain itself (so a hook can't corrupt it) and defers to `mcp__exchek__audit_verify` if it can't see the audit key. New exported `seal()` + a tiny `verify`/`seal` CLI in `lib/audit.mjs` (Node built-ins only — runs without `node_modules`). Note: if a host (e.g. some Cowork builds) doesn't fire `SessionEnd`, the integrity fix above is independent and still applies; the chain is verifiable on demand regardless.

## [3.4.0] — 2026-06-02

**Regulatory-currency pass: red flags, the BIS 50% Affiliates Rule, and the ITAR AUKUS exemption.** BIS and DDTC amended several rules the skills depend on. Most importantly, **Supplement No. 3 to 15 CFR Part 732 (the "Know Your Customer" red flags) now has 29 enumerated flags** (last amended 2025-11-12) — the skill shipped a generic 12-item list. This release refreshes the affected content and adds a way to keep the red flags from going stale again.

### Added

- **`ecfr_full_text` tool on the local MCP** (`servers/exchek-mcp/lib/ecfr.mjs` + `index.mjs`) — fetches the full regulatory **text** of a part/appendix from `ecfr.gov` (the structure tools only return hierarchy), with latest-amendment-date resolution and a 24h cache. Part **732** added to the supported set so the red-flag skill can pull the **live Supplement No. 3** at runtime (`part: "732"`, `contains: "Supplement No. 3"`). ecfr.gov-only — api.exchek.us does not serve full text or mirror Part 732. Local server is now **14 tools**.
- **50% Affiliates Rule guidance** added to `exchek-skill-partner-compliance` (ownership-tracing flow-down) and cross-referenced in `exchek-skill-risk-triage`. (The `exchek-skill-csl` screening best-practices already covered it.)
- **ITAR AUKUS § 126.7 + USML-currency notes** added to `exchek-skill-jurisdiction`; an ITAR-§126.18 parallel note to `exchek-skill-deemed-export`; and an ITAR DCS/authorization (§ 123.9, § 126.7/§ 126.5) note to `exchek-skill-export-docs`.
- **`docs/RULES_TRACKER.md`** — a living watch-list of BIS/DDTC/OFAC rule changes that will require skill updates: dated triggers (e.g. the 2026-11-09 Affiliates Rule resumption), pending rules (AI-diffusion replacement; USML Cat IV/XV/XI/IX), recurring/auto-current items (live-pulled red flags, § 742.6), and a "recently completed" log. Linked from the README.

### Changed

- **`exchek-skill-red-flag-assessment` rewritten to the current 29-flag Supplement No. 3** — `references/end-use-red-flag-guidance.md` regrouped into Group A (general diversion, §§1–12), Group B (semiconductor/computing/600-series/D:5, §§13–23), and Group C (Entity List/FDP/AI-weights/ownership, §§24–29), each flag traceable to its official Supp. 3 number, plain-English for the SMB audience. Added a §29 "ownership" companion section on the 50% Affiliates Rule (incl. the 2025-11-10 → 2026-11-09 suspension). `SKILL.md` flow now pulls the live list via `ecfr_full_text` and notes Groups B/C apply conditionally. `templates/Red Flag Assessment Note.md` restructured to the three groups.
- **`exchek-skill-classify` — AI Diffusion Rule correction.** `classification-memo-best-practices.md` no longer states the Jan-2025 "AI Diffusion" IFR is "effective May 2025." It now reflects that the framework was **rescinded May 12–13, 2025** (never took effect), replaced by BIS guidance/enforcement red flags with a replacement rule pending; that advanced-computing ECCNs (incl. live **4E091**) remain and change often; and the **2026-01-15 § 742.6 case-by-case** shift for China/Macau.
- **Advanced-computing licensing currency** added to `exchek-skill-license` (system prompt Scope) and `exchek-skill-country-risk` (Country Groups): the § 742.6 case-by-case policy, the D:5/Macau ultimate-parent rule, and a "verify the current rule" caveat for this fast-moving area.
- **Civil-penalty figures softened** in `exchek-skill-classify` and `exchek-skill-csl`: hard-coded EAR "$300,000" and ITAR/OFAC "$1M/$1.3M" maximums replaced with "IEEPA/AECA statutory maximum, inflation-adjusted annually — verify current" (the caps are now higher than the figures previously shown).
- **Folder rename for consistency:** `skills/exchek-skill/` → `skills/exchek-skill-classify/`, aligning the classify skill with the rest of the `exchek-skill-*` family (folder `exchek-skill-classify` → invocation name `exchek-classify`, like `exchek-skill-csl` → `exchek-csl`). The skill's `name:` and the `api.exchek.us` skill key (`exchek-classify`) are unchanged, so plugin users and the API are unaffected. References updated across README, docs, and cross-skill mentions.

### Regulatory notes (as of 2026-06-02)

- **BIS Affiliates Rule** (≥50% ownership by Entity List/MEU parties extends controls to affiliates): interim final rule **2025-09-30** (FR doc 2025-19001); **suspended 2025-11-10 → 2026-11-09** (FR doc 2025-19846). The §29 ownership-tracing duty continues during the suspension.
- **ITAR AUKUS § 126.7** exemption (Australia/UK/US): final rule effective **2025-12-30**; § 126.18's dual/third-country-national release scope is unchanged, so the CUI/§126.18 gate boilerplate in all skills remains accurate.
- **USML revisions**: a temporary Category VIII modification was terminated in early 2025; DDTC's 2026 agenda includes Categories IV/XV (space), XI (semiconductor/PCB), and IX ("defense services"). Skills now tell users to verify the current USML.

## [3.3.0] — 2026-06-02

**You now choose your regulatory-data source: the local MCP or the hosted ExChek API MCP.** v3.2.0 wired
`api.exchek.us` only as a *silent* fallback inside the local server. But `api.exchek.us` is a full
no-auth Cloudflare Workers API (v2.0.0) that **hosts its own MCP server** at
`https://api.exchek.us/mcp` (Streamable HTTP, JSON-RPC 2.0). This release surfaces that as a first-class,
user-selectable source behind a one-time **data-source gate**, and makes the docs accurate about what
that means for outbound traffic.

### Added

- **Second MCP server `exchek-api`** in `.claude-plugin/plugin.json` — `{"type":"http","url":"https://api.exchek.us/mcp"}`.
  Exposes 7 tools: `list_skills`, `get_skill`, `get_skill_bundle`, `get_ecfr_part`, `get_ecfr_sections`,
  `search_ecfr_part`, `search_ecfr_title` (namespaced `mcp__exchek-api__*`). Coexists with the local stdio `exchek`.
- **Data-source gate** in all 20 SKILL.md `⚡ Tools` blocks. Before pulling any CFR text a skill calls the new
  local tool **`regulatory_source`** and either uses the pinned source or asks the user once
  (**ExChek API MCP recommended**; Local MCP the alternative).
- **`regulatory_source` userConfig** option (`ask` | `local` | `api`, default `ask`) so enterprises can pin a
  default and skip the prompt.
- **`regulatory_source` MCP tool** on the local server — returns `{mode, recommended, routes, options, always_local}`
  computed from `EXCHEK_REGULATORY_SOURCE`, giving the skill an exact tool-routing map.
- **`docs/DATA_SOURCES.md`** — the canonical explainer: the two MCPs, what does/doesn't transit each host, the
  gate, the config knob, the tool-routing table, and the REST/MCP endpoint reference.

### Changed

- **`servers/exchek-mcp/lib/ecfr.mjs`**: the local server's automatic mirror fallback now covers **all 11
  supported parts** (added 748, 762, 772 to `EXCHEK_API_PARTS`), matching `GET /api/ecfr/meta`. ecfr.gov stays
  primary; the mirror is a *disclosed* backup — every response records `source` (`cache` / `ecfr.gov` / `api.exchek.us`).
- **Legacy `GET https://api.exchek.us/api/ecfr/{part}` curl copy** in the data-heavy skills (classify, license,
  country-risk, encryption, jurisdiction) reframed to the gate + MCP tools; the `exchek-setup` connectivity step
  now tests the ExChek API MCP and surfaces the configured source.
- **Doc accuracy fixes** in `SECURITY.md`, `DATA_STORAGE.md`, `TELEMETRY.md`, `COMMUNICATIONS_KIT.md`,
  `CHAMPION_KIT.md`, and `README.md`: the "only ecfr.gov + trade.gov / no ExChek server in the loop" claims now
  read accurately — by default the plugin contacts only the two government hosts; if you opt into the ExChek API
  MCP (or the local auto-fallback fires), CFR part numbers + search terms also transit `api.exchek.us`, but never
  your item descriptions, party names, file content, or compliance results. Telemetry remains zero.

### Notes

- The removed `/api/classify/*` and `/api/expert-review/*` endpoints (HTTP 410) are **not** used by any skill;
  classification is performed in-skill from the CCL (774) and USML (121) data.
- Part 732 (red-flag Supp. 3) is not mirrored by either source and continues to rely on ecfr.gov (unchanged).

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
