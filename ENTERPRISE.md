# ExChek Enterprise

ExChek's core is free and always will be: classification analysis, jurisdiction
and ECCN determination, eCFR regulatory data, restricted-party screening,
red-flag assessment, and the local audit-ready Word report — all of it runs on
your machine, none of it requires a key or an account. See [ETHOS.md](ETHOS.md).

**ExChek Enterprise** is the paid layer on top: finished, branded compliance
documents rendered by the ExChek API. You pay for the deliverable, never for
the thinking.

## Paid services

### Official Classification Memorandum (PDF) — $1 per report

The flagship Enterprise document: a branded, audit-ready **~28-page
classification memorandum** with native pagination, document-control block,
executive summary with risk posture, full Order-of-Review analysis (Steps 1–6
including the "specially designed" catch/release), encryption/software
analysis, license determination, screening and red-flag tables, AI-usage and
regulatory-currency disclosures, and a reviewer certification page.

It is the same analysis the free flow produces — rendered as the document an
enterprise compliance program (or a regulator) expects to see.

| | |
|---|---|
| **Price** | $1.00 per rendered document — flat rate, prepaid credits, no subscription, no base fee |
| **Buy credits** | https://app.exchek.us — sign in, buy credits (one-time Stripe purchase, pick your quantity), manage keys, view render history |
| **API key** | `exk_live_…`, shown exactly once on the confirmation page after payment |
| **REST** | `POST https://api.exchek.us/pdf/classification` with `Authorization: Bearer <key>` |
| **MCP (sign-in)** | add connector `https://api.exchek.us/mcp/pro` (claude.ai, Claude Desktop) — OAuth sign-in, no key handling |
| **MCP (key header)** | `https://api.exchek.us/mcp` with the key as the connection's Authorization header, or the plugin's `enterprise_api_key` setting (Claude Code, Cursor) |
| **Contract** | `GET https://api.exchek.us/pdf/classification/contract` — requires your key (the variable schema is part of the paid product); documents every field. Fetching it never consumes a credit |
| **In-skill** | `exchek-classify` offers this as **Option 2** at report time; the free local Word report remains Option 1 and the default |
| **Dashboard sync** | opt-in: `exchek-classify` can mirror pipeline *status* (stage/status/ECCN refs only — never item details) to your Transactions page via `record_compliance_event`; the dashboard reminds you to re-screen (90 days) and re-verify classifications (30 days) |

### The compliance dashboard — included with every Enterprise account

Buying credits creates your account at **https://app.exchek.us**, and the
dashboard that comes with it is where Enterprise compounds:

| Surface | What it does |
|---|---|
| **Transactions** | The compliance pipeline (classify → jurisdiction → screen → license → export docs) fills itself as your AI works, via opt-in metadata-only sync. A needs-attention queue flags stale screens (90 days), stale classifications (30 days), and missing stages — each with a ready-made prompt to hand back to your agent |
| **Screening Center** | Parties your AI screens can be registered for **continuous monitoring** — re-screened weekly (daily for high-risk) against the Consolidated Screening List, with email alerts the moment a new match appears and a per-party evidence log for audits |
| **Products registry** | Confirmed determinations are saved (generic label + ECCN only) so an item is **classified once and reused** — agents check `get_prior_classification` before re-deriving anything, with staleness flags after 30 days |
| **Regulatory Radar** | Recent BIS/DDTC/OFAC rulemaking cross-referenced against *your* ECCNs, your team's pinned notes, and your monitored parties — plus alerts when a note's pinned CFR section is amended after the note was written |
| **eCFR Workbench + notes** | Read and search the CFR, and pin your team's institutional guidance to citations; agents pull those notes into every analysis via `get_regulatory_notes` |
| **Document vault** | Opt-in retention of rendered memoranda organized for 15 CFR 762 recordkeeping |
| **Audit-Readiness Score** | A 0–100 heuristic across screening health, classification currency, pipeline completeness, and recordkeeping — each component links to the page that improves it |
| **Team** | Share keys, parties, products, and notes with your organization; roles via your identity provider |

Everything on the dashboard is fed by the same metadata-discipline tools the
skills use — stage/status, generic labels, ECCNs — never item specifications,
party details (except parties you explicitly register for monitoring), file
contents, or analysis text.

Only **successful** renders consume a credit. Failed validation (HTTP 400) and
service errors are never charged. When credits run out, renders return HTTP
402 with a purchase link; buy again to receive a new key, or email
[matt@exchek.us](mailto:matt@exchek.us) to top up an existing one.

## How keys work

- Keys are **prepaid bearer credentials**: we store only a SHA-256 hash and the
  remaining credit balance. The plaintext key exists once, on your screen, at
  purchase time — we cannot recover it (we can rotate it; credits carry over).
- One key works on both surfaces (REST and MCP). There is no client ID, OAuth
  app, or account to manage.
- Treat it like a password: environment variable (`EXCHEK_API_KEY`) or the
  plugin's `enterprise_api_key` setting (stored in your OS keychain) — never in
  source control, never in a memo.

## Privacy

Rendering is **stateless**: your variables are substituted into the template,
the PDF is returned, and everything is discarded. Nothing is stored; service
logs record only the customer name and byte counts — never memo content.
Responses are sent with `Cache-Control: no-store`.

Even so, the memo variables transit `api.exchek.us` for rendering. **CUI,
classified, and § 126.18-restricted matter must never be sent** — the skills
enforce this gate, and the free local report (Option 1) exists precisely so
those memos never leave your machine. Full policy:
https://docs.exchek.us/docs/legal/privacy

## What stays free

Everything else. All 20 skills, the local and hosted MCP servers, the eCFR
data API, the skills HTTP API, CSL screening, the document converter, and the
local Word/Pages classification report. Enterprise documents are an option,
never a wall.

## Support

- Docs: https://docs.exchek.us/docs/api-reference · https://docs.exchek.us/docs/mcp
- Email: [matt@exchek.us](mailto:matt@exchek.us) — key rotation, credit top-ups,
  invoicing questions, or anything billing-related.
