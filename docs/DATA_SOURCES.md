# Data sources — Local MCP vs ExChek API MCP

ExChek pulls live U.S. regulatory text (the EAR in 15 CFR and the ITAR in 22 CFR) from one of
**two interchangeable MCP servers**. Both return the identical eCFR structure, so your
classification, license, and jurisdiction reasoning is the same either way — only *where the bytes
come from* changes. You choose at a one-time **data-source gate**, or pin a default in plugin config.

## The two sources

| | **Local MCP** (`exchek`) | **ExChek API MCP** (`exchek-api`) |
|---|---|---|
| Transport | Local stdio child process (Node) | Remote Streamable HTTP — `https://api.exchek.us/mcp` |
| CFR text from | `www.ecfr.gov` directly, cached 24h on your machine | ExChek's Cloudflare edge cache of eCFR |
| Speed | First pull hits ecfr.gov; cached after | Fast — global edge cache, warmed daily |
| Dependency | A working local Node runtime + ecfr.gov reachability | Just network to `api.exchek.us` |
| Fallback | Auto-falls back to the `api.exchek.us` mirror if ecfr.gov is unreachable (records `source`) | None needed |
| Parts | All 11 (121, 734, 738, 740, 742, 744, 746, 748, 762, 772, 774) | All 11 (same) |
| Recommended | When you want everything on-machine by default | **Default recommendation** — fastest, most reliable |

## What travels where

This is the important part for compliance and privacy:

- **Only CFR part numbers and search terms** ever go to the ExChek API MCP — e.g. "part 774",
  "search 742 for *encryption*". That is public reference data, identical for every user.
- **Never** does your item description, party name, spec-sheet content, ECCN determination, screening
  result, or any report leave your machine to ExChek. There is no item context and no PII in a
  regulatory lookup.
- **Screening, sanitization, the CUI/classified gate, audit logging, disclosure validation, and report
  generation always run on the local `exchek` server**, regardless of which data source you pick. They
  never go remote. Party screening still calls `data.trade.gov` directly (live, only when you screen).
- The **plugin** emits **zero telemetry** either way. If you use the hosted ExChek API MCP, that
  service keeps minimal anonymous operational logs — the tool invoked plus the CFR part, never the
  search term or any of your data. See [TELEMETRY.md](TELEMETRY.md).

So the full outbound picture is:

| Host | When | Carries |
|---|---|---|
| `www.ecfr.gov` | Local MCP pulls CFR text (primary) | The part number you're reading. No PII. |
| `api.exchek.us` | You select the ExChek API MCP, **or** the local MCP's auto-fallback fires | CFR part numbers + search terms only. No PII. |
| `data.trade.gov` | You screen a party (CSL), any source | The party name/terms you screen. Required to screen. |

> The search term is *sent* to `api.exchek.us` to execute the search, but its operational logs record
> only the **tool name and CFR part** — never the search term, item context, or any of your data. To
> avoid even that, pin the **Local MCP** (`regulatory_source: local`).

## Choosing a source

### The gate
By default, the first time a skill needs CFR text it asks you once:

> **How should I pull regulatory data?**
> **ExChek API MCP (recommended)** — fast, edge-cached at api.exchek.us · **Local MCP** — direct from ecfr.gov, cached on your machine

Your answer is reused for the rest of that run. Behind the scenes a skill calls
`mcp__exchek__regulatory_source` to learn the policy, then routes to the right tool.

### Pinning a default
Set **Regulatory data source** in `/plugin config exchekskills` (the `regulatory_source` option):

- `ask` *(default)* — show the gate, ExChek API recommended.
- `api` — always use the ExChek API MCP, no prompt.
- `local` — always use the local MCP, no prompt.

## Tool routing

| Operation | Local MCP (`exchek`) | ExChek API MCP (`exchek-api`) |
|---|---|---|
| Pull a CFR part | `mcp__exchek__ecfr_get_part` (`part` = string) | `mcp__exchek-api__get_ecfr_part` (`part` = integer) |
| Search within a part | `mcp__exchek__ecfr_search` | `mcp__exchek-api__search_ecfr_part` |
| Search across a title (15 EAR / 22 ITAR) | — | `mcp__exchek-api__search_ecfr_title` |
| List sections in a part | — | `mcp__exchek-api__get_ecfr_sections` |
| Load a skill's content over HTTP | — | `mcp__exchek-api__list_skills` / `get_skill` / `get_skill_bundle` |
| Currency / drift check, sanitize, CUI gate, CSL, audit, disclosure, docx | `mcp__exchek__*` (always local) | — |

## The ExChek API (REST + MCP)

`api.exchek.us` is a no-auth, read-only Cloudflare Workers API (v2.0.0). The same data is available
two ways:

- **MCP** (what the skills use): `POST https://api.exchek.us/mcp` (Streamable HTTP, JSON-RPC 2.0);
  discovery at `GET https://api.exchek.us/.well-known/mcp`. Tools: `list_skills`, `get_skill`,
  `get_skill_bundle`, `get_ecfr_part`, `get_ecfr_sections`, `search_ecfr_part`, `search_ecfr_title`.
- **REST** (the underlying surface): `GET /api/ecfr/{part}`, `/{part}/sections`, `/{part}/search?q=`,
  `/api/ecfr/search?q=&title=`, `/api/ecfr/meta`, `/skills…`, `/health`, `/openapi.json`.

Full reference: <https://docs.exchek.us/docs/api-reference>.

> The legacy `/api/classify/*` and `/api/expert-review/*` endpoints were **removed** (HTTP 410).
> Classification is performed in-skill from the CCL (Part 774) and USML (Part 121) data — there is no
> "classify" API to call.
