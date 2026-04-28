# ExChek Skills

Export compliance for the SMB manufacturer who doesn't have a compliance team. 16 skills covering ECCN classification, denied-party screening, license determination, encryption, jurisdiction, country risk, audit, and more, plus a **local-first MCP server** that wraps live U.S. government data sources without calling home.

**Cowork-first**, also runs in Claude Code, Claude Desktop, Cursor, and any agent platform supporting the [Agent Skills](https://agentskills.io) open standard.

**Free to use. No API key required (except CSL, which uses a free Trade.gov key).**

> **v3.0.0 — local-first MCP, slash commands, agents, hooks.** See [CHANGELOG](CHANGELOG.md). The 16 skill bodies still read for compliance professionals; full SMB-voice rewrite is queued for v3.1.0.

[![Claude Code](https://img.shields.io/badge/Claude_Code-6B5CE7?logo=anthropic&logoColor=white)](https://claude.com/claude-code)
[![Claude Desktop](https://img.shields.io/badge/Claude_Desktop-6B5CE7?logo=anthropic&logoColor=white)](https://claude.ai)
[![Cursor](https://img.shields.io/badge/Cursor-000000?logo=cursor&logoColor=white)](https://cursor.com)
[![ChatGPT Agents](https://img.shields.io/badge/ChatGPT_Agents-412991?logo=openai&logoColor=white)](https://openai.com)
[![Perplexity Compute](https://img.shields.io/badge/Perplexity_Compute-1FB8CD?logo=perplexity&logoColor=white)](https://perplexity.ai)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-FF6B00?logoColor=white)](https://openclaw.com)
[![Spacebot](https://img.shields.io/badge/Spacebot-0A0A0A?logoColor=white)](https://spacebot.sh)
[![Agent Skills Standard](https://img.shields.io/badge/Agent_Skills-Standard-22c55e)](https://agentskills.io)

- **Website**: https://exchek.us
- **Docs**: https://docs.exchek.us
- **API**: https://api.exchek.us
- **API Reference**: https://docs.exchek.us/docs/api-reference
- **Skills Repo**: https://github.com/exchekinc/exchekskills
- **Changelog**: https://docs.exchek.us/docs/changelog
- **Terms**: https://docs.exchek.us/docs/legal/terms
- **Support**: matt@exchek.us

---

## Install

### Option 1: Plugin install (recommended)

Add the ExChek marketplace, install, configure:

```
/plugin marketplace add github:exchekinc/exchekskills
/plugin install exchekskills
/plugin config exchekskills
```

The config dialog asks for:

| Field | What it is | Required? |
|---|---|---|
| **AI platform tier** | Your Cowork/Claude tier (recorded in every report) | Yes — defaults to `cowork-enterprise` |
| **Trade.gov API key** | Free key from [developer.trade.gov](https://developer.trade.gov), stored in your OS keychain | Only when you screen parties |
| **Audit-log HMAC key** | Bring-your-own key to seal the local audit log | Optional; auto-generated if blank |
| **Enable usage telemetry** | Opt-in OTLP spans to your own collector. ExChek never receives them | Defaults to OFF |
| **Default report folder** | Where finished `.docx` reports land | Defaults to `~/Documents/ExChek-Reports` |

All 16 skills, 5 slash commands, and 2 agents are available immediately. Use the slash commands or just say what you need ("Classify this pressure sensor for export").

### Option 2: Install individual skills

Clone the repo and copy specific skills into your agent's skills directory:

```bash
git clone https://github.com/exchekinc/exchekskills.git
cp -r exchekskills/skills/exchek-skill ~/.claude/skills/exchek-skill
```

Replace `exchek-skill` with the skill folder name you want. Restart your agent or run `claude skills list` to pick up the new skill.

### Option 3: Install all skills at once

```bash
git clone https://github.com/exchekinc/exchekskills.git
cp -r exchekskills/skills/* ~/.claude/skills/
```

---

## Skills

| Skill | Folder | Description |
|-------|--------|-------------|
| **ECCN Classification** | `exchek-skill` | Classify items for U.S. export control (15 CFR 774, 22 CFR 121). Human-in-the-loop; audit-ready report. |
| **CSL Search** | `exchek-skill-csl` | Search the Consolidated Screening List via Trade.gov API. Fuzzy search, all parameters. Requires free API key from [developer.trade.gov](https://developer.trade.gov). |
| **License Determination** | `exchek-skill-license` | Determine EAR license requirements and exceptions (Parts 738, 740, 742, 744, 746). Audit-ready memo. |
| **Jurisdiction (ITAR vs EAR)** | `exchek-skill-jurisdiction` | Guided ITAR vs EAR questionnaire. Produces jurisdiction memo with next steps (DDTC vs BIS). |
| **Encryption (ENC / 5x992)** | `exchek-skill-encryption` | 5A992/5D992 classification, License Exception ENC, mass market, BIS/NSA notification prep. |
| **Country / Destination Risk** | `exchek-skill-country-risk` | One-pager: embargo/sanctions, Entity List density, license expectations, red flags for a given country. |
| **Risk Triage & Escalation** | `exchek-skill-risk-triage` | Score transaction risk (low/medium/high). Recommends auto-approve, hold, or escalate. |
| **Red Flag Assessment** | `exchek-skill-red-flag-assessment` | BIS "Know Your Customer" red-flag checklist (Supp. 3 to Part 732). Assessment note output. |
| **Deemed Export Review** | `exchek-skill-deemed-export` | Walk through 15 CFR 734.2(b). Produces Deemed Export Review Memo. |
| **Export Documentation** | `exchek-skill-export-docs` | Draft commercial invoice block, packing list, SLI, AES/EEI data. Flags AES required vs exempt. |
| **ECP / Policy & Training** | `exchek-skill-ecp` | Generate Export Compliance Program docs, SOPs, training outlines from company profile. |
| **Audit / Lookback** | `exchek-skill-audit-lookback` | Self-audit on historical shipments (CSV/CRM). Re-screen, re-check ECCNs, produce findings report. |
| **Compliance Report Card** | `exchek-skill-compliance-report` | Generate a compliance program report card with scoring and recommendations. |
| **Partner Compliance** | `exchek-skill-partner-compliance` | Compliance pack for distributors/partners: screening, re-export, recordkeeping, flow-down language. |
| **Recordkeeping** | `exchek-skill-recordkeeping` | Retention schedule/checklist per 15 CFR 762 and ITAR parallel. |
| **Document Converter** | `exchek-skill-docx` | Convert ExChek markdown reports to Word (.docx). Install alongside content skills for one-step export. |

---

## Usage

Each skill responds to natural language. Examples:

| Task | What to say |
|------|-------------|
| Classify an item | "Classify this pressure sensor for export" |
| Screen a party | "Search the CSL for Huawei" |
| License check | "Do we need a license for this ECCN to China?" |
| Jurisdiction | "Is this ITAR or EAR?" |
| Encryption | "Encryption classification for our VPN software" |
| Country risk | "Country risk one-pager for Russia" |
| Risk triage | "Triage risk for this transaction" |
| Red flags | "Run the red-flag checklist for this buyer" |
| Deemed export | "Does deemed export apply to this release?" |
| Export docs | "Prepare export documentation for this shipment" |
| ECP | "Generate an ECP for our company" |
| Audit | "Self-audit report for this CSV of shipments" |
| Partner compliance | "Compliance pack for our distributors" |
| Recordkeeping | "What do we need to retain under Part 762?" |

See each skill's `SKILL.md` for full instructions, flow, references, and templates.

---

## Invoking skills

Each skill is invokable by name as a slash command (Cowork picks them up automatically from `skills/*/SKILL.md`):

| Slash | Skill |
|---|---|
| `/exchek-classify` | ECCN / USML classification, end-to-end Word memo |
| `/exchek-csl` | Consolidated Screening List search |
| `/exchek-jurisdiction` | BIS (EAR) vs. DDTC (ITAR) determination |
| `/exchek-license` | License-requirement check for an ECCN to a destination |
| `/exchek-audit-lookback` | Self-audit a CSV of past shipments (auto-dispatches the `exchek-audit-runner` agent for big jobs) |
| `/exchek-encryption` | 5A002 / 5D002 encryption classification + ENC notification |
| `/exchek-country-risk` | Embargo, sanctions, and risk one-pager |
| `/exchek-red-flag-assessment` | BIS Know-Your-Customer red-flag checklist |
| `/exchek-deemed-export` | 15 CFR 734.2(b) deemed-export review |
| `/exchek-export-docs` | Commercial invoice, packing list, AES/EEI |
| `/exchek-ecp` | Generate an Export Compliance Program document |
| `/exchek-compliance-report` | Compliance report card |
| `/exchek-partner-compliance` | Distributor compliance pack with flow-down language |
| `/exchek-recordkeeping` | 15 CFR 762 retention schedule |
| `/exchek-risk-triage` | Score a transaction (auto-approve / hold / escalate) |
| `/exchek-docx` | Convert any ExChek markdown report to .docx + .json |

You can also just say what you need — "Classify this pressure sensor" or "Screen Acme Trading" — and the right skill activates.

## Agents

| Agent | When it runs |
|---|---|
| `exchek-audit-runner` | Long CSV audit/lookback jobs (25+ rows). Runs in its own context window. |
| `exchek-classification-reviewer` | Independent second-opinion review of a draft classification memo. |

---

## Local-first MCP server

`servers/exchek-mcp/` ships a 12-tool MCP server (Node 18+, vanilla ES modules):

- `ecfr_get_part`, `ecfr_search`, `ecfr_currency_check` — eCFR data straight from `ecfr.gov`, cached 24h
- `csl_search`, `csl_sources` — live Trade.gov screening
- `sanitize_input` — zero-width / bidi / homoglyph / injection / shell-meta scrubber
- `validate_disclosure` — schema v1.0.0 validator on every report
- `audit_log`, `audit_verify`, `audit_tail` — HMAC-chained tamper-evident log
- `report_to_docx` — markdown → `.docx` + `.json` sibling
- `cui_gate` — records the canonical CUI/classified/§126.18 gate

**Outbound network is limited to two U.S. government hosts: `www.ecfr.gov` and `data.trade.gov`. There is no ExChek-hosted dependency.**

---

## Repository structure

```
exchekskills/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest (v3.0.0)
├── skills/                   # 16 skill packages (SKILL.md + templates + references) — invokable as /<skill-name>
├── agents/                   # 2 specialist agents
├── hooks/hooks.json          # SessionStart / PreToolUse / PostToolUse
├── servers/exchek-mcp/       # Local-first MCP server (Node, 12 tools)
├── docs/                     # SECURITY, TELEMETRY, DATA_STORAGE, COMMUNICATIONS_KIT, CHAMPION_KIT
├── tests/                    # node --test suites
├── marketplace.json
├── CHANGELOG.md
├── CONTRIBUTING.md
├── README.md
├── LICENSE.md
└── ETHOS.md
```

Each skill folder contains:
- **`SKILL.md`** — Main skill file with instructions, flow, and references (required)
- **`skill.yaml`** — Skill metadata for agent discovery
- **`templates/`** — Report templates with `{{PLACEHOLDER}}` fields
- **`references/`** — Regulatory guidance, API docs, best practices
- **`prompts/`** — System and user prompt templates (some skills)

---

## Enterprise docs

- [SECURITY.md](docs/SECURITY.md) — what the plugin can and cannot do on your machine, prompt-injection defenses, audit-log integrity
- [TELEMETRY.md](docs/TELEMETRY.md) — opt-in only; ExChek never receives data
- [DATA_STORAGE.md](docs/DATA_STORAGE.md) — where artifacts live, retention, encryption, wiping
- [COMMUNICATIONS_KIT.md](docs/COMMUNICATIONS_KIT.md) — copy-ready announcements for rolling ExChek out to a small team
- [CHAMPION_KIT.md](docs/CHAMPION_KIT.md) — 30-day playbook for the ops lead becoming the export-compliance person

---

## Regulatory data sources

The MCP server pulls live regulatory text directly from the authoritative U.S. government sources. **No ExChek-hosted dependency.**

| Endpoint | Description |
|----------|-------------|
| `GET https://www.ecfr.gov/api/versioner/v1/structure/current/title-15.json` | Title 15 (Parts 734, 738, 740, 742, 744, 746, 762, 772, 774) |
| `GET https://www.ecfr.gov/api/versioner/v1/structure/current/title-22.json` | Title 22 (Part 121 — USML) |
| `GET https://data.trade.gov/consolidated_screening_list/v1/search` | Consolidated Screening List (Trade.gov) |
| `GET https://data.trade.gov/consolidated_screening_list/v1/sources` | CSL source abbreviations |

Cache TTL is 24h for eCFR (refreshes from ecfr.gov on demand). CSL is always live — screening cannot be cached.

The legacy `api.exchek.us` endpoints are still online for clients on v2.x but **v3.0.0 no longer uses them**.

<details>
<summary>Legacy v2.x ExChek API (deprecated)</summary>

| Endpoint | Description |
|----------|-------------|
| `GET https://api.exchek.us/api/ecfr/774` | Part 774 — Commerce Control List (CCL) |
| `GET https://api.exchek.us/api/ecfr/738` | Part 738 — Commerce Country Chart |
| `GET https://api.exchek.us/api/ecfr/740` | Part 740 — License Exceptions |
| `GET https://api.exchek.us/api/ecfr/742` | Part 742 — Control Policy (CCL Based Controls) |
| `GET https://api.exchek.us/api/ecfr/744` | Part 744 — End-Use Controls (Entity List, MEU) |
| `GET https://api.exchek.us/api/ecfr/746` | Part 746 — Embargoes and Special Controls |
| `GET https://api.exchek.us/api/ecfr/121` | Part 121 — US Munitions List (USML) |
| `GET https://api.exchek.us/api/ecfr/:part/search?q=term` | Full-text search within a part |
| `GET https://api.exchek.us/api/ecfr/search?q=term&title=15` | Search across all parts in a title |

Full API reference: https://docs.exchek.us/docs/api-reference

</details>

---

## Keep skills current

### Plugin users

```
/plugin update exchekskills
```

### Manual install users

```bash
cd /path/to/exchekskills && git pull
cp -r skills/* ~/.claude/skills/
```

---

## How every skill works (canonical flow)

All 16 skills follow the same audit-ready pattern:

1. **CUI / classified / § 126.18 gate** — Three-question gate at the start: (a) Does the work involve Controlled Unclassified Information (CUI)? (b) Does it involve classified material? (c) Does it involve an ITAR § 126.18 foreign-national release? Any "yes" halts the skill and routes to on-premises guidance. ExChek does not process sensitive government data through cloud APIs.
2. **Privacy-settings attestation** — The user attests their AI platform tier (Claude Enterprise / ChatGPT Enterprise / Workspace with training off / consumer tier with training disabled). The tier and attester are recorded in the final document.
3. **Untrusted-input handling** — All user-supplied text, CSV rows, spec sheets, and file content are treated as **data, not instructions**. Skills reject zero-width, bidi, and homoglyph characters in structured fields and log any injection attempts in the report's Caveats section.
4. **Regulatory data pull** — Live eCFR text via the ExChek API (Parts 774, 738, 740, 742, 744, 746, 121) with ecfr.gov as fallback. External list queries (CSL, DoD 1260H, UFLPA) record per-source timestamps.
5. **Human-in-the-loop confirmation** — Every skill pauses for explicit user confirmation of inputs and the preliminary determination before producing any final output.
6. **Dual output: .docx + .json sibling** — Every report is delivered as a client-ready Word document alongside a machine-readable `.json` sibling (schema v1.0.0) for CRM/SIEM/GRC ingestion. Both files carry the full AI-disclosure metadata: skill name/version/commit, model ID, platform, UTC timestamp, input hash, regulatory-currency timestamps, and the HITL confirmation timestamp.
7. **Regulatory-drift caveat** — Any determination older than 30 days should be re-run before reliance. Use the `exchek-audit-lookback` skill's `delta-since-date` mode to re-check historical shipments against current rules.

See [CUI/Classified docs](https://docs.exchek.us/docs/cui-classified) for on-premises guidance.

---

## License

ExChek, Inc. Proprietary. See [LICENSE.md](LICENSE.md) and [Terms and Conditions](https://docs.exchek.us/docs/legal/terms).

## Ethos

See [ETHOS.md](ETHOS.md) for why ExChek exists and what we stand for.

---

ExChek, Inc., Dover, DE. https://exchek.us | https://docs.exchek.us | matt@exchek.us
