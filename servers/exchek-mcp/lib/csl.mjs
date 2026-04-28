// Trade.gov Consolidated Screening List wrapper.
// Live API call (screening must be live by definition). Key is supplied via
// userConfig.trade_gov_api_key, exported by Claude Code as
// CLAUDE_PLUGIN_OPTION_TRADE_GOV_API_KEY, and never logged.

const BASE = "https://data.trade.gov/consolidated_screening_list/v1";

function key() {
  const k = process.env.CLAUDE_PLUGIN_OPTION_TRADE_GOV_API_KEY || process.env.TRADE_GOV_API_KEY;
  if (!k) {
    throw new Error(
      "Missing Trade.gov API key. Set it in /plugin config (trade_gov_api_key) or " +
      "TRADE_GOV_API_KEY in your environment. Get a free key at https://developer.trade.gov."
    );
  }
  return k;
}

async function fetchWithTimeout(url, ms = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "subscription-key": key(),
        "User-Agent": "exchek-mcp/3.0",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Trade.gov ${res.status} ${res.statusText}: ${body.slice(0, 300)}`);
    }
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const ALLOWED_PARAMS = new Set([
  "name", "fuzzy_name", "sources", "types", "countries",
  "address", "city", "state", "postal_code", "full_address",
  "offset", "size",
]);

export async function search(params) {
  const url = new URL(`${BASE}/search`);
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null || v === "") continue;
    if (!ALLOWED_PARAMS.has(k)) continue;
    url.searchParams.set(k, String(v));
  }
  if (!url.searchParams.get("name") && !url.searchParams.get("full_address")) {
    throw new Error("CSL search requires at least 'name' or 'full_address'.");
  }
  const queriedAt = new Date().toISOString();
  const json = await fetchWithTimeout(url.toString());
  return {
    queried_at: queriedAt,
    query: Object.fromEntries(url.searchParams),
    total: json.total ?? null,
    sources_used: json.sources_used ?? null,
    results: json.results ?? [],
  };
}

export async function listSources() {
  return fetchWithTimeout(`${BASE}/sources`);
}
