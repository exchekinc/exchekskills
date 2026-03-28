# Publishing ExChek skills to the public repo

The public repo **https://github.com/exchekinc/exchekskills** contains **15 skills** in separate folders. This file describes how to publish from the private ExChek repo (exchekinc).

## Public repo layout

```
exchekskills/
  LICENSE                  # Proprietary license — copy from exchekinc root
  README.md                # Root README (all skills, install for each) — from exchekskills-README.md
  src/badges/              # Badge SVGs for READMEs/docs — from exchekinc src/badges/
  exchek-classify/         # Classification — from exchek-skill/
  exchek-csl/              # CSL search — from exchek-skill-csl/
  exchek-license/          # License determination — from exchek-skill-license/
  exchek-export-docs/      # Export documentation — from exchek-skill-export-docs/
  exchek-risk-triage/      # Risk & escalation triage — from exchek-skill-risk-triage/
  exchek-ecp/              # ECP / Policy & Training — from exchek-skill-ecp/
  exchek-audit-lookback/   # Retrospective audit — from exchek-skill-audit-lookback/
  exchek-country-risk/     # Country risk one-pager — from exchek-skill-country-risk/
  exchek-deemed-export/    # Deemed export — from exchek-skill-deemed-export/
  exchek-encryption/       # Encryption ENC/5x992 — from exchek-skill-encryption/
  exchek-jurisdiction/     # ITAR vs EAR — from exchek-skill-jurisdiction/
  exchek-partner-compliance/   # Partner compliance pack — from exchek-skill-partner-compliance/
  exchek-red-flag-assessment/ # Red-flag assessment — from exchek-skill-red-flag-assessment/
  exchek-recordkeeping/    # Recordkeeping — from exchek-skill-recordkeeping/
  exchek-docx/            # Document Converter (md → .docx) — from exchek-skill-docx/
```

- **exchek-classify/** — Contents of private `exchek-skill/` (this folder), excluding `PUBLISH.md` and `.git`.
- **exchek-csl/** — Contents of private `exchek-skill-csl/`.
- **exchek-license/** — Contents of private `exchek-skill-license/` (excluding `.git`, `node_modules`).
- **exchek-export-docs/**, **exchek-risk-triage/**, **exchek-ecp/**, **exchek-audit-lookback/**, **exchek-country-risk/**, **exchek-deemed-export/**, **exchek-encryption/**, **exchek-jurisdiction/**, **exchek-partner-compliance/**, **exchek-red-flag-assessment/**, **exchek-recordkeeping/** — Synced from the corresponding private `exchek-skill-*/` folders (excluding `.git`, `node_modules`).
- **exchek-docx/** — Document Converter (md → .docx). Before sync: copy canonical script into the skill so the public repo is self-contained: `cp scripts/md-to-docx.mjs exchek-skill-docx/scripts/report-to-docx.mjs`. Then sync from private `exchek-skill-docx/` (excluding `.git`, `node_modules`).
- **README.md** at root — Copy from private repo root: `exchekskills-README.md` → public repo `README.md`.

## One-time setup

1. **Create the public repo** on GitHub: **exchekinc/exchekskills** (or your org/repo). Can be empty or already have skill folders.

2. **Clone the public repo** as the base-of-truth copy inside exchekinc: `git clone https://github.com/exchekinc/exchekskills.git exchekskills` (the folder `exchekskills/` is in `.gitignore`).

3. **Sync all skills and the root README** from the exchekinc repo root:

```bash
# From exchekinc repo root. PUB is the base-of-truth clone (exchekskills/ in this repo).
PUB=exchekskills

# Classify skill → exchek-classify (exclude PUBLISH.md and .git)
rsync -av exchek-skill/ "$PUB/exchek-classify/" --exclude='.git' --exclude='PUBLISH.md' --exclude='node_modules'

# CSL skill → exchek-csl
rsync -av exchek-skill-csl/ "$PUB/exchek-csl/" --exclude='.git' --exclude='node_modules'

# License determination skill → exchek-license
rsync -av exchek-skill-license/ "$PUB/exchek-license/" --exclude='.git' --exclude='node_modules'

# Export documentation → exchek-export-docs
rsync -av exchek-skill-export-docs/ "$PUB/exchek-export-docs/" --exclude='.git' --exclude='node_modules'

# Risk triage → exchek-risk-triage
rsync -av exchek-skill-risk-triage/ "$PUB/exchek-risk-triage/" --exclude='.git' --exclude='node_modules'

# ECP → exchek-ecp
rsync -av exchek-skill-ecp/ "$PUB/exchek-ecp/" --exclude='.git' --exclude='node_modules'

# Audit lookback → exchek-audit-lookback
rsync -av exchek-skill-audit-lookback/ "$PUB/exchek-audit-lookback/" --exclude='.git' --exclude='node_modules'

# Country risk → exchek-country-risk
rsync -av exchek-skill-country-risk/ "$PUB/exchek-country-risk/" --exclude='.git' --exclude='node_modules'

# Deemed export → exchek-deemed-export
rsync -av exchek-skill-deemed-export/ "$PUB/exchek-deemed-export/" --exclude='.git' --exclude='node_modules'

# Encryption → exchek-encryption
rsync -av exchek-skill-encryption/ "$PUB/exchek-encryption/" --exclude='.git' --exclude='node_modules'

# Jurisdiction → exchek-jurisdiction
rsync -av exchek-skill-jurisdiction/ "$PUB/exchek-jurisdiction/" --exclude='.git' --exclude='node_modules'

# Partner compliance → exchek-partner-compliance
rsync -av exchek-skill-partner-compliance/ "$PUB/exchek-partner-compliance/" --exclude='.git' --exclude='node_modules'

# Red-flag assessment → exchek-red-flag-assessment
rsync -av exchek-skill-red-flag-assessment/ "$PUB/exchek-red-flag-assessment/" --exclude='.git' --exclude='node_modules'

# Recordkeeping → exchek-recordkeeping
rsync -av exchek-skill-recordkeeping/ "$PUB/exchek-recordkeeping/" --exclude='.git' --exclude='node_modules'

# Document Converter → exchek-docx (copy canonical script so public repo is self-contained)
cp scripts/md-to-docx.mjs exchek-skill-docx/scripts/report-to-docx.mjs
rsync -av exchek-skill-docx/ "$PUB/exchek-docx/" --exclude='.git' --exclude='node_modules'

# Badge assets (users can use raw URLs from the public repo)
mkdir -p "$PUB/src/badges"
rsync -av src/badges/ "$PUB/src/badges/"

# Root README and LICENSE for the public repo
cp exchekskills-README.md "$PUB/README.md"
cp LICENSE "$PUB/LICENSE"

cd "$PUB"
git add .
git status   # expect LICENSE, README.md, src/badges/, and all 15 skill folders
git commit -m "ExChek skills: all 15 skills"
git push
```

