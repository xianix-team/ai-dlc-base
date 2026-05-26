# AI-DLC Setup Guide

This document explains how to set up the AI-DLC framework in a repository. It works with Claude Code, Cursor, and GitHub Copilot. Everything here is generic — substitute your project's technology stack, domain terms, and rules where indicated.

---

## What You Are Building

AI-DLC is a structured operating system for building software with AI assistance. It is not a tool — it is a set of files, conventions, and ceremonies that govern how your team and your AI work together. The output is a repo where:

- Every feature starts with a written intent and testable acceptance criteria
- Every AI interaction is gated by a quality check and logged for audit
- Every failure feeds back into rules that prevent recurrence
- Any engineer (or AI tool) opening the repo knows exactly how to work in it

---

## Before You Begin

### Question 1 — Which AI tool are you using?

This guide uses the term **master rule file** to refer to the file that governs AI behaviour in your repository. Each tool has a different name and location for this file:

| AI Tool | Master rule file | Location |
|---|---|---|
| **Claude Code** | `CLAUDE.md` | Repo root |
| **Cursor** | `.cursorrules` | Repo root |
| **GitHub Copilot** | `copilot-instructions.md` | `.github/` folder |

The content of the master rule file is identical across tools. The only differences are the file name, the location, and — for GitHub Copilot — internal links to `ai-dlc/` files must use the prefix `../ai-dlc/` since the file lives inside `.github/`.

All subsequent steps in this guide refer to the "master rule file." Substitute the correct name and path for your chosen tool.

> If you want to support more than one AI tool in the same repo, write the master rule file once and create copies for each additional tool. See Step 8.

---

### Question 2 — Fresh or Mature Project?

Before following this guide, the AI must ask the engineer one question:

> **"Is this a fresh project (no significant codebase yet) or a mature project (existing code, conventions, and team practices already in place)?"**

- **Fresh project** → proceed directly to Step 1 below.
- **Mature project** → complete the Mature Project Onboarding phases (Phase M1–M3) first, then continue to Step 1.

---

## Mature Project Onboarding

Onboarding AI-DLC into an existing codebase requires three preparatory phases before any Bolt is written. The goal is to extract what the system already is, encode it as rules, and establish safety controls — so that AI-DLC enhances the project without disrupting what already works.

---

### Phase M1 — Codebase Archaeology Analysis

#### M1.1 — Architecture Mapping

- Read the codebase module by module
- Generate business-language descriptions of each module (what it does, not how)
- Produce a capability map: what the system does as a whole
- Identify service boundaries, integration points, and data flows
- Output becomes the foundation for the Bolt Backlog

#### M1.2 — Pattern Extraction

- Read 10–20 representative files across modules
- Extract: naming conventions, error handling style, ORM usage, API response shapes, authentication patterns, test patterns and coverage conventions
- Document all extracted patterns — these go into the master rule file and the `rules/` folder before any Bolt is written

#### M1.3 — Debt and Gap Mapping

Classify all identified work into three Bolt types:

| Bolt Type | Description |
|---|---|
| **Enhancement Bolt** | New capabilities not yet in the system |
| **Remediation Bolt** | Tech debt, coverage gaps, refactoring |
| **Migration Bolt** | Architectural changes that enable future work |

**Prioritisation order:** Enhancement first (shows value) → Remediation second (earns trust) → Migration last.

---

### Phase M2 — Repository Overlay

Create the governance layer on top of the existing codebase. All four artefacts must exist before the first Bolt runs.

#### M2.1 — Master Rule File

The most important file in the overlay. See **Before You Begin** for the correct file name and location for your AI tool. Must contain:
- Architecture context derived from M1.1
- Coding conventions extracted in M1.2
- Forbidden zones (see M2.2)
- Bolt workflow rules
- Entry points (see M2.3)

Follow the full master rule file authoring instructions in Step 2 of this guide, but populate each section from the archaeology output rather than from scratch.

#### M2.2 — Forbidden Zones

Create `ai-dlc/guidelines/forbidden-zones.md` containing an explicit list of files, modules, or patterns that the AI must **not** modify without senior engineer approval. This protects stable, business-critical code from accidental change.

```markdown
| Zone | Path / Pattern | Reason | Approval required from |
|---|---|---|---|
| <name> | <path or glob> | <why it is protected> | <role> |
```

Reference this file in the master rule file under Code Rules (Section 3) so it is enforced in every session.

