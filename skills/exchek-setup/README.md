# exchek-setup

First-run setup wizard for your ExChek Engine. Verifies your company profile, report defaults, API connectivity, CRM/ERP connectors, and telemetry preferences. Run once after receiving your engine — takes about 5 minutes.

## Usage

```
/exchek setup
```

Or it runs automatically the first time you use any ExChek skill and setup hasn't been completed yet.

## What it does

1. Verifies your company profile from `.exchek/config.json`
2. Confirms report defaults (prefix, folder, analyst names, ECO approval)
3. Tests ExChek API connectivity
4. Optionally sets up CRM/ERP connectors (routes to `exchek-connector`)
5. Configures telemetry preferences (local always on, cloud opt-in)
6. Verifies compliance contacts
7. Writes completion state to `.exchek/state/setup-complete.json`

## After setup

```
/exchek classify [item]  — Start classifying items
/exchek screen [party]   — Screen against denied party lists
/exchek onboarding       — Take the guided engine tour
/exchek                  — Full dashboard
```

## Support

matt@exchek.us | https://docs.exchek.us
