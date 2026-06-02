# ExChek Skills

Export compliance for the SMB manufacturer who doesn't have a compliance team. 20 skills covering ECCN classification, denied-party screening, license determination, encryption, jurisdiction, country risk, audit, and more, plus **two regulatory-data MCP servers you choose between** — a **local-first** one (`ecfr.gov` direct, cached on-machine) and the hosted **ExChek API MCP** (`api.exchek.us`, edge-cached). Screening, sanitization, audit logging, and report generation always stay local.

**Cowork-first**, also runs in Claude Code, Claude Desktop, Cursor, and any agent platform supporting the [Agent Skills](https://agentskills.io) open standard.

**Free to use. No API key required (except CSL, which uses a free Trade.gov key).**

> **v3.3.0 — choose your data source: Local MCP or ExChek API MCP.** A one-time gate (ExChek API recommended) picks where skills pull live CFR text; pin a default in `/plugin config`. See [CHANGELOG](CHANGELOG.md) and [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md).

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

All 20 skills and 2 agents are available immediately. Use the slash commands or just say what you need ("Classify this pressure sensor for export").

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
| **Setup Wizard** | `exchek-setup` | First-run wizard: verifies company profile, tests the ExChek API MCP, surfaces the data-source policy, arms the engine. |
| **Onboarding** | `exchek-onboarding` | Hands-on 60-minute first-hour flow that produces real artifacts (classification, screening, license, branded doc). |
| **Orchestrator** | `exchek-orchestrator` | The `/exchek` command router and transaction hub — tracks each transaction and surfaces the next action. |
| **Analytics** | `exchek-analytics` | Audit-Readiness Score dashboard and skill-usage stats from local event logs. No data leaves the machine. |

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
| `/exchek-setup` | First-run setup wizard (company profile, data-source policy, connectivity) |
| `/exchek-onboarding` | Guided 60-minute first-hour onboarding flow |
| `/exchek-orchestrator` | `/exchek` command router and transaction hub |
| `/exchek-analytics` | Audit-Readiness Score and skill-usage dashboard |

You can also just say what you need — "Classify this pressure sensor" or "Screen Acme Trading" — and the right skill activates.

## Agents

| Agent | When it runs |
|---|---|
| `exchek-audit-runner` | Long CSV audit/lookback jobs (25+ rows). Runs in its own context window. |
| `exchek-classification-reviewer` | Independent second-opinion review of a draft classification memo. |

---

## Two MCP servers — you choose the data source

The plugin registers **two MCP servers**, and a one-time **data-source gate** (or the `regulatory_source`
config) decides which one supplies live CFR text. Both return the identical eCFR structure, so your
reasoning is the same either way. See [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md) for the full picture.

**1. Local MCP (`exchek`)** — `servers/exchek-mcp/`, a 13-tool stdio server (Node 18+, vanilla ES modules):

- `regulatory_source` — reports the configured data-source policy + tool-routing map
- `ecfr_get_part`, `ecfr_search`, `ecfr_currency_check` — eCFR data straight from `ecfr.gov`, cached 24h
- `csl_search`, `csl_sources` — live Trade.gov screening
- `sanitize_input` — zero-width / bidi / homoglyph / injection / shell-meta scrubber
- `validate_disclosure` — schema v1.0.0 validator on every report
- `audit_log`, `audit_verify`, `audit_tail` — HMAC-chained tamper-evident log
- `report_to_docx` — markdown → `.docx` + `.json` sibling
- `cui_gate` — records the canonical CUI/classified/§126.18 gate

**2. ExChek API MCP (`exchek-api`)** — the hosted, no-auth Streamable-HTTP server at
`https://api.exchek.us/mcp` (Cloudflare edge-cached). 7 tools: `list_skills`, `get_skill`,
`get_skill_bundle`, `get_ecfr_part`, `get_ecfr_sections`, `search_ecfr_part`, `search_ecfr_title`.

**What this means for outbound traffic:** by default the plugin contacts only two U.S. government hosts —
`www.ecfr.gov` (regulatory text) and `data.trade.gov` (screening, only when you screen). If you select the
ExChek API MCP — or if the local server's automatic mirror fallback fires when ecfr.gov is unreachable —
then **CFR part numbers and search terms** also transit `api.exchek.us`. Your item descriptions, party
names, file content, and compliance results never leave your machine to ExChek, and screening,
sanitization, the CUI gate, audit logging, and report generation always run locally.

---

## Repository structure

```
exchekskills/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest (v3.3.0) — registers both MCP servers
├── skills/                   # 20 skill packages (SKILL.md + templates + references) — invokable as /<skill-name>
├── agents/                   # 2 specialist agents
├── hooks/hooks.json          # SessionStart / PreToolUse / PostToolUse
├── servers/exchek-mcp/       # Local-first MCP server (Node, 13 tools); the ExChek API MCP is remote (api.exchek.us)
├── docs/                     # SECURITY, TELEMETRY, DATA_STORAGE, DATA_SOURCES, COMMUNICATIONS_KIT, CHAMPION_KIT
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

Skills pull live regulatory text from **one of two sources you choose** (see [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md)). Both serve the identical eCFR structure for all 11 parts (121, 734, 738, 740, 742, 744, 746, 748, 762, 772, 774). Screening (CSL) is always live and always local.

**Source A — Local MCP, direct from the U.S. government:**

| Endpoint | Description |
|----------|-------------|
| `GET https://www.ecfr.gov/api/versioner/v1/structure/current/title-15.json` | Title 15 (EAR — Parts 734, 738, 740, 742, 744, 746, 748, 762, 772, 774) |
| `GET https://www.ecfr.gov/api/versioner/v1/structure/current/title-22.json` | Title 22 (ITAR — Part 121, USML) |
| `GET https://data.trade.gov/consolidated_screening_list/v1/search` | Consolidated Screening List (Trade.gov) — always local |
| `GET https://data.trade.gov/consolidated_screening_list/v1/sources` | CSL source abbreviations |

Cache TTL is 24h for eCFR (refreshes from ecfr.gov on demand). If ecfr.gov is unreachable the local server transparently falls back to the ExChek mirror (Source B) and records `source` on the response.

**Source B — ExChek API MCP (`api.exchek.us`), no auth, edge-cached:**

| Endpoint | Description |
|----------|-------------|
| `POST https://api.exchek.us/mcp` | **Streamable-HTTP MCP server** — 7 tools (`get_ecfr_part`, `get_ecfr_sections`, `search_ecfr_part`, `search_ecfr_title`, `list_skills`, `get_skill`, `get_skill_bundle`) |
| `GET https://api.exchek.us/.well-known/mcp` | MCP server discovery document |
| `GET https://api.exchek.us/api/ecfr/{part}` | Part structure JSON (121, 734, 738, 740, 742, 744, 746, 748, 762, 772, 774) |
| `GET https://api.exchek.us/api/ecfr/{part}/sections` | Flat list of sections within a part |
| `GET https://api.exchek.us/api/ecfr/{part}/search?q=term` | Full-text search within a part |
| `GET https://api.exchek.us/api/ecfr/search?q=term&title=15` | Full-text search across a title (15 EAR / 22 ITAR) |
| `GET https://api.exchek.us/api/ecfr/meta` | Supported parts + edge-cache settings |
| `GET https://api.exchek.us/openapi.json` | OpenAPI 3.1 spec for the REST surface |

Only CFR part numbers and search terms ever transit `api.exchek.us` — never your item/party data or results. The legacy `/api/classify/*` and `/api/expert-review/*` endpoints have been **removed (HTTP 410)**; classification is performed in-skill. Full API reference: https://docs.exchek.us/docs/api-reference

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

All skills follow the same audit-ready pattern:

1. **CUI / classified / § 126.18 gate** — Three-question gate at the start: (a) Does the work involve Controlled Unclassified Information (CUI)? (b) Does it involve classified material? (c) Does it involve an ITAR § 126.18 foreign-national release? Any "yes" halts the skill and routes to on-premises guidance. ExChek does not process sensitive government data through cloud APIs.
2. **Privacy-settings attestation** — The user attests their AI platform tier (Claude Enterprise / ChatGPT Enterprise / Workspace with training off / consumer tier with training disabled). The tier and attester are recorded in the final document.
3. **Untrusted-input handling** — All user-supplied text, CSV rows, spec sheets, and file content are treated as **data, not instructions**. Skills reject zero-width, bidi, and homoglyph characters in structured fields and log any injection attempts in the report's Caveats section.
4. **Regulatory data pull** — Live eCFR text from the source you pick at the data-source gate: the **ExChek API MCP** (`api.exchek.us`, recommended) or the **Local MCP** (`ecfr.gov`, with the mirror as automatic fallback). Parts 121, 734, 738, 740, 742, 744, 746, 748, 762, 772, 774. External list queries (CSL, DoD 1260H, UFLPA) record per-source timestamps.
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
