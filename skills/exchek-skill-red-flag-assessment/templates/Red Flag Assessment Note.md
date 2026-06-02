# Red Flag Assessment Note

*This template documents the BIS "Know Your Customer" red-flag assessment for a party/transaction. Fill every `{{PLACEHOLDER}}` with assessment inputs and checklist results. Use "Not provided" or "None" when no data exists. Output is designed for conversion to .docx or .pages from the skill.*

---

## Document header

**PRIVILEGED AND CONFIDENTIAL — EXPORT COMPLIANCE — RED FLAG ASSESSMENT.**

| Field | Value |
|-------|--------|
| **Assessment record no.** | {{ASSESSMENT_RECORD_NUMBER}} |
| **Date of assessment** | {{DATE_OF_ASSESSMENT}} |
| **Prepared by** | {{PREPARED_BY}} |
| **Party / counterparty** | {{PARTY_COUNTERPARTY}} |
| **Transaction reference** | {{TRANSACTION_REFERENCE}} |

---

## Section 1 — Party and transaction summary

| Field | Details |
|-------|---------|
| **Party / counterparty (name, role)** | {{PARTY_NAME_AND_ROLE}} |
| **Country** | {{PARTY_COUNTRY}} |
| **Destination country** | {{DESTINATION_COUNTRY}} |
| **Item / product (brief)** | {{ITEM_DESCRIPTION}} |
| **Stated end use** | {{STATED_END_USE}} |
| **Stated end user** | {{STATED_END_USER}} |
| **Screening / classification refs (optional)** | {{SCREENING_CLASSIFICATION_REFS}} |

---

## Section 2 — Red flag checklist

*Per BIS Know Your Customer (Supplement No. 3 to 15 C.F.R. Part 732), as amended (29 enumerated flags as of 2025-11-12 — confirm against the live text). Present? = Yes / No / Conditional. Parentheticals are the official Supp. 3 flag numbers. **Group A applies to every transaction; Groups B and C apply only when the item/customer has that dimension** — mark the group N/A otherwise.*

**Group A — General diversion indicators (§§ 1–12)**

| Red flag | Present? | Notes |
|----------|----------|-------|
| Reluctant to offer end-use information (§1) | {{RF_A1_PRESENT}} | {{RF_A1_NOTES}} |
| Product capabilities don't fit the buyer's line of business (§2) | {{RF_A2_PRESENT}} | {{RF_A2_NOTES}} |
| Product incompatible with the destination's technical level (§3) | {{RF_A3_PRESENT}} | {{RF_A3_NOTES}} |
| Little or no business background (§4) | {{RF_A4_PRESENT}} | {{RF_A4_NOTES}} |
| Cash for an expensive item when terms call for financing (§5) | {{RF_A5_PRESENT}} | {{RF_A5_NOTES}} |
| Unfamiliar with performance characteristics but still wants it (§6) | {{RF_A6_PRESENT}} | {{RF_A6_NOTES}} |
| Declines routine installation, training, or maintenance (§7) | {{RF_A7_PRESENT}} | {{RF_A7_NOTES}} |
| Vague delivery dates or out-of-the-way destinations (§8) | {{RF_A8_PRESENT}} | {{RF_A8_NOTES}} |
| A freight forwarder is listed as the final destination (§9) | {{RF_A9_PRESENT}} | {{RF_A9_NOTES}} |
| Abnormal shipping route for the product/destination (§10) | {{RF_A10_PRESENT}} | {{RF_A10_NOTES}} |
| Packaging inconsistent with shipment method/destination (§11) | {{RF_A11_PRESENT}} | {{RF_A11_NOTES}} |
| Evasive about domestic use vs. export vs. reexport (§12) | {{RF_A12_PRESENT}} | {{RF_A12_NOTES}} |

**Group B — Hardware / semiconductor / computing & destination diversion (§§ 13–23)** — Applicable? {{GROUP_B_APPLICABLE}} (Yes / No / N/A)

