# Export Compliance Report Card

*Customer-facing compliance summary — CARFAX style. This report is designed to be shared with buyers, distributors, and partners as assurance that the transaction has been vetted under U.S. export control regulations. Fill every `{{PLACEHOLDER}}` with transaction and compliance data. Use "Not assessed" or "Not provided" when no data exists. Output is designed for conversion to .docx or .pages from the skill.*

---

## Report header

| | |
|---|---|
| **COMPLIANCE STATUS** | **{{COMPLIANCE_STATUS}}** |

| Field | Value |
|-------|--------|
| **Report no.** | {{REPORT_NUMBER}} |
| **Date issued** | {{DATE_ISSUED}} |
| **Valid through** | {{VALID_THROUGH_DATE}} |
| **Prepared by** | {{PREPARED_BY}} |
| **Company** | {{COMPANY_NAME}} |
| **Transaction / order ref** | {{TRANSACTION_REFERENCE}} |

---

## Section 1 — Transaction summary

| Field | Details |
|-------|---------|
| **Item / product** | {{ITEM_NAME_DESCRIPTION}} |
| **Model / part / SKU** | {{MODEL_PART_SKU}} |
| **Quantity** | {{QUANTITY}} |
| **Buyer / consignee** | {{BUYER_CONSIGNEE_NAME}} |
| **Buyer country** | {{BUYER_COUNTRY}} |
| **Ship-to destination** | {{SHIP_TO_DESTINATION}} |
| **Ultimate end user** | {{ULTIMATE_END_USER}} |
| **Stated end use** | {{STATED_END_USE}} |

---

## Section 2 — Compliance status overview

**Status: {{COMPLIANCE_STATUS}}**

{{COMPLIANCE_STATUS_EXPLANATION}}

*This is a plain-language explanation of what the compliance status means for this transaction. For PASS: "This transaction has been fully vetted and cleared for export under applicable U.S. regulations. No restrictions, holds, or conditions apply." For CONDITIONAL: "This transaction has been vetted and may proceed subject to the conditions noted below." For HOLD: "This transaction requires further review before it can proceed. Please see details below."*

---

## Section 3 — Classification check

| Check | Result |
|-------|--------|
| **Status** | {{CLASSIFICATION_CHECK_STATUS}} |
| **ECCN / classification** | {{ECCN_CLASSIFICATION}} |
| **Jurisdiction** | {{JURISDICTION}} (EAR / ITAR) |
| **What this means** | {{CLASSIFICATION_PLAIN_LANGUAGE}} |
| **Classification date** | {{CLASSIFICATION_DATE}} |
| **Classification memo ref** | {{CLASSIFICATION_MEMO_REF}} |

*Plain-language example for "What this means": "This item is classified as EAR99, meaning it is a commercial item not on the Commerce Control List and does not require an export license for most destinations." Or: "This item is classified under ECCN 5A992, a mass-market encryption item eligible for License Exception ENC."*

---

## Section 4 — Screening check

| Check | Result |
|-------|--------|
| **Status** | {{SCREENING_CHECK_STATUS}} |
| **Parties screened** | {{PARTIES_SCREENED}} |
| **Lists checked** | {{LISTS_CHECKED}} |
| **Result** | {{SCREENING_RESULT}} |
| **Screening date** | {{SCREENING_DATE}} |
| **What this means** | {{SCREENING_PLAIN_LANGUAGE}} |

*Plain-language example: "All parties to this transaction have been screened against U.S. government restricted-party lists. No matches were found." Or: "A potential match was identified and has been reviewed and resolved as a false positive (different individual/entity)."*

---

## Section 5 — License & authorization check

| Check | Result |
|-------|--------|
| **Status** | {{LICENSE_CHECK_STATUS}} |
| **Authorization type** | {{AUTHORIZATION_TYPE}} |
| **Details** | {{LICENSE_DETAILS}} |
| **What this means** | {{LICENSE_PLAIN_LANGUAGE}} |

*Authorization types: NLR (No License Required), License Exception [name], License [number], License Required — Not Yet Obtained.*

*Plain-language example: "No export license is required for this item to this destination (NLR). The item may be exported under the Export Administration Regulations without further authorization." Or: "This export is authorized under License Exception ENC § 740.17(b)(1) for mass-market encryption software."*

---

## Section 6 — Destination risk check

