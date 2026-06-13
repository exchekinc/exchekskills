# Transaction sync (ExChek Enterprise dashboard)

Enterprise accounts have a Transactions page at https://app.exchek.us that
shows the compliance pipeline — classify → jurisdiction → screen → license →
export docs — as the user's AI works through it, with automatic reminders
(re-screen after 90 days, re-verify classifications after 30 days, flagged
steps). This reference defines **exactly** when and how a skill may record
events to it.

Sync is a courtesy mirror of pipeline *status*, never a data channel. The
local audit log (`mcp__exchek__audit_log`) remains the system of record;
sync failing, being declined, or being unavailable changes nothing about the
classification flow.

## The three gates — all must pass, in order

1. **CUI gate.** If the Step 0 CUI/Classified selector returned **Yes** or
   **Don't know**, transaction sync is prohibited for the entire engagement.
   Do not record events, and do not ask the user about sync — asking would
   itself suggest sending something. This gate is absolute and overrides the
   user's sync preference.
2. **Credentials gate.** Recording requires an authenticated ExChek API
   connection: the `enterprise_api_key` plugin setting (which puts the
   Authorization header on the bundled `exchek-api` MCP connection), or an
   OAuth-authenticated `/mcp/pro` connector (claude.ai, Claude Desktop). If
   neither is present, **skip sync silently** — no mention, no upsell, no
   error. Free users should never learn this feature exists from a failure
   message.

   **Re-evaluate this gate at every milestone, not just at step 1.** Users
   connect the `/mcp/pro` connector mid-conversation (it's how the paid PDF
   gets unlocked); a credentials check that ran once at the start would then
   silently drop every event for the rest of the engagement — the user ends
   the session believing their dashboard tracked the work when nothing
   landed. The moment an authenticated connection appears, ask the consent
   question once (gate 3), and on a yes **record the milestones already
   passed** before continuing — the server replaces same-type events per
   transaction, so late recording is safe and idempotent. A wrap-up is the
   last chance to catch this: if credentials exist, consent is yes, and no
   events were recorded this engagement, record the completed stages then.
3. **Consent gate.** Check the `transaction_sync` plugin setting:
   - `"on"` — record without asking.
   - `"off"` — never record, never ask.
   - `"ask"` (default) — ask **once per engagement**, folded into the step 1
     opening question set (never as an extra interruption): *"Track this
     transaction on your ExChek dashboard? It records stage and status only —
     for example 'classify ✓ EAR99' — never item details. (yes / no)"*
     Reuse the answer for the rest of the run. "No" means no for the whole
     engagement; do not re-ask at later steps.

## What may be sent — the complete list

The `record_compliance_event` tool accepts exactly these fields, and you may
populate them with exactly this:

| Field | Allowed content | Hard limit |
|---|---|---|
| `transaction_id` | The orchestrator's id (`tx_007`) when running under `/exchek`; otherwise generate `tx-YYYYMMDD-<4 random hex>` | 40 chars |
| `event_type` | One of: `classify`, `jurisdiction`, `screen`, `license`, `export_docs`, `red_flags`, `note` | enum |
| `status` | `complete`, `pending`, or `flagged` | enum |
| `label` | A short generic item label — category words only | 80 chars |
| `ref` | A determination reference: ECCN, `EAR`/`ITAR`, list name, doc number | 40 chars |

**Label discipline.** The label names the *kind* of thing, not the thing:

| ✓ Acceptable label | ✗ Never send |
|---|---|
| `MWIR thermal camera` | `FLIR Boson+ 640 60Hz for Acme Defense's UAV program` |
| `LED headlight assembly` | Part numbers, customer names, program names |
| `network encryption appliance` | Specs, quantities, values, destinations |

**Never send, in any field:** technical specifications, performance
parameters, part/serial numbers, party or customer names, end users,
destinations, countries, quantities, valuations, file contents, file names,
analysis text, screening hit details, or anything from a CRM record. When in
doubt, make the label more generic or omit it — `ref` and `label` are both
optional in spirit: a bare `classify/complete` event is always safe.

**Party names and screening:** the `screen` event records *that* screening
happened and its outcome class — `complete` with `ref` naming the list
(`CSL`), or `flagged` with `ref` like `Entity List near-match`. The party's
name stays local, always.

## Event map — which flow step records what

Record each event **once**, immediately after the milestone it describes
(the server replaces same-type events, so a corrected re-record is safe):

| Flow milestone | Event |
|---|---|
| Step 4 — user confirms jurisdiction | `jurisdiction` / `complete` / ref `EAR` or `ITAR` |
| Step 5 — user approves the final classification | `classify` / `complete` / ref = final ECCN (e.g. `1A995`, `EAR99`) |
| A CSL screen run during this flow, clear | `screen` / `complete` / ref `CSL` |
| A CSL screen run during this flow, potential hit | `screen` / `flagged` / ref e.g. `Entity List near-match` |
| Screening deliberately deferred (user will screen later) | `screen` / `pending` / no ref |
| Enterprise PDF memorandum rendered (Option 2) | `note` / `complete` / ref = the memo's DOC number |

Set `label` on the **first** event of the engagement only; later events for
the same `transaction_id` don't need it.

The license determination and export-docs stages belong to their own skills
(`exchek-license`, `exchek-export-docs`) — do not record them from the
classify flow. An unscreened or unlicensed transaction showing `pending`/empty
stages on the dashboard is the *point*: that's what drives the user's
"needs attention" queue back into a new agent session.

## Products registry (same gates, same discipline)

The dashboard's companion is the **Products registry** at https://app.exchek.us
(Products): the account's durable catalog of classified items, so an item is
classified once and reused. Two tools, governed by the SAME three gates and
label discipline as event sync — the step 1 consent question covers both:

| Tool | When | What may be sent |
|---|---|---|
| `get_prior_classification` | At the START of a classification, before collecting full specs | A generic label or keyword (category words only) — it's a lookup, nothing is stored |
| `record_product_classification` | After the user's FINAL approval (step 5) | `label` (generic, 80 chars), `eccn`, `jurisdiction` (`EAR`/`ITAR`), optional `doc_number` (the rendered memo's DOC number) |

`record_product_classification` upserts by label (case-insensitive): re-running
the same item updates its entry rather than duplicating it. Lookups return a
`stale` flag for determinations older than 30 days — recommend re-verification
(the free `get_rule_changes` tool shows whether recent rules touched that ECCN)
rather than silent reuse. The registry follows the same label discipline as
events: category words, never specs, part numbers, customers, or programs.

## Invocation

Through the bundled hosted connection: `mcp__exchek-api__record_compliance_event`
with the fields above. On an OAuth connector the tool name follows the
client's naming for the `/mcp/pro` server. There is a companion
`list_compliance_transactions` tool — use it when the user asks "what's open?"
or to find an existing transaction id for the same item before creating a new
one.

## Failure handling

Recording is fire-and-forget. If the tool errors (expired token, exhausted
account, network), **continue the flow without comment** beyond at most one
line ("Dashboard sync didn't go through — your local audit log is complete."),
and do not retry more than once. Never let sync failures delay, block, or
alter the classification, the report, or the user's deliverable.

## Revocation and the user's controls

The user can see every recorded transaction at https://app.exchek.us
(Transactions), and recording stops the moment they set `transaction_sync`
to `off`, remove their credentials, or revoke the connected app. If a user
asks "what did you send?", show them the literal tool calls you made this
session — they are short enough to display in full.
