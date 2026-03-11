# ExChek Claude Skill

This repository contains the **ExChek classification skill** for Claude Code (and compatible Claude environments). The layout follows the [Agent Skills](https://agentskills.io/) standard: `SKILL.md` at the root (required), optional `references/` for API docs. Install so Claude can classify export items (ECCN, BIS, ITAR) via the ExChek API with Adjudicator-in-the-Loop.

- **API**: https://api.exchek.us  
- **Docs**: https://docs.exchek.us  
- **Website**: https://exchek.us  

## Install for Claude Code

Claude expects each skill in its own directory with `SKILL.md` inside; the directory name should match the skill name (`exchek-classify`). Clone into that path:

**Option 1 — From this repo (recommended)**

```bash
git clone https://github.com/mrdulasolutions/exchekskill ~/.claude/skills/exchek-classify
```

**Option 2 — From the full ExChek repo**

If the standalone skill repo is not available yet, clone the main repo and copy the skill folder:

```bash
git clone https://github.com/mrdulasolutions/exchekinc exchek-skill-temp
mkdir -p ~/.claude/skills/exchek-classify
cp -r exchek-skill-temp/exchek-skill/* ~/.claude/skills/exchek-classify/
rm -rf exchek-skill-temp
```

**Option 3 — Project-only**

From your project root, create `.claude/skills/exchek-classify/` and copy `SKILL.md`, `reference.md`, and this README from this repo into it.

Verify: run `claude skills list` (or restart Claude Code) and you should see `exchek-classify`. Invoke with `/exchek-classify` or ask Claude to classify an item for export.

## Usage

Once installed, you can ask Claude to classify an item for export (ECCN/BIS/ITAR). Claude will:

1. Use your wallet (authenticate and fund with USDC on Base if needed).
2. Start a classification (first free per wallet, then paid).
3. Ask you for item description, specs, and intended use.
4. Run jurisdiction and Order of Review via the API and relay results for your confirmation or refinement.
5. Finalize and return the audit-ready report when you approve.

## License

See ExChek, Inc. terms.