#### M2.3 — Entry Point Registry

Create `ai-dlc/guidelines/entry-points.md` containing the approved list of modules and features where AI-DLC Bolts may begin. This controls the expansion boundary. Update the list as the team gains confidence with the process.

```markdown
| Module / Feature | Status | Notes |
|---|---|---|
| <name> | Approved / Pending / Blocked | <any constraints> |
```

#### M2.4 — Coding Conventions File

Create `ai-dlc/rules/code-standards.md` (or populate it if it already exists) entirely from the patterns extracted in M1.2. Every AI session must match the style of the existing codebase — this file is the authoritative source injected into each session.

---

### Phase M3 — Blast Radius Management

Before any Bolt is executed, three safety controls must be in place. These apply to every Bolt that touches existing code.

#### M3.1 — Test Coverage Gate

Verify that adequate test coverage exists for the target feature or module before a Bolt begins. If coverage is insufficient, a Remediation Bolt to add tests must be planned and executed first. No Bolt modifying existing code starts without this gate passing.

#### M3.2 — Feature Flag Requirement

Every change introduced by AI-DLC into an existing module must be wrapped in a feature flag. This limits production impact if a change behaves unexpectedly and allows rollback without a deployment.

#### M3.3 — Default Acceptance Criterion for Existing-Code Bolts

Every Bolt that affects existing code must carry the following AC by default — it is non-negotiable and cannot be removed during elaboration:

> **"All integration tests for [affected module] pass without modification."**

Add this rule to the master rule file Section 6 (AI-DLC Workflow) and to `ai-dlc/rules/code-standards.md` so it is enforced automatically.

---

### Mature Project Onboarding Checklist

- [ ] Architecture map produced (capability map, service boundaries, data flows)
- [ ] Pattern extraction complete (naming, error handling, ORM, API shapes, test conventions)
- [ ] Debt and gap map produced; work classified into Enhancement / Remediation / Migration Bolts
- [ ] Master rule file written from archaeology output (see Before You Begin for file name)
- [ ] `ai-dlc/guidelines/forbidden-zones.md` created and referenced in the master rule file
- [ ] `ai-dlc/guidelines/entry-points.md` created
- [ ] `ai-dlc/rules/code-standards.md` populated from extracted patterns
- [ ] Test coverage gate verified for first target module
- [ ] Feature flag approach confirmed with team
- [ ] Default AC for existing-code Bolts added to the master rule file and `code-standards.md`

Once all items above are checked, continue to **Step 1** of this guide to create the full folder structure and remaining artifacts.

---

## Fresh Project — Structured Interview

For fresh projects the agent cannot read a codebase to populate the master rule file. Instead, it must run a structured interview before creating any files. The interview is strictly one question at a time, in this order. The agent must not proceed to the next question until the engineer has answered the current one.

**Do not present all questions at once. Ask them one at a time and wait for the answer.**

---

**Interview sequence:**

1. **Product identity**
   > "In one sentence, what does this product do and who uses it?"

2. **Technology stack — backend**
   > "What language and framework will the backend use? (e.g., Node/Express, Python/FastAPI, .NET/ASP.NET Core)"

3. **Technology stack — frontend**
   > "What language and framework will the frontend use? (e.g., React/TypeScript, Vue, server-rendered only)"

4. **Database and auth**
   > "What database will you use, and how will authentication work? (e.g., PostgreSQL with Supabase Auth, MongoDB with JWT)"

5. **System boundaries**
   > "Are there any hard rules about what must never happen architecturally? (e.g., 'the frontend must never call the database directly', 'the mobile app communicates only through the REST API')"

6. **Domain language**
   > "List the key business terms this system uses — the words that appear in your domain, not generic tech terms. For each one, give a one-sentence definition. (e.g., 'Booking — a confirmed reservation between a guest and a host')"
   >
   > *Keep asking "any more?" until the engineer says done.*

7. **Known constraints and prohibitions**
   > "Are there any technical choices that are already decided and must not be changed by the AI? (e.g., 'we must use REST, not GraphQL', 'no ORM — raw SQL only', 'all prices stored as integers in cents')"

8. **First capability**
   > "What is the first feature or capability you want to build? Give it a name and one sentence describing what it does for the user."

---

Once all eight questions are answered, the agent has enough to:
- Create the folder structure (Step 1)
- Write the master rule file with Sections 1–5 and Section 8 fully populated
- Write an initial first intent file from the answer to question 8
- Flag Sections 6 and 7 (workflow and review) as pre-populated from the guide defaults

