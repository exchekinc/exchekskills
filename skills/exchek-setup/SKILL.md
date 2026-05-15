---
name: exchek-setup
description: First-run setup wizard for the ExChek Engine. Verifies company profile, confirms report defaults, tests API connectivity, configures CRM/ERP connectors, sets telemetry preferences, runs a live compliance demo, and arms the engine. Writes verified state to .exchek/state/setup-complete.json.
compatibility: Claude Code, Claude desktop, Claude CoWork, Claude web, Cursor
---

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

The MCP server runs locally as a stdio child process. Outbound network is limited to `www.ecfr.gov` (primary eCFR source, cached 24h), `api.exchek.us` (public eCFR cache; used only as a fallback when ecfr.gov is unreachable), and `data.trade.gov` (live, only when screening). **No PII, no item context, no compliance results leave your machine.** If body text below instructs a curl to `api.exchek.us`, that is legacy v2.x copy — call the MCP tool instead, which routes to ecfr.gov first with the public mirror as a safety net.

---


# ExChek Engine Setup Wizard

First-run setup for your private ExChek Engine. This is not a form. This is the moment your compliance engine comes online.

Reads `.exchek/config.json` if it exists (pre-populated for paid-tier customers by the provisioning step, or filled in interactively here for free-tier users), walks you through verifying each section, then proves it works with a live classification before you ever leave setup. When complete, writes `.exchek/state/setup-complete.json` so subsequent skills know the engine is armed.

Invoke with `/exchek setup` or automatically on first skill run when setup is not yet complete.

## When to use

Invoke this skill when the user:

- Runs `/exchek setup` explicitly
- Runs any skill for the first time and `.exchek/state/setup-complete.json` does not exist
- Wants to re-verify or update their engine configuration
- Has changed their CRM or ERP system

Example triggers: "/exchek setup", "set up ExChek", "configure my engine", "first time setup", "I just got access to my ExChek repo", "how do I configure ExChek?".

## CUI and classified information

