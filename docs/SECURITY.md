# Security — ExChek Skills

Plain-English security model for the SMB manufacturer who owns this install. No security background assumed.

## What this plugin can and cannot do on your machine

- It can **read** files in the directory where you run Claude Code or Cowork.
- It can **write** finished `.docx` reports to the folder you point it at (default `~/Documents/ExChek-Reports`).
- It can **call two websites**: `www.ecfr.gov` (the U.S. regulations) and `data.trade.gov` (the screening list). Nothing else. There is no call back to ExChek's servers.
- It cannot install other software, change your system settings, or send your data anywhere else.

## Where your data lives

Everything the plugin writes — cached regulations, the audit log, any reports — lives under a single folder:

| OS | Path |
|---|---|
| macOS (Cowork) | `~/Library/Application Support/Claude-3p/plugins/data/exchekskills-*/` |
| macOS (Claude Code) | `~/.claude/plugins/data/exchekskills-*/` |
| Windows | `%LOCALAPPDATA%\Claude-3p\plugins\data\exchekskills-*\` |

Files are owner-only (`0600`). Other accounts on the same machine cannot read them.

If you uninstall the plugin, the folder is deleted unless you pass `--keep-data`.

## How the plugin protects you against prompt injection

When you paste a customer email, a CSV, or a spec sheet into the conversation, the AI could be tricked by hidden instructions inside that content (this is a real attack — search "prompt injection"). The plugin defends against this in three ways:

1. **The `sanitize_input` MCP tool** strips zero-width, right-to-left, control, and Cyrillic-look-alike characters from every field before the AI reasons on it. Anything suspicious is logged in the report's "Caveats" section so a reviewer sees it.
2. **The CUI gate** (the three questions the AI asks before doing anything) cannot be skipped, even if the pasted content tries to override it.
3. **Every report carries an AI-disclosure block** that records exactly which model, which tier, and which timestamp produced it.

You don't have to do anything to turn this on — every skill calls these tools.

## How the plugin protects you against tampered audit logs

Each entry in the audit log includes an HMAC signature of the previous entry, so editing any past line breaks the chain. To check:

> "Verify my audit log."

The AI will call the `audit_verify` MCP tool and tell you whether the chain is intact.

The HMAC key is generated on first run and stored owner-only at `audit.key` in the plugin data directory. If you want to bring your own key (say, you keep it in a corporate password manager), set it in `/plugin config` under "Audit-log HMAC key."

## Trade.gov API key — what it is, why it's safe

The Consolidated Screening List (denied-party list) is run by the U.S. government. Searching it requires a free API key from `developer.trade.gov`. The plugin asks Cowork or Claude Code to store this key in your **OS keychain** — macOS Keychain, Windows Credential Manager. It is never written to disk in plain text and never logged.

You only need the key when you ask the plugin to screen a party. If you skip that, you don't need a key.

## Things you should still do

- **Read the report before relying on it.** Every ExChek report says "Reviewer Certification — `{{NAME}}`" in section 11. That blank exists because *you* are the human in the loop. The plugin's job is to do the homework; yours is to sign off.
- **Keep your AI tier honest.** When the plugin asks what AI tier you're on, answer truthfully. If you're on a free consumer tier where prompts may be used for training, the plugin will tell you so and recommend you upgrade or move sensitive work on-prem.
- **Rotate the audit key** if you ever suspect the machine was compromised. Set a new key in `/plugin config`; the plugin starts a new chain from that point.

## Reporting a security issue

Email `matt@exchek.us`. Do not file a public GitHub issue for security problems.
