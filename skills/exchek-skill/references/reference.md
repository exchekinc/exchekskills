# ExChek API reference (Claude skill)

The skill's Order of Review mirrors **Supplement No. 4 to Part 774** (Commerce Control List Order of Review) and the **BIS CCL Order of Review** and **Specially Designed** decision tools: https://www.bis.doc.gov/index.php/export-control-classification-interactive-tool and https://www.bis.doc.gov/wrappers/sd/special_design_tool.htm.

- **Base URL**: `https://api.exchek.us`
- **Payment**: None. The ExChek classification skill is free; regulatory snapshot endpoints are read-only and require no auth or payment.

## Endpoints

| Endpoint | Method | Returns |
|----------|--------|---------|
| /health | GET | `{ status: "ok", service: "exchek-api" }` — includes eCFR reachability, cache stats, snapshot ages. |
| /api/ecfr/meta | GET | Supported parts list, snapshot metadata, cache stats, and refresh schedule. |
| /api/ecfr/774 | GET | Part 774 (CCL) structure JSON — identifier, label, children. Use for Order of Review and citations. |
| /api/ecfr/738 | GET | Part 738 (Commerce Country Chart) structure — use for destination vs. control columns. |
| /api/ecfr/740 | GET | Part 740 (License Exceptions) structure — use for LVS, GBS, TMP, RPL, etc. |
| /api/ecfr/742 | GET | Part 742 (Control Policy — CCL Based Controls) — reasons for control by ECCN. |
| /api/ecfr/744 | GET | Part 744 (End-Use Controls) — Entity List, Military End-Use, and end-use restrictions. |
| /api/ecfr/746 | GET | Part 746 (Embargoes and Other Special Controls) — embargo and sanctions provisions. |
| /api/ecfr/121 | GET | Part 121 (USML) structure JSON — same shape. Use for jurisdiction and USML review. |
| /api/ecfr/:part/sections | GET | Flat list of all sections within a part (identifier + label). Useful for navigation. |
| /api/ecfr/:part/search?q=term | GET | Full-text search within a part. Returns matching sections with excerpts, highlights, scores, and pagination. |
| /api/ecfr/search?q=term&title=15 | GET | Full-text search across all parts in a title (15 = EAR, 22 = ITAR). |

On 503, the API may return `{ error: "Regulatory data temporarily unavailable", message: "..." }`. Fall back to the eCFR developer API (below) or ask the user to try again later.

## eCFR developer API (fallback)

When ExChek snapshot endpoints are unavailable, use the official eCFR API (no API key):

- **Title 15 (EAR):** `GET https://www.ecfr.gov/api/versioner/v1/structure/current/title-15.json` — extract the node for Part 774, 738, 740, 742, 744, or 746.
- **Title 22 (ITAR):** `GET https://www.ecfr.gov/api/versioner/v1/structure/current/title-22.json` — extract the node for Part 121.

Structure: each node can have `identifier`, `label`, `content`, `children`. Traverse `children` to find sections; use `identifier` (e.g. ECCN like "1A995") and `label` for citations.

## Donation

ExChek is free. Optional donation addresses by network are in [references/donation.md](donation.md). Suggest the address for the chain that matches the user's or agent's pay abilities.

Full docs: https://docs.exchek.us
