# Enforcement Precedents — 2024–2026 marquee cases

Curated list of recent U.S. export-control and sanctions enforcement actions that are useful context for risk triage, red-flag assessment, ECP design, and audit lookback. Each entry cites the date, agency, penalty, and theme, with a primary link.

**Use this as assistive context only.** Quote the case name and primary URL when writing findings; do not invent facts. If the user wants to rely on a specific case for a determination, recommend counsel review.

Currency: cases through April 2026. Re-verify before citing in a filed memo.

---

## BIS / OEE export-control enforcement

### Cadence Design Systems — $140M+ (July 2025)
DOJ/BIS coordinated penalty for 2015–2021 exports of semiconductor design technology and software to a PRC entity tied to an Entity-Listed military university. Largest EDA enforcement action on record.
- Theme: **China diversion; EDA/EDA tools**; **Entity List**; **semiconductor ecosystem**.
- Lesson: "know your customer" must go beyond the direct buyer to downstream military-university affiliations.
- Primary: BIS press release and DOJ filing (July 2025).

### Applied Materials — $252M (2025)
Second-largest BIS penalty ever; diversion of chip-manufacturing equipment through a South Korean subsidiary to an Entity-Listed PRC company.
- Theme: **SME diversion via subsidiary**; **Entity List**; **FDP**.
- Lesson: subsidiary controls and transshipment monitoring are critical.
- Primary: BIS press release (2025).

### Seagate Technology — $300M (April 2023, ongoing compliance program 2025)
Hard-drive exports to Huawei in violation of the FDP Rule. Settlement remains the single largest administrative penalty in BIS history.
- Theme: **FDP Rule**; **Huawei / Entity List**.
- Lesson: FDP applies worldwide; U.S. content analysis alone is insufficient.

---

## OFAC sanctions enforcement

### GVA Capital — $215.9M (June 12, 2025)
Largest OFAC settlement since Binance ($4.3B, Nov 2023). Venture-capital firm managed assets tied to SDN Suleyman Kerimov through nominee structures. OFAC rejected corporate-formality defenses.
- Theme: **Gatekeeper** (VC/PE); **OFAC 50% Rule**; **nominee/indirect ownership**; **substance over form**.
- Lesson: investment advisers and asset managers are now a named enforcement priority.
- Primary: [OFAC enforcement release](https://ofac.treasury.gov/recent-actions/20250612) (verify URL).

### Former U.S. Official Attorney Settlement — $1.092M (December 9, 2025)
Former U.S. government official, acting as a fiduciary for a trust linked to a sanctioned oligarch, settled for facilitating prohibited dealings.
- Theme: **Gatekeeper** (attorneys, fiduciaries, trust managers); **personal liability**.
- Lesson: fiduciary role plus Russia-nexus trust is a red-flag combination OFAC will pursue.

### Binance — $4.3B (November 2023, settlement continues through 2025–2026 monitorship)
Combined DOJ / FinCEN / OFAC / CFTC action for sanctions violations and BSA failures. Largest financial-sector penalty of the decade.
- Theme: **Crypto exchange**; **sanctions screening failures**; **BSA/AML**.
- Lesson: volume and automation do not excuse sanctions-screening gaps.

### Microsoft — $3.3M (April 2023)
Export and sanctions violations via subsidiaries; voluntary self-disclosure credit applied.
- Theme: **VSD mitigation**; **subsidiary-transaction controls**.
- Lesson: VSD materially reduces penalties, even for Fortune-10 companies.

### SAP SE — ~$222M (January 2024, multi-agency)
Iran/Cuba/Russia sanctions and export violations via partners and subsidiaries.
- Theme: **Partner / distributor controls**; **global enterprise sanctions**.

### 3M Company — $9.6M (March 2024)
Exports to Iran through foreign subsidiary. VSD credit applied.
- Theme: **Iran**; **subsidiary**; **VSD**.

---

## DDTC / ITAR enforcement

### Honeywell — $13M (2025)
Consent agreement involving repeat ITAR violations despite voluntary disclosure — aggravating factors (repeat violations, transfers to proscribed destination [China], Significant Military Equipment) limited mitigation.
- Theme: **Repeat-violation aggravator**; **§ 126.1 proscribed-destination exports**; **SME**; **ITAR VSD limits**.
- Lesson: a VSD does not automatically guarantee mitigation if aggravating factors exist.
- Primary: DDTC consent agreement (2025).

### L3Harris — (consent agreement, prior years; widely cited in 2025)
Cited as a cautionary example on **insufficient VSD scope**. Scoping a VSD too narrowly can leave later-discovered violations outside the disclosure's mitigation umbrella.
- Theme: **VSD scoping**; **aggregation of findings**.
- Lesson: scope VSDs broadly enough to cover the full factual pattern.

---

## CFIUS enforcement

### T-Mobile — $60M (April 2023, enforcement trend continues 2025)
Largest CFIUS civil penalty at the time. Violations of a CFIUS mitigation agreement (unauthorized access to sensitive data).
- Theme: **Mitigation agreement compliance**; **covered business data access**.

### Record-setting CFIUS penalties (2024–2025, Treasury rulemaking in force)
Treasury's 2024 rulemaking (effective 2025) raised CFIUS civil-penalty maximums to the greater of $5M or the transaction value, and expanded subpoena authority. Expect larger numbers in coming years.

---

## Themes to use in risk triage

| Theme | What it flags | Relevant skills |
|---|---|---|
| **China diversion (direct)** | Direct sale or re-export to Entity-Listed PRC counterparty | `risk-triage`, `red-flag-assessment`, `csl` |
| **Subsidiary / transshipment diversion** | Sale to non-China counterparty with China-nexus affiliates or distribution | `partner-compliance`, `audit-lookback` |
| **FDP Rule exposure** | Foreign-manufactured item with U.S. technology nexus | `license`, `classify` |
| **Entity List affiliate (post-Sept 2025 rule, now stayed)** | ≥50% aggregated ownership by listed party | `risk-triage`, `csl`, `red-flag-assessment` |
| **Gatekeeper role** | User / counterparty is an attorney, VC/PE, investment adviser, fiduciary, family office, freight forwarder | `risk-triage`, `ecp` |
| **OFAC 50% Rule (indirect ownership)** | Target ≥50% owned (directly or aggregated) by SDN | `csl`, `risk-triage` |
| **VSD scoping error** | Discovery of issues outside a prior VSD scope | `audit-lookback`, `ecp` |
| **ITAR § 126.1 / SME** | Transfer or attempted transfer to proscribed destination, or Significant Military Equipment | `jurisdiction`, `license`, `risk-triage` |
| **Repeat violation aggravator** | Organization has prior violations not remediated | `ecp`, `audit-lookback` |
| **Mitigation-agreement non-compliance** | Prior CFIUS, BIS, or OFAC agreement terms not being met | `ecp` |
| **Russia sanctions / GL windowing** | Transaction touches Russia; GL 55E / 134B / etc. applicability | `license`, `country-risk` |

---

## How to use in reports

When a skill's risk analysis matches one of the themes above, the report's narrative may reference the precedent in a single sentence like:

> "This pattern is substantively similar to the {CASE NAME} ({YEAR}, {PENALTY}) enforcement action cited for {THEME}; see exchekskills enforcement-precedents.md. This is assistive context only and does not constitute a legal conclusion about the current transaction."

Do not quote the precedent as dispositive. Do not compare the current transaction's facts to the precedent's facts beyond the theme label.