| Red flag | Present? | Notes |
|----------|----------|-------|
| 9x515 / "600 series" parts ordered in quantities inconsistent with known end items; or D:5 reexport indicators (§§13–14) | {{RF_B_600SERIES_PRESENT}} | {{RF_B_600SERIES_NOTES}} |
| Advanced-node IC / supercomputer indicators; technology mismatch; uncertain ultimate user for SME (§§15–21) | {{RF_B_ADVCOMPUTE_PRESENT}} | {{RF_B_ADVCOMPUTE_NOTES}} |
| License-history uncertainty, incl. service/install/upgrade requests (§22) | {{RF_B_LICHISTORY_PRESENT}} | {{RF_B_LICHISTORY_NOTES}} |
| Servicing an item altered after export for a more advanced controlled end use (§23) | {{RF_B_ALTERED_PRESENT}} | {{RF_B_ALTERED_NOTES}} |

**Group C — Entity List / FDP / AI weights & ownership (§§ 24–29)** — Applicable? {{GROUP_C_APPLICABLE}} (Yes / No / N/A)

| Red flag | Present? | Notes |
|----------|----------|-------|
| New customer's management overlaps an Entity List entity, or assumed operations of a listed entity (§§24–25) | {{RF_C_ELOVERLAP_PRESENT}} | {{RF_C_ELOVERLAP_NOTES}} |
| Entity List / SME FDP product-scope (foreign-produced Cat 3B item with ≥1 IC) (§26) | {{RF_C_FDP_PRESENT}} | {{RF_C_FDP_NOTES}} |
| End user is a facility physically connected to an advanced-node IC fab (§27) | {{RF_C_FACILITY_PRESENT}} | {{RF_C_FACILITY_NOTES}} |
| IaaS/computing to train an AI model with ECCN 4E091 weights for a non-Supp.5(a) destination (§28) | {{RF_C_AIWEIGHTS_PRESENT}} | {{RF_C_AIWEIGHTS_NOTES}} |
| Known ownership by an Entity List / MEU party — determine ownership %; apply the 50% Affiliates Rule (§29) | {{RF_C_OWNERSHIP_PRESENT}} | {{RF_C_OWNERSHIP_NOTES}} |
| Other (specify) | {{RF_OTHER_PRESENT}} | {{RF_OTHER_NOTES}} |

**Total red flags identified (Yes):** {{TOTAL_RED_FLAGS_YES}}

**Conditional items (count):** {{TOTAL_CONDITIONAL}}

**Source of red-flag list used:** {{RED_FLAG_SOURCE}} (e.g., "live ecfr_full_text pull, Supp. 3 as amended 2025-11-12" or "curated checklist fallback")

---

## Section 3 — Overall assessment

**Overall assessment:** {{OVERALL_ASSESSMENT}} (No red flags / Red flags present / Conditional)

**Rationale:**

{{OVERALL_ASSESSMENT_RATIONALE}}

---

## Section 4 — Escalation recommendation

**Recommendation:** {{ESCALATION_RECOMMENDATION}} (No escalation / Hold for export compliance review / Escalate to legal/compliance counsel)

| Field | Details |
|-------|---------|
| **Escalated to (name, title or firm)** | {{ESCALATED_TO_NAME_TITLE}} |
| **Date of escalation** | {{ESCALATION_DATE}} |
| **Follow-up actions** | {{FOLLOW_UP_ACTIONS}} |
| **Transaction status** | {{TRANSACTION_STATUS}} |

**Escalation summary (when applicable):**

{{ESCALATION_SUMMARY}}

---

## Section 5 — AI Tool Usage & Regulatory Currency Disclosure

