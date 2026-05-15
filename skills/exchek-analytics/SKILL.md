---
name: exchek-analytics
description: Compliance intelligence dashboard for the ExChek Engine. Computes an Audit Readiness Score (0-100), tracks compliance posture over time, shows transaction pipeline completeness and gaps, surfaces risk concentration by destination and ECCN category, generates auditor-ready export packages, and optionally benchmarks against anonymized industry data. Also shows skill usage counts, success rates, average durations, and CSV export. Respects privacy — never tracks code, paths, prompts, PII, or compliance results.
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


# ExChek Compliance Intelligence Dashboard

Answers the three questions every compliance professional loses sleep over: **Am I audit-ready?** **What am I missing?** **Is my posture improving?**

Reads from two data sources:
- `~/.exchek/analytics/events.jsonl` — skill execution telemetry (run counts, durations, success rates)
- `.exchek/state/transactions.jsonl` — transaction lifecycle log (classify, screen, license, docs chain status)

If cloud telemetry is opted in via `.exchek/telemetry.json`, shows anonymized industry benchmarks. Supports CSV export for compliance reporting and full audit package generation.

## When to use

Invoke this skill when the user asks to:

- See their audit readiness score
- Check their compliance posture or compliance health
- Review compliance gaps or find what they are missing
- View the analytics dashboard or usage statistics
- See how their compliance program is trending over time
- Generate an audit package or audit export
- View their transaction pipeline or workflow completeness
- Check risk concentration by country or ECCN
- Export analytics data to CSV
- Compare their compliance program to industry benchmarks
- Prepare for a BIS, OFAC, or DDTC audit

Example triggers: "Am I audit-ready?", "Show my compliance score", "What compliance gaps do I have?", "Generate an audit package", "How is my compliance trending?", "ExChek analytics", "Show my usage stats", "Export analytics", "Which skills have I used?", "What areas am I missing?", "Risk heatmap", "Transaction pipeline", "How do I compare?".

## CUI and classified information

