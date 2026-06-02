# End-use / End-user Red Flag Assessment Guidance

Structured checklist and assessment rules for BIS "Know Your Customer" red flags. Aligns with **Supplement No. 3 to 15 C.F.R. Part 732** and with exchek-skill-risk-triage escalation-best-practices and exchek-skill-csl Section 5 (Red Flag Assessment).

---

## 1. Authority and scope

- **BIS "Know Your Customer" Guidance:** Supplement No. 3 to 15 C.F.R. Part 732.
- **Purpose:** Run a structured checklist for a given party/transaction and produce an auditable red-flag assessment note (no / yes / conditional; escalate if needed).
- **Use:** Dedicated end-use/end-user review before committing; complements risk triage and denied-party screening. This skill does **not** perform screening, classification, or license determination.

> **Currency — important.** BIS has expanded Supplement No. 3 substantially. As of the **2025-11-12** amendment it contains **29 enumerated red flags** (up from the short historical list), driven by the advanced-computing / semiconductor / Entity List rulemakings of 2022–2025. The curated checklist below groups all 29 in plain English for a small-manufacturer audience. **Always confirm against the live text** — the list is amended frequently.
>
> **Pull the current list at runtime:** call `mcp__exchek__ecfr_full_text` with `part: "732"`, `contains: "Supplement No. 3"`. (Part 732 is fetched from ecfr.gov by the local MCP; the ExChek API MCP does not mirror it.) Authoritative URL: <https://www.ecfr.gov/current/title-15/part-732/appendix-Supplement%20No.%203%20to%20Part%20732>.

---

## 2. Red flag checklist (BIS Supp. 3 to Part 732 — current 29)

Assess each applicable item for the party and transaction. For each, mark **Present?** as **Yes**, **No**, or **Conditional**, and add **Notes**. The flags are grouped: **Group A** applies to every transaction; **Groups B and C** apply when you make or handle controlled hardware, semiconductors, computing items, 9x515/"600 series" items, or sell through distributors / abroad. The parenthetical numbers are the official Supp. 3 flag numbers for audit traceability.

### Group A — General diversion indicators (Supp. 3 §§ 1–12)

| # | Red flag | Guidance for Yes / No / Conditional |
|---|----------|--------------------------------------|
| A1 | **Reluctant to offer end-use information** (§1) | Yes: customer/agent evades or refuses to explain end use. No: provided. Conditional: partial/pending. |
| A2 | **Product capabilities don't fit the buyer's line of business** (§2) | Yes: mismatch (e.g., a small bakery ordering sophisticated lasers). No: consistent. Conditional: under review. |
| A3 | **Product incompatible with the destination's technical level** (§3) | Yes: e.g., semiconductor manufacturing equipment to a country with no electronics industry. No: appropriate. Conditional: clarifying. |
| A4 | **Customer has little or no business background** (§4) | Yes: no verifiable history/presence. No: established. Conditional: new entity with other mitigations. |
| A5 | **Cash for an expensive item when terms call for financing** (§5) | Yes: unusual/unexplained payment. No: standard terms. Conditional: explained. |
| A6 | **Unfamiliar with performance characteristics but still wants it** (§6) | Yes: cannot explain normal use yet insists. No: familiar. Conditional: under review. |
| A7 | **Declines routine installation, training, or maintenance** (§7) | Yes: declined without explanation. No: accepted/normal. Conditional: clarifying. |
| A8 | **Vague delivery dates, or deliveries to out-of-the-way destinations** (§8) | Yes: vague/unusual. No: normal. Conditional: pending. |
| A9 | **A freight forwarder is listed as the final destination** (§9) | Yes: forwarder named as end destination. No: real end-user destination. Conditional: clarifying. |
| A10 | **Abnormal shipping route for the product and destination** (§10) | Yes: route deviates without explanation. No: normal. Conditional: under review. |
| A11 | **Packaging inconsistent with the stated shipment method or destination** (§11) | Yes: mismatch. No: consistent. Conditional: clarifying. |
| A12 | **Evasive about domestic use vs. export vs. reexport** (§12) | Yes: evasive/unclear when questioned. No: clear. Conditional: pending. |

### Group B — Hardware, semiconductor, computing & destination diversion (Supp. 3 §§ 13–23)

