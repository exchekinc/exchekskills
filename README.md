# ExChek Skills

Export compliance skills for AI agents. 16 skills covering ECCN classification, denied party screening, license determination, encryption, jurisdiction, country risk, audit, and more. Works with Claude Code, Claude Desktop, Cursor, and any agent platform supporting the [Agent Skills](https://agentskills.io) open standard.

**Free to use. No API key required (except CSL, which uses a free Trade.gov key).**

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
- **Support**: support@exchek.us

---

## Install

### Option 1: Plugin install (recommended)

Add the ExChek marketplace and install the plugin:

```
/plugin marketplace add github:exchekinc/exchekskills
/plugin install exchekskills
```

All 16 skills are available immediately. Invoke any skill by name (e.g., "Classify this item for export" or "Search the CSL for [name]").

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

## Repository structure

```
exchekskills/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest for discovery and install
├── skills/
│   ├── exchek-skill/         # ECCN Classification
│   │   ├── SKILL.md          # Skill instructions (required)
│   │   ├── skill.yaml        # Skill metadata
│   │   ├── templates/        # Report templates
│   │   ├── references/       # Regulatory references, API docs
│   │   └── prompts/          # System and user prompts
│   ├── exchek-skill-csl/
│   ├── exchek-skill-license/
│   └── ... (16 skills total)
├── marketplace.json          # Plugin marketplace manifest
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

## API

All skills that use regulatory data call the ExChek API (free, no auth):

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

## CUI and classified information

Every ExChek skill asks upfront whether information involves Controlled Unclassified Information (CUI) or classified material. If yes, the skill stops and directs you to on-premises infrastructure with a local LLM. ExChek does not process sensitive government data through cloud APIs. See [CUI/Classified docs](https://docs.exchek.us/docs/cui-classified).

---

## License

ExChek, Inc. Proprietary. See [LICENSE.md](LICENSE.md) and [Terms and Conditions](https://docs.exchek.us/docs/legal/terms).

## Ethos

See [ETHOS.md](ETHOS.md) for why ExChek exists and what we stand for.

---

ExChek, Inc., Dover, DE. https://exchek.us | https://docs.exchek.us | support@exchek.us
