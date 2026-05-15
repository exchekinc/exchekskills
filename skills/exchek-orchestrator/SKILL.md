---
name: exchek-orchestrator
description: "Your compliance co-pilot. The ExChek Engine hub routes commands, tracks every transaction from classification through documentation, watches for incomplete workflows, alerts on re-screening deadlines, remembers past determinations, and surfaces exactly what you need to do next. Invoke with /exchek."
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


# ExChek Orchestrator — Your Compliance Co-Pilot

The orchestrator is the **heart** of the ExChek Engine. It is not a dashboard. It is the single pane of glass between you and export compliance exposure. It knows what you have done, what you have not done, and what you should do next. It protects you.

**The Engine Model:** The agent (Claude, Cursor, etc.) is the **wheel**. Your ExChek Engine is the **hub**. The **spokes** are compliance tasks flowing in and audit-ready documents flowing out. Every compliance action routes through the hub, and every result is captured for your records. But unlike a passive hub, this one **watches your back** — tracking every transaction to completion, flagging stale screenings, remembering past determinations, and surfacing the single most important action you should take right now.

---

## When to use

Invoke this skill when the user:

- Types `/exchek` with no arguments (Compliance Posture dashboard)
- Types `/exchek status` (full dashboard, alias)
- Types `/exchek [command]` to route to a sub-skill
- Types `/exchek resume [transaction_id]` to pick up an incomplete transaction
- Types `/exchek help` for context-aware help
- Asks any general ExChek question

Example triggers: "/exchek", "/exchek status", "/exchek classify thermal camera", "/exchek screen Huawei", "/exchek resume tx_001", "/exchek help", "What can ExChek do?", "Show me my compliance posture".

---

## CUI and classified information

**Step 0 — always first.** Before any other action, ask:

> "Does the item or any information you'll share involve **Controlled Unclassified Information (CUI)** or **classified information**? **Yes** / **No** / **Don't know**."

