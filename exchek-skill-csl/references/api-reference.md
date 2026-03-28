# Consolidated Screening List (CSL) API reference

This reference describes how to call the Trade.gov Consolidated Screening List API for the ExChek CSL skill. **Authentication:** You need a free API key (subscription key) from [developer.trade.gov](https://developer.trade.gov). See [references/api-key-setup.md](api-key-setup.md). The portal may require the key as a query parameter (e.g. `subscription_key` or `api_key`) or as an HTTP header; check the [API details page](https://developer.trade.gov/api-details#api=consolidated-screening-list&operation=search) for the exact name and location.

## Endpoints

### Search

**Method:** `GET`  
**URL:** `https://data.trade.gov/consolidated_screening_list/v1/search`

Optional query parameters are appended (e.g. `?name=Acme&fuzzy_name=true&sources=SDN,EL`). Include the user's API key as required by the portal (query param or header).

### Sources

**Method:** `GET`  
**URL:** `https://data.trade.gov/consolidated_screening_list/v1/sources`

Returns the list of available screening list sources (e.g. abbreviations and full names) that can be used with the search endpoint’s **sources** parameter. Use the same API key as for search. Call this when the user wants to see which lists are available or to resolve source names to abbreviations.

## Request parameters

Support all of the following. Only include parameters the user provides or that are needed for the search.

| Parameter      | In    | Required | Type   | Description |
|----------------|-------|----------|--------|-------------|
| **name**       | query | false    | string | Searches against the **name** and **alt_names** fields. |
| **fuzzy_name** | query | false    | string | Set `fuzzy_name=true` to use fuzzy name matching. Fuzzy matching returns usable results without exact spelling. **Works only with `name`.** The API filters out common words: co, company, corp, corporation, inc, incorporated, limited, ltd, mrs, ms, mr, organization, sa, sas, llc, university, univ. Example: "Water Corporation" returns the same results as "Water". |
| **sources**   | query | false    | string | Limit search to specific lists by **Source Abbreviation** (comma-separated). See list below. |
| **types**      | query | false    | string | Limit to entries of the specified **type**(s). |
| **countries**  | query | false    | string | Only entities whose country, nationalities, or citizenships match. Use **ISO alpha-2** country codes. Multiple countries (plural) separated by commas; API returns one country (singular) per entity. Country fields are in the addresses and ids arrays. |
| **address**    | query | false    | string | Searches the **address** field in the addresses array. |
| **city**       | query | false    | string | Searches the **city** field in the addresses array. |
| **state**      | query | false    | string | Searches the **state** field in the addresses array. |
| **postal_code**| query | false    | string | Searches the **postal** field in the addresses array. |
| **full_address** | query | false | string | Searches **address**, **city**, **state**, and **postal_code** together. If present, individual **address**, **city**, **state**, and **postal_code** parameters are ignored. |
| **offset**     | query | false    | short  | Offset from the first result (max 1000). |
| **size**       | query | false    | short  | Number of results to return (max 50). |

### Source abbreviations (sources parameter)

**Department of Commerce – Bureau of Industry and Security (BIS):**
- **DPL** — Denied Persons List  
- **EL** — Entity List  
- **MEU** — Military End User  
- **UVL** — Unverified List  

**Department of State – Bureau of International Security and Non-Proliferation:**
- **ISN** — Nonproliferation Sanctions  

**Department of State – Directorate of Defense Trade Controls:**
- **DTC** — ITAR Debarred  

**Department of Treasury – Office of Foreign Assets Control:**
- **CAP** — Correspondent Account or Payable-Through Account Sanctions (CAPTA)  
- **CMIC** — Non-SDN Chinese Military-Industrial Complex Companies List  
- **FSE** — Foreign Sanctions Evaders  
- **MBS** — Non-SDN Menu-Based Sanctions List (NS-MBS List)  
- **PLC** — Palestinian Legislative Council List  
- **SSI** — Sectoral Sanctions Identifications List  
- **SDN** — Specially Designated Nationals  

## Example request

```
GET https://data.trade.gov/consolidated_screening_list/v1/search?name=Acme&fuzzy_name=true&sources=SDN,EL&size=10
```

Add the API key as required by the portal (e.g. `&subscription_key=YOUR_KEY` or via header).

## Response

The API returns JSON with a results array. Each result typically includes name, alt_names, addresses (with address, city, state, postal, country), source list(s), type, and other entity fields. Use the **source** (and any score field when using fuzzy_name) to summarize and cite which list(s) each hit comes from.

## Backup / downloadable files

When the API is unavailable or the user needs offline data, direct them to the official CSL page:

**https://www.trade.gov/consolidated-screening-list**

That page provides:
- **CSL Search Engine** (web UI, works with the API; supports fuzzy name search)
- **CSL downloadable files** — JSON, CSV, and TSV (ASCII) for the full consolidated list. The download files include a **source** column indicating which federal agency’s list each entry comes from.

Use the JSON (or CSV/TSV) download as a backup if the API cannot be called. Data is updated automatically every day at 5:00 AM EST/EDT.

## Data and updates

- The CSL consolidates **eleven** export screening lists from the Departments of Commerce, State, and Treasury.
- Data is updated automatically every day at **5:00 AM EST/EDT**.
- For compliance decisions, users must verify against official Federal Register publications and the original lists maintained by the agencies.

## Compliance disclaimer

CSL results are for **screening support only**. They do not replace legal or compliance advice. Users must verify any determination against official Federal Register and agency sources before acting.
