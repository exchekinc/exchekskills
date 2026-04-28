# Communications kit — ExChek for SMB manufacturers

Copy-ready announcements for an SMB shop owner, ops lead, or founder rolling ExChek out to a small team. Replace `[bracketed]` placeholders with your shop's specifics. Treat this as draft copy — rewrite it in your voice.

## The "we have to do this now" announcement

Use this when a customer, distributor, insurer, or freight forwarder has just asked your team if you do export compliance, and you realized the answer is "kind of."

### Email

```
Subject: We're putting export compliance on a real footing this month

Team,

[Distributor / customer / forwarder] asked us last week if we have an export
compliance program. The honest answer was "kind of." That's not where I want
us to be, especially since we ship [product] to [Germany / Mexico / Vietnam /
wherever].

Starting this week we're using ExChek — it's a plugin that runs inside
Cowork/Claude on our laptops and walks us through the things a compliance
consultant would do, except we don't have a compliance consultant.

What you'll do:

  1. Install Cowork (or Claude Code) — instructions in [your wiki link].
  2. Run /plugin marketplace add github:exchekinc/exchekskills
  3. Run /plugin install exchekskills
  4. Next time you quote or ship anything outside the U.S., open a chat
     and type /exchek-classify or /exchek-screen.

Each run produces a Word document we keep on file. That document is the
record of what we did and when, which is what every regulator wants to
see.

What it costs: nothing. ExChek is free. We need a free API key from
developer.trade.gov for the screening side; takes two minutes.

What it doesn't do: replace a lawyer for the genuinely hard cases. If
something looks gnarly the plugin will say "stop and talk to counsel."

Questions: [#export-compliance Slack channel / email me].

— [Your name]
```

### Slack / Teams

```
🚢 *We're putting export compliance on a real footing*

[Customer / forwarder] asked if we have an export program. Time to actually
have one.

Plan: install ExChek (free, runs inside Cowork). Every quote outside the U.S.
gets a 5-minute /exchek-classify and /exchek-screen run. Each run drops a
Word doc in our reports folder. That folder *is* the program.

Setup: [wiki link] · Questions in this thread.

— [Your name]
```

## The "we just got asked for a CCP" variant

A "CCP" is a Compliance Commitment Plan — what big distributors, ITAR-affected partners, or insurers sometimes ask for from suppliers. Use this when one comes in.

```
Subject: [Customer] asked for a Compliance Commitment Plan — here's how we'll
generate one this week

Team,

[Customer] sent over a Compliance Commitment Plan questionnaire last [day].
Rather than make this up, we're going to run /exchek-ecp tonight, which is
a skill that walks us through generating an ECP (Export Compliance Program)
document tailored to a shop our size.

The output is a Word doc that covers:

  - Screening procedure (we use the CSL via Trade.gov)
  - Classification procedure (we use ExChek's classification skill)
  - Recordkeeping (5 years per 15 CFR 762, files in [shared drive])
  - Training (we'll schedule the first session [date])

I'll send the draft for review tomorrow. If anyone has hit this before
at a previous job, please flag.

— [Your name]
```

## The "what about ITAR?" FAQ message

Pin this in your channel.

```
🛑 *FAQ: Does ITAR apply to us?*

Short answer: probably not, but we should be sure.

ITAR (the State Department list) covers things designed for military use —
weapons, classified equipment, certain night vision, certain crypto. Most
of what we make is on the Commerce Control List (the BIS / EAR side), which
is a different set of rules.

If you're not sure for a specific product, run /exchek-jurisdiction. It's
a 10-minute questionnaire that produces a memo you can hand to anyone who
asks. The memo cites the specific regulation that covers your answer, so
it's not "AI said so" — it's "the regulation says so, and here's the cite."

If the answer is "yes ITAR applies," stop and call [counsel / consultant].
ITAR is a different posture and not something to figure out in a Slack
thread.
```

## FAQ — one-line replies

| Question | Reply |
|---|---|
| "Is this just AI guessing?" | "No. The plugin pulls live regulation text from ecfr.gov and the screening list from trade.gov. The AI does the homework, but the cite is real. You sign off as the human in the loop." |
| "What happens to our customer data?" | "It stays on your laptop. The plugin only calls ecfr.gov and trade.gov. There is no ExChek server in the loop. See [DATA_STORAGE.md]." |
| "Do we need a lawyer?" | "Not for routine classifications and screenings. For ITAR, embargoed destinations, deemed-export questions, or anything that hits a red flag — yes." |
| "How much will this cost us?" | "The plugin is free. Trade.gov screening API key is free. The only cost is the AI tier you're already paying for (Cowork or Claude Code)." |
| "What if the AI is wrong?" | "Every report has a Reviewer Certification line. That's where you sign off. The audit log records that you, not the AI, made the final call." |
| "Are we audit-ready now?" | "After your first 10 runs, you have 10 dated Word memos and an HMAC-chained log saying when each was generated. That's more than most shops your size have. Yes." |