---

## Step 1 — Create the Folder Structure

Create this directory tree at the root of your repository:

```
ai-dlc/
  Instructions2FDE.md        ← main guide for engineers
  README.md                  ← how the process achieves quality
  rules/
    prompt-quality-gate.md   ← the 4-component gate run before every code generation
    code-standards.md        ← language/framework conventions and anti-patterns
    security.md              ← never/always security rules
    architecture.md          ← ADRs — decisions and their rationale
  skills/
    mob-elab-prompts.md      ← interactive protocol and prompts for elaboration sessions
    review-checklist.md      ← structured lens for reviewing AI output
    unit-template.md         ← how to write a unit (reference doc)
  guidelines/
    domain-glossary.md       ← canonical business terms used in code and prompts
    edge-cases.md            ← known failure modes to check before generating code
    acceptance-patterns.md   ← rules and anti-patterns for writing ACs
    dev-setup.md             ← environment setup checklist for new engineers
    team-rollout.md          ← scaling to multiple engineers
  prompts/                   ← one file per feature; every AI session logged here
  ops/
    inception/
      intents/               ← one file per feature intent
        _template.md
        README.md
      elaborations/          ← one folder per intent; one file per session
        _template.md
    build/
      backlog.md             ← master status of all units
      units/                 ← one file per atomic unit of work
        _template.md
      bolts/                 ← one file per planned batch of units
        _template.md
    operate/
      retros/                ← one file per completed bolt
        _template.md
      incidents/             ← one file per production issue
        _template.md
      improvements/          ← one file per process change triggered by retro/incident
        _template.md
```

---

## Step 2 — Write the Master Rule File (The Behavioral Contract)

The master rule file is loaded automatically by your AI tool every session. See **Before You Begin** for the correct file name and location for your tool — the content is the same regardless of which tool you use. Every section below is required.

### Section 1 — Project Identity

State what the system is and its technology stack. Be specific — the AI needs to know:
- What the product does (one sentence)
- Backend language/framework and key patterns
- Frontend language/framework
- Database and auth approach
- **System boundaries** — what calls what; what must never happen (e.g. "frontend never calls the database directly")

```markdown
## 1. Project Identity

**<ProjectName>** is a <one-sentence description>.
- Backend: <language/framework, key patterns>
- Frontend: <language/framework>
- Database: <database, auth approach>

**System boundaries:**
- <boundary rule 1>
- <boundary rule 2>
```

### Section 2 — Prompt Quality Gate

This section tells the AI to enforce the four-component check before every code response. Copy this block verbatim and add a link to `ai-dlc/rules/prompt-quality-gate.md`:

```markdown
## 2. Prompt Quality Gate — Run This Before Every Code Response

Before writing, generating, or modifying any code, check that the request contains all four components:

| Component | What it requires |
|---|---|
| **Context** | Who is asking, what system or feature this touches |
| **Constraints** | What must not be done; which rules apply |
| **Acceptance Criteria** | A testable pass/fail condition (Given/When/Then) |
| **Output Format** | What the response should look like |

**If any component is missing:** do not generate code. Ask one question at a time in this order: Acceptance Criteria → Context → Constraints → Output Format.

**When all four are present:** generate the output and open the response with:
**Context:** <one line>
**Constraints:** <one line>
**Acceptance Criteria:** <one line>
**Output Format:** <one line>

Full gate definition: [ai-dlc/rules/prompt-quality-gate.md](ai-dlc/rules/prompt-quality-gate.md)

> **GitHub Copilot users:** replace `ai-dlc/` with `../ai-dlc/` in all links above.
```

### Section 3 — Code Rules

Three subsections:

**Never do these** — absolute prohibitions for your stack. Common examples:
- Commit secrets, API keys, or connection strings
- Trust client-supplied IDs without server-side ownership verification
- Expose internal stack traces to the client
- Use raw SQL string concatenation
- *(Add stack-specific rules — e.g. no `.Result`/`.Wait()` in async .NET, no `any` in TypeScript)*

**Always do these** — mandatory patterns for your stack. Common examples:
- Validate and sanitize all input at the API boundary
- Authenticate every endpoint — explicitly mark public routes
- *(Add domain-specific rules — e.g. how prices are stored, how dates are handled)*

**Naming conventions** — per language/framework. Be explicit about file naming, type naming, variable naming, and database naming.

