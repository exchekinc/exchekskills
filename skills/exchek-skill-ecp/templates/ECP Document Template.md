# Export Compliance Program (ECP)

*This template is aligned with BIS nine ECP elements and DDTC expectations where ITAR applies. Fill every `{{PLACEHOLDER}}` from company footprint, product mix, and risk profile. Use "Not provided" or "None" when no data exists. Output is designed for conversion to .docx or .pages from the skill. For guidance, see [references/ecp-best-practices.md](../references/ecp-best-practices.md).*

---

## Document control

| Field | Value |
|-------|--------|
| **Document title** | Export Compliance Program |
| **Company** | {{COMPANY_NAME}} |
| **Version** | {{ECP_VERSION}} |
| **Effective date** | {{EFFECTIVE_DATE}} |
| **Approved by** | {{APPROVED_BY}} |
| **Export Compliance Officer (ECO)** | {{ECO_NAME_TITLE}} |

---

## 1. Management commitment

{{MANAGEMENT_COMMITMENT_STATEMENT}}

The Company is committed to compliance with U.S. export control laws and regulations, including the Export Administration Regulations (EAR), 15 C.F.R. Parts 730–774, and, where applicable, the International Traffic in Arms Regulations (ITAR), 22 C.F.R. Parts 120–130. Senior management supports this Export Compliance Program (ECP) and designates adequate resources and authority to the Export Compliance Officer (ECO). The Company will not retaliate against personnel who report potential violations in good faith.

**Signatory:** {{SIGNATORY_NAME}}, {{SIGNATORY_TITLE}}

**Date:** {{SIGNATURE_DATE}}

---

## 2. Scope and applicability

**Scope:** {{SCOPE_DESCRIPTION}}

**Applicability:** This ECP applies to {{APPLICABILITY}} (e.g., all exports and reexports subject to the EAR; all exports of defense articles and services subject to the ITAR where applicable). Geography: {{COMPANY_FOOTPRINT}}. Product mix: {{PRODUCT_MIX_SUMMARY}}. Risk profile: {{RISK_PROFILE_SUMMARY}}.

---

## 3. Risk assessment

**Approach:** {{RISK_ASSESSMENT_APPROACH}}

The Company assesses export compliance risk based on product mix (e.g., ECCN spread, ITAR exposure), operations (destinations, channels), and customer/end-user profile. Risk is profiled as {{RISK_LEVELS}}. Re-assessment is triggered by: {{RISK_REASSESSMENT_TRIGGERS}} (e.g., new products, new destinations, material regulatory change, annual cycle).

**Owner:** {{RISK_ASSESSMENT_OWNER}}

---

## 4. Export authorization

**Classification:** The Company maintains written procedures for determining the jurisdiction (EAR vs. ITAR) and classification (ECCN or USML category) of items and technology. Classification is documented in a classification memo and retained per recordkeeping policy. See SOP: {{CLASSIFICATION_SOP_REF}}.

**License determination:** For each transaction, the Company determines the required authorization (No License Required, License Exception, or formal license) using the five determinative facts (classification, destination, end-user, end-use, conduct), the Commerce Country Chart, and General Prohibitions. Determinations are documented in a license determination memo. See SOP: {{LICENSE_DETERMINATION_SOP_REF}}.

**ITAR (if applicable):** {{ITAR_AUTHORIZATION_PARAGRAPH}}

---

## 5. Recordkeeping

The Company retains export compliance records in accordance with 15 C.F.R. Part 762: at least five years from the date of export or the last transaction under a license, whichever is later. Records are stored {{RECORD_STORAGE_LOCATION}} and are reproducible in their original form and legible. Records include: classification memos, license determinations, denied party screening results, export documentation (invoice blocks, SLI, AES/EEI data as applicable), and triage/escalation notes. See SOP: {{RECORDKEEPING_SOP_REF}}.

---

## 6. Training

Personnel whose activities touch export decisions receive role-appropriate training. Topics and frequency are defined in the Company’s training outline and schedule. Training is documented; attestation or certification is required as per internal policy. See {{TRAINING_OUTLINE_REF}}.

**Roles trained:** {{TRAINED_ROLES}}

**Frequency:** {{TRAINING_FREQUENCY}}

---

## 7. Audits

The Company conducts periodic internal reviews of export compliance, including classification accuracy, screening and license determination adequacy, and recordkeeping. Audits are performed {{AUDIT_FREQUENCY}}. Scope and remediation of findings are documented. External audits or assessments may be conducted as appropriate.

**Owner:** {{AUDIT_OWNER}}

---

## 8. Handling violations and corrective action

Potential violations are reported to the ECO and, as appropriate, to legal or compliance counsel. The Company will investigate, document, and remediate issues and consider whether a Voluntary Self-Disclosure (VSD) to BIS under 15 C.F.R. § 764.5 or to OFAC is warranted. Corrective action may include process updates, retraining, and discipline. Deliberate failure to disclose significant apparent violations is an aggravating factor in enforcement; good-faith VSD is a mitigating factor.

---

## 9. ECP manual maintenance

This ECP and the linked SOPs are maintained by {{ECP_MAINTENANCE_OWNER}}. Updates are versioned and communicated to relevant personnel. A full review is conducted {{ECP_REVIEW_CYCLE}} (e.g., annually or upon material change in regulations, product mix, or operations).

---

## 10. Company-specific / additional elements

{{COMPANY_SPECIFIC_ELEMENTS}}

*Examples: deemed export controls; encryption (e.g., ENC (b)(1)) annual reporting to BIS if applicable; ITAR-specific compliance elements; third-party or customer compliance expectations.*

---

## 11. Integration with systems (optional)

*Complete when the Company uses CRM, ERP, or agent tools for export compliance.*

**Screening** is performed {{SCREENING_POINT_IN_PROCESS}} using {{SCREENING_TOOL_OR_SYSTEM}}. Results are retained and linked to the transaction (e.g., in {{CRM_OR_ERP_NAME}}).

**Classification** is performed {{CLASSIFICATION_POINT_IN_PROCESS}} using {{CLASSIFICATION_TOOL_OR_PROCESS}}. Classification memos are stored {{CLASSIFICATION_RECORD_LOCATION}} and referenced on the transaction.

**License determination** is performed {{LICENSE_DETERMINATION_POINT}} and documented; the determination is attached or linked to the transaction.

**Triage and escalation** notes (hold/escalate) are documented and attached to the transaction; workflow or tasks in {{CRM_OR_ERP_NAME}} support ECO/legal review and release.

{{INTEGRATION_ADDITIONAL_NOTES}}

---

## 12. AI Tool Usage & Regulatory Currency Disclosure

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
- **Human review required.** This document is assistive; final decisions are the responsibility of the user and their designated Export Compliance Officer or legal counsel.
- **When uncertain:** When ECP element design touches areas flagged by recent enforcement (VSD scoping, mitigation-agreement compliance, repeat-violation aggravator), engage counsel before adoption.

---

*This document does not constitute legal advice. Consult qualified export compliance counsel for adoption and ongoing compliance.*
