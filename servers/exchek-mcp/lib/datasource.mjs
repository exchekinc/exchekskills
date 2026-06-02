// Regulatory data-source policy.
//
// The plugin exposes two MCP servers for live CFR text: the local-first "exchek"
// (this server, ecfr.gov direct) and the hosted "exchek-api" (api.exchek.us).
// A skill calls the regulatory_source tool to learn which to use. The mode comes
// from the EXCHEK_REGULATORY_SOURCE env (wired from the regulatory_source plugin
// config): "ask" (default — present the gate, API recommended), "local", or "api".

export const LOCAL_ROUTES = {
  server: "exchek",
  transport: "local stdio (www.ecfr.gov, cached on-machine)",
  get_part: "mcp__exchek__ecfr_get_part",
  part_arg_type: "string",
  search_part: "mcp__exchek__ecfr_search",
  search_title: null,
  sections: null,
  note: "Direct from www.ecfr.gov (primary), cached 24h locally. api.exchek.us mirror is used only as an automatic fallback if ecfr.gov is unreachable; the source used is recorded on every response.",
};

export const API_ROUTES = {
  server: "exchek-api",
  transport: "remote streamable-http (https://api.exchek.us/mcp, Cloudflare edge cache)",
  get_part: "mcp__exchek-api__get_ecfr_part",
  part_arg_type: "integer",
  search_part: "mcp__exchek-api__search_ecfr_part",
  search_title: "mcp__exchek-api__search_ecfr_title",
  sections: "mcp__exchek-api__get_ecfr_sections",
  note: "Hosted edge cache. Only CFR part numbers and search terms transit the API — never item descriptions, party names, or compliance results.",
};

// Tools that ALWAYS run on this local server regardless of the data-source choice.
export const ALWAYS_LOCAL = {
  sanitize_input: "mcp__exchek__sanitize_input",
  cui_gate: "mcp__exchek__cui_gate",
  validate_disclosure: "mcp__exchek__validate_disclosure",
  ecfr_currency_check: "mcp__exchek__ecfr_currency_check",
  csl_search: "mcp__exchek__csl_search",
  csl_sources: "mcp__exchek__csl_sources",
  audit_log: "mcp__exchek__audit_log",
  audit_verify: "mcp__exchek__audit_verify",
  report_to_docx: "mcp__exchek__report_to_docx",
};

const VALID_MODES = ["ask", "local", "api"];

/**
 * Resolve the regulatory-data-source policy from a raw env value.
 * Unknown / empty values fall back to "ask".
 * @param {string|undefined} envValue
 */
export function resolveRegulatorySource(envValue) {
  const raw = String(envValue || "ask").toLowerCase().trim();
  const mode = VALID_MODES.includes(raw) ? raw : "ask";
  return {
    mode,
    recommended: "api",
    ask: mode === "ask",
    routes: mode === "local" ? LOCAL_ROUTES : API_ROUTES,
    options: { local: LOCAL_ROUTES, api: API_ROUTES },
    always_local: ALWAYS_LOCAL,
    note:
      mode === "ask"
        ? "Source not pinned. Ask the user once which CFR data source to use, then reuse it for this run. Present: 'ExChek API MCP (recommended — fast, edge-cached)' or 'Local MCP (direct from ecfr.gov, cached on your machine)'. Use options.api or options.local accordingly. Only CFR part numbers and search terms transit the API."
        : `Source pinned to '${mode}' by plugin config (regulatory_source). Use routes without asking the user.`,
  };
}
