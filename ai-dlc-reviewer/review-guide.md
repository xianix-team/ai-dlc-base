# AI-DLC Review Guide

This document is the protocol for the AI-DLC Process Reviewer. It defines the five review domains, the rubric for each artifact type, the scoring system, and the format for the final Review Report.

---

## Artifact Log

Throughout the session, maintain a running log of every artifact the engineer shares. Record the artifact type, the location the engineer provided it from, and a one-word status after review. Do not tell the engineer you are doing this — it is an internal tracking step.

```
| Artifact type       | Location provided by engineer | Status after review |
|---------------------|-------------------------------|---------------------|
| Master rule file    | [path or description]         | Reviewed            |
| Intent file         | [path or description]         | Reviewed            |
| ...                 | ...                           | ...                 |
```

At the end of the session, use this log to assess whether the team's artifacts are organized in a logical, findable, and consistent structure. This becomes the Organization Assessment in the Review Report.

---

## Review Scorecard

Maintain this table throughout the session. Update it after each domain completes.

| Domain | Score | Critical findings | Important findings | Advisory findings |
|---|---|---|---|---|
| 1. Foundation | — | — | — | — |
| 2. Inception | — | — | — | — |
| 3. Build | — | — | — | — |
| 4. Operate | — | — | — | — |
| 5. Process Adherence | — | — | — | — |
| 6. Organization & Structure | — | — | — | — |
| **Overall** | — | — | — | — |

**Scoring scale per domain:**

| Score | Meaning |
|---|---|
| **Aligned** | Artifacts and practice match AI-DLC principles with no critical gaps |
| **Partially Aligned** | Core structure is present but key elements are missing or weak |
| **Not Aligned** | Fundamental principles are not being followed; process is generating risk |

---

## Finding Severity

Every finding must be classified before it goes into the report.

| Severity | Meaning |
|---|---|
| **Critical** | The gap is actively undermining output quality or hiding risk — must be fixed before the next bolt |
| **Important** | The gap weakens the process over time and should be addressed in the next retro |
| **Advisory** | A refinement that would improve quality but is not urgent |

---

## Domain 1 — Foundation

**What you are reviewing:** The master rule file (`CLAUDE.md`, `.cursorrules`, or `.github/copilot-instructions.md`)

**How to request it:**
> "Please share your master rule file — the file your AI tool loads automatically at the start of every session."

**What to look for and how to score it:**

| Check | Aligned | Partially Aligned | Not Aligned |
|---|---|---|---|
| **Project Identity (Section 1)** | Stack, boundaries, and system constraints are specific and accurate | Present but vague or incomplete | Missing or generic placeholder |
| **Prompt Quality Gate (Section 2)** | Routes to `rules/prompt-quality-gate.md` with a clear mandatory-read instruction | Gate referenced but embedded inline as a wall of text | Missing entirely |
| **Code Rules (Section 3)** | 3–5 hard-stop prohibitions in working memory; routes to rules files for the rest | Long lists embedded inline; no routing | Missing or only generic rules |
| **Domain Language (Section 4)** | Routes to `guidelines/domain-glossary.md`; 2–3 critical terms inline | Full glossary embedded inline (not routed) | Domain terms not defined |
| **Edge Cases (Section 5)** | Routes to `guidelines/edge-cases.md` with a mandatory-read instruction | Some edge cases inline; no routing | Missing |
| **Workflow (Section 6)** | Compact turn structure; routes to skills files; includes engagement monitoring reference | Turn structure present but long; no routing | Missing or not enforced |
| **Review Behavior (Section 7)** | Routes to `skills/review-checklist.md` with a mandatory-run instruction | Checklist embedded inline | Missing |
| **Reference Map (Section 8)** | Complete routing table covering all common needs | Partial | Missing |
| **Process Configuration (Section 9)** | Archive threshold set | Present but value not set | Missing section |

**Common findings:**
- Master rule file is a wall of text rather than a routing table — AI loads it but cannot act on it efficiently
- Domain language section uses generic examples rather than the project's actual terms
- Hard-stop list has more than five items — items beyond five belong in `code-standards.md`
- Engagement monitoring reference is missing — disengagement will go undetected

---

## Domain 2 — Inception

**What you are reviewing:** Intent files and elaboration session files

**How to request it:**
> "Please share two or three intent files for recently delivered features — wherever you keep them in your project — and at least one elaboration session file for one of those intents."

Note the location each file comes from in the Artifact Log. Review the intent files first, then the elaboration files.

### Intent File Rubric

| Check | Aligned | Partially Aligned | Not Aligned |
|---|---|---|---|
| **What section** | User-perspective description; no implementation detail | Partially user-facing; some technical leak | Written from a technical perspective |
| **Why section** | Business or user reason clearly stated | Vague or missing motivation | Missing |
| **Success Looks Like** | Observable, non-technical outcome | Technical metric used | Missing |
| **Assumptions and Open Questions** | Specific and relevant | Generic or templated | Missing or empty |
| **Out of Scope** | Explicit list of excluded items | Vague | Missing |
| **Implementation Summary** | Completed for Implemented intents; not filled in for open intents | Partially filled | Missing on Implemented intents, or filled prematurely |
| **Extracted Units** | Units listed with links | Present but unlinked | Missing |

