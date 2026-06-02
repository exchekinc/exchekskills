# Regulatory Rules Tracker

Living watch-list of BIS / DDTC / OFAC rule changes that will (or may) require updates to ExChek
skills. U.S. export controls change constantly; this file is how we stay ahead of the changes that
affect skill *content* (not the day-to-day list churn, which is handled live — see below).

- **Last reviewed:** 2026-06-02
- **Owner:** ExChek maintainers (matt@exchek.us)
- **Review cadence:** quarterly, **plus** event-driven on any dated trigger below.
- **How to verify current text:** the local MCP exposes `mcp__exchek__ecfr_full_text` (full
  part/appendix prose, e.g. `part: "732"`, `contains: "Supplement No. 3"`) and `ecfr_get_part` /
  `ecfr_search`; the ExChek API MCP exposes `get_ecfr_part` / `search_ecfr_part` / `search_ecfr_title`.
  Use them to diff a skill's text against the live rule before a review sign-off.

**Status legend:** 🔴 action needed · 🟡 watch (no fixed date) · 🟢 auto-current (live-pulled) · ✅ done

---

## 1. Action needed soon (dated)

| Status | Trigger date | Item | Affected skills | Action when it fires | Source |
|---|---|---|---|---|---|
| 🔴 | **2026-11-09** | **BIS 50% Affiliates Rule** suspension ends (Entity List/MEU controls extend to ≥50%-owned affiliates). Currently suspended 2025-11-10 → 2026-11-09. | `exchek-skill-csl`, `exchek-skill-partner-compliance`, `exchek-skill-risk-triage`, `exchek-skill-red-flag-assessment` (Supp. 3 §29 companion) | Confirm whether it resumed, was extended, or repealed. If **resumed**: change "suspended" → "in force" and drop the suspension window. If **extended**: update the window dates. | [FR 2025-19846](https://www.federalregister.gov/documents/2025/11/12/2025-19846/one-year-suspension-of-expansion-of-end-user-controls-for-affiliates-of-certain-listed-entities) |
| 🟡 | **2026-12-31** | BIS "authorized IC designer" timeline (extended 2026-04-07 to this date) for advanced-computing due-diligence measures. | `exchek-skill-classify` (classify), `exchek-skill-license` (adv-computing notes) | Check whether the timeline is extended again or lapses; adjust the advanced-computing caveat if the framework changes. | BIS adv-computing IC due-diligence rule (FR 2025-00711) + 2026-04-07 extension |
| 🟡 | **~annually (Jan)** | IEEPA / AECA **civil-penalty inflation adjustments**. We replaced hard figures with "statutory max, inflation-adjusted — verify current," so urgency is low. | `exchek-skill-classify` (penalty context), `exchek-skill-csl` | Confirm our "verify current" phrasing still reads correctly; optionally cite the year's adjusted cap. | Annual DOC/State/Treasury inflation-adjustment rules |

---

## 2. Pending (announced, no fixed effective date)

| Status | Item | Affected skills | Action when it publishes | Source |
|---|---|---|---|---|
| 🟡 | **BIS AI-diffusion replacement rule.** The Jan-2025 "AI Diffusion" framework was rescinded May 2025; BIS said a replacement would follow. | `exchek-skill-classify` (classify), `exchek-skill-license`, `exchek-skill-country-risk` | Replace the "rescinded / replacement pending" language with the new framework (any new country tiers, ECCNs, license policy). Re-verify ECCN 4E091 and § 742.6 references. | [BIS rescission notice](https://www.bis.gov/press-release/department-commerce-announces-rescission-biden-era-artificial-intelligence-diffusion-rule-strengthens) |
| 🟡 | **USML Categories IV & XV (space)** revision — DDTC 2026 regulatory agenda. | `exchek-skill-jurisdiction` | Update USML category guidance and the "verify current USML" note; re-check any space-item examples. | DDTC 2026 regulatory agenda |
| 🟡 | **USML Category XI (semiconductor / circuit-board controls)** omnibus revision — 2026 agenda. | `exchek-skill-jurisdiction`, `exchek-skill-classify` (classify ITAR/EAR boundary) | Update Cat XI guidance; re-check ITAR-vs-EAR boundary for electronics. | DDTC 2026 regulatory agenda |
| 🟡 | **USML Category IX ("defense services" redefinition)** — 2026 agenda. | `exchek-skill-jurisdiction`, `exchek-skill-deemed-export` | Update the "defense services" framing and any §126.18 / deemed-export ITAR-parallel notes. | DDTC 2026 regulatory agenda |

---

## 3. Recurring / auto-current (no scheduled edit, but spot-check)

| Status | Item | How it stays current | Spot-check |
|---|---|---|---|
| 🟢 | **BIS red flags — Supplement No. 3 to Part 732** (29 flags as of 2025-11-12; amended often). | `exchek-skill-red-flag-assessment` **live-pulls** the current text via `ecfr_full_text` (`part: "732"`). | Quarterly: diff the curated grouped checklist against the live list; re-group if BIS adds flags. |
| 🟢 | **§ 742.6 advanced-computing license policy** (case-by-case for China/Macau since 2026-01-15; fast-moving). | Skills carry a "verify current § 742.6" caveat; pull Part 742 via the data-source gate. | Before any advanced-computing determination. |
| 🟢 | **Entity List / MEU / SDN / CSL contents** — change continuously. | Screening is **always live** against `data.trade.gov`; no skill-text edits needed for list contents. | N/A (live). |
| 🟢 | **eCFR Parts 738/740/742/744/746/121** (Country Chart, exceptions, embargoes, USML structure). | Pulled live via the data-source gate (local or ExChek API MCP); 24h cache. | The 30-day regulatory-currency caveat in every report already flags stale pulls. |

---

## 4. Recently completed (for the record)

| Done in | Change | Trigger |
|---|---|---|
| v3.4.0 | Red-flag checklist rewritten to the current **29** Supp. 3 flags (grouped); added live-pull. | Supp. 3 amended 2025-11-12 |
| v3.4.0 | **50% Affiliates Rule** added to partner-compliance + risk-triage (csl already had it). | FR 2025-19001 (2025-09-30); suspension FR 2025-19846 |
| v3.4.0 | **ITAR AUKUS § 126.7** + USML-currency notes (jurisdiction); § 126.18 parallel (deemed-export); ITAR DCS/authorization (export-docs). | AUKUS final rule eff. 2025-12-30 |
| v3.4.0 | **AI Diffusion** "effective May 2025" claim corrected to "rescinded"; advanced-computing licensing currency added; civil-penalty figures softened. | Rescission May 2025; § 742.6 2026-01-15 |

---

## How to run a review

1. For each 🔴 / 🟡 row whose date has arrived (or quarterly for 🟢), pull the live rule with the
   eCFR tools above and diff it against the named skill files.
2. Apply edits, update the affected skills' currency lines, and move the row to **§4 Recently completed**.
3. Bump the plugin version and add a CHANGELOG entry; update **Last reviewed** at the top of this file.
4. Consider a scheduled reminder for the next dated trigger (e.g. `/schedule` a re-check on the date in §1).
