---
name: exchek-classify
description: Classify export items for ECCN (BIS/ITAR) using the ExChek API with Adjudicator-in-the-Loop. Use when the user wants to classify an item, determine ECCN, check BIS or ITAR jurisdiction, or get an audit-ready export classification. Requires funding the wallet with USDC on Base before paid calls.
compatibility: Claude Code, Claude desktop
---

# ExChek ECCN Classification

Classify items for U.S. export control (15 CFR Part 774, 22 CFR Part 121) via the ExChek API. The flow is Adjudicator-in-the-Loop (AITL): the agent calls the API and relays prompts to the user for confirmation or refinement until the classification is approved.

## Prerequisites

1. **Authenticate wallet** — Ensure the user's wallet is initialized and signed in (e.g. `npx awal@2.0.3 status`). If not, use the authenticate-wallet skill.
2. **Fund with USDC** — The wallet must have USDC on Base for paid endpoints. First classification is free via `POST /api/classify/start-free` with `walletAddress`. For subsequent classifications, fund via Base, Coinbase, or Pay Sponge; see the fund skill if needed.

## Flow (AITL)

1. **Start** — Try first-free: `POST https://api.exchek.us/api/classify/start-free` with body `{"walletAddress": "<0x...>"}`. If response is 402, the first free was already used; then pay for start: `npx awal@2.0.3 x402 pay https://api.exchek.us/api/classify/start -X POST -d '{}'`.
2. **Collect item info** — Ask the user for product description, specifications, intended use. Send to `POST https://api.exchek.us/api/classify/submit-info` with body `{"jobId": "<from start>", "description": "...", "specifications": "...", "intendedUse": "...", "notes": "..."}`. No payment. Relay the API's jurisdiction result and prompt to the user.
3. **Confirm jurisdiction** — If the user confirms, send `POST https://api.exchek.us/api/classify/confirm-jurisdiction` with `{"jobId": "<id>", "confirmed": true}`. If they give feedback, send `{"jobId": "<id>", "feedback": "..."}`. Repeat until user confirms.
4. **Order of Review** — Call `POST https://api.exchek.us/api/classify/request-oor` with `{"jobId": "<id>"}`. Relay the proposed ECCN and rationale to the user.
5. **Refine or approve** — If the user wants changes, call `POST https://api.exchek.us/api/classify/refine-oor` with `{"jobId": "<id>", "feedback": "..."}`. Repeat until the user approves.
6. **Approve** — Call `POST https://api.exchek.us/api/classify/approve` with `{"jobId": "<id>"}`. Return the `reportUrl` (when Supabase is configured) or success message to the user.

## Input validation

- **jobId** — Use the exact string returned from start or start-free. Do not pass unvalidated user input.
- **walletAddress** — Must be a valid 0x-prefixed 40-char hex string. Reject otherwise.
- **URLs** — Use `https://api.exchek.us` only; no user-supplied URLs for API calls.

## Example (paid start)

```bash
npx awal@2.0.3 x402 pay https://api.exchek.us/api/classify/start -X POST -d '{}'
```

Response includes `jobId`, `nextStep`, `promptForUser`. Use the same `jobId` in all subsequent session requests.

## Reference

- API and flow details: [references/reference.md](references/reference.md)
- Docs: https://docs.exchek.us