| Check | Result |
|-------|--------|
| **Status** | {{DESTINATION_CHECK_STATUS}} |
| **Destination** | {{DESTINATION_COUNTRY}} |
| **Risk level** | {{DESTINATION_RISK_LEVEL}} (Low / Medium / High) |
| **What this means** | {{DESTINATION_PLAIN_LANGUAGE}} |

*Plain-language example: "The destination country is a low-risk trade partner with no comprehensive embargoes or sanctions. Standard export procedures apply." Or: "The destination has elevated export control requirements. Specific license conditions apply and are documented above."*

---

## Section 7 — End-use / end-user verification

| Check | Result |
|-------|--------|
| **Status** | {{END_USE_CHECK_STATUS}} |
| **End use verified** | {{END_USE_VERIFIED}} (Yes / No / Partial) |
| **End user verified** | {{END_USER_VERIFIED}} (Yes / No / Partial) |
| **What this means** | {{END_USE_PLAIN_LANGUAGE}} |

*Plain-language example: "The stated end use is consistent with the product's intended commercial application. The end user has been verified as a legitimate commercial entity." Or: "End-use verification is pending additional documentation from the buyer."*

---

## Section 8 — Red-flag assessment

| Check | Result |
|-------|--------|
| **Status** | {{RED_FLAG_CHECK_STATUS}} |
| **Red flags identified** | {{RED_FLAGS_IDENTIFIED}} (None / Yes — see details) |
| **Resolution** | {{RED_FLAG_RESOLUTION}} |
| **What this means** | {{RED_FLAG_PLAIN_LANGUAGE}} |

*Plain-language example: "No red flags were identified for this transaction based on BIS 'Know Your Customer' guidance." Or: "A potential concern was identified regarding [factor] and has been reviewed and resolved. See conditions below."*

---

## Section 9 — Conditions & notes

*Complete when status is CONDITIONAL. Leave blank or "None" for PASS. For HOLD, list what must be resolved.*

{{CONDITIONS_AND_NOTES}}

*Examples:*
- *"Export authorized under License Exception ENC. Recipient must not re-export to embargoed destinations without separate authorization."*
- *"License application submitted [date]. Do not ship until license is granted."*
- *"End-use statement required from buyer before shipment. Expected by [date]."*

---

## Section 10 — Compliance checklist summary

*Quick-reference checklist for the recipient.*

| Check | Status |
|-------|--------|
| Item classified | {{CHECKLIST_CLASSIFIED}} |
| All parties screened | {{CHECKLIST_SCREENED}} |
| License / authorization confirmed | {{CHECKLIST_LICENSE}} |
| Destination risk assessed | {{CHECKLIST_DESTINATION}} |
| End use / end user verified | {{CHECKLIST_END_USE}} |
| Red-flag review complete | {{CHECKLIST_RED_FLAG}} |
| **Overall compliance status** | **{{COMPLIANCE_STATUS}}** |

---

## Section 11 — Validity and disclaimer

**Report validity:** This compliance report card is valid as of {{DATE_ISSUED}} through {{VALID_THROUGH_DATE}} ({{VALIDITY_PERIOD}}), unless regulatory changes, new screening data, or material changes to the transaction occur, in which case the exporter should update this report.

**Regulatory basis:** This report summarizes compliance vetting performed under the Export Administration Regulations (EAR), 15 C.F.R. Parts 730–774, and where applicable the International Traffic in Arms Regulations (ITAR), 22 C.F.R. Parts 120–130.

**Disclaimer:** This Export Compliance Report Card is provided as a summary of compliance vetting performed by the exporter. It is **not** a government-issued export license, certificate, or legal opinion. It does not bind any U.S. government agency. The exporter bears responsibility for the accuracy of the information and compliance determinations herein. Recipients should not construe this report as a guarantee of regulatory compliance. Questions about specific regulatory requirements should be directed to the exporter's compliance team or legal counsel.

**Recordkeeping:** The exporter should retain this report and supporting documentation per 15 C.F.R. § 762.6 (five-year retention) and their internal compliance program.

---

## Section 12 — AI Tool Usage & Regulatory Currency Disclosure

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
- **When uncertain:** When a CONDITIONAL or HOLD status rests on unresolved adjudications, do not proceed until the underlying source determinations are confirmed by a qualified reviewer.

---

**Prepared by:** _______________________  **Date:** ___________

**Approved by:** _______________________  **Title:** ___________  **Date:** ___________
