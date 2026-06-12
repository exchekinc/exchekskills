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

## 1. Credentials — required before anything else

**Payment first, then variables.** The contract, the variable schema, and the
template are the paid product: do not fetch the contract, build a payload, or
offer to approximate the document until credentials are in hand. Without
them, the only correct moves are (a) the purchase/sign-in links below or
(b) the free local flow.

Resolution order, by environment:

1. **OAuth connector (preferred on claude.ai and Claude Desktop)** — the
   connector at `https://api.exchek.us/mcp/pro` authenticates with the user's
   ExChek account: adding it pops a sign-in window at app.exchek.us (one-time
   email link) and a consent page. If the user's client has that connector,
   the paid tools just work — no key handling at all. If the user is on
   claude.ai/Desktop without it, tell them: Settings → Connectors → add
   `https://api.exchek.us/mcp/pro` → sign in.
2. Plugin setting `enterprise_api_key` (the bundled `exchek-api` MCP
   connection then carries it automatically as its Authorization header —
   Claude Code, Cursor).
3. `EXCHEK_API_KEY` environment variable.
4. Ask the user to paste a key (`exk_live_…`). Never echo it back, never write
   it to any file, and never include it in the memo or the JSON sibling.
   **Never ask the user to paste a key on claude.ai/Desktop — use option 1.**

No account/key? Send the user to **https://app.exchek.us** — sign in, buy
prepaid report credits at $1 each (one-time Stripe purchase, they choose the
quantity), and either connect via OAuth (option 1) or use the API key shown
once at purchase. The dashboard also handles top-ups, key rotation, connected
apps, and render history. Each successful render uses one credit.

## 2. Variable contract (Enterprise — key required)

Fetch the contract at render time — do not rely on a memorized field list:

- MCP: `mcp__exchek-api__get_classification_pdf_contract` (the connection must
  carry the `Authorization: Bearer <key>` header — automatic when
  `enterprise_api_key` is set in plugin settings)
- REST: `GET https://api.exchek.us/pdf/classification/contract` with
  `Authorization: Bearer <key>`

Both return **402 with a purchase link** when the key is missing, invalid, or
out of credits. Fetching the contract does not consume a credit — only
successful renders do.

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

## 3. Render — ALWAYS draft first, finalize only on explicit approval

The render tool has two modes, and the order is not optional:

1. **Draft preview (free).** Call `mcp__exchek-api__create_classification_pdf`
   with `variables` = the full payload AND `draft: true` (REST:
   `POST /pdf/classification?draft=1`). Drafts are watermarked "DRAFT — NOT
   FINAL" on every page, consume **no credit**, and are never stored. Deliver
   the draft to the user (see **Delivery** below) and walk them through a
   review checklist before anything is charged:
   - document-control block — company name, CAGE code attribution, preparer,
     addressee, dates
   - the item line and the final ECCN/jurisdiction
   - exhibits — is the governing drawing/spec carried as a populated exhibit?
   - parties and screening rows
   - any render warnings from the response
2. **Edit loop.** Apply the user's corrections to the payload and re-render
   drafts as many times as needed — they're free. Do not nickel-and-dime the
   review: ask for all corrections, fix, show one corrected draft.
3. **Finalize (1 credit).** Only after the user explicitly approves — ask
   exactly: "Finalize the memorandum? This renders the clean official PDF and
   uses 1 credit ($1)." — call the tool again WITHOUT `draft`. Never render a
   final the user hasn't seen a draft of, and never re-render a final for an
   error you could have caught at draft (that's a second charge the draft
   step exists to prevent).

**Delivery.** Every render response (draft and final) includes a one-hour
download link (`https://api.exchek.us/pdf/dl/<token>`) in the summary text,
alongside the PDF bytes as a base64 `application/pdf` resource:

- **File-writing surfaces (Claude Code, Cowork, Desktop, Cursor):** decode the
  resource and save it — finals as
  `ExChek-Memorandum-YYYY-MM-DD-ShortItemName.pdf` in the report folder,
  drafts with a `-DRAFT` suffix. Delete draft files after finalization.
- **claude.ai web chat:** the chat surface **cannot accept the PDF resource** —
  do not try to attach it; give the user the download link instead and say it
  expires in one hour. Final memoranda are additionally retained in their
  dashboard vault (app.exchek.us → Documents) when document storage is on —
  mention that as the durable copy.

**REST equivalent** (any environment, or when the user runs it themselves):

```bash
# draft preview — free, watermarked
curl -X POST "https://api.exchek.us/pdf/classification?draft=1" \
  -H "Authorization: Bearer $EXCHEK_API_KEY" \
  -H "Content-Type: application/json" \
  -d @memo-variables.json -o memorandum-DRAFT.pdf

# final — after explicit approval; consumes 1 credit
curl -X POST https://api.exchek.us/pdf/classification \
  -H "Authorization: Bearer $EXCHEK_API_KEY" \
  -H "Content-Type: application/json" \
  -d @memo-variables.json -o memorandum.pdf
```

Delete any temporary variables file afterward. If you cannot write files,
give the user the filled payload and the exact curl commands with a
placeholder where their key goes — never the key inline.

## 4. Errors

| Status | Meaning | What to do |
|---|---|---|
| `402` | No key, unrecognized key, or **credits exhausted** (contract or render) | Relay the `purchase` link from the response body (https://app.exchek.us); offer the free local flow as the fallback |
| `403` | Key suspended | Tell the user to contact matt@exchek.us |
| `400` | Missing/invalid variables | The response lists the exact fields — fix the payload and retry (failed renders are not charged) |
| `413` | Payload over 1 MB | Trim oversized free-text fields |
| `5xx` | Render service hiccup | Retry once; if it persists, fall back to the free flow and report the error |

A successful render returns the PDF directly (REST) or as an embedded
resource plus a one-hour download link (MCP); only successful **final**
renders consume a credit — drafts are always free.
