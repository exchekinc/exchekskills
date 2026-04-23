# Denied Party Screening Transaction Record

*This template is structured for BIS, OFAC, and DDTC audit readiness. Fill every `{{PLACEHOLDER}}` with screening inputs, API results, and adjudication. Use "Not provided" or "None" only when no data exists. Output is designed for conversion to .docx or .pages from the skill.*

---

## Document header

**PRIVILEGED AND CONFIDENTIAL — EXPORT COMPLIANCE — DENIED PARTY SCREENING RECORD.** This document is privileged and confidential whether or not it was prepared by an attorney.  
*[Include this line if prepared with or at the direction of legal counsel: Prepared with or at the direction of legal counsel.]*

| Field | Value |
|-------|--------|
| **Transaction / Screening record no.** | {{DOC_NUMBER}} |
| **Date of screen** | {{DATE_OF_SCREEN}} |
| **Screened by** | {{SCREENED_BY}} |
| **Reviewed / approved by** | {{REVIEWED_APPROVED_BY}} |
| **Transaction reference** | {{TRANSACTION_REFERENCE}} |

---

## Section 1 — Counterparty / screened party information

| Field | Details |
|-------|---------|
| **Entity / individual name (legal)** | {{ENTITY_LEGAL_NAME}} |
| **DBA / trade name / aliases known** | {{ALIASES}} |
| **Country of incorporation / citizenship** | {{COUNTRY}} |
| **Registered address** | {{REGISTERED_ADDRESS}} |
| **Government / tax ID number** | {{GOV_TAX_ID}} |
| **Date of birth** (individuals) | {{DOB}} |
| **Nationality / passport number** (individuals) | {{NATIONALITY_PASSPORT}} |
| **Role in transaction** | {{ROLE_IN_TRANSACTION}} |
| **Counterparty type** | {{COUNTERPARTY_TYPE}} |
| **Parent company / ownership** | {{PARENT_OWNERSHIP}} |
| **Ownership source verified** | {{OWNERSHIP_SOURCE}} |
| **Date ownership verified** | {{DATE_OWNERSHIP_VERIFIED}} |

**Supporting KYC documentation on file:** {{KYC_DOCUMENTATION}}

---

## Section 2 — Transaction / search details

| Field | Details |
|-------|---------|
| **Item / product / service description** | {{ITEM_DESCRIPTION}} |
| **Destination country** | {{DESTINATION_COUNTRY}} |
| **Stated end-use** | {{STATED_END_USE}} |
| **Transaction value** | {{TRANSACTION_VALUE}} |
| **License / license exception applicable** | {{LICENSE_OR_EXCEPTION}} |
| **Shipping method** | {{SHIPPING_METHOD}} |

*For CSL search-only: this section may reflect the search context (e.g. name searched, sources requested).*

---

## Section 3 — Screening execution

| Field | Details |
|-------|---------|
| **Screening tool used** | {{SCREENING_TOOL}} |
| **Tool version / data set date** | {{TOOL_VERSION_DATA_DATE}} |
| **Fuzzy logic / match threshold** | {{FUZZY_THRESHOLD}} |
| **Date / time of screen** | {{SCREEN_DATE_TIME}} |

**Lists screened:** {{LISTS_SCREENED}}

*BIS Affiliates Rule ownership screen:* {{AFFILIATES_RULE_OWNERSHIP}}

**Overall screening result:** {{OVERALL_RESULT}}

---

## Section 4 — Hit adjudication

*Complete for each hit returned. For CSL API searches, document each result from the API; for full DPS, complete primary/secondary identifier comparison and disposition.*

{{HIT_ADJUDICATION}}

*If no hits:* No matching records found. Proceed to Section 7 certification.

---

## Section 5 — Red flag assessment

