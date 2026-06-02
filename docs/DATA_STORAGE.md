# Data storage — ExChek Skills

Where the plugin keeps data, how long it keeps it, and how to wipe it.

## The two folders that matter

### 1. The plugin data directory (managed by the plugin)

This is where the plugin caches regulations and writes its audit log.

| OS | Path |
|---|---|
| macOS (Cowork) | `~/Library/Application Support/Claude-3p/plugins/data/exchekskills-*/` |
| macOS (Claude Code) | `~/.claude/plugins/data/exchekskills-*/` |
| Windows (Cowork) | `%LOCALAPPDATA%\Claude-3p\plugins\data\exchekskills-*\` |
| Windows (Claude Code) | `%LOCALAPPDATA%\.claude\plugins\data\exchekskills-*\` |

What's inside:

| File / folder | What it is | When to clear it |
|---|---|---|
| `node_modules/` | Dependencies for the local MCP server | Cleared automatically on plugin update if `package.json` changed |
| `ecfr/` | Cached eCFR part structures (24h TTL, refreshed from ecfr.gov on demand) | Safe to delete any time; will refetch |
| `audit.jsonl` | HMAC-chained log of every skill milestone | **Keep.** This is your compliance evidence. |
| `audit.key` | HMAC key used to seal the audit log | **Keep.** Owner-only `0600`. |

### 2. Your reports folder (chosen by you)

Default: `~/Documents/ExChek-Reports`. You can change this in `/plugin config exchekskills` under **Default report folder**.

What's inside: pairs of `ExChek-<skill>-<date>-<short>.docx` and `.json`. The `.json` follows the canonical schema v1.0.0 and is what your CRM, SIEM, or GRC tool should ingest.

## Retention

Nothing is deleted by the plugin. You decide.

A reasonable SMB retention policy looks like:

| Artifact | Keep for | Why |
|---|---|---|
| Classification memos (.docx + .json) | 5 years from last shipment | 15 CFR Part 762 |
| Screening records | 5 years from screening date | Same |
| Audit log (`audit.jsonl`) | 5 years rolling | Establishes you actually ran the screenings on the dates the memos claim |

If you uninstall the plugin without `--keep-data`, the plugin data directory is deleted. **Your reports folder is never touched** — those files are yours.

## Encryption

- File permissions are owner-only (`0600`) on POSIX and ACL-restricted on Windows. Other accounts on the same machine cannot read.
- Whole-disk encryption (FileVault, BitLocker) is on you. Turn it on. It's free and it's the single biggest thing you can do to protect compliance records on a laptop.
- API keys (Trade.gov key, audit HMAC key) are stored in your OS keychain — macOS Keychain, Windows Credential Manager. Cowork and Claude Code handle this automatically when the user-config field is marked sensitive.

## Wiping data

To clear regulatory cache:

```
rm -rf ~/Library/Application\ Support/Claude-3p/plugins/data/exchekskills-*/ecfr
```

To start a fresh audit chain (this **breaks** the existing chain — only do it if you're sure):

```
mv audit.jsonl audit.jsonl.archive-$(date +%Y%m%d)
mv audit.key audit.key.archive-$(date +%Y%m%d)
```

The plugin will generate a new key and start a new chain on next use.

## What does not leave your machine

- Item descriptions, party names, file content, ECCNs, and your compliance results stay on your machine. The only thing sent to a screening provider is the **party name/terms you choose to screen**, to `data.trade.gov`, when you explicitly screen.
- Regulatory text is **fetched, not sent**: the plugin pulls public CFR parts from `www.ecfr.gov` (Local MCP) or, if you choose the **ExChek API MCP** at the data-source gate (or the local server falls back when ecfr.gov is down), from `api.exchek.us`. Either way the request carries only a **CFR part number or search term** — never your item or party data. Choose **Local MCP** / set `regulatory_source` to `local` if you want regulatory lookups to touch only `ecfr.gov`. See [DATA_SOURCES.md](DATA_SOURCES.md).
- The conversation between you and the AI runs through Cowork or Claude Code. Whether that conversation is used for model training depends on the **AI tier you attested to** in `/plugin config`. ExChek records the tier you claimed in every report so a future auditor can see what protections were in place.
