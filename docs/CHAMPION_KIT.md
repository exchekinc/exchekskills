# Champion kit — for the ops lead who is becoming the export-compliance person

You probably did not sign up for this. But your shop just realized somebody needs to own export compliance, and the rest of the team looked at you. Welcome.

This guide is for the **internal champion** — the ops manager, COO, EA-to-the-CEO, or senior shipper — at an SMB manufacturer who is becoming the de facto export-compliance owner using ExChek as the backbone. No compliance background assumed.

## The role, honestly

You're not becoming a Trade Compliance Officer. You're becoming the person who:

- Knows where the records are.
- Knows when to run a screen and when to run a classification.
- Knows which one of the four or five "this looks gnarly" patterns to escalate to outside counsel.
- Can answer "yes we do that, here's the doc" when a customer, insurer, or distributor asks.

That's enough for a shop your size. The plugin does the regulatory homework; you do the judgment.

## Week 1 — get the program standing up

| Day | Do this |
|---|---|
| Day 1 | Install Cowork (or Claude Code) on your laptop. Run `/plugin marketplace add github:exchekinc/exchekskills` and `/plugin install exchekskills`. |
| Day 1 | Get a free Trade.gov API key at `developer.trade.gov`. Paste it into `/plugin config exchekskills` under **Trade.gov API key**. |
| Day 2 | Decide the reports folder. Default is `~/Documents/ExChek-Reports`. If you have a shared drive, point it there so the team can see records. |
| Day 2 | Tell `/plugin config` your AI tier (probably `cowork-enterprise` or `claude-team`). This goes into every report's disclosure block. |
| Day 3 | Run `/exchek-classify` on one product you know well. End-to-end, including the Word output. This is your reference. |
| Day 4 | Run `/exchek-screen` on one customer you've already shipped to. Save the doc. Note how fast it was. |
| Day 5 | Run `/exchek-ecp` to generate your shop's first Export Compliance Program document. Edit the placeholders. This is the doc you hand any customer or insurer who asks. |

By Friday you have: 1 classification memo, 1 screening record, 1 ECP. That is more documented compliance than 80% of shops your size.

## Week 2 — make it routine

Pick **one trigger** in your existing workflow. The most common ones:

- "Before any quote ships outside the U.S., we screen the buyer." → run `/exchek-screen` on the buyer's name.
- "Any new product line gets classified once." → run `/exchek-classify` once per product.
- "Any new distributor signs the partner-compliance pack." → run `/exchek-partner-compliance`.

Pick one. Wire it into your existing tool — Slack reminder, ClickUp checklist, calendar block. Don't try to do all three at once.

## Week 3 — the first hard case

You will hit one of these in your first 10 runs:

| Pattern | Plugin says | What you do |
|---|---|---|
| Destination is on the embargo list | "Stop. This destination is comprehensively embargoed under 15 CFR 746." | Don't ship. Tell sales. |
| ECCN is on the 600 series or 9x515 | "This is military-related under the CCL." | Call counsel before shipping. |
| Item is ITAR (USML category Roman numeral) | "This is ITAR. Do not proceed in cloud AI." | Call counsel. ITAR is a different program. |
| Buyer is on a screening list | "Hit on [list name], score [X]." | Adjudicate (is it the same person?). Document. If yes — don't ship. |
| Encryption product without prior notification | "5A002/5D002 — License Exception ENC requires BIS notification." | Use the `/exchek-encryption` skill to draft the notification. |

You don't need to memorize these. You need to know that when the plugin says "stop" or "see counsel," you stop. That's the whole skill.

## Week 4 — show your work

The most important thing you do in week 4 is **show one other person on the team where the records are**. Not because they need to do compliance, but because if you get hit by a bus next week, the program shouldn't disappear.

15 minutes:

1. Open the reports folder.
2. Show them three reports from the last three weeks.
3. Show them the audit log: `cat ~/Library/Application\ Support/Claude-3p/plugins/data/exchekskills-*/audit.jsonl | tail -20`
4. Tell them: "if I'm out and a customer asks for a compliance doc, the answer is in this folder."

Done. You have a program.

## When to escalate

| Situation | Escalate to |
|---|---|
| ITAR jurisdiction confirmed | Outside counsel with ITAR practice |
| Embargoed destination | Counsel; also stop shipping immediately |
| Repeated CSL hits on a buyer you keep selling to | Counsel; pull the customer file |
| Deemed export (foreign national hired into engineering with access to controlled tech) | Counsel + HR |
| Voluntary self-disclosure to BIS | Counsel — do not write a VSD without one |
| Subpoena, BIS letter, or OFAC inquiry | Counsel immediately |

For everything else — routine classifications, routine screenings, partner packs, ECP updates — you've got this.

## Common questions you'll get from the team

> "Is the AI making this up?"

It's pulling live text from `ecfr.gov` (the regulations) and `data.trade.gov` (the screening list). The cite in the memo is real. The reasoning the AI does is on top of that. We sign off as the human in the loop.

> "Why do we have to do this?"

15 CFR Part 762 says U.S. exporters keep records for five years. ITAR has a similar rule. If we ever get audited and we don't have records, that's a finding by itself, separate from any underlying violation.

> "What if I screw up?"

Run the plugin. The plugin doesn't screw up the routine cases. The cases where you can screw up are the ones the plugin tells you to stop on, and on those, we call counsel. The boring middle is exactly what the plugin is for.

## Time budget

| Activity | Time per week |
|---|---|
| Routine screenings | 5 minutes per non-U.S. quote |
| Routine classifications | 30 minutes per new product |
| Audit log spot-check | 5 minutes per month |
| Hard case escalation | Variable; rare |

If you find yourself spending more than an hour a week on this in steady state, something is mis-scoped. Email `matt@exchek.us` and we'll fix it.