| # | Red flag | Guidance for Yes / No / Conditional |
|---|----------|--------------------------------------|
| B13 | **Order for 9x515 / "600 series" "parts" or "components" in quantities inconsistent with known end items** in the destination (§13) | Yes: quantity would service far more end items than the country is known to have. No: consistent. Conditional: verifying. |
| B14 | **Facts suggest a 9x515 / "600 series" item may be reexported to a Country Group D:5 destination** (§14) | Yes: D:5 diversion indicators. No: none. Conditional: verifying. (D:5 = supplement no. 1 to part 740.) |
| B15 | **Customer's pre-Oct-7-2022 marketing advertised "advanced-node IC" development/production capability** (§15) | Yes: such marketing exists. No: none. Conditional: under review. |
| B16 | **Items requested are typically used (exclusively/predominantly) for "advanced-node IC" production, despite customer representations otherwise** (§16) | Yes: technology/representation mismatch. No: consistent. Conditional: verifying. |
| B17 | **Customer "known" to develop/produce for supercomputer-involved companies in Macau or D:5** (§17) | Yes: such knowledge. No: none. Conditional: verifying. |
| B18 | **Knowledge the customer intends to develop/produce supercomputers or ICs restricted under § 744.23** (§18) | Yes: such knowledge. No: none. Conditional: verifying. |
| B19 | **FDP / advanced-IC production with >50B transistors + HBM for a Macau/D:5-HQ'd company** (§19) | Yes: meets the technical thresholds — resolve or license. No: outside scope. Conditional: applying the technical note. |
| B20 | **Technology mismatch — a non-advanced fab orders equipment designed for "advanced-node IC" production it wouldn't need** (§20) | Yes: mismatch indicates intended advanced production. No: appropriate. Conditional: verifying. |
| B21 | **Uncertain ultimate owner/user** — e.g., IC-production equipment shipped to a distributor with no manufacturing operation (§21) | Yes: end user unknown where it should be known (advanced computing, supercomputers, SME). No: known. Conditional: tracing. |
| B22 | **License-history uncertainty** — a required license likely was not / would not be obtained; also applies to service/install/upgrade/maintain requests (§22) | Yes: indicators a license is missing (risk of 764.2(e) "acting with knowledge"). No: clean. Conditional: confirming. |
| B23 | **Request to service/install/upgrade/maintain an item altered after export for a more advanced end use** needing a license (§23) | Yes: altered for a controlled end use. No: not. Conditional: verifying. |

### Group C — Entity List, FDP, AI weights & ownership (Supp. 3 §§ 24–29)

| # | Red flag | Guidance for Yes / No / Conditional |
|---|----------|--------------------------------------|
| C24 | **New customer's senior management / technical leadership overlaps with an Entity List entity** (§24) | Yes: leadership overlap, especially if you previously supplied the listed entity. No: none. Conditional: due diligence in progress. |
| C25 | **New customer requests an item/service designed/modified for a current or former customer now on the Entity List** (assumed operations) (§25) | Yes: assumed-operations indicators. No: none. Conditional: verifying. |
| C26 | **Entity List FDP (Footnote 5) / SME FDP product-scope** — a foreign-produced Category 3B item containing ≥1 integrated circuit (§26) | Yes: meets FDP product scope — resolve before proceeding. No: outside scope. Conditional: analyzing 734.9(e)(3)/(k). |
| C27 | **End user is a facility physically connected to an "advanced-node IC" production facility** (§27) | Yes: bridge/tunnel/connection to an advanced-node fab. No: not connected. Conditional: verifying. |
| C28 | **Providing IaaS / computing to train an AI model with ECCN 4E091 model weights** for an entity HQ'd outside the Supp. 5 to Part 740(a) destinations (§28) | Yes: such assistance — substantial diversion risk. No: not applicable. Conditional: verifying destination/HQ. |
| C29 | **Known ownership by an Entity List / MEU-List party (or an unlisted party restricted by ownership)** (§29) | Yes: any such ownership. **Affirmative duty to determine the percentage of ownership and obtain a license if required.** No: none. Conditional: ownership trace in progress. See Section 7 on the 50% Affiliates Rule. |
| C+ | **Other** (specify) | Document any other relevant red flag; set Yes/No/Conditional and notes. |

---

## 3. Yes / No / Conditional

- **Yes:** The red flag is present or not adequately mitigated. Must be documented and typically leads to hold or escalate.
- **No:** The red flag is not present, or the situation is clearly benign and documented.
- **Conditional:** Under review, mitigated with specific conditions, or pending (e.g., ownership trace in progress). Document the condition and follow-up; disposition may be "Hold for export compliance" until resolved.

