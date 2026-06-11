# Official PDF memorandum rendering (ExChek Enterprise)

Renders the branded 21-page ExChek classification memorandum as a PDF. This is
the paid alternative (Option 2, $1 per report) to the free local .docx flow —
the analysis itself is always free; only the finished, audit-ready PDF document
is metered.

**Privacy:** rendering is stateless — the service substitutes your variables
into the template, returns the PDF, and discards everything. Nothing is stored;
logs record only the customer name and byte counts. Still, variables transit
api.exchek.us, so **never use this for CUI, classified, or § 126.18-restricted
matter** — use the free local flow (Option 1) for those.

## 1. API key

Resolution order:

1. Plugin setting `enterprise_api_key` (the bundled `exchek-api` MCP connection
   then carries it automatically as its Authorization header).
2. `EXCHEK_API_KEY` environment variable.
3. Ask the user to paste a key (`exk_live_…`). Never echo it back, never write
   it to any file, and never include it in the memo or the JSON sibling.

No key? Send the user to **https://api.exchek.us/enterprise/checkout** — a
one-time Stripe purchase of prepaid report credits at $1 each (they choose the
quantity). The key is issued on the confirmation page immediately after
payment and shown exactly once. Each successful render uses one credit.

## 2. Variable contract

Fetch the contract at render time — do not rely on a memorized field list:

- MCP (free, no auth): `mcp__exchek-api__get_classification_pdf_contract`
- REST (free, no auth): `GET https://api.exchek.us/pdf/classification/contract`

The contract documents every variable: name, type (string / array / enum /
boolean section flag), whether it is required, and allowed enum values.
Required fields: `COMPANY_NAME`, `DOC_NUMBER`, `VERSION`, `ITEM_NAME_MODEL`,
`DATE`, `FINAL_JURISDICTION`, `FINAL_ECCN`, `FROM_NAME_TITLE`.

Mapping from the approved classification (the same content that fills the
12-section free report):

| Memo content | Contract variable groups |
|---|---|
| Cover / document control | `COMPANY_NAME`, `DOC_NUMBER`, `VERSION`, `DATE`, `TO_RECIPIENT`, `FROM_NAME_TITLE`, `PREPARED_BY_COUNSEL`, `DISTRIBUTION_LIST`, `DOCUMENT_CONTROLLER` |
| Executive summary + risk posture | `FINAL_JURISDICTION`, `FINAL_ECCN`, `OVERALL_RISK_LEVEL`, `RISK_LEVEL_CLASS`, `EXEC_SUMMARY_RISKS_AND_RECOMMENDATIONS`, `PRIMARY_RISK_DRIVERS`, `ENFORCEMENT_EXPOSURE` |
| Item description / specs | `ITEM_NAME_MODEL`, `ITEM_TYPE`, `MODEL_PART_SKU`, `MANUFACTURER_DEVELOPER`, `TECHNICAL_FUNCTION`, `KEY_TECHNICAL_PARAMETERS` |
| Order of Review (Steps 1–6) | `STEP1_*` … `STEP6_*`, plus `SD_*` for the "specially designed" catch/release analysis |
| Encryption / software (if any) | `ENC_*` (gated by `ENC_PRESENT`), `SW_*`, `TECH_DATA_*` |
| License determination | `LICENSE_*`, `REASONS_FOR_CONTROL`, `LICENSE_COUNTRY_TABLE`, `LICENSE_EXCEPTIONS_TABLE`, `REEXPORT_LICENSE` |
| Screening & red flags | `PARTIES_SCREENED`, `RESTRICTED_LISTS_CHECKED`, `SCREEN_*`, `SCREENING_NARRATIVE`, `RED_FLAGS_*`, `RED_FLAG_RESOLUTIONS` |
| Risk matrix & mitigations | `RISK_MATRIX`, `MITIGATION_ACTIONS`, `AGGRAVATING_FACTORS`, `MITIGATING_FACTORS` |
| AI disclosure & currency | `AI_*`, `REG_DATA_SOURCES`, `REGULATORY_CURRENCY_*` — same canonical content as [ai-disclosure-and-currency.md](ai-disclosure-and-currency.md) |
| Certification / version control | `PRIMARY_ANALYST_*`, `SME_*`, `LEGAL_REVIEW_NAME_TITLE`, `DATE_OF_LEGAL_APPROVAL`, `VERSION_HISTORY`, `NEXT_REVIEW_DATE` |

Table variables (`RISK_MATRIX`, `VERSION_HISTORY`, `RED_FLAGS_*`, `*_TABLE`,
`MITIGATION_ACTIONS`, …) take **arrays of row objects** — the contract shows
each row's shape with example values, and the service numbers rows itself.
CSS-class fields are enums (`risk-low | risk-medium | risk-high |
risk-critical`; `flag-yes | flag-no | flag-unknown | flag-na`) — copy them
exactly as the contract lists them. Use `"Not provided"` / `"None specified"`
only where no data exists — same rule as the free template.

## 3. Render

**MCP** (preferred when the `exchek-api` connection has the Authorization
header configured — it does automatically when `enterprise_api_key` is set in
plugin settings):

- Tool: `mcp__exchek-api__create_classification_pdf`
- Argument: `variables` = the full payload object
- Returns a text summary plus the PDF as a base64 `application/pdf` embedded
  resource — decode and save it.

**REST** (any environment, or when the user pasted a key in chat):

```bash
curl -X POST https://api.exchek.us/pdf/classification \
  -H "Authorization: Bearer $EXCHEK_API_KEY" \
  -H "Content-Type: application/json" \
  -d @memo-variables.json -o memorandum.pdf
```

Save as `ExChek-Memorandum-YYYY-MM-DD-ShortItemName.pdf` in the user's report
folder. Delete any temporary variables file afterward. If you cannot write
files (Claude web), give the user the filled payload and the exact curl
command to run themselves — with a placeholder where their key goes, never the
key inline.

## 4. Errors

| Status | Meaning | What to do |
|---|---|---|
| `402` | No key, unrecognized key, or **credits exhausted** | Relay the `purchase` link from the response body (https://api.exchek.us/enterprise/checkout) |
| `403` | Key suspended | Tell the user to contact matt@exchek.us |
| `400` | Missing/invalid variables | The response lists the exact fields — fix the payload and retry (failed renders are not charged) |
| `413` | Payload over 1 MB | Trim oversized free-text fields |
| `5xx` | Render service hiccup | Retry once; if it persists, fall back to the free flow and report the error |

A successful render returns the PDF directly (REST) or as an embedded
resource (MCP); only successful renders consume a credit.