| Red flag | Present? | Notes |
|----------|----------|-------|
| Counterparty unfamiliar with product / end-use inconsistent with product | {{RED_FLAG_1}} | {{RED_FLAG_1_NOTES}} |
| Unwilling to provide end-use or end-user information | {{RED_FLAG_2}} | {{RED_FLAG_2_NOTES}} |
| Unusual payment structure | {{RED_FLAG_3}} | {{RED_FLAG_3_NOTES}} |
| Shipping destination differs from buyer country without explanation | {{RED_FLAG_4}} | {{RED_FLAG_4_NOTES}} |
| Delivery instructions inconsistent with normal practice | {{RED_FLAG_5}} | {{RED_FLAG_5_NOTES}} |
| Requests removal of technical documentation | {{RED_FLAG_6}} | {{RED_FLAG_6_NOTES}} |
| No established business history or web presence | {{RED_FLAG_7}} | {{RED_FLAG_7_NOTES}} |
| Country subject to comprehensive embargo or heightened controls | {{RED_FLAG_8}} | {{RED_FLAG_8_NOTES}} |
| Item controlled for AT, NP, CB, or MT reasons | {{RED_FLAG_9}} | {{RED_FLAG_9_NOTES}} |
| Refused to provide ownership or identification | {{RED_FLAG_10}} | {{RED_FLAG_10_NOTES}} |
| Known or suspected minority ownership by Entity/MEU/SDN (BIS Red Flag 29) | {{RED_FLAG_11}} | {{RED_FLAG_11_NOTES}} |
| Other | {{RED_FLAG_OTHER}} | {{RED_FLAG_OTHER_NOTES}} |

**Total red flags identified:** {{TOTAL_RED_FLAGS}}

**Red flag disposition:** {{RED_FLAG_DISPOSITION}}

---

## Section 6 — AI Tool Usage & Regulatory Currency Disclosure

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
- **When uncertain:** When a screening hit adjudication is uncertain or the Affiliates Rule / OFAC 50% analysis is ambiguous, engage counsel or trigger a transaction hold before shipment.

---

## Section 7 — Screening certification and final disposition

**SCREENING CERTIFICATION**

I, the undersigned, hereby certify that:

1. The denied party screening described in this record was conducted using current versions of the lists identified in Section 3 as of the date of screen.
2. All hits were adjudicated using primary and secondary identifiers as documented in Section 4.
3. A red flag assessment was completed in Section 5.
4. The final disposition stated below reflects my good-faith professional judgment based on applicable regulations as of the date hereof.
5. This record will be retained for a minimum of five (5) years per 15 C.F.R. § 762.6 and in its original form per 15 C.F.R. § 762.4.

**FINAL DISPOSITION:** {{FINAL_DISPOSITION}}

**Screened by**

Signature: _________________________  Date: {{SCREENED_BY_DATE}}  
Printed name: {{SCREENED_BY_NAME}}  Title: {{SCREENED_BY_TITLE}}

**Compliance officer approval**

Signature: _________________________  Date: {{COMPLIANCE_OFFICER_DATE}}  
Printed name: {{COMPLIANCE_OFFICER_NAME}}  Title: {{COMPLIANCE_OFFICER_TITLE}}

---

## Section 8 — Rescreening history log

*For recurring counterparties, attach to master Party Record. Each transaction or periodic rescreening adds a row.*

| Screen date | Screened by | Tool used | Lists version date | Result | Disposition | Ref. no. |
|-------------|-------------|-----------|--------------------|--------|-------------|----------|
| {{RESCREENING_LOG}} |

---

## Record retention and disclaimer

- **BIS (15 C.F.R. Part 762):** Retain records as required by 15 C.F.R. 762.2 and 762.6. Typical retention: at least five years from the date of the transaction or export.
- **OFAC:** Blocking and rejecting transactions must be reported to OFAC (for SDN matches involving blockable property) within 10 days of the action when required.
- This document is a screening record and is not a substitute for legal or compliance advice. Verify any determination against official Federal Register and agency sources (Commerce, State, Treasury). CSL data is updated daily (~5:00 AM EST/EDT); this report reflects the screening output at the time of the search.

---

*Powered by ExChek, Inc.*
