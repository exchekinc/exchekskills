#!/usr/bin/env node
/**
 * ExChek local-first MCP server (v3.0.0).
 *
 * Tools exposed:
 *   - ecfr_get_part            Fetch (and cache) eCFR part structure from ecfr.gov.
 *   - ecfr_search              Substring search inside a cached part.
 *   - ecfr_currency_check      Compute regulatory-currency age and drift warning.
 *   - csl_search               Live Trade.gov Consolidated Screening List search.
 *   - csl_sources              List available CSL source abbreviations.
 *   - sanitize_input           Strip / flag zero-width, bidi, homoglyph, injection.
 *   - validate_disclosure      Validate the canonical AI-disclosure block (schema v1.0.0).
 *   - audit_log                Append HMAC-chained event to ${CLAUDE_PLUGIN_DATA}/audit.jsonl.
 *   - audit_verify             Verify the chain has not been tampered with.
 *   - audit_tail               Read the last N audit lines.
 *   - report_to_docx           Convert a markdown report to .docx + .json sibling.
 *   - cui_gate                 Record the CUI/classified gate response.
 *
 * Local-first: only outbound calls are to ecfr.gov (regulatory data) and
 * data.trade.gov (CSL screening). No ExChek-hosted dependency.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import * as ecfr from "./lib/ecfr.mjs";
import * as csl from "./lib/csl.mjs";
import { sanitize, isBlocking } from "./lib/sanitize.mjs";
import * as audit from "./lib/audit.mjs";
import { validateDisclosure } from "./lib/disclosure.mjs";
import { convert as docxConvert } from "./lib/docx.mjs";

const VERSION = "3.0.0";

const TOOLS = [
  {
    name: "ecfr_get_part",
    description:
      "Fetch eCFR part structure (15 CFR or 22 CFR) from ecfr.gov, cached locally for 24h. Use for ECCN classification, license determination, embargoes, USML jurisdiction. Supported parts: 121 (USML), 734, 738, 740, 742, 744, 746, 748, 762, 772, 774 (CCL).",
    inputSchema: {
      type: "object",
      properties: {
        part: { type: "string", description: "Part number, e.g. '774'." },
        force_refresh: { type: "boolean", description: "Bypass cache. Default false." },
      },
      required: ["part"],
    },
  },
  {
    name: "ecfr_search",
    description: "Substring search inside a cached eCFR part. Returns matching node identifiers and labels.",
    inputSchema: {
      type: "object",
      properties: {
        part: { type: "string" },
        query: { type: "string" },
      },
      required: ["part", "query"],
    },
  },
  {
    name: "ecfr_currency_check",
    description: "Given an ISO-8601 fetched-at timestamp, compute age in days and flag if > 30 days (regulatory-drift caveat).",
    inputSchema: {
      type: "object",
      properties: { fetched_at_iso8601: { type: "string" } },
      required: ["fetched_at_iso8601"],
    },
  },
  {
    name: "csl_search",
    description:
      "Search the U.S. Consolidated Screening List (Trade.gov). Live API. Requires the trade_gov_api_key plugin config. Supports name (with fuzzy_name), sources, types, countries, address fields, offset, size (max 50).",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        fuzzy_name: { type: "boolean" },
        sources: { type: "string", description: "Comma-separated, e.g. 'DPL,EL,SDN'" },
        types: { type: "string" },
        countries: { type: "string", description: "ISO alpha-2 codes, comma-separated." },
        address: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        postal_code: { type: "string" },
        full_address: { type: "string" },
        offset: { type: "number" },
        size: { type: "number" },
      },
    },
  },
  {
    name: "csl_sources",
    description: "List the available CSL source abbreviations (DPL, EL, SDN, ...).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "sanitize_input",
    description:
      "Strip zero-width, bidi, control, and homoglyph characters from untrusted input (party names, ECCNs, paths, free text). Returns {cleaned, flags[]}. Skills MUST run this on every user-supplied field before reasoning.",
    inputSchema: {
      type: "object",
      properties: {
        input: { type: "string" },
        field: {
          type: "string",
          description: "Optional field type for stricter checks: 'eccn' | 'country_iso2' | 'path' | 'text'.",
        },
      },
      required: ["input"],
    },
  },
  {
    name: "validate_disclosure",
    description: "Validate the AI Tool Usage & Currency Disclosure block (schema v1.0.0) embedded in every ExChek report.",
    inputSchema: {
      type: "object",
      properties: { disclosure: { type: "object" } },
      required: ["disclosure"],
    },
  },
  {
    name: "audit_log",
    description:
      "Append a tamper-evident event to the local audit log (HMAC-chained). Use after every skill flow milestone: gate-passed, hitl-confirmed, report-generated, csl-queried, etc.",
    inputSchema: {
      type: "object",
      properties: {
        event_type: { type: "string" },
        skill: { type: "string" },
        tool: { type: "string" },
        actor: { type: "string" },
        summary: { type: "string" },
        metadata: { type: "object" },
      },
      required: ["event_type"],
    },
  },
  {
    name: "audit_verify",
    description: "Verify the local audit log has not been tampered with. Returns {ok, lines, broken_at, reason}.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "audit_tail",
    description: "Return the last N audit entries (default 50).",
    inputSchema: {
      type: "object",
      properties: { n: { type: "number", description: "Default 50, max 1000." } },
    },
  },
  {
    name: "report_to_docx",
    description:
      "Convert a markdown report to a client-ready .docx with a .json sibling. Markdown is the report body produced by a skill; metadata is the optional canonical AI-disclosure / json-output-schema object.",
    inputSchema: {
      type: "object",
      properties: {
        markdown: { type: "string" },
        metadata: { type: "object" },
        output_dir: { type: "string" },
        basename: { type: "string" },
      },
      required: ["markdown"],
    },
  },
  {
    name: "cui_gate",
    description:
      "Record the user's response to the CUI/classified/§126.18 gate. Required before any skill collects substantive content. Returns {pass, route} where route is 'cloud' or 'on_prem'.",
    inputSchema: {
      type: "object",
      properties: {
        cui: { type: "string", description: "'yes' | 'no' | 'unknown'" },
        classified: { type: "string", description: "'yes' | 'no' | 'unknown'" },
        s126_18: { type: "string", description: "'yes' | 'no' | 'unknown'" },
        platform_tier: { type: "string", description: "User attestation, e.g. 'claude-enterprise', 'workspace-training-off'." },
        attester: { type: "string", description: "Person attesting; included in audit log." },
      },
      required: ["cui", "classified", "s126_18"],
    },
  },
];

const HANDLERS = {
  async ecfr_get_part(args) {
    const out = await ecfr.getPart(args.part, { force_refresh: !!args.force_refresh });
    return { source: out.source, part: out.part, title: out.title, fetched_at: out.fetched_at, stale: out.stale, structure: out.body };
  },
  async ecfr_search(args) {
    return ecfr.searchPart(args.part, args.query);
  },
  async ecfr_currency_check(args) {
    return ecfr.regulatoryCurrencyAge(args.fetched_at_iso8601);
  },
  async csl_search(args) {
    return csl.search(args || {});
  },
  async csl_sources() {
    return csl.listSources();
  },
  async sanitize_input(args) {
    const result = sanitize(args.input, { field: args.field });
    return { ...result, blocking: isBlocking(result.flags) };
  },
  async validate_disclosure(args) {
    return validateDisclosure(args.disclosure);
  },
  async audit_log(args) {
    return audit.append(args);
  },
  async audit_verify() {
    return audit.verify();
  },
  async audit_tail(args) {
    const n = Math.min(Math.max(parseInt(args?.n ?? 50, 10) || 50, 1), 1000);
    return audit.tail(n);
  },
  async report_to_docx(args) {
    return docxConvert(args || {});
  },
  async cui_gate(args) {
    const yes = (v) => String(v || "").toLowerCase() === "yes";
    const unknown = (v) => String(v || "").toLowerCase() === "unknown";
    const anyYes = yes(args.cui) || yes(args.classified) || yes(args.s126_18);
    const anyUnknown = unknown(args.cui) || unknown(args.classified) || unknown(args.s126_18);
    const route = anyYes ? "on_prem" : "cloud";
    const pass = !anyYes && !anyUnknown;
    await audit.append({
      event_type: "cui_gate",
      summary: `cui=${args.cui} classified=${args.classified} s126_18=${args.s126_18} tier=${args.platform_tier || "unset"} attester=${args.attester || "unset"}`,
      metadata: { ...args, route, pass },
    });
    return {
      pass,
      route,
      guidance: anyYes
        ? "STOP. Do not process this content through cloud AI. Route to on-premises guidance: https://docs.exchek.us/docs/cui-classified"
        : anyUnknown
        ? "Brief the user on CUI / classified / § 126.18 categories before proceeding. See https://docs.exchek.us/docs/cui-classified."
        : "Cloud processing permitted under the attested platform tier.",
    };
  },
};

const server = new Server(
  { name: "exchek-mcp", version: VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  const handler = HANDLERS[name];
  if (!handler) {
    return { isError: true, content: [{ type: "text", text: `Unknown tool: ${name}` }] };
  }
  try {
    const out = await handler(args || {});
    return { content: [{ type: "text", text: JSON.stringify(out, null, 2) }] };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: `${name} failed: ${err.message}` }],
    };
  }
});

const transport = new StdioServerTransport();
server.connect(transport).catch((e) => {
  process.stderr.write(`exchek-mcp fatal: ${e.message}\n`);
  process.exit(1);
});
