# ExChek Orchestrator (exchek-orchestrator)

The **central command hub** for the ExChek Engine. Invoke with `/exchek` for a status dashboard showing your company info, engine version, connector status, recent activity, and suggested next actions. Invoke with `/exchek [command]` to route to any ExChek sub-skill. After each skill run, suggests the logical next compliance step.

**Why use it** — One command to rule them all. The orchestrator reads your `.exchek/` state files for context-aware behavior and routes every compliance task to the right skill. The agent is the wheel, ExChek is the hub, compliance tasks are the spokes.

- **API**: https://api.exchek.us
- **Docs**: https://docs.exchek.us
- **Website**: https://exchek.us

## Install

This skill lives in the **exchek-orchestrator** folder in the paid skills repo. If you have the repo cloned, the skill is already available.

## How to use

- **Dashboard** — Type `/exchek` or `/exchek status` for a full status overview.
- **Route to skill** — Type `/exchek classify [item]`, `/exchek screen [party]`, `/exchek license [item] [dest]`, or any command from the routing table.
- **Help** — Type `/exchek help` for context-aware guidance based on your current setup and onboarding state.
- **What you get** — A unified interface to every ExChek compliance capability, with anticipatory next-step suggestions after each skill run.

See **SKILL.md** and **skill.yaml** in this folder for full instructions and manifest.

## License

See ExChek, Inc. terms.
