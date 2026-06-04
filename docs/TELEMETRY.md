# Telemetry — ExChek Skills

**The plugin emits zero telemetry.** No call-home, no analytics, no metrics endpoint. There is no opt-in toggle to flip; there's nothing to flip it for.

## What this means in practice

- Nothing the plugin does is reported to ExChek as telemetry — no usage events, no analytics, no metrics.
- Nothing the plugin does is reported to a third-party analytics service.
- Outbound calls are functional data lookups, not telemetry: `www.ecfr.gov` (regulation text) and `data.trade.gov` (screening list, only when you screen) are U.S. government endpoints. If you select the **ExChek API MCP** at the data-source gate (or the local server falls back when ecfr.gov is down), regulation lookups also go to `api.exchek.us` — carrying only a CFR part number or search term, never your data. The plugin itself still emits no telemetry; the hosted service keeps minimal anonymous operational logs, described below. See [DATA_SOURCES.md](DATA_SOURCES.md).
- The audit log lives on your disk, owner-only, and is never transmitted anywhere.

If you want operational metrics (how often each skill ran, average duration, etc.) you can build that yourself by tailing `${CLAUDE_PLUGIN_DATA}/audit.jsonl`. Each line is JSON; pipe it into anything you like.

## The hosted ExChek API (only if you opt into it)

Everything above is about the **plugin**, which emits nothing. The hosted API at `api.exchek.us` is a separate, optional data source — the plugin is local-first by default, and you reach the hosted API only via the data-source gate or the local server's automatic fallback. Like any web service, it keeps **minimal, anonymous operational logs**:

- the tool or endpoint invoked (e.g. `get_ecfr_part`, `search_ecfr_part`),
- the CFR part or title requested, and
- per-session request counts (to tell a handshake from real usage).

These logs **never** include search terms, skill arguments, item descriptions, party names, file contents, classification or screening results, or any PII — nothing you classify or screen appears in them. If you want **zero** ExChek-side logging of regulatory lookups, pin the **Local MCP** at the data-source gate (`regulatory_source: local`); CFR text then comes straight from `www.ecfr.gov`.

## Cowork's own telemetry (separate from the plugin)

Cowork itself emits two streams, controlled by Cowork's managed config:

| Stream | What it is | How to disable |
|---|---|---|
| Essential | Crash reports, performance timings, app version, OS. **No prompt or response content.** | `disableEssentialTelemetry: true` |
| Non-essential | Feature adoption, session counts, UI interactions. **No prompt or response content.** | `disableNonessentialTelemetry: true` |

The plugin does not control these and is not affected by them. See https://claude.com/docs/cowork/3p/telemetry.

## Why we removed the toggle

v3.0.0 and v3.0.1 shipped a `telemetry_enabled` config toggle that did nothing — the field existed but no code emitted spans. v3.0.2 removed the field. If a real need ever shows up, we'll add it back as actual functioning code rather than a placeholder.
