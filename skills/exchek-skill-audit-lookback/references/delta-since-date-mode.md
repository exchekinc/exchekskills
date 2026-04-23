# Delta-since-date mode

Use this mode when the user wants to audit **only what changed** between a baseline date (`as_of_date`) and today — instead of a cold full re-check. Typical callers: quarterly compliance reviews, post–Entity-List-update sweeps, VSD-scope validation, M&A rep-and-warranty updates, post-AC/S-IFR checks.

---

## Inputs

- `as_of_date` — ISO 8601 `YYYY-MM-DD`, the baseline date. Must be in the past. Flag (but do not block) if older than ~5 years.
- `current_as_of` — defaults to today's date in ISO 8601.
- Historical rows with **prior** ECCN, destination, license/exception used, and screening result at-time-of-export. Columns missing at-time-of-export data can still be re-checked, but tag the finding with `baseline-state: unknown` so downstream consumers know the delta is inferred, not measured.

---

## Delta sources — what to check between baseline and today

Cast a wide net. The following are the canonical sources to compare between `as_of_date` and `current_as_of`:

### 1. Party-list deltas (per row's party[ies])

- Entity List (Supplement No. 4 to Part 744) additions after `as_of_date`.
- Military End User (MEU) List (Supplement No. 7 to Part 744) additions after `as_of_date`.
- Unverified List (Supplement No. 6 to Part 744) additions.
- Denied Persons List additions.
- OFAC SDN / non-SDN sanctions additions.
- OFAC 50% Rule triggers (direct or aggregated ownership that crossed 50% since baseline).
- BIS 50% Affiliates Rule (Sept 29, 2025 — **stayed Nov 10, 2025 – Nov 9, 2026**): if the stay has lifted by `current_as_of`, flag aggregated-ownership matches; if still stayed, note as "prudent-diligence flag (stay in effect)."
- DoD 1260H list additions (separate from CSL).
- UFLPA Entity List additions.
- FCC Covered List additions.

Finding type: `party-now-listed`. Record the list name and the publication/effective date of the listing relative to `as_of_date`.

### 2. ECCN / USML classification deltas

- Changes to specific ECCNs in Supplement No. 1 to Part 774 (CCL) between baseline and today — including AC/S IFRs, § 734.9 FDP expansions, and any ECCN-specific technical-parameter revisions.
- USML Targeted Revisions Final Rule (**Sept 15, 2025**): 15 of 21 categories revised + new § 121.0 definitions. If any row's ECCN/USML entry sits in a revised category and `as_of_date` is before 2025-09-15, flag for re-classification.
- § 734.9 FDP Rule expansions (Huawei / SMIC / etc.).

Finding type: `eccn-revised` or `usml-revised`. Record prior citation, current citation, and Federal Register publication date.

### 3. License / exception deltas

- License Requirement column changes on the Country Chart (Supplement No. 1 to Part 738) — a destination that was NLR for the row's reasons-for-control may now require a license.
- License Exception scope narrowing (e.g., tightened eligibility for STA, ENC, GBS, TSR).
- General Prohibitions (Part 736) changes applicable to the row.
- ITAR § 126.1 proscribed-destination additions.
- ITAR exemption changes (§ 126.4, § 126.5, § 126.6, § 126.7 AUKUS Final Rule effective **Dec 30, 2025**).

Finding type: `license-now-required`, `exception-scope-changed`, or `exemption-now-unavailable`. Record prior vs current state + effective date.

### 4. OFAC GL / sanctions-regime deltas

- Russia / Belarus / Iran / North Korea / Cuba / Syria / Venezuela regime changes between baseline and today.
- General License expirations (e.g., GL 55E, GL 134B — check current status against `current_as_of`).
- New EO or prohibitions (e.g., EO 14157 cartel FTO designations, Feb 20, 2025 → 18 USC 2339B exposure).

Finding type: `ofac-gl-expired` / `new-prohibition` / `regime-change`. Record citation + effective date.

### 5. Enforcement-precedent deltas (contextual only)

If a row's pattern now maps to a post-baseline marquee enforcement case (see `references/enforcement-precedents.md`) that did not exist at `as_of_date`, you MAY note the precedent in the finding's description in a single sentence. Do not treat this as dispositive.

### 6. Non-CFR rule deltas

- BIS published guidance or FAQ memoranda (e.g., Huawei Ascend GP10 presumption, May 13, 2025).
- DDTC CJs or advisory opinions with general applicability.
- OFAC enforcement releases or advisories.

Finding type: `guidance-change`. Cite the document and date.

---

## What NOT to flag in delta mode

- Rows whose rule state is unchanged from `as_of_date` to `current_as_of`. Tabulate them in the report's "Rows reviewed — no delta" count but do not emit a finding.
- Determinations you are re-confirming under unchanged rules — those belong in **full re-check mode**.
- Internal process findings (e.g., "recordkeeping gap") — those belong to the recordkeeping skill, not delta-mode.

---

## Finding shape (machine-readable, per JSON schema)

```json
{
  "severity": "high",
  "type": "party-now-listed",
  "row_id": "TX-000188",
  "description": "Consignee 'Acme Widgets GmbH' added to Entity List on 2025-09-16 (after baseline 2025-06-01). Re-adjudicate and halt further shipments pending licensing review.",
  "baseline_state": { "screening_result": "no_hits", "screened_on": "2025-05-28" },
  "current_state": { "screening_result": "el_hit", "list": "EL", "list_effective": "2025-09-16" },
  "citation": "15 CFR § 744 Supp. No. 4",
  "effective_date": "2025-09-16",
  "theme_match": "china-diversion-direct"
}
```

Severity bands (delta mode):
- **High** — party-now-listed (any list); license-now-required for an already-shipped transaction; exemption-now-unavailable; new prohibition directly applicable.
- **Medium** — ECCN-revised where the row's prior classification may no longer match; exception scope narrowing.
- **Low** — guidance changes that warrant documentation but do not clearly change the row's outcome.

---

## Determination object (top-level, per JSON schema)

```json
{
  "type": "audit_lookback",
  "mode": "delta_since_date",
  "baseline_as_of": "2025-06-01",
  "current_as_of": "2026-04-22",
  "rows_reviewed": 412,
  "rows_with_deltas": 27,
  "findings": [ /* as above */ ]
}
```

For full re-check mode, set `"mode": "full_recheck"` and omit `baseline_as_of` / `rows_with_deltas`.

---

## Report-building guidance

When building the Self-Audit Report .md, include:

- A clear top-of-report banner: "Delta-since-date audit: baseline `as_of_date` {{AS_OF_DATE}} → current {{CURRENT_AS_OF}}. Rows reviewed: {{ROWS_REVIEWED}}; rows with deltas: {{ROWS_WITH_DELTAS}}."
- Findings grouped by delta source (party-list, ECCN/USML, license, OFAC, enforcement context, guidance).
- For each finding, show `prior → current` state side-by-side with the effective date and citation.
- A closing note: "Rows not shown in the findings table had no rule-state delta between baseline and current date. Run **full re-check mode** if a cold audit is also needed."

---

## Input-hash implications

The `as_of_date` MUST be included in the input-hash canonicalization so that re-running the skill with the same inputs AND the same baseline produces the same hash. Without this, reproducibility fails. Ordering reminder: keys sorted alphabetically, whitespace trimmed, empty strings omitted.