### Elaboration Session File Rubric

| Check | Aligned | Partially Aligned | Not Aligned |
|---|---|---|---|
| **Turn structure followed** | One unit proposed per turn; AC confirmation before edge cases | Multiple units proposed at once | No evidence of turn structure |
| **ACs are testable** | Every AC has Given/When/Then structure; no compound ACs | Some ACs are testable | ACs are vague or describe implementation |
| **Unhappy path covered** | At least one AC per unit covers a failure case | One unhappy path for the whole session | No unhappy paths |
| **Edge cases surfaced** | Referenced `edge-cases.md`; new ones identified | Edge cases discussed informally | Not addressed |
| **Sign-off recorded** | Final summary table and explicit sign-off before file creation | Partial | Files created without sign-off |

**Common findings:**
- "Success Looks Like" describes a technical metric (e.g. "API returns 200") rather than a user outcome
- ACs say "should" instead of "then" — "the system should X" is not a testable criterion
- Unhappy paths are missing — every unit needs at least one failure-case AC
- Elaboration session has no turn structure evidence — the AI proposed all units at once

---

## Domain 3 — Build

**What you are reviewing:** Unit files and bolt files

**How to request it:**
> "Please share the planning file for a recently completed batch of work and three or four of the individual work-item files that were part of it — wherever you keep them."

Note the location each file comes from in the Artifact Log. Review the planning file first to understand the scope, then review the individual work-item files.

### Bolt File Rubric

| Check | Aligned | Partially Aligned | Not Aligned |
|---|---|---|---|
| **Goal is bounded** | One clear outcome; maps to one intent | Multiple intents mixed | Vague or missing goal |
| **Units table** | All units listed with status and links | Present but incomplete | Missing |
| **Execution order** | Dependencies between units are documented | Implied but not stated | Missing — units executed in arbitrary order |
| **Risks and assumptions** | Specific risks listed; assumptions that could invalidate the bolt are named | Generic | Missing |
| **Retrospective link** | Links to completed retro for Done bolts | Missing on Done bolts | — |

### Unit File Rubric

| Check | Aligned | Partially Aligned | Not Aligned |
|---|---|---|---|
| **Context paragraph** | Self-contained; readable without the intent | Requires reading the intent | Missing |
| **ACs** | Testable Given/When/Then; at least one unhappy path; no compound ACs | Partially testable | Vague or missing |
| **Scope** | Explicit in-scope and out-of-scope lists | Only one of the two | Missing |
| **Pre-generation Checks** | Grep patterns listed; forbidden zones checked | Partial | Missing |
| **Breaking Changes Register** | Present and approved for Migration/Remediation bolts; "N/A" for others | Present but not approved | Missing on contract-change units |
| **Definition of Done** | All items checked off; prompt log linked | Partially checked | Not completed |
| **Integration test AC** | Standard or contract-change form present | Missing | Missing |

**Common findings:**
- Units have no out-of-scope section — AI scope-creeps silently
- Pre-generation checks are empty — duplication goes undetected
- Definition of Done not completed after execution — no evidence the unit was properly closed
- Breaking Changes Register missing on Remediation units that changed API contracts

---

## Domain 4 — Operate

**What you are reviewing:** Retro files, improvement files, and incident files (if any)

**How to request it:**
> "Please share your last two retrospective write-ups and any improvement records they triggered — wherever you keep these in your project. If you have had any production incidents, share one of those too."

Note the location each file comes from in the Artifact Log.

### Retro File Rubric

| Check | Aligned | Partially Aligned | Not Aligned |
|---|---|---|---|
| **What Went Well is specific** | Named prompts, decisions, or patterns that worked | Generic observations | Missing |
| **What Didn't Go Well is specific** | Named failures with enough detail to trace to a root cause | Vague observations | Missing or "nothing went wrong" |
| **AI-Specific Observations** | Prompts analysed; quality gate failures logged; output-without-review cases named | Partially filled | Missing or empty |
| **Improvements Triggered** | At least one improvement per retro; reason stated if none | Present but improvements not applied | Left blank with no reason |
| **Post-Retro Workflow completed** | Improvements applied to target files; retro closed only after | Started but not finished | Not run |
| **New Intents Triggered** | Populated or explicitly "None — reason stated" | Missing | — |

### Improvement File Rubric

| Check | Aligned | Partially Aligned | Not Aligned |
|---|---|---|---|
| **Current text and replacement both present** | Exact text shown for both | One is vague | Missing either |
| **Reason traces to the retro** | Explicit link and explanation | Link present, no explanation | Missing |
| **Validation criteria set** | Observable signal defined | Generic | Missing |
| **Status is Applied** | Change is applied; date recorded | Open for more than one bolt | Rejected without reason |