## Updating the public repo later

From the exchekinc repo root, sync only what changed:

```bash
PUB=exchekskills   # base-of-truth clone in this repo; pull latest first: cd exchekskills && git pull

# Update classify skill
rsync -av exchek-skill/ "$PUB/exchek-classify/" --exclude='.git' --exclude='PUBLISH.md' --exclude='node_modules'

# Update CSL skill
rsync -av exchek-skill-csl/ "$PUB/exchek-csl/" --exclude='.git' --exclude='node_modules'

# Update license determination skill
rsync -av exchek-skill-license/ "$PUB/exchek-license/" --exclude='.git' --exclude='node_modules'

# Update remaining skills
rsync -av exchek-skill-export-docs/ "$PUB/exchek-export-docs/" --exclude='.git' --exclude='node_modules'
rsync -av exchek-skill-risk-triage/ "$PUB/exchek-risk-triage/" --exclude='.git' --exclude='node_modules'
rsync -av exchek-skill-ecp/ "$PUB/exchek-ecp/" --exclude='.git' --exclude='node_modules'
rsync -av exchek-skill-audit-lookback/ "$PUB/exchek-audit-lookback/" --exclude='.git' --exclude='node_modules'
rsync -av exchek-skill-country-risk/ "$PUB/exchek-country-risk/" --exclude='.git' --exclude='node_modules'
rsync -av exchek-skill-deemed-export/ "$PUB/exchek-deemed-export/" --exclude='.git' --exclude='node_modules'
rsync -av exchek-skill-encryption/ "$PUB/exchek-encryption/" --exclude='.git' --exclude='node_modules'
rsync -av exchek-skill-jurisdiction/ "$PUB/exchek-jurisdiction/" --exclude='.git' --exclude='node_modules'
rsync -av exchek-skill-partner-compliance/ "$PUB/exchek-partner-compliance/" --exclude='.git' --exclude='node_modules'
rsync -av exchek-skill-red-flag-assessment/ "$PUB/exchek-red-flag-assessment/" --exclude='.git' --exclude='node_modules'
rsync -av exchek-skill-recordkeeping/ "$PUB/exchek-recordkeeping/" --exclude='.git' --exclude='node_modules'

# Update Document Converter (copy canonical script then sync)
cp scripts/md-to-docx.mjs exchek-skill-docx/scripts/report-to-docx.mjs
rsync -av exchek-skill-docx/ "$PUB/exchek-docx/" --exclude='.git' --exclude='node_modules'

# Update badge assets
mkdir -p "$PUB/src/badges"
rsync -av src/badges/ "$PUB/src/badges/"

# Update root README and LICENSE if you changed them
cp exchekskills-README.md "$PUB/README.md"
cp LICENSE "$PUB/LICENSE"

cd "$PUB"
git add .
git commit -m "Update ExChek skills"
git push
```

## After publishing

- **Repo**: https://github.com/exchekinc/exchekskills  
- **Install any skill**: Clone the repo, then copy the folder(s) you want: `git clone https://github.com/exchekinc/exchekskills exchekskills && cp -r exchekskills/exchek-classify ~/.claude/skills/exchek-classify` (and similarly for exchek-csl, exchek-license, exchek-export-docs, exchek-risk-triage, exchek-ecp, exchek-audit-lookback, exchek-country-risk, exchek-deemed-export, exchek-encryption, exchek-jurisdiction, exchek-partner-compliance, exchek-red-flag-assessment, exchek-recordkeeping, exchek-docx). See the public repo README for full install commands for all 15 skills.
- Keep the docs site (install-skill page, etc.) and main README in exchekinc in sync with these URLs and folder names.
