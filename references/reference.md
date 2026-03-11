# ExChek API reference (Claude skill)

- **Base URL**: `https://api.exchek.us`
- **Paid endpoints**: x402 (USDC on Base). Use `npx awal@2.0.3 x402 pay <url> -X POST -d '<json>'` for paid calls.
- **Session endpoints**: Require `jobId` in body; no payment after start.

| Endpoint | Payment | Body | Returns |
|----------|---------|------|--------|
| POST /api/classify/start-free | None | `{ "walletAddress": "0x..." }` | jobId, promptForUser (or 402 if free used) |
| POST /api/classify/start | x402 $10 | `{}` | jobId, nextStep, promptForUser |
| POST /api/classify/jurisdiction | x402 $2 | description, specifications, intendedUse, notes | jurisdiction, rationale, citations |
| POST /api/classify/submit-info | None | jobId, description, specifications, intendedUse, notes | jurisdiction, promptForUser |
| POST /api/classify/confirm-jurisdiction | None | jobId, confirmed or feedback | nextStep, promptForUser |
| POST /api/classify/request-oor | None | jobId | eccn, rationale, citations, promptForUser |
| POST /api/classify/refine-oor | None | jobId, feedback | eccn, rationale, promptForUser |
| POST /api/classify/approve | None | jobId | reportUrl, message |

Full docs: https://docs.exchek.us
