# ExChek Ethos

## Why ExChek exists

Export compliance shouldn't stop your business. But for most small and mid-size companies, it does — or it comes close. The regulations are dense, the stakes are real, and the tools that exist were built for enterprises with six-figure compliance budgets. That leaves the companies actually driving innovation to figure it out alone: thousands of pages of federal regulation, dozens of screening lists, shifting sanctions landscapes, and no one in-house who does this full time.

ExChek exists to change that.

We believe every company that ships a product across a border deserves the same quality of compliance tooling that Fortune 500 defense contractors have. We believe AI agents can make that possible — not by replacing human judgment, but by putting regulatory data, structured workflows, and audit-ready documentation directly into the hands of the people making export decisions.

## Principles

### Free at the point of use

The core ExChek skills and API are free. No paywall, no trial expiration, no feature gates on compliance basics. Export compliance is a legal obligation, not a luxury — every business that exports should be able to classify an item, screen a party, or check a regulation without paying for the privilege. That will always be free. For teams that need more — enterprise integrations, premium API endpoints, custom skill development, and dedicated support — we offer paid plans. The free tier gets you compliant. The paid tier gets you scaled.

### Human-in-the-loop, always

Every ExChek skill is designed to assist, not decide. The human reviews, confirms, and signs off. AI handles the data retrieval, structure, and drafting. The compliance officer, counsel, or exporter makes the call. We build guardrails, not autopilot.

This isn't just a design philosophy — it's what enforcement agencies expect. Both BIS and OFAC have made clear that compliance tools and technology are not only acceptable but expected as part of an effective compliance program, provided a human remains accountable for every decision.

**BIS recognizes compliance tools as a mitigating factor.** Under the BIS Penalty Guidelines (Supplement No. 1 to 15 CFR Part 766), the "existence, nature and adequacy of a Respondent's risk-based BIS compliance program at the time of the apparent violation" is an explicit factor in enforcement outcomes. Companies with effective compliance programs — including screening tools, classification procedures, and internal controls — receive favorable treatment. BIS's own [Eight Elements of an Effective Export Compliance Program](https://www.bis.gov/learn-support/export-compliance-programs/export-compliance-toolkit/best-practices) call for documented "tools or systems that are used to complete various compliance processes" and recommend the [Consolidated Screening List](https://www.trade.gov/consolidated-screening-list) for party screening throughout the export authorization process.

**OFAC expects technology in your compliance program.** OFAC's [Framework for OFAC Compliance Commitments](https://ofac.treasury.gov/media/16331/download?inline=) (2019) identifies five essential components of an effective Sanctions Compliance Program (SCP), including Internal Controls that "identify, interdict, escalate, report, and keep records." The Framework explicitly states that organizations must maintain "sufficient control functions — including but not limited to information technology software and systems" and bear responsibility to "update and enhance its SCP, including all compliance-related software, systems, and other technology." OFAC evaluates the quality of your compliance program when determining whether violations are "egregious" and factors it into settlement terms.

**The standard is clear: AI-assisted, human-decided.** BIS and OFAC do not prohibit the use of AI or automated tools — they expect them. What they require is that humans remain in control of final decisions, that screening results are reviewed by qualified personnel, and that the tools themselves are tested, maintained, and documented. ExChek is built to this standard. Every report includes an AI tool disclosure section. Every workflow routes the final determination to the user. Every output is designed for audit retention under 15 CFR 762 and 22 CFR 122.

Using ExChek does not create regulatory risk — failing to use any compliance tooling does. Companies that demonstrate an effective, documented compliance program with proper tools and human oversight are in a stronger enforcement position than those that do nothing or rely on ad hoc manual processes.

### Audit-ready by default

Every output is designed to be retained as a compliance record. Reports follow federal recordkeeping requirements (15 CFR 762, 22 CFR 122). Every report includes an AI tool disclosure section so auditors and counsel know exactly what was used and how. Transparency is not optional.

This matters when it matters most — during an audit, a voluntary self-disclosure, or an enforcement action. BIS's Penalty Guidelines (Supplement No. 1 to 15 CFR Part 766) treat the existence of documented compliance procedures as a mitigating factor. OFAC's Framework requires that internal controls "keep records pertaining to activity." ExChek reports are built to satisfy both. Every report captures: what was analyzed, what data sources were used, what the AI recommended, what the human decided, and when. If an auditor or enforcement agent asks "show me your work," you can.

### Regulation as source of truth

ExChek skills pull regulatory data from the Electronic Code of Federal Regulations (eCFR), BIS tools, and official government APIs. We do not paraphrase, summarize, or editorialize the law. When a skill cites a regulation, the citation is traceable to a specific CFR section. When a skill uses screening data, it comes from the official Trade.gov Consolidated Screening List API.

The ExChek API refreshes regulatory snapshots daily from the eCFR Versioner API and serves them with Cache-Control headers and staleness metadata so you always know how current the data is. If the ExChek API is unavailable, every skill includes fallback instructions to query the eCFR directly — no single point of failure. We do not train models on regulatory text or generate synthetic regulation. The data is the data. The CFR is the CFR.