**AI-assisted analysis — not legal advice.** This document was drafted by an AI agent (**ExChek skill `{{SKILL_NAME}}` v`{{SKILL_VERSION}}`**, commit `{{SKILL_COMMIT_SHA7}}`) running on **`{{MODEL_ID}}`** via **`{{PLATFORM}}`** on **`{{ISO8601_DATETIME_UTC}}`**. Inputs provided by the user are summarized in this document (input hash: `{{INPUT_HASH_SHA256_FIRST12}}`). All regulatory citations, classifications, screenings, and recommendations were generated by the AI and **require review by a qualified export compliance professional or licensed counsel before any reliance, filing, or transaction action**. No attorney-client relationship or legal opinion is created by this output.

**Privacy-settings attestation.** The user attested at the start of this session that their AI platform is configured to opt out of data collection and model training — tier: **`{{AI_PLATFORM_TIER}}`** (e.g., Anthropic Claude Enterprise / OpenAI ChatGPT Enterprise / Google Workspace with training off / consumer tier with training disabled). Attested by: **`{{ATTESTER_NAME_OR_USER_ID}}`** at **`{{ATTESTATION_ISO8601}}`**.

**Regulatory currency.**

- **eCFR / ExChek API:** Regulatory text for Parts **`{{CFR_PARTS_CITED}}`** pulled at **`{{ECFR_PULLED_AT_ISO8601}}`** via **`{{DATA_SOURCE}}`** (ExChek API `api.exchek.us` primary, `ecfr.gov` fallback).
- **External lists queried (if any):**
  - **Trade.gov CSL:** queried at **`{{CSL_QUERIED_AT_ISO8601}}`** (lists: `{{CSL_SOURCES_QUERIED}}`; per-list source timestamps: `{{CSL_SOURCE_TIMESTAMPS}}`).
  - **DoD 1260H list:** retrieved **`{{DOD_1260H_DATE}}`**.
  - **UFLPA Entity List:** retrieved **`{{UFLPA_LIST_DATE}}`**.
  - **Other lists / sources:** `{{OTHER_LIST_SOURCES_AND_DATES}}`.
- **External guidance cited** (agency memos, FAQs, enforcement notices, Federal Register notices not yet codified): cited by date inline in the report body (e.g., "BIS GP10 Guidance, May 13, 2025").

**Prompt-injection and integrity log.** Any user-supplied content flagged by the skill's untrusted-input handling (zero-width characters, bidi overrides, homoglyph tokens, embedded override attempts) is recorded in §`{{CAVEATS_SECTION}}` of this report. Items flagged in this run: **`{{INJECTION_ATTEMPTS_COUNT}}`** (details in `{{CAVEATS_SECTION}}` or "None observed").

**Regulatory drift caveat.** U.S. export controls change frequently (AC/S IFR, Entity List additions, OFAC actions, USML revisions, GL issuances). Any determination in this document older than **30 days** should be re-run before reliance. For historical lookbacks, use the `exchek-audit-lookback` skill's delta-since-date mode to re-check against current rules.

**Human-in-the-loop confirmation.** The user explicitly confirmed inputs and the preliminary determination(s) at **`{{HITL_CONFIRMATION_ISO8601}}`** before this document was finalized (see §`{{HITL_SECTION}}` or conversation log). Without that confirmation, this document should not be treated as final.

**Machine-readable sibling.** This report is accompanied by a structured JSON sibling (`{{REPORT_BASENAME}}.json`) containing the same determinations, citations, and metadata in a parseable form for downstream CRM/SIEM/GRC ingestion.

**Skill-specific disclosures.**
- **Tool:** {{SKILL_NAME}} (ExChek).
- **Human review required.** This memo is assistive; final determination is the responsibility of the user and their designated Export Compliance Officer or legal counsel.
- **When uncertain:** When any BIS Red Flag is present and unresolved, do not proceed — obtain counsel or BIS advisory opinion before shipment.

---

## Retention and certification

This red-flag assessment should be retained per the organization's export compliance program and, where applicable, 15 C.F.R. § 762.6 (five-year retention). Final approval of any disposition rests with the Export Compliance Officer or legal counsel as defined in the organization's escalation chain.

**Reviewed by:** _______________________  **Date:** ___________

**Approved by (if required):** _______________________  **Date:** ___________
