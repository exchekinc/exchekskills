# Telemetry — ExChek Skills

**The plugin emits zero telemetry.** No call-home, no analytics, no metrics endpoint. There is no opt-in toggle to flip; there's nothing to flip it for.

## What this means in practice

- Nothing the plugin does is reported to ExChek.
- Nothing the plugin does is reported to a third-party analytics service.
- The MCP server's only outbound calls are `www.ecfr.gov` (regulation text) and `data.trade.gov` (screening list, only when you screen). Both are U.S. government endpoints required to do the work.
- The audit log lives on your disk, owner-only, and is never transmitted anywhere.

If you want operational metrics (how often each skill ran, average duration, etc.) you can build that yourself by tailing `${CLAUDE_PLUGIN_DATA}/audit.jsonl`. Each line is JSON; pipe it into anything you like.

## Cowork's own telemetry (separate from the plugin)

Cowork itself emits two streams, controlled by Cowork's managed config:

| Stream | What it is | How to disable |
|---|---|---|
| Essential | Crash reports, performance timings, app version, OS. **No prompt or response content.** | `disableEssentialTelemetry: true` |
| Non-essential | Feature adoption, session counts, UI interactions. **No prompt or response content.** | `disableNonessentialTelemetry: true` |

The plugin does not control these and is not affected by them. See https://claude.com/docs/cowork/3p/telemetry.

## Why we removed the toggle

v3.0.0 and v3.0.1 shipped a `telemetry_enabled` config toggle that did nothing — the field existed but no code emitted spans. v3.0.2 removed the field. If a real need ever shows up, we'll add it back as actual functioning code rather than a placeholder.