- If **Yes**: Do not use cloud APIs or LLMs. Direct the user to run the skill on-premises with a local LLM (see [CUI/Classified guidance](references/cui-classified.md) and [ExChek CUI/Classified docs](https://docs.exchek.us/docs/cui-classified)). Stop here.
- If **Don't know**: Give a brief note that CUI/classified requires on-prem use, then ask whether to proceed in this environment or switch to on-prem.
- If **No**: Continue.

---

## Transaction Tracking — The Safety Net

Every export compliance workflow is a **transaction**. A transaction begins when the user classifies an item or screens a party, and it is not complete until the item has been classified, the parties screened, a license determination made, and export documentation generated (or explicitly waived).

The orchestrator tracks transactions in `.exchek/state/transactions.jsonl`. Each line is a transaction event:

```json
{"id":"tx_001","ts":"2026-03-28T10:00:00Z","type":"classify","item":"thermal camera MWIR 640x480","result":"6A003.b.4.a","party":null,"destination":null,"status":"incomplete"}
{"id":"tx_001","ts":"2026-03-28T10:15:00Z","type":"screen","item":"thermal camera MWIR 640x480","result":"clear","party":"Acme GmbH","destination":"Germany","status":"incomplete"}
{"id":"tx_001","ts":"2026-03-28T10:30:00Z","type":"license","item":"thermal camera MWIR 640x480","result":"NLR - License Exception TMP","party":"Acme GmbH","destination":"Germany","status":"incomplete"}
{"id":"tx_001","ts":"2026-03-28T11:00:00Z","type":"export_docs","item":"thermal camera MWIR 640x480","result":"SLI + EEI generated","party":"Acme GmbH","destination":"Germany","status":"complete"}
```

### Transaction event schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Transaction ID, generated by the orchestrator when routing the first skill in a workflow (format: `tx_XXX` with zero-padded incrementing integer). If the user provides a party or destination alongside a classify, or an item alongside a screen, the orchestrator may link them to an existing transaction by matching on item description or party name. |
| `ts` | ISO 8601 | Timestamp of the event |
| `type` | enum | One of: `classify`, `screen`, `license`, `export_docs`, `jurisdiction`, `encryption`, `risk_triage`, `red_flags`, `deemed_export` |
| `item` | string or null | Item description (carried forward from classify) |
| `result` | string | The output of the skill (ECCN, clear/hit, NLR/license required, etc.) |
| `party` | string or null | Party name if applicable |
| `destination` | string or null | Country if applicable |
| `status` | enum | `incomplete` until the transaction has at minimum: classify + screen + license determination. Set to `complete` when export_docs is generated OR the user explicitly marks it complete. |

### How skills write to the transaction log

When the orchestrator routes to a sub-skill, it:

1. Generates a new transaction ID (or identifies the existing one by matching item/party).
2. Passes the transaction ID to the sub-skill context.
3. After the sub-skill completes, appends the event line to `.exchek/state/transactions.jsonl`.
4. Evaluates the transaction status: if all required steps (classify, screen, license) are done, mark `incomplete`; if export_docs is also done, mark `complete`.

If `.exchek/state/transactions.jsonl` does not exist, create it on the first transaction event.

---

## Transaction Watchdog — Incomplete Workflow Detection

Every time the dashboard is displayed, the orchestrator reads `.exchek/state/transactions.jsonl`, groups events by transaction ID, and identifies transactions that are **not complete**. A transaction is incomplete if any of the following steps are missing:

- **Screening** — item was classified but no screen event exists for that transaction
- **License determination** — item was classified and screened but no license event exists
- **Export documentation** — classify + screen + license exist but no export_docs event

Display incomplete transactions prominently:

```
+----------------------------------------------------------+
|  INCOMPLETE TRANSACTIONS                                  |
+----------------------------------------------------------+
|                                                           |
|  1. Thermal Camera (6A003.b.4.a) - classified 2 days ago |
|     Missing: screening, license determination, export docs|
|     Resume: /exchek resume tx_001                         |
|                                                           |
|  2. CNC Controller (2B001.a) - classified, screened (clear)|
|     Missing: license determination                        |
|     Resume: /exchek resume tx_003                         |
|                                                           |
+----------------------------------------------------------+
```

Incomplete transactions are sorted by age, oldest first. The oldest incomplete transaction drives the top suggested action.

---

## Re-screening Alerts

Parties that were screened in the past may appear on new or updated restricted party lists at any time. The orchestrator checks `.exchek/state/transactions.jsonl` for all `screen` events and calculates the age of each screening.

The re-screening interval is configured in `.exchek/config.json` under `screening.re_screen_interval_days` (default: **90 days**). When a screening is older than this interval, the party is flagged for re-screening.

```
+----------------------------------------------------------+
|  PARTIES DUE FOR RE-SCREENING                             |
+----------------------------------------------------------+
|                                                           |
|  Acme GmbH        Last screened: 92 days ago              |
|                    /exchek screen Acme GmbH               |
|                                                           |
|  Mahan Trading     Last screened: 45 days ago             |
|                    (due in 45 days)                        |
|                                                           |
+----------------------------------------------------------+
```

Parties past due are flagged with a warning. Parties approaching the interval (within 30 days) are shown as informational. Deduplicate by party name (use the most recent screen event for each unique party).

---

## Transaction Memory — Prior Determination Recall

When the user starts a new `classify` or `screen`, the orchestrator searches `.exchek/state/transactions.jsonl` for previous events with a similar item description or party name. Similarity is determined by fuzzy matching on the item or party string (substring match, case-insensitive, or token overlap above 60%).

If a match is found, present the user with options before proceeding:

> You classified a similar item -- "thermal imaging camera, MWIR, 640x480" -- as **6A003.b.4.a** on 2026-01-15. Would you like to:
>
> 1. **Use that classification** (with updated date)
> 2. **Reclassify from scratch** (recommended if specs changed)
> 3. **View the previous report**

If the user selects option 1, create a new transaction event referencing the prior result and move to the next step in the workflow. If option 2, route to the classify skill as normal. If option 3, locate the prior report in the configured report folder and display it.

For screening, the same pattern applies:

> You screened "Acme GmbH" on 2026-01-20 -- result was **clear**. That screening is 67 days old. Would you like to:
>
> 1. **Re-screen now** (recommended -- lists may have changed)
> 2. **View the previous screening report**

Always recommend re-screening if the prior screening is older than 50% of the configured re-screening interval.

---

## Flow (no arguments — Compliance Posture Dashboard)

0. **CUI/Classified check** -- Ask the selector above; if Yes, route to on-prem guidance and stop; if No, continue; if Don't know, brief then re-ask.

1. **Read all state** -- Load the following files from the workspace (skip any that do not exist):
   - `.exchek/config.json` -- engine configuration, report folder, preferences, screening interval
   - `.exchek/client.json` -- company name, industry, product types. If `client.json` does not exist, read the company name from `.exchek/config.json` (key: `company.name`) as a fallback.
   - `.exchek/state/update-manifest.json` -- engine version, last updated
   - `.exchek/state/onboarding-progress.json` -- onboarding completion percentage
   - `.exchek/state/setup-complete.json` -- setup completion status
   - `.exchek/state/transactions.jsonl` -- all transaction events (full history)
   - `.exchek/connectors/*.json` -- CRM and ERP connector status
   - `~/.exchek/analytics/events.jsonl` -- recent skill run events (last 10)

2. **Compute compliance metrics** from `transactions.jsonl`:
   - Total unique transactions (by `id`)
   - Complete transactions (status = `complete` on the latest event per transaction)
   - Incomplete transactions (group by ID, identify missing steps)
   - Total items classified, parties screened, license determinations, documents generated
   - Parties due for re-screening (screening age > configured interval)
   - Completion rate = complete / total
   - **Audit Readiness Score** = weighted average of:
     - Transaction completion rate (40%)
     - Re-screening compliance (30%) -- percentage of parties screened within interval
     - Documentation coverage (30%) -- percentage of transactions with export_docs

3. **Display Compliance Posture Dashboard**:

```
+==============================================================+
|  ExChek Engine -- {company_name}                              |
|  Engine v{version}  |  Updated: {date}                        |
+==============================================================+
|  COMPLIANCE POSTURE                                           |
|                                                               |
|  Complete transactions:    47/52  (90.4%)                      |
|  Items classified:         52                                  |
|  Parties screened:         48  (3 due for re-screening)        |
|  License determinations:   47                                  |
|  Documents generated:      41                                  |
|                                                               |
|  [!] 5 incomplete transactions (see below)                    |
|  [~] 3 parties due for re-screening                           |
|  [ok] No red flags in last 30 days                            |
|                                                               |
+--------------------------------------------------------------+
|  AUDIT READINESS: 90%                                         |
|  ||||||||||||||||||||..  (based on completion rate,            |
|  re-screening cadence, and documentation coverage)            |
+--------------------------------------------------------------+
|  Connectors                                                   |
|    CRM: {type} ({status})   |   ERP: {type} ({status})        |
+--------------------------------------------------------------+
|  Suggested Actions                                            |
|    1. {highest priority action}                               |
|    2. {second priority action}                                |
|    3. {third priority action}                                 |
+==============================================================+
```

   If state files are missing, show "Not configured" for the relevant section and suggest running `/exchek setup` or `/exchek onboarding`.

   If `transactions.jsonl` does not exist or is empty, show: "No transactions yet. Start with `/exchek classify [item]` to begin tracking."

4. **Display Incomplete Transactions** (if any) -- see Transaction Watchdog section above.

5. **Display Re-screening Alerts** (if any) -- see Re-screening Alerts section above.

6. **Prompt** -- "What would you like to do? Type a command, describe what you need, or `/exchek resume [id]` to pick up where you left off."

---

## Smart Suggested Actions

The three suggested actions in the dashboard are not generic. They are computed from state, ranked by priority:

| Priority | Condition | Suggested Action |
|----------|-----------|------------------|
| 1 (highest) | Incomplete transactions exist | "Complete screening for '{item}' -- `/exchek resume {tx_id}`" (oldest first) |
| 2 | Parties past due for re-screening | "Re-screen {party} ({N} days overdue) -- `/exchek screen {party}`" |
| 3 | Skills never used (coverage gaps) | "You have never run a {skill_name}. Consider `/exchek {command}` to {benefit}." Detect by scanning `events.jsonl` for skill_run events and comparing against the routing table. |
| 4 | Time since last ECP review > 12 months | "Your Export Compliance Program was last reviewed {N} months ago. Update it with `/exchek ecp`." Detect from the last `ecp` event in `events.jsonl`. |
| 5 | Time since last audit lookback > 6 months | "No audit lookback in {N} months. Run `/exchek audit` to review recent transactions." Detect from the last `audit` event in `events.jsonl`. |
| 6 | Engine update brought new regulatory data | "New regulatory data was loaded on {date}. Review whether your ECCNs are affected with `/exchek classify`." Detect from `update-manifest.json` having a recent update date and the user not having run classify since. |
| 7 | Onboarding incomplete | "Continue onboarding ({N}% complete) -- `/exchek onboarding`" |
| 8 | Setup incomplete | "Complete engine setup -- `/exchek setup`" |

Show the top 3 applicable actions. If fewer than 3 conditions apply, show only those that do.

---

## Flow (with arguments — command routing)

4. **Parse command** -- Extract the command name and arguments from user input.

5. **Transaction memory check** -- If the command is `classify` or `screen`, search `transactions.jsonl` for prior determinations on a similar item or party. If a match is found, present the recall options (see Transaction Memory section). If the user chooses to reuse the prior result, create the transaction event and skip to the post-skill suggestion. Otherwise, continue to routing.

6. **Generate or resolve transaction ID** -- For commands that are part of a compliance workflow (`classify`, `screen`, `license`, `export-docs`, `jurisdiction`, `encryption`, `risk-triage`, `red-flags`, `deemed-export`):
   - If the user provided `/exchek resume {tx_id}`, use that transaction ID.
   - If the item or party matches an existing incomplete transaction, use that transaction ID.
   - Otherwise, generate a new transaction ID.

7. **Route to sub-skill** -- Look up the command in the routing table. If found, pass arguments and the transaction ID to the target skill. If not found, suggest closest match and show full command list.

8. **Record transaction event** -- After the sub-skill completes, append the event to `.exchek/state/transactions.jsonl` with the result.

9. **Post-skill suggestion** -- After the sub-skill completes, look up the anticipatory next step from the suggestions table and present it. Include the transaction ID so the user can resume easily.

10. **Log event** -- Append a `hub_route` event to `~/.exchek/analytics/events.jsonl`.

---

## /exchek resume [transaction_id]

Resume an incomplete transaction where it left off.

1. Read `.exchek/state/transactions.jsonl` and filter for the given transaction ID.
2. Reconstruct the transaction history: which steps have been completed, which are missing.
3. Present a summary:

> **Transaction {tx_id}:** {item} to {party} ({destination}).
> Classified as {ECCN}, screened ({result}). **Next step: license determination.**
> Run it now? **Yes** / **Skip to next step** / **View transaction history**

4. If the user says Yes, route to the appropriate sub-skill with all context pre-filled (item, ECCN, party, destination, prior results).
5. If Skip, advance to the next missing step.
6. If View, display the full event history for that transaction.

If no transaction ID is provided, show the list of incomplete transactions and ask the user to pick one.

---

## Command routing table

When `/exchek` is followed by a command, route to the corresponding sub-skill:

| Command | Routes to | Description |
|---------|-----------|-------------|
| `/exchek classify [item]` | exchek-skill | ECCN classification |
| `/exchek screen [party]` | exchek-skill-csl | Consolidated Screening List search |
| `/exchek license [item] [dest]` | exchek-skill-license | License determination (Part 738/740) |
| `/exchek jurisdiction [item]` | exchek-skill-jurisdiction | ITAR vs EAR jurisdiction check |
| `/exchek encryption [item]` | exchek-skill-encryption | Encryption classification (5A992/5D992, ENC) |
| `/exchek country-risk [country]` | exchek-skill-country-risk | Country/destination risk one-pager |
| `/exchek risk-triage` | exchek-skill-risk-triage | Transaction risk scoring and escalation |
| `/exchek red-flags [party]` | exchek-skill-red-flag-assessment | BIS Know Your Customer red-flag checklist |
| `/exchek deemed-export` | exchek-skill-deemed-export | Deemed export analysis (15 CFR 734.2(b)) |
| `/exchek export-docs` | exchek-skill-export-docs | Export documentation drafting |
| `/exchek docx [report-path]` | exchek-skill-docx | Export a compliance report to branded Word .docx |
| `/exchek ecp` | exchek-skill-ecp | Export Compliance Program generation |
| `/exchek audit` | exchek-skill-audit-lookback | Retrospective audit/lookback |
| `/exchek report` | exchek-skill-compliance-report | CARFAX-style compliance report card |
| `/exchek partner` | exchek-skill-partner-compliance | Partner/distributor compliance pack |
| `/exchek records` | exchek-skill-recordkeeping | Retention schedule (15 CFR 762) |
| `/exchek setup` | exchek-setup | Engine setup and configuration |
| `/exchek onboarding` | exchek-onboarding | Guided onboarding wizard |
| `/exchek connect [type]` | exchek-connector | CRM/ERP connector setup *(paid tier — not in public plugin)* |
| `/exchek update` | exchek-updater | Check for and apply engine updates *(paid tier — not in public plugin)* |
| `/exchek analytics` | exchek-analytics | Usage statistics and telemetry dashboard |
| `/exchek resume [tx_id]` | (built-in) | Resume an incomplete transaction |
| `/exchek help` | (built-in) | Context-aware help based on current state |
| `/exchek status` | (built-in) | Full Compliance Posture dashboard (same as no arguments) |

When routing, pass any arguments after the command to the target skill (e.g., `/exchek classify thermal camera` passes "thermal camera" as the item to classify). Always pass the resolved transaction ID as context.

If the command is not recognized, suggest the closest match from the table above and show the full list.

If a user invokes a paid-tier-only command (`/exchek connect`, `/exchek update`) on the public plugin where that skill is not installed, respond: "That command is part of the ExChek paid tier and isn't bundled with the public plugin. See https://exchek.us for the full engine."

---

## Post-skill suggestions (anticipatory next steps)

After a sub-skill completes, suggest the logical next compliance step. Always include the transaction ID for easy resumption.

| After this skill... | Suggest... |
|---------------------|------------|
| **classify** (ECCN classification) | "Item classified. Screen the end user next: `/exchek screen [party]`" (or `/exchek resume {tx_id}` if party is unknown yet) |
| **screen** (CSL screening) | "Screening complete. Determine license requirements: `/exchek license [item] [destination]`" |
| **license** (license determination) | "License determination done. Draft export documentation: `/exchek export-docs`" |
| **export-docs** (documentation) | "Documentation generated. Transaction {tx_id} is **complete**. Generate a compliance report card for the customer: `/exchek report`" |
| **jurisdiction** | If EAR: "Proceed to classification: `/exchek classify [item]`". If ITAR: "Contact DDTC for USML classification. ExChek can help with EAR items." |
| **country-risk** | "For specific parties in this country, run `/exchek screen [party]`" |
| **risk-triage** | If escalate: "Prepare an escalation memo and contact legal." If hold: "Run `/exchek red-flags [party]` for deeper diligence." If auto-approve: "Proceed to `/exchek export-docs`." |
| **red-flags** | If flags raised: "Consider `/exchek risk-triage` for formal scoring." If clear: "Proceed with `/exchek license`." |
| **deemed-export** | If deemed export applies: "A license may be required. Run `/exchek license`." If not: "Document the determination with `/exchek records`." |
| **audit** | "Review findings and update your ECP with `/exchek ecp`." |
| **report** | "Archive the report per your retention schedule. See `/exchek records`." |

---

## Event logging

Each skill in the ExChek Engine appends an event to `~/.exchek/analytics/events.jsonl` after execution. The event format is:

```json
{ "ts": "ISO8601", "event": "skill_run", "skill": "skill-name", "duration_ms": 1234, "success": true, "version": "1", "os": "darwin", "agent": "claude-code", "engine_version": "2.0.0" }
```

After the orchestrator completes any routing to a sub-skill, it appends its own event:

```json
{ "event": "hub_route", "skill": "exchek-orchestrator", "routed_to": "exchek-skill-csl", "tx_id": "tx_001", "ts": "ISO8601", "duration_ms": 150, "success": true, "version": "1", "os": "darwin", "agent": "claude-code", "engine_version": "2.0.0" }
```

If you see "No recent activity" in the dashboard, run any skill first -- events are logged automatically.

---

## Help command (/exchek help)

When the user runs `/exchek help`, provide context-aware assistance:

1. Read current state (setup completion, onboarding progress, recent activity, incomplete transactions, re-screening alerts)
2. If setup is incomplete: prioritize setup instructions
3. If onboarding is incomplete: show next onboarding step
4. If there are incomplete transactions: highlight them and explain `/exchek resume`
5. If there are re-screening alerts: explain the re-screening cadence and how to configure it
6. If fully configured with no urgent items: show the command routing table with descriptions
7. Always include: "For detailed docs, visit https://docs.exchek.us"

---

## Help escalation

If the user asks for help 3 or more times in a session or appears to be stuck (repeated errors, confusion about commands, or explicit frustration):

- Offer: "Would you like to reach out to ExChek support? Email **matt@exchek.us** with a description of what you're trying to do and we'll help."
- Include the current engine version and any error context in the suggested email.

---

## Reference

- API: https://api.exchek.us
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
