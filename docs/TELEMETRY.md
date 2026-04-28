# Telemetry — ExChek Skills

**Default: telemetry is OFF.** This plugin does not call home.

If you want internal usage analytics — say, you run an SMB with five engineers and want to know how often each is running screenings — you can turn telemetry on and point it at your own collector. ExChek never receives the data.

## How to turn it on

1. `/plugin config exchekskills`
2. Toggle **Enable usage telemetry** to ON.
3. In Cowork's managed config, set `otlpEndpoint` to your OpenTelemetry collector. Cowork supports this natively — see https://claude.com/docs/cowork/3p/telemetry.

That's it. The plugin's `Stop` hook emits an OTLP span at the end of every conversation that used an ExChek skill. The span carries:

| Field | Example |
|---|---|
| `skill.name` | `exchek-classify` |
| `skill.version` | `2.1.0` |
| `event_type` | `report_emitted` |
| `duration_ms` | `42000` |
| `platform_tier` | `cowork-enterprise` |
| `host.name` | redacted SHA-256 of the machine name |

It does **not** carry:

- The contents of any prompt or response.
- Item descriptions, party names, ECCNs, country codes, or any other compliance content.
- API keys, file paths, or user identifiers.

## How to turn it off

It's already off. If you turned it on and want it off, set the toggle back. The hook becomes a no-op.

## Cowork's own telemetry (separate from the plugin's)

Cowork itself emits two streams of its own: essential (crash reports, performance) and non-essential (feature usage). Both can be disabled in Cowork's managed config:

- `disableEssentialTelemetry: true`
- `disableNonessentialTelemetry: true`

These switches are independent from the plugin toggle. Even if you disable both, the plugin will keep working — it has no runtime dependency on Cowork's telemetry stream.

## Why we default to OFF

You are an SMB manufacturer. Your shipment data, your customer list, and your product specs are competitive. You also probably haven't talked to a security reviewer about whether sending anonymous spans to a third party is fine. So the default answer is "don't send anything until you decide to."