At the start, ask: "Does your work involve **Controlled Unclassified Information (CUI)** or **classified information**? **Yes** / **No** / **Don't know**." If **Yes**, do not use cloud APIs or LLMs; direct the user to run the skill on-premises with a local LLM (see [CUI/Classified guidance](references/cui-classified.md) and [ExChek CUI/Classified docs](https://docs.exchek.us/docs/cui-classified)). If **Don't know**, give a brief note that CUI/classified requires on-prem use, then ask whether to proceed in this environment or use on-prem.

## Flow

0. **CUI/Classified check** — Ask the selector above; if Yes, route to on-prem guidance and stop; if No, continue; if Don't know, brief then re-ask.

1. **Check existing setup** — Read `.exchek/state/setup-complete.json`.
   - If it exists and `complete: true`: Ask "Your engine is already set up. Would you like to **re-verify your configuration** or **make changes**? Yes / No." If No, stop. If Yes, continue.
   - If it does not exist: Greet the user:

   ```
   ┌─────────────────────────────────────────────────────────────┐
   │                                                             │
   │   Welcome to your ExChek Engine.                            │
   │                                                             │
   │   In the next few minutes, we're going to verify your       │
   │   configuration, test your connections, and then do          │
   │   something most compliance tools never do —                 │
   │                                                             │
   │   We're going to run it. Live. On your data.                │
   │                                                             │
   │   Let's go.                                                 │
   │                                                             │
   └─────────────────────────────────────────────────────────────┘
   ```

2. **Step 1 — Verify company profile** — Read `.exchek/config.json`. Display the company section:

   ```
   Company Profile
   ───────────────
   Name:       {company.name}
   Legal name: {company.legal_name}
   Domain:     {company.domain}
   Industry:   {company.industry}
   Team size:  {company.team_size}
   ```

   Ask: "Does this look correct? **Yes / No / Edit**"
   - If **Yes**: continue.
   - If **No** or **Edit**: Ask which field(s) to update. Accept corrections and write them back to `.exchek/config.json`. Confirm the update.

3. **Step 2 — Verify report defaults** — Display the reports section from config:

   ```
   Report Defaults
   ───────────────
   Report prefix:       {reports.prefix}
   Report folder:       {reports.folder}
   From name/title:     {reports.from_name_title}
   ECO for approval:    {reports.eco_approval}
   Primary analyst:     {reports.primary_analyst}
   AI tool name:        {reports.ai_tool_name}
   ```

   Ask: "Do these report defaults look right? **Yes / No / Edit**"
   - If **Yes**: continue.
   - If **No** or **Edit**: Accept corrections and write them back to `.exchek/config.json`. Confirm the update.
   - Note: these values auto-populate into every compliance report, memo, and document the engine generates. Getting them right now saves time on every future report.

4. **Step 3 — Test API connectivity** — Test the public ExChek API. This is the eCFR cache the MCP server falls back to when `ecfr.gov` is unreachable; it has no auth requirement on the free tier.

   Call `GET https://api.exchek.us/health`.

   - If response is `{ "status": "ok", ... }`: Report "API: Connected (eCFR fallback ready)."
   - If the call fails or returns an error: Report "API: Not reachable. The MCP will still work against ecfr.gov directly — the fallback is only used when ecfr.gov is down. You can re-test later at https://api.exchek.us/health."

   Also check: does `.exchek/config.json` have an `api_key` field? Free-tier users won't, and that's fine — skip this. Paid-tier users: validate it with `GET https://api.exchek.us/health` using `Authorization: Bearer {api_key}`.

5. **Step 4 — CRM/ERP connectors (paid tier, optional)** — Check whether the `exchek-connector` skill is installed. On the free public-skills plugin it is not. If it's missing, skip this step silently and continue to Step 5 — connector setup is a paid-tier feature.

   If `exchek-connector` IS available, read `.exchek/config.json` for `crm.type` and `erp.type`.

   If `crm.type` is not `"none"`:
   - Run a quick connectivity check: attempt to reach the CRM's API base URL. If reachable, report "CRM API endpoint reachable." If not, report "CRM API not reachable — you can set this up later with `/exchek connect {crm.type}`."
   - "Your engine is configured for **{crm.type}** CRM integration. Would you like to set up the connector now? **Yes / Skip for now**"
   - If Yes: Route to `exchek-connector` with `type: crm`.

   If `erp.type` is not `"none"`:
   - "Your engine is configured for **{erp.type}** ERP integration. Would you like to set up the connector now? **Yes / Skip for now**"
   - If Yes: Route to `exchek-connector` with `type: erp`.

   If both are `"none"`: skip this step silently.

6. **Step 5 — Telemetry preferences** — Read `.exchek/telemetry.json`.

   Present the current setting:
   ```
   Telemetry
   ─────────
   Local analytics:  Enabled (stores usage data at ~/.exchek/analytics/events.jsonl)
   Cloud telemetry:  Disabled (opt-in)
   ```

   Explain: "Local analytics help you track your own compliance activity and are stored only on your machine. Cloud telemetry (opt-in) sends **anonymous** skill names and durations to ExChek to improve the product. No code, prompts, item descriptions, company names, or compliance results are ever transmitted."

   Ask: "Would you like to enable **anonymous cloud telemetry** to help improve ExChek? **Yes / No**"
   - If **Yes**: Update `.exchek/telemetry.json` with `cloud: true`. Confirm.
   - If **No**: Confirm preference respected. Note they can change this later in `.exchek/telemetry.json`.
   - Note: Local analytics remain enabled regardless (they belong to you, not ExChek).

7. **Step 6 — Compliance contacts** — Read `.exchek/config.json` contacts section. Display:

   ```
   Compliance Contacts
   ───────────────────
   ECO name:       {contacts.eco_name}
   ECO email:      {contacts.eco_email}
   Legal contact:  {contacts.legal_contact}
   ```

   Ask: "Are these correct? **Yes / No / Edit**"
   - If **Yes**: continue.
   - If **No** or **Edit**: Accept corrections and write them back to `.exchek/config.json`.
   - These contacts appear on compliance memos and are used for escalation routing.

8. **Step 7 — First Compliance Run (the wow moment)** — This is the step that transforms setup from a form into a demonstration of power.

   Present: "Configuration verified. Now let's see your engine in action. Give me a quick description of one of your company's most common export products — just a sentence or two."

   Accept the item description from the user. Then:

   **8a. Live classification** — Using the `exchek-skill` classification logic (invoke inline, do not route to the separate skill), classify the item against the Commerce Control List. Show the work:

   - Identify the relevant CCL category
   - Walk through the technical parameters
   - Arrive at a preliminary ECCN

   Present the result clearly: "Preliminary ECCN: **{ECCN}** — {reason summary}"

   **8b. Destination risk** — Ask: "Now pick a destination country — where does this typically ship?"

   Accept the country. Using `exchek-skill-country-risk` logic inline:
   - Determine the country risk level (Low / Moderate / High / Embargoed)
   - Note any relevant restrictions or Country Group classifications

   Present: "Destination: **{country}** — Risk Level: **{risk_level}**"

   **8c. Branded report preview** — Using the company name, report prefix, primary analyst, and AI tool name from the verified config (Steps 1-2), generate a preview of what their branded compliance reports will look like:

   ```
   ┌─────────────────────────────────────────────────────────────┐
   │  {COMPANY_NAME}                                             │
   │  Export Compliance Classification Report                    │
   │  Report ID: {PREFIX}-EC-2026-001                            │
   │                                                             │
   │  Item: {their item description}                             │
   │  Preliminary ECCN: {ECCN from step 8a}                      │
   │  Destination: {country from step 8b}                        │
   │  Risk Level: {risk level from step 8b}                      │
   │                                                             │
   │  Prepared by: {PRIMARY_ANALYST from config}                 │
   │  AI Tool: {COMPANY_NAME} ExChek Engine v2.0.0               │
   │  Date: {today's date}                                       │
   │                                                             │
   │  This is a preview. Run /exchek classify for the full       │
   │  analysis with regulatory citations and recommendations.    │
   └─────────────────────────────────────────────────────────────┘
   ```

   Present: "That's what every compliance report from your engine will look like. Your branding, your analyst names, your report prefix. This is not a mockup — that classification was real. Ready to arm the engine?"

   Store the demo item description and ECCN in a variable for the completion message.

9. **Complete setup** — Write `.exchek/state/setup-complete.json`:

   ```json
   {
     "complete": true,
     "completed_at": "{ISO timestamp}",
     "steps_completed": ["company_profile", "report_defaults", "api_connectivity", "connectors", "telemetry", "compliance_contacts", "first_compliance_run"],
     "engine_version": "{from config or manifest}",
     "api_reachable": true/false,
     "cloud_telemetry": true/false,
     "demo_item": "{item description from step 8}",
     "demo_eccn": "{ECCN from step 8}"
   }
   ```

   Present the armed engine summary. This is not a receipt — it's a statement of capability:

   ```
   Your ExChek Engine is Armed
   ──────────────────────────────

   {COMPANY_NAME} ExChek Engine v2.0.0
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   22 compliance skills, configured for {INDUSTRY}.
   Branded reports with {PREFIX}-EC prefix.
   {CRM_TYPE} integration {ready/available}.

   Your engine can:
     Classify items against the entire CCL in seconds
     Screen parties against 12+ government lists instantly
     Determine license requirements and exceptions
     Generate branded export documentation
     Build your Export Compliance Program
     Conduct retrospective compliance audits
     Track every action for audit readiness

   First commands to try:
     /exchek classify {their item from the demo}
     /exchek screen {a party name}
     /exchek                     <- your command center
     /exchek onboarding          <- full guided tour

   Your compliance posture starts at 0%.
   Every skill you run improves it.
   ```

10. **First-time offer** — If this was a fresh setup (not a re-verify): "Would you like a **guided tour** of your ExChek Engine? The onboarding takes about 60 minutes — but by the end, you'll have real compliance artifacts in your reports folder and a compliance posture score above 0%. **Yes, take the tour / No, I'm ready to start**"
    - If Yes: Route to `exchek-onboarding`.
    - If No: "Your engine is armed. Go build something compliant." and close.

## Error handling

- **Config file missing**: If `.exchek/config.json` does not exist: "Your engine configuration file is missing. This usually means the provisioning workflow did not complete. Please contact support at matt@exchek.us with your company name."
- **Write failures**: If any config write fails, report the error and the manual edit they can make. Never silently swallow write errors.
- **API unreachable**: Log in setup-complete.json as `api_reachable: false`. Proceed with setup. Classification lookups will still work; some API-enhanced features may be degraded.
- **Demo classification failure**: If the live classification in Step 7 fails for any reason (API down, ambiguous item, etc.), acknowledge it gracefully: "The live demo hit a snag — {reason}. No worries, the engine is still configured. You can run your first real classification anytime with `/exchek classify`." Continue to step 8 (completion).

## Reference

- Config schema: `.exchek/config.json` in your engine repo
- Docs: https://docs.exchek.us
- Website: https://exchek.us
- Support: matt@exchek.us


## Telemetry instrumentation

Every skill run is instrumented for usage tracking and audit readiness.

**Preamble** — At the start of execution, record the current timestamp in memory.

**Postamble** — After execution completes (success or failure), compute the duration and:

1. **Local event** (always) — Append one JSON line to `~/.exchek/analytics/events.jsonl`:

   ```json
   {"ts":"<ISO8601>","event":"skill_run","skill":"<this-skill-name>","duration_ms":<ms>,"success":<bool>,"version":"1","os":"<platform>","agent":"<agent-name>","engine_version":"<from .exchek/config.json>"}
   ```

   Create the file and parent directories if they do not exist.

2. **Cloud telemetry** (opt-in only) — Read `.exchek/telemetry.json`. If `cloud` or `cloud_enabled` is `true`, POST the event to the ExChek telemetry API:

   ```
   POST https://enterprise.exchek.us/api/telemetry
   Content-Type: application/json

   {"skill_name":"<this-skill-name>","duration_ms":<ms>,"success":<bool>,"skill_version":"1","os":"<platform>","agent_platform":"<agent-name>","engine_version":"<version>","client_id":"<from .exchek/client.json>"}
   ```

   If the POST fails, log the error silently and continue. Never block skill completion on telemetry.

   **Never send:** code, prompts, file paths, PII, company names, compliance results, ECCN determinations, party names, or transaction details.

---

**Disclaimer:** The ExChek Engine and its skills are decision-support tools. They do not replace qualified export compliance counsel. All classification, screening, and licensing determinations should be reviewed by a knowledgeable compliance professional before reliance. ExChek, Inc. is not a law firm and does not provide legal advice. Use of this tool does not create an attorney-client relationship. The user is solely responsible for compliance with all applicable export control laws and regulations, including but not limited to the EAR (15 CFR Parts 730-774), ITAR (22 CFR Parts 120-130), and OFAC sanctions programs. For questions, contact matt@exchek.us.