Link to `ai-dlc/rules/code-standards.md`, `ai-dlc/rules/security.md`, and `ai-dlc/rules/architecture.md` (GitHub Copilot: use `../ai-dlc/` prefix).

### Section 4 — Domain Language

List every business term the team uses with its exact definition. This is the most important section for preventing logic errors — if the AI uses "Order" when your domain uses "Booking," the output will be subtly wrong throughout.

```markdown
| Term | Meaning |
|---|---|
| **<Term>** | <precise definition> |
```

Link to `ai-dlc/guidelines/domain-glossary.md` for the full glossary (GitHub Copilot: use `../ai-dlc/` prefix).

### Section 5 — Known Edge Cases

Table of known failure modes the AI must check before generating code. Start with the ones relevant to your domain. Format:

```markdown
| ID | Scenario | Required behavior |
|---|---|---|
| EC-001 | <scenario> | <what the code must do> |
```

Add edge cases here as they are discovered in retros and incidents. Link to `ai-dlc/guidelines/edge-cases.md` (GitHub Copilot: use `../ai-dlc/` prefix).

### Section 6 — AI-DLC Workflow

This section tells the AI the artifact hierarchy and the mob elaboration protocol. Copy the mob elaboration turn structure verbatim — it is what prevents the AI from dumping all units at once instead of running a proper conversation:

```markdown
**Turn structure — strictly one unit per turn:**
1. Propose a single candidate unit (name + one-sentence purpose only). Stop and wait.
2. Once confirmed, propose ACs as a numbered list. Stop and wait.
3. Once ACs are agreed, surface edge cases and open questions. Stop and wait.
4. Move to next unit. Repeat.
5. After all units agreed, present summary table and ask for final sign-off before writing any files.
```

Include the artifact table (what lives where) and the "never do these during elaboration" rules.

### Section 7 — Review Behavior

A short checklist the AI runs before presenting any output. Minimum items:
- Every AC is traceable to the code
- No hallucinated APIs or library methods
- Known edge cases checked
- No secrets or hardcoded environment values
- Auth checked on every new endpoint
- Tests exist for each AC

Link to `ai-dlc/skills/review-checklist.md` for the full checklist (GitHub Copilot: use `../ai-dlc/` prefix).

### Section 8 — Reference Map

A table mapping common needs to their files. Engineers and the AI both use this to navigate the framework.

---

## Step 3 — Write the Rules Files

### `rules/prompt-quality-gate.md`

Defines the four components in detail with examples of complete and incomplete requests. Include:
- What each component means
- The order to ask for missing components
- An example of an incomplete request and the correct response
- An example of a complete request

### `rules/code-standards.md`

Document your stack's patterns and anti-patterns. Key sections:
- Languages & runtimes
- Naming conventions (per language)
- Framework patterns (backend and frontend)
- Formatting & linting tooling
- Testing requirements and coverage thresholds

**Critically:** add anti-patterns discovered through actual failures — e.g. framework methods that look correct but have unit-testing limitations. These turn retro findings into permanent rules.

### `rules/security.md`

Two sections:
- **Never do these** — injection, auth gaps, secrets, data exposure
- **Always do these** — input validation, auth on every endpoint, least privilege

Add a section for your specific platform's security quirks (e.g. Supabase RLS, AWS IAM patterns, OAuth flows).

### `rules/architecture.md`

One ADR per significant decision. Format:

```markdown
### ADR-001 — <Decision title>
**Decision:** <what was decided>
**Why:** <the reasoning>
**Trade-off:** <what you gave up>
```

Add an ADR whenever a new cross-cutting decision is made — especially ones where the AI might make a different choice if not told (e.g. symmetric vs asymmetric JWT signing, SSR vs SPA, monorepo vs polyrepo).

---

## Step 4 — Write the Skills Files

### `skills/mob-elab-prompts.md`

The mob elaboration reference. Must include:
- The mandatory interactive protocol (turn structure + never-do rules)
- Facilitation prompts for: opening a session, proposing ACs, edge case check, generating API contract, generating implementation scaffold, reviewing output

### `skills/review-checklist.md`

Structured review sections covering all five AI failure modes:

| Section | Failure mode covered |
|---|---|
| Functional Correctness | Logic errors that look correct |
| Code Quality | Over-engineering; dead code |
| Security | Security vulnerabilities |
| Architecture | Architectural drift |
| Tests | Logic errors; hallucinations |
| AI-Specific Checks | Hallucinated library calls; prompt log; scope creep |
| Deployment Readiness | Configuration errors; breaking changes |

