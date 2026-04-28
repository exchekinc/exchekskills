// Validate the canonical AI Tool Usage & Currency Disclosure block that every
// ExChek report carries (schema v1.0.0 — see references/ai-disclosure-and-currency.md).

const REQUIRED_FIELDS = [
  "skill_name",
  "skill_version",
  "model_id",
  "platform",
  "generated_at_iso8601",
  "input_hash_sha256",
  "regulatory_currency",
  "hitl_confirmed_at_iso8601",
];

export function validateDisclosure(disclosure) {
  const missing = [];
  const warnings = [];
  if (!disclosure || typeof disclosure !== "object") {
    return { ok: false, missing: REQUIRED_FIELDS, warnings: ["disclosure_not_object"] };
  }
  for (const f of REQUIRED_FIELDS) {
    if (disclosure[f] === undefined || disclosure[f] === null || disclosure[f] === "") {
      missing.push(f);
    }
  }
  if (disclosure.regulatory_currency && typeof disclosure.regulatory_currency === "object") {
    const rc = disclosure.regulatory_currency;
    if (!rc.sources || !Array.isArray(rc.sources) || rc.sources.length === 0) {
      warnings.push("regulatory_currency.sources_missing");
    } else {
      for (const s of rc.sources) {
        if (!s.name || !s.fetched_at_iso8601) warnings.push("regulatory_currency.source_incomplete");
      }
    }
  }
  if (disclosure.generated_at_iso8601) {
    const ageMs = Date.now() - new Date(disclosure.generated_at_iso8601).getTime();
    if (ageMs > 30 * 24 * 60 * 60 * 1000) warnings.push("determination_older_than_30d");
  }
  return { ok: missing.length === 0, missing, warnings };
}
