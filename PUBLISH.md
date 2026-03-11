# Publishing the ExChek skill to a public repo

This folder is the **ExChek Claude skill**. To let anyone install it with one clone (without access to the private ExChek repo), publish it to a **public** GitHub repo (e.g. `mrdulasolutions/exchekskill`).

## One-time setup

1. **Create the public repo** on GitHub (e.g. `mrdulasolutions/exchekskill`). Leave it empty (no README, no .gitignore).

2. **From the ExChek repo root** (parent of `exchek-skill/`), create a new repo that contains only the skill files and push to the public repo.

### Option A — Copy and push (simplest)

```bash
# From exchekinc repo root (copies SKILL.md, README.md, PUBLISH.md, references/)
mkdir -p /tmp/exchek-skill-pub
cp -r exchek-skill/. /tmp/exchek-skill-pub/
cd /tmp/exchek-skill-pub
git init
git add .
git commit -m "ExChek Claude skill: ECCN classification with AITL"
git branch -M main
git remote add origin https://github.com/mrdulasolutions/exchekskill.git
git push -u origin main
```

Replace `mrdulasolutions/exchekskill` with your actual org/repo URL.

### Option B — Subtree split (keeps history of exchek-skill only)

```bash
# From exchekinc repo root
git subtree split -P exchek-skill -b skill-only
mkdir ../exchek-skill-pub && cd ../exchek-skill-pub
git init
git pull ../exchekinc skill-only
git remote add origin https://github.com/mrdulasolutions/exchekskill.git
git branch -M main
git push -u origin main
```

## Updating the public repo later

After you change files in `exchek-skill/` in the main ExChek repo, re-run Option A (copy the folder contents into the public repo, commit, and push), or use subtree split again and force-push the `skill-only` branch to the public repo’s main.

## After publishing

- Point users to: `git clone https://github.com/mrdulasolutions/exchekskill ~/.claude/skills/exchek-classify`
- Update the docs install-skill page and README if the public repo URL differs.
