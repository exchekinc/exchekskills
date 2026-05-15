# ExChek Analytics Event Schema

Reference for the JSONL event format used by all ExChek Engine skills.

## Event file location

`~/.exchek/analytics/events.jsonl` — one JSON object per line.

## Event types

### `skill_run`

Logged by every ExChek skill at the end of execution.

```json
{
  "ts": "2025-06-15T14:30:00.000Z",
  "event": "skill_run",
  "skill": "exchek-classify",
  "duration_ms": 12345,
  "success": true,
  "version": "1",
  "os": "darwin",
  "agent": "claude-code",
  "engine_version": "2.0.0"
}
```

### `hub_route`

Logged by the exchek-orchestrator when it routes a command to a sub-skill.

```json
{
  "ts": "2025-06-15T14:30:00.000Z",
  "event": "hub_route",
  "skill": "exchek-orchestrator",
  "routed_to": "exchek-skill-csl",
  "duration_ms": 150,
  "success": true,
  "version": "1",
  "os": "darwin",
  "agent": "claude-code",
  "engine_version": "2.0.0"
}
```

## Field descriptions

| Field | Type | Description |
|-------|------|-------------|
| `ts` | string (ISO 8601) | Timestamp of event creation |
| `event` | string | Event type: `skill_run` or `hub_route` |
| `skill` | string | The skill that generated the event (folder name, e.g. `exchek-classify`, `exchek-orchestrator`) |
| `routed_to` | string | (hub_route only) The target skill the orchestrator routed to |
| `duration_ms` | number | Wall-clock milliseconds from skill start to finish |
| `success` | boolean | `true` if the skill completed without error; `false` otherwise |
| `version` | string | Skill manifest version |
| `os` | string | Operating system: `darwin`, `linux`, `win32` |
| `agent` | string | Agent runtime: `claude-code`, `claude-desktop`, `cursor`, etc. |
| `engine_version` | string | ExChek Engine version from `.exchek/state/update-manifest.json` |

## Example events

```jsonl
{"ts":"2025-06-15T14:30:00.000Z","event":"skill_run","skill":"exchek-classify","duration_ms":12345,"success":true,"version":"1","os":"darwin","agent":"claude-code","engine_version":"2.0.0"}
{"ts":"2025-06-15T14:32:00.000Z","event":"skill_run","skill":"exchek-skill-csl","duration_ms":8200,"success":true,"version":"1","os":"darwin","agent":"claude-code","engine_version":"2.0.0"}
{"ts":"2025-06-15T14:32:00.000Z","event":"hub_route","skill":"exchek-orchestrator","routed_to":"exchek-skill-csl","duration_ms":150,"success":true,"version":"1","os":"darwin","agent":"claude-code","engine_version":"2.0.0"}
{"ts":"2025-06-15T14:35:00.000Z","event":"skill_run","skill":"exchek-skill-license","duration_ms":15400,"success":false,"version":"1","os":"linux","agent":"cursor","engine_version":"2.0.0"}
```

## What is NEVER tracked

The following data is **never** logged, stored, or transmitted — locally or to the cloud:

- Source code or file contents
- File paths or directory structures
- User prompts or agent responses
- Personally identifiable information (PII)
- ECCN results, classification outcomes, or screening hits
- Company names, party names, or transaction details
- API keys, tokens, or credentials
- Report contents or document text

Only skill names, run timestamps, durations, success/failure status, OS, agent type, and engine version are recorded.

## How to write events (for skill authors)

Each ExChek skill is responsible for writing its own event. The pattern is:

1. **Preamble** — At the start of execution, record the current timestamp.
2. **Execute** — Run the skill logic.
3. **Postamble** — Compute the duration and append one line to `~/.exchek/analytics/events.jsonl`:

```bash
echo '{"ts":"2025-06-15T14:30:00.000Z","event":"skill_run","skill":"exchek-skill-csl","duration_ms":4200,"success":true,"version":"1","os":"darwin","agent":"claude-code","engine_version":"2.0.0"}' >> ~/.exchek/analytics/events.jsonl
```

If the file does not exist, the skill creates it. If `.exchek/telemetry.json` has `cloud: true`, the event is also POSTed to the ExChek telemetry API:

```
POST https://enterprise.exchek.us/api/telemetry
Content-Type: application/json

{ "skill_name": "exchek-classify", "duration_ms": 4200, "success": true, "skill_version": "1", "os": "darwin", "agent_platform": "claude-code", "engine_version": "2.0.0", "client_id": "<uuid from .exchek/client.json>" }
```

Only anonymous usage data is sent. Never: code, prompts, PII, compliance results, company data, or ECCN determinations.