When in doubt, use **Conditional** and recommend follow-up rather than No.

---

## 4. Overall assessment

| Outcome | When to use |
|---------|-------------|
| **No red flags** | Every applicable checklist item is No (and any "Other" is No or not applicable). No escalation recommended. |
| **Red flags present** | One or more items are Yes. Escalation or hold recommended per Section 5. |
| **Conditional** | One or more items are Conditional; no item is Yes. Recommend hold for compliance review or enhanced due diligence until resolved. |

Note Groups B and C only when they apply to the item/customer; if the transaction has no hardware/semiconductor/computing/Entity-List dimension, say so in the note rather than marking those flags "No" item-by-item. Summarize with a short rationale (e.g., "No red flags identified; end use and counterparty documentation are consistent with product and policy." or "Red flag present: §29 ownership by a listed party; ownership trace and license analysis required.").

---

## 5. When to recommend escalation

| Situation | Recommendation |
|-----------|----------------|
| **Refusal to provide ownership / KYC** (relates to §§ 1, 4, 29) | **Escalate to legal/compliance counsel.** Do not proceed without resolution. |
| **Ownership by an Entity List / MEU party (§29)** | **Escalate.** Affirmative duty to determine ownership %; obtain a license if required. Apply the 50% Affiliates Rule analysis in Section 7. Do not proceed until resolved. |
| **Entity List management overlap or assumed operations (§§ 24–25)** | **Escalate / enhanced due diligence.** Treat as a probable diversion/end-use concern. |
| **FDP product-scope or advanced-IC / supercomputer / AI-weights indicators (§§ 15–21, 26–28)** | **Hold and resolve** before proceeding; a license or FDP analysis is likely required. Loop in counsel for D:5 / Macau exposure. |
| **License-history uncertainty or servicing of an altered item (§§ 22–23)** | **Hold.** Resolve the license question before any service/install/upgrade — risk of 764.2(e) "acting with knowledge of a violation." |
| **Any other Yes** | **Hold for export compliance review** at minimum; escalate to legal if policy or risk warrants. |
| **One or more Conditional** | **Hold for export compliance review** or **enhanced due diligence** until resolved; then reassess. |
| **All No** | **No escalation.** May proceed per standard process (subject to screening/classification/license requirements). |

Document the recommendation in the assessment note: "No escalation" / "Hold for export compliance review" / "Escalate to legal/compliance counsel," with optional placeholders for "Escalated to," date, and follow-up.

---

## 6. Cross-references

- **exchek-skill-risk-triage** references/escalation-best-practices.md: Section 4 (Red flags to assess), Section 1 (Hold vs Escalate). Use for consistent language and escalation chain.
- **exchek-skill-csl** references/denied-party-screening-best-practices.md: Section 5 (Red Flag Assessment), Section 4.5 (Hit Disposition), §29 ownership and the 50% Affiliates Rule.
- **15 C.F.R. § 762.6:** Retention; assessment records should be retained per program and regulation.
- **Live current text:** `mcp__exchek__ecfr_full_text` (`part: "732"`, `contains: "Supplement No. 3"`).

---

## 7. Ownership and the BIS "50% Affiliates Rule" (§29 companion)

Red flag §29 (ownership by a listed party) now sits alongside the BIS **Affiliates Rule**:

- **What it is:** On **2025-09-30** BIS adopted an OFAC-style rule (90 FR — "Expansion of End-User Controls To Cover Affiliates of Certain Listed Entities," FR doc 2025-19001) under which any entity **≥ 50% owned, individually or in the aggregate, by one or more Entity List or MEU-List parties** is itself subject to the same Entity List / MEU restrictions — even if not separately listed.
- **Current status:** **Suspended** by BIS from **2025-11-10 through 2026-11-09** (FR doc 2025-19846). During the suspension the automatic 50% attribution is paused, **but the §29 affirmative duty to determine ownership and the diligence expectation remain in force**, and the Entity List overlap flags (§§ 24–25) still apply.
- **How to apply:** When you find any listed-party ownership, determine the aggregate percentage. If it reaches 50%, treat the affiliate as restricted (and note the suspension window so the user knows when the rule resumes). If ownership cannot be determined, treat it as a Yes/Conditional and escalate. This is screening/ownership guidance, not legal advice — recommend counsel for borderline ownership.