Key items that must be present:
- Feature verified in a real environment — tests passing alone is not sufficient
- Nothing in the diff beyond what the ACs required (no extra abstractions or future-proofing)
- Diff checked against system boundaries in `architecture.md`
- Behavioral trade-offs confirmed before accepting output
- For wrapper/layout components: existing files grepped for patterns the new component will duplicate before generation

---

## Step 5 — Write the Guidelines Files

### `guidelines/domain-glossary.md`

Full definitions for every domain term. Each entry: term, definition, usage notes, and related terms. The glossary in the master rule file is a summary — this file is the authoritative source.

### `guidelines/edge-cases.md`

Full descriptions of each known edge case: the scenario, the required behavior, and which parts of the system must handle it. Start with the ones most relevant to your domain. Add entries from retros and incidents.

### `guidelines/acceptance-patterns.md`

Rules for writing good Given/When/Then ACs:
- One behavior per criterion (no compound ACs)
- Name the actor in every Given
- Cover at least one unhappy path per unit
- No implementation details in ACs
- Anti-patterns to avoid (vague outcomes, testing implementation not behavior)


### `guidelines/dev-setup.md`

Step-by-step environment setup for a new engineer:
- All prerequisites with version checks
- Configuration files needed and what goes in them (no actual secrets — explain how to get them)
- How to start each service
- Auth verification steps
- Secrets hygiene checklist

### `guidelines/team-rollout.md`

Covers: git branching conventions, environment isolation, secrets management, backlog ownership, multi-FDE Bolt rhythm, PR checklist, merge conflict resolution (including AI-assisted resolution), team leader review guidelines, and common anti-patterns.

---

## Step 6 — Write the Ops Templates

Each template file defines the structure for its artifact type. The key templates:

### `ops/inception/intents/_template.md`
Fields: Status, Date, Owner, What, Why, Success Looks Like, Assumptions, Open Questions, Out of Scope, Elaboration Sessions, Extracted Units.

### `ops/build/units/_template.md`
Fields: Status, Intent link, Elaboration link, Bolt link, Priority, Context, Acceptance Criteria, Scope (in/out), Dependencies, Pre-generation Checks, Edge Cases to Handle, Definition of Done, Prompt Log link, Notes.

The **Pre-generation Checks** section is critical for wrapper/layout units — list grep patterns to run across existing files before generating to surface duplication.

### `ops/build/bolts/_template.md`
Fields: Status, Goal, Start/Target/Completed dates, Units table, Execution Order diagram, Risks & Assumptions, Definition of Done, Retrospective link.

### `ops/operate/retros/_template.md`
Sections: What Went Well, What Didn't Go Well, AI-Specific Observations (prompts that worked / needed revision / quality gate failures / output accepted without enough review), Actions table, Improvements Triggered (**required** — cannot be left blank without a stated reason), New Intents Triggered.

### `ops/operate/improvements/_template.md`
Fields: Triggered by (retro/incident link), Target file, Current text, Proposed replacement, Reason, Status, Applied date.

---

## Step 7 — Write Instructions2FDE.md

This is the main onboarding document for every engineer. Sections:
1. What AI-DLC is (the loop diagram: Inception → Build → Operate → Improvements)
2. How to invoke each ceremony by talking to the AI (not by following manual steps)
3. What the engineer still owns (review, AC confirmation, running tests, edge case checks)
4. Phase 1 — Inception (how intents and mob elaboration work)
5. Phase 2 — Build (bolts, unit execution order, review before merge)
6. Phase 3 — Operate (retros, incidents, improvements)
7. The Three Non-Negotiables (quality gate, review checklist, prompt log)
8. Using a different AI tool (Cursor → `.cursorrules`; GitHub Copilot → `.github/copilot-instructions.md`)
9. Common mistakes table
10. Quick reference table (ceremony → what to say to the AI)

---

## Step 8 — Confirm Tool Setup and Add Mirror Files

### Primary tool setup

By this point your master rule file should exist at the correct path for your chosen tool (see **Before You Begin**). Verify:

| Tool | Expected path | Loaded automatically? |
|---|---|---|
| Claude Code | `CLAUDE.md` at repo root | Yes — every session |
| Cursor | `.cursorrules` at repo root | Yes — every session |
| GitHub Copilot | `.github/copilot-instructions.md` | Yes — every session |

