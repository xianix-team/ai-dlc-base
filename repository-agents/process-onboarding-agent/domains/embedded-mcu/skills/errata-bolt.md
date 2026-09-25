# Skill: Errata Bolt

**Purpose:** A bug-bolt-style workflow specifically for silicon or peripheral errata — a defect in the chip itself, not in this project's code, requiring a firmware workaround. Distinct from `bug-bolt.md` because the "fix" is a workaround for something that can never actually be fixed, and the workaround must be protected from being "cleaned up" by a future unit that doesn't know why it's there.

**Trigger:** Engineer says "errata workaround", "silicon bug in X", or references a vendor errata sheet/reference number. Routed from the master rule file Section 6.

---

## Step 1 — Errata Intake

Ask:

> "Four things:
> 1. **Errata reference**, if there is one (vendor errata sheet number/ID), or a description if this was discovered independently.
> 2. **What's the symptom** — what goes wrong and under what conditions?
> 3. **Which silicon revisions/steppings are affected?** (Check whether your current hardware revision is even affected — see `ops/hardware-revision-log.md` if this project has one.)
> 4. **Does the vendor document a recommended workaround**, or does one need to be designed?"

---

## Step 2 — Confirm Scope and Workaround Approach

If the vendor documents a workaround, use it as the starting point — do not improvise an alternative without discussing why. If no vendor workaround exists, treat this as a small design problem: propose an approach and confirm with the engineer before implementing.

---

## Step 3 — Create the Focused Unit

Single unit, minimal ceremony (same pattern as `bug-bolt.md`):

**Context:** the errata reference, the symptom, and the workaround approach.

**Acceptance Criteria:**
```
Given [the condition that triggers the erratum]
When [the workaround is applied]
Then [the erratum's symptom no longer occurs]

Given normal operation with the workaround applied
When [the affected peripheral/path is used normally]
Then [no regression in the peripheral's normal behavior — the workaround doesn't break the working case]
```

**Mandatory code annotation:** the workaround implementation must be marked with a comment citing the errata reference and a one-line description of why it exists — this is the one place the framework's "don't over-comment" default is overridden, because a workaround with no explanation reads as a bug and invites a future "cleanup" that reintroduces the defect. State this requirement explicitly in the unit's Definition of Done.

---

## Step 4 — Execute and Record

Execute the unit. Review through `review-checklist.md` as normal.

Add an entry to `rules/code-standards-embedded.md`'s Anti-Patterns section (or a dedicated "Silicon Errata" subsection if the project has enough of these to warrant one):

```markdown
- **[Errata reference]:** [one-line symptom]. Workaround at [file/function]. Affects silicon revision(s): [list]. Do not remove without confirming the affected silicon is no longer in the field.
```

This is what stops a future unit — human or AI — from "simplifying" the workaround away.

---

## Step 5 — Close

```
Errata Bolt Complete — [Errata reference]

Symptom:            [description]
Silicon affected:    [revisions]
Workaround:          [approach]
Documented at:       rules/code-standards-embedded.md — Anti-Patterns
```

If this erratum affects only specific hardware revisions, update `ops/hardware-revision-log.md`'s "Known issues at this revision" column for those revisions.