### Incident File Rubric (if applicable)

| Check | Aligned | Partially Aligned | Not Aligned |
|---|---|---|---|
| **Timeline is complete** | Detection, investigation, and resolution all timestamped | Partial | Missing |
| **Root cause is specific** | Names what exactly was wrong, not "human error" | Semi-specific | Vague |
| **AI-DLC contributing factor assessed** | Explicitly checked yes or no with detail | Checked but no detail | Not filled in |
| **Improvements triggered** | At least one improvement filed | None with no reason | Missing section |
| **RCA run** | Root-cause-analysis skill has been run; linked | Not run | — |

**Common findings:**
- Retros produce observations but not improvements — the feedback loop is not closing
- Improvement files are created but never applied — the target files are unchanged
- "What Didn't Go Well" is left blank or says "nothing" — this is a signal the retro was not run seriously
- Incidents have no AI-DLC contributing factor assessment — the framework cannot learn from production failures

---

## Domain 5 — Process Adherence

**What you are reviewing:** Observable practice — not files, but how the team actually works. This domain is assessed through conversation, not artifact inspection.

**How to conduct it:**
Ask the following questions one at a time. Wait for each answer before continuing.

1. > "Walk me through what happens from the moment an engineer decides to build a new feature to the moment the first line of code is generated. What steps happen in between?"

   *Looking for:* intent written → mob elaboration run → ACs confirmed → quality gate checked before code generated.

2. > "When the AI proposes an acceptance criterion during elaboration, what does your team typically do with it? Has anyone ever pushed back on one?"

   *Looking for:* active challenge and modification of ACs, not passive acceptance.

3. > "After the AI generates code, what does the review step look like? Who does it and what are they checking?"

   *Looking for:* review-checklist.md used systematically, not a casual glance at the diff.

4. > "Has the AI ever flagged that the quality gate components were missing before generating code? Can you give me an example?"

   *Looking for:* evidence the gate is actually enforced, not just documented.

5. > "After a retro, how do the improvements get applied? Who does it and how do you know it happened?"

   *Looking for:* improvements applied to the actual files, not just filed and forgotten.

6. > "Have you ever noticed a pattern of recurring issues — the same type of problem appearing across multiple bolts?"

   *Looking for:* awareness of systemic gaps; use of root-cause-analysis skill.

**Scoring:**

| Score | Signal |
|---|---|
| **Aligned** | Engineer describes all steps fluently; evidence of gate enforcement and active AC challenge |
| **Partially Aligned** | Steps are known but shortcuts are taken; review is informal |
| **Not Aligned** | Process is not followed; AI generates code without elaboration or gate; retro loop is not closing |

**Common findings:**
- Engineers describe the process correctly but admit the quality gate is skipped when they are in a hurry
- AC review is passive — the engineer accepts whatever the AI proposes
- Improvements are filed but the target files are never actually updated
- The retro is run but the Post-Retro Improvement Workflow is not — the loop does not close

---

## Review Report Format

Present this report at the end of the session.

---

### AI-DLC Process Review — [Project Name]

**Date:** YYYY-MM-DD
**Reviewer:** AI-DLC Process Reviewer
**Scope:** Full review / [Domain(s) reviewed]

---

#### Review Scorecard

[Insert completed scorecard table]

---

#### Findings

List all findings grouped by severity. For each finding:

```
[CRITICAL / IMPORTANT / ADVISORY] — [Domain]

Observed: [What was seen in the artifact or conversation]
Principle violated: [Which AI-DLC principle this breaks and why it matters]
Recommended change: [Specific, actionable change — name the file, section, or practice to modify]
```

---

#### Organization Assessment

Using the completed Artifact Log, evaluate whether the team's artifacts are organized in a logical, consistent, and findable structure. Score each dimension:

| Dimension | Score | Observation |
|---|---|---|
| **Colocation** | Aligned / Partial / Poor | Are like artifacts stored together? (all intents in one place, all retros in one place, etc.) |
| **Naming consistency** | Aligned / Partial / Poor | Do file names follow a consistent, date-prefixed or slug-based convention that makes chronological order and topic obvious? |
| **Discoverability** | Aligned / Partial / Poor | Could a new team member find any artifact type within 30 seconds without asking? |
| **Cross-linking** | Aligned / Partial / Poor | Are related artifacts linked to each other (intent → units → bolt → retro)? |
| **Orphaned artifacts** | None found / Some found / Many found | Are there files that exist but are not linked from anywhere? |

If the team's structure differs significantly from the AI-DLC recommended layout, note it here and explain whether the deviation is intentional and defensible or accidental and worth correcting.

---

#### First Action

> [One sentence: the single highest-impact change the team should make before the next bolt runs. Name the specific file or practice, not a general improvement.]

---

#### Patterns Worth Monitoring

[Any recurring themes across domains that did not reach Critical severity but suggest a direction the process is drifting. Optional — omit if none.]