### Supporting multiple tools in the same repo

If your team uses more than one AI tool, create copies of the master rule file for each additional tool. The content is identical — only the file name, location, and internal link prefixes differ.

**Add Cursor support** (if your primary tool is Claude Code or Copilot):
```bash
cp CLAUDE.md .cursorrules
```
Open `.cursorrules` and update the opening line to reference Cursor.

**Add GitHub Copilot support** (if your primary tool is Claude Code or Cursor):
```bash
mkdir -p .github
cp CLAUDE.md .github/copilot-instructions.md
```
Open `.github/copilot-instructions.md`, update the opening line to reference GitHub Copilot, and change all `ai-dlc/` link prefixes to `../ai-dlc/`.

**Add Claude Code support** (if your primary tool is Cursor or Copilot):
```bash
cp .cursorrules CLAUDE.md   # or copy from .github/copilot-instructions.md
```
Open `CLAUDE.md`, update the opening line to reference Claude Code, and if copying from Copilot change all `../ai-dlc/` prefixes back to `ai-dlc/`.

### Sync discipline

Whenever the master rule file is updated, all mirror files must be updated in the same PR. Add this to your PR checklist — it is a team discipline, not an automated process.

---

## Step 9 — Initialize the Backlog and First Intent

1. Create `ops/build/backlog.md` with empty Open / Planned / In Progress / Done / Blocked / Deferred sections
2. Identify the first capability to build and write an intent: `ops/inception/intents/YYYY-MM-DD-<slug>.md`
3. Say to your AI assistant: "Run a mob elaboration for the [intent name] intent"
4. After sign-off, the AI creates unit files and updates the backlog
5. Say: "Plan a bolt from the open units in the backlog"
6. Say: "Execute unit [name] from bolt [name]"

---

## What Makes This Work

The quality of the framework depends entirely on two things:

**1. The specificity of the master rule file.** Generic rules produce generic output. The more your master rule file encodes your actual domain language, your actual architectural decisions, and your actual learned anti-patterns, the better every AI interaction will be. A master rule file written on day one will be much weaker than one shaped by three bolts of retros.

**2. The discipline of the retro loop.** The retro is the compiler for the process. Every failure that is not encoded into a rule will recur. Every retro that produces no improvement file means the next bolt starts from the same baseline. Run the retro after every bolt, file the improvements, and the framework compounds.

---

## Onboarding Completion — What the Agent Must Produce

When the agent has finished executing this guide, it must output a structured completion report before handing back to the engineer. The report must contain:

### 1. Files Created
A table of every file written during onboarding, grouped by folder.

| File | Status | Notes |
|---|---|---|
| `CLAUDE.md` (or tool equivalent) | Created | Sections 1–8 populated |
| `ai-dlc/rules/...` | Created | … |
| *(etc.)* | | |

### 2. Sections Requiring Engineer Review
List every section or field in the master rule file that the agent could not populate from the codebase and left as a placeholder. The engineer must fill these before the first Bolt runs.

### 3. Open Questions
Any ambiguity the agent encountered that the engineer must resolve — e.g., conflicting patterns found in the codebase, modules where ownership was unclear, or test coverage below the gate threshold.

### 4. First Recommended Action
One sentence: what the engineer should do next (e.g., "Review the domain glossary placeholders in Section 4 of the master rule file, then run a mob elaboration for the first intent in the backlog.").

> The agent must not mark onboarding as complete until all checklist items below are checked and this report has been presented.

---

## Checklist: Ready to Start

**Tool setup**
- [ ] AI tool identified (Claude Code / Cursor / GitHub Copilot)
- [ ] Master rule file created at the correct path for your tool (see Before You Begin)
- [ ] Mirror files created for any additional tools in use (see Step 8)

**Framework files**
- [ ] Folder structure created (`ai-dlc/` tree from Step 1)
- [ ] Master rule file written with all 8 sections (Step 2)
- [ ] `rules/` files written (prompt-quality-gate, code-standards, security, architecture)
- [ ] `skills/` files written (mob-elab-prompts, review-checklist)
- [ ] `guidelines/` files written (domain-glossary, edge-cases, acceptance-patterns, dev-setup)
- [ ] Ops templates written (intent, unit, bolt, retro, incident, improvement)
- [ ] `Instructions2FDE.md` written
- [ ] `ai-dlc/README.md` written

**First iteration**
- [ ] First intent written and ready for mob elaboration
