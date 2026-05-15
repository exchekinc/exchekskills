# ExChek Analytics Dashboard (exchek-analytics)

View **usage statistics and telemetry** for your ExChek Engine. Reads local event data from `~/.exchek/analytics/events.jsonl` and displays skill usage counts, success rates, average durations, most-used skills, trends, and compliance coverage gaps. Export to CSV for compliance reporting.

**Why use it** — Understand how your team uses export compliance tools, identify coverage gaps (which compliance categories haven't been exercised), and export usage data for audits or management reporting.

- **API**: https://api.exchek.us
- **Docs**: https://docs.exchek.us
- **Website**: https://exchek.us

## Install

This skill lives in the **exchek-analytics** folder in the paid skills repo. If you have the repo cloned, the skill is already available.

## How to use

- **Invoke** — Type `/exchek analytics` or ask in plain language, e.g. *"Show my ExChek usage stats"* or *"Export analytics to CSV"*
- **What the agent does** — Reads your local event log, computes statistics (totals, success rates, durations, coverage), displays a dashboard, highlights compliance gaps, and optionally exports to CSV.
- **What you get** — A clear picture of your ExChek usage with actionable suggestions for compliance areas you haven't covered yet.

## Privacy

Only skill names, run timestamps, durations, and success/failure are tracked. Code, paths, prompts, PII, ECCN results, company data, and API keys are **never** logged or transmitted.

See **SKILL.md** and **skill.yaml** in this folder for full instructions and manifest.

## License

See ExChek, Inc. terms.