At the start, ask: "Does the item or any information you'll share involve **Controlled Unclassified Information (CUI)** or **classified information**? **Yes** / **No** / **Don't know**." If **Yes**, do not use cloud APIs or LLMs; direct the user to run the skill on-premises with a local LLM (see [CUI/Classified guidance](references/cui-classified.md) and [ExChek CUI/Classified docs](https://docs.exchek.us/docs/cui-classified)). If **Don't know**, give a brief note that CUI/classified requires on-prem use, then ask whether to proceed in this environment or use on-prem.

## Flow

0. **CUI/Classified check** — Ask the selector above; if Yes, route to on-prem guidance and stop; if No, continue; if Don't know, brief then re-ask.

1. **Read telemetry config** — Load `.exchek/telemetry.json` from the workspace. Check:
   - `enabled`: whether local event logging is active (default: true)
   - `cloud_enabled`: whether anonymous cloud telemetry is opted in (default: false)
   - `events_path`: path to events file (default: `~/.exchek/analytics/events.jsonl`)
   - If the file does not exist, report defaults and continue.

2. **Read data sources** — Parse both files:
   - `~/.exchek/analytics/events.jsonl` (one JSON object per line) — skill execution events.
   - `.exchek/state/transactions.jsonl` (one JSON object per line) — transaction lifecycle records written by the orchestrator, tracking each transaction through the classify, screen, license, docs chain.
   - If both files are missing or empty, report "No usage data yet. Run some ExChek skills and come back to see your compliance intelligence." and stop.
   - If only one file exists, proceed with partial data and note which data source is missing.

3. **Compute Audit Readiness Score** — This is the headline number. A single score from 0 to 100 that answers "How audit-ready am I right now?" Compute it from six weighted dimensions:

   - **Transaction completion rate (20%)**: What percentage of transactions have completed the full classify, screen, license, docs chain? Read from `.exchek/state/transactions.jsonl`. A transaction that was classified but never screened is incomplete. Score = (fully complete chains / total initiated transactions) x 100.

   - **Re-screening cadence (15%)**: Are parties being re-screened per policy? Check the interval between the most recent screening event for each unique party and compare against a 90-day re-screening window (configurable in `.exchek/config.json` key `rescreening_interval_days`, default 90). Score = (parties screened within window / total unique parties screened) x 100.

   - **Documentation coverage (20%)**: What percentage of transactions that received a license determination also have generated export docs (exchek-export-docs run)? Score = (transactions with docs / transactions with license determination) x 100.

   - **ECP currency (15%)**: When was the last time the ECP skill was run? Score decays over time: 100 if within 90 days, 80 if within 180 days, 50 if within 365 days, 20 if older, 0 if never run.

   - **Recordkeeping compliance (15%)**: Has a recordkeeping review been run? Same decay logic as ECP: 100 if within 90 days, 80 if within 180 days, 50 if within 365 days, 20 if older, 0 if never.

   - **Skill coverage (15%)**: How many of the critical skill categories have been used at least once? Critical categories: Classification, Screening, Licensing, Documentation, Country Risk, Risk Triage, Red Flags, ECP, Recordkeeping, Deemed Export, Jurisdiction, Encryption, Audit Lookback, Partner Compliance, Compliance Report. Score = (categories used / 15) x 100.

   The weighted composite score is: `(completion x 0.20) + (rescreening x 0.15) + (docs x 0.20) + (ecp x 0.15) + (records x 0.15) + (coverage x 0.15)`.

   Display the score prominently with a visual bar and full breakdown:

   ```
   AUDIT READINESS SCORE: 87/100
   ████████████████████░░░

   Breakdown:
     Transaction completion:  92%  ████████████████████░
     Re-screening cadence:    85%  █████████████████░░░░
     Documentation coverage:  95%  ███████████████████░░
     ECP currency:           100%  ████████████████████░
     Recordkeeping:           78%  ████████████████░░░░░
     Skill coverage:          72%  ███████████████░░░░░░
   ```

   Below the breakdown, always show **What to improve** — actionable, specific recommendations for each dimension scoring below 90%. Examples:
   - "4 parties overdue for re-screening. Run `/exchek screen [party]` for each."
   - "3 transaction chains missing export documentation. Run `/exchek export-docs` for transactions [X, Y, Z]."
   - "You haven't run a recordkeeping review in 6 months. Try `/exchek records`."
   - "7 of 15 skill categories never used. Try `/exchek red-flags`, `/exchek deemed-export`, `/exchek jurisdiction`."
   - "No ECP review on file. Run `/exchek ecp` to generate your Export Compliance Program."

4. **Compliance Posture Timeline** — Show how the Audit Readiness Score has changed over time. Re-compute the score at each month boundary using only events up to that date. Display as a text bar chart for the last 90 days (3 months) or longer if data exists:

   ```
   Compliance Posture — Last 90 Days
   ---------------------------------
   Jan    ████████████████░░░░  78%
   Feb    █████████████████░░░  83%
   Mar    ████████████████████  87%  <- current
          -------------------------
          Trend: Improving (+9 points in 90 days)
   ```

   If fewer than 2 months of data exist, show whatever is available and note "More history will appear as you continue using ExChek."

   If the score has declined, flag it: "Trend: Declining (-X points). Review the breakdown above for areas that have slipped."

5. **Transaction Pipeline View** — Show the compliance workflow funnel from `.exchek/state/transactions.jsonl`. For the last 30 days (configurable), display how many transactions reached each stage:

   ```
   Transaction Pipeline — Last 30 Days
   ------------------------------------
     52 items classified
      |-- 48 parties screened (92%)
           |-- 47 license determinations (90%)
                |-- 41 export docs generated (79%)
                     |-- 38 fully documented (73%)
   ```

   Below the funnel, show a **Gap analysis** listing every drop-off:
   - "4 items classified but not screened"
   - "1 item screened but no license determination"
   - "6 transactions with license but no export docs"
   - "3 transactions with docs but incomplete records"

   Each gap should include an actionable next step (e.g., "Run `/exchek screen` for items [list]").

6. **Risk Heatmap** — Show where compliance risk concentrates across two dimensions. Read destination countries and ECCN categories from `.exchek/state/transactions.jsonl`:

   **By Destination:**
   ```
   Risk Concentration — By Destination
   ------------------------------------
     China          ████████████  12 transactions  -- High scrutiny
     Malaysia       ████████      8 transactions
     Germany        ██████        6 transactions
     India          ████          4 transactions
     UAE            ███           3 transactions   -- Diversion risk
   ```

   Flag countries that appear on embargo lists, have high Entity List density, or are known diversion points with a risk annotation. Reference the exchek-country-risk skill for details.

   **By ECCN Category:**
   ```
   Risk Concentration — By ECCN Category
   --------------------------------------
     Category 6 (Sensors)     ████████████  12 items
     Category 3 (Electronics) ████████      8 items
     Category 5 (Telecom)     ██████        6 items
     EAR99                    ████████████████  16 items
   ```

   If a destination and ECCN category combination triggers elevated concern (e.g., Category 6 items to China), call it out explicitly.

7. **Skill usage breakdown** — The original analytics view. Calculate from `~/.exchek/analytics/events.jsonl`:

   - **Total skill runs**: all time, last 7 days, last 30 days
   - **Skill usage breakdown**: count per skill name, displayed as a text bar chart:
     ```
     exchek-classify     ████████████  24
     exchek-csl          ████████      16
     exchek-license      ██████        12
     exchek-country-risk ████          8
     exchek-risk-triage  ██            4
     ```
   - **Success rate**: percentage of events where `success` is true vs false (all time and last 30 days)
   - **Average duration per skill**: mean `duration_ms` grouped by skill name, displayed in human-readable format (e.g., "12.3s")
   - **Most active days/times**: group events by day of week and hour; show the top 3 most active periods
   - **Compliance coverage**: map skills to compliance categories and show which have been used vs not:

     | Category | Skill(s) | Status |
     |----------|----------|--------|
     | Classification | exchek-classify | Used (24 runs) |
     | Screening | exchek-csl | Used (16 runs) |
     | Licensing | exchek-license | Used (12 runs) |
     | Jurisdiction | exchek-jurisdiction | Not yet used |
     | Encryption | exchek-encryption | Not yet used |
     | Red Flags | exchek-red-flag-assessment | Not yet used |
     | Deemed Export | exchek-deemed-export | Not yet used |
     | Documentation | exchek-export-docs | Used (6 runs) |
     | Country Risk | exchek-country-risk | Used (8 runs) |
     | Risk Triage | exchek-risk-triage | Used (4 runs) |
     | ECP | exchek-ecp | Not yet used |
     | Audit | exchek-audit-lookback | Not yet used |
     | Compliance Report | exchek-compliance-report | Not yet used |
     | Partner Compliance | exchek-partner-compliance | Not yet used |
     | Recordkeeping | exchek-recordkeeping | Not yet used |

8. **Compliance coverage gaps** — Highlight skill categories that have not been used yet. Provide actionable, specific suggestions. For example:
   - "You haven't run a **red flag assessment** yet. Consider `/exchek red-flags` for your next transaction."
   - "No **deemed export** reviews found. If you share technology or source code with foreign nationals, run `/exchek deemed-export`."
   - "No **audit lookback** on file. Consider `/exchek audit` to review historical shipments."
   - "No **jurisdiction determination** found. Run `/exchek jurisdiction` to confirm ITAR vs EAR before your next classification."

9. **Export options** — Offer two export paths:

   **A. CSV Export (quick)** — Ask: "Would you like to export these analytics to CSV?" If yes:
   - Read the report folder path from `.exchek/config.json` (key: `report_folder`). If not set, use the current workspace.
   - Write a CSV file named `ExChek-Analytics-YYYY-MM-DD.csv` with columns: `timestamp`, `event`, `skill`, `duration_ms`, `success`, `version`, `os`, `agent`, `engine_version`.
   - Report the file path to the user.
   - If in an environment without file write access (Claude web), output the CSV content in a code block for the user to copy and save.

   **B. Audit Package Export (comprehensive)** — If the user requests `/exchek analytics export audit` or asks to generate an audit package, produce a complete folder at `{report_folder}/ExChek-Audit-Package-YYYY-MM-DD/` containing:

   - **`Compliance-Activity-Summary.md`** — Overall posture narrative: Audit Readiness Score, posture timeline, transaction pipeline summary, risk concentrations, and key findings. Written in a format suitable for presenting to an auditor or management.

   - **`Transaction-Log.csv`** — Every transaction from `.exchek/state/transactions.jsonl` with columns: `transaction_id`, `date`, `item_description`, `destination`, `eccn`, `classified_date`, `screened_date`, `license_determined_date`, `docs_generated_date`, `chain_status` (complete/incomplete), `missing_steps`.

   - **`Screening-Log.csv`** — Every party screening event from events.jsonl where skill is `exchek-csl`, with columns: `date`, `skill`, `duration_ms`, `success`, `engine_version`.

   - **`Classification-Log.csv`** — Every classification event from events.jsonl where skill is `exchek-classify`, with columns: `date`, `skill`, `duration_ms`, `success`, `engine_version`.

   - **`Gap-Report.md`** — Incomplete transactions (which step is missing for each), overdue re-screenings (party, last screened date, days overdue), unused skill categories, and ECP/recordkeeping currency status.

   - **`Audit-Readiness-Scorecard.md`** — The full Audit Readiness Score breakdown with all six dimensions, trend data, and recommendations.

   Report the folder path and file count to the user. This is what an auditor asks for. This is what saves 40 hours of manual compilation.

10. **Cloud telemetry and benchmarks** — Check `cloud_enabled` in `.exchek/telemetry.json`:

    - If **enabled**: Show anonymized benchmarks comparing the user's program to industry averages:

      ```
      How You Compare (anonymized benchmarks)
      ----------------------------------------
        Your audit readiness:    87%   Industry avg: 72%   Above average
        Your completion rate:    90%   Industry avg: 65%   Above average
        Your re-screening:       85%   Industry avg: 45%   Well above
        Your avg response time:  4.2s  Industry avg: 6.8s  Faster
      ```

      Also note: "Anonymous usage data is being shared with ExChek to improve the product. No PII, compliance results, or company data is ever transmitted."

    - If **not enabled**: Offer: "You can optionally share anonymous usage statistics to help improve ExChek. This only includes skill names, run counts, and durations — never compliance results, party names, or transaction details. In return, you get anonymized industry benchmarks so you can see how your program compares. Would you like to enable cloud telemetry? **Yes** / **No**." Respect the user's choice without pressure. If yes, update `.exchek/telemetry.json` with `cloud_enabled: true`.

## How events are written

Each ExChek skill is responsible for writing its own event. At the start of execution, the skill records the current timestamp. At the end, it computes the duration and appends one line to `~/.exchek/analytics/events.jsonl`:

```
echo '{"ts":"...","event":"skill_run","skill":"exchek-skill-csl","duration_ms":4200,"success":true,...}' >> ~/.exchek/analytics/events.jsonl
```

If the file does not exist, the skill creates it. If `.exchek/telemetry.json` has `cloud: true`, the event is also POSTed to the ExChek telemetry API at `https://enterprise.exchek.us/api/telemetry` (see `references/event-schema.md` for payload format). Only anonymous usage data is sent — never code, prompts, PII, or compliance results.

The orchestrator writes transaction lifecycle events to `.exchek/state/transactions.jsonl` as items progress through classify, screen, license, and docs stages.

## Event schema reference

Each line in `~/.exchek/analytics/events.jsonl` is a JSON object with this schema:

```json
{
  "ts": "2025-06-15T14:30:00.000Z",
  "event": "skill_run",
  "skill": "exchek-classify",
  "duration_ms": 12345,
  "success": true,
  "version": "1",
  "os": "darwin",
  "agent": "claude-code",
  "engine_version": "1.0.0"
}
```

For full schema details, field descriptions, example events, and what is never tracked, see [Event schema reference](references/event-schema.md).

## What is NEVER tracked

The following data is **never** logged, stored, or transmitted — locally or to the cloud:

- Source code or file contents
- File paths or directory structures
- User prompts or agent responses
- Personally identifiable information (PII)
- ECCN results, classification outcomes, or screening hits
- Company names, party names, or transaction details
- API keys, tokens, or credentials
- Report contents or document text

Only skill names, run timestamps, durations, success/failure status, OS, agent type, and engine version are recorded. The Audit Readiness Score and all derived metrics are computed locally from event metadata and transaction lifecycle status — never from the substance of compliance decisions. See [references/event-schema.md](references/event-schema.md) for the full specification.

## Reference

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