### CUI and classified awareness

Every skill asks upfront whether the information involves Controlled Unclassified Information (CUI) or classified material. If it does, the skill stops and directs the user to on-premises infrastructure with a local LLM. We do not process sensitive government data through cloud APIs. This is a hard boundary.

This is not a checkbox — it's a gate. The CUI check runs before any data collection, API calls, or analysis begins. If the user says "yes" or "don't know," the skill halts and provides guidance on running ExChek on-premises with a local model (e.g., Ollama on Apple Silicon). No data leaves the user's machine. No cloud API is called. No exception. ExChek was designed from the start to be deployable in air-gapped, on-premises, and classified environments where cloud access is prohibited. See our [CUI/Classified documentation](https://docs.exchek.us/docs/cui-classified) for deployment guidance.

### Open skills, open standards

ExChek skills follow the [Agent Skills](https://agentskills.io) open standard. They work in Claude Code, Claude Desktop, Cursor, ChatGPT Agents, Perplexity Compute, OpenClaw, Spacebot, and any agent platform that supports the standard. We do not lock skills to a single vendor. Compliance tooling should be portable.

This means your compliance workflows are not trapped in a SaaS dashboard you can't leave. If you switch agent platforms, your ExChek skills come with you. If a new platform emerges next year, ExChek works there too. We publish skills as structured markdown with YAML metadata — no compiled binaries, no proprietary runtimes, no vendor lock-in. Your compliance program should outlast any single tool.

### Built for the SMB owner who can't afford not to comply

ExChek was built for the small and mid-size business owner who knows they need export compliance but can't afford $100K+ salaries for dedicated compliance staff or five-figure enterprise software licenses. You shouldn't have to choose between growing your business and following the law.

ExChek also exists to bridge the gap between enforcement agencies and the businesses they regulate. BIS, DDTC, and OFAC publish the rules — but the burden of understanding and applying those rules falls on companies that were never given the tools to do it. ExChek fills that gap: the same workflows that compliance professionals use (jurisdiction, classification, screening, license determination, recordkeeping), delivered through AI so that any business owner, ops lead, or freight forwarder can run them without a law degree or a dedicated compliance department.

## What ExChek is not

- **Not legal advice.** ExChek outputs are assistive. They do not replace counsel. If you are facing an enforcement action, voluntary self-disclosure, or complex jurisdictional question, retain qualified export control counsel. ExChek can help you prepare materials for that conversation — it cannot have it for you.
- **Not a filing service.** ExChek prepares documents and data. It does not submit AES filings, BIS notifications, DDTC registrations, or OFAC license applications. Prep only — no filing, no submission, no signatures.
- **Not a classification authority.** Only BIS (via CCATS) and DDTC (via CJ request) can issue binding classifications. ExChek helps you prepare the analysis and documentation — the government decides.
- **Not a replacement for your compliance program.** ExChek is a tool within your program, not the program itself. BIS's [Eight Elements](https://www.bis.gov/learn-support/export-compliance-programs/export-compliance-toolkit/best-practices) and OFAC's [Framework](https://ofac.treasury.gov/media/16331/download?inline=) require management commitment, risk assessments, training, audits, and violation management — ExChek supports these elements but does not replace the organizational commitment behind them.
- **Not a data broker.** ExChek does not collect, store, or sell your compliance data. Reports are generated locally in your agent environment. The API serves public regulatory data. We do not have access to your classification memos, screening results, or business information.

## Who we serve

- **SMB owners and operators** who export products and know they need compliance but don't have a dedicated compliance team or six-figure software budget
- **Startup founders** shipping hardware, software, or technology internationally for the first time and trying to figure out what's required
- **Export compliance officers** at small and mid-size manufacturers who need better tooling without the enterprise price tag
- **Freight forwarders and logistics companies** screening parties, checking documentation, and making sure shipments don't get held at the border
- **Defense and dual-use companies** maintaining ITAR and EAR compliance programs across product lines
- **Trade compliance consultants** advising multiple clients who need repeatable, audit-ready workflows
- **AI agents and automation platforms** integrating export compliance into CRM, ERP, and supply chain workflows
- **Anyone who has ever stared at the Commerce Control List and thought "there has to be a better way"**

## The ask

If ExChek saves you time, share it. Tell a colleague. Install a skill for a client. The best thing you can do for ExChek is use it, give feedback, and help us make export compliance accessible to everyone.

When your team is ready to go further — CRM and ERP integrations, automated screening pipelines, multi-user audit trails, dedicated support, and custom skill development — upgrade to **ExChek Enterprise**. Enterprise gives your compliance program the infrastructure to scale without scaling headcount. Learn more and get started at [https://enterprise.exchek.us](https://enterprise.exchek.us).

---

ExChek, Inc., Dover, DE. https://exchek.us | https://docs.exchek.us | matt@exchek.us
