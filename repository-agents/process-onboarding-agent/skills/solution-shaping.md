# Skill: Solution Shaping (Pre-Elaboration)

**Purpose:** Decide the *shape* of a solution before any design or build work begins — how general it should be, how much of it to build, and whether to build it at all. The signed-off shape is recorded on the intent and becomes binding context for the design session and elaboration that follow, so over-engineering and accidental platform-building are caught before any contract or data model is drawn.

Design Session (Phase 0 of mob elaboration) captures *what the design is*. Solution Shaping decides *what kind of solution to design*. The two are complementary: shaping first, then design within the shape.

**Trigger:** Runs after an intent is drafted and before mob elaboration. The engineer can invoke it directly at any time, and the elaboration workflow also **auto-prompts** for it at the start of a session when the intent has no recorded shape — but it is never run without the engineer's go-ahead (see the discretion note below). To invoke it directly:

> "Read `process-onboarding-agent/skills/solution-shaping.md` and shape the solution for [intent name]."

**This step runs at the developer's discretion — it is a judgment call, not a mandatory gate.** For each intent the engineer chooses to run Solution Shaping or to skip straight to mob elaboration. Nothing downstream blocks on it, and skipping it is a legitimate, expected choice for work that doesn't need it.

Use this guide to decide:

- **Run it** when the shape is not obvious — a new capability, something that could become a framework or "platform feature", a request where the answer might be "extend what we already have", "adopt an existing service", or "don't build this at all", or any decision that is expensive to reverse.
- **Skip it** when the intent is plainly small and feature-specific, the approach is already agreed, and there is no generic-vs-one-off or build-vs-buy question to settle — go straight to the design session.

Session length also scales with the request: an obviously feature-specific change may conclude in two questions; a candidate platform capability should run all five.

---

## Step 1 — Read and Anchor the Intent

Read the intent file fully (`What` / `Why` / `Success Looks Like` / `Assumptions` / `Out of Scope`) before saying anything. Then reflect the goal back to the engineer in one sentence:

> "I've read the intent for [intent name]. Before we design anything, I want to decide the *shape* of the solution — how general it should be and how much to build. Is this the goal: [one-sentence summary]?"

Do not proceed until the goal is agreed.

**Fast path:** If you have chosen to run it but the request turns out to be plainly small and feature-specific — no new capability, no reusable surface, no plausible existing alternative — say so, propose a brief shape record, and skip directly to Step 4 with the engineer's confirmation. Do not force all five questions onto work that doesn't need them.

---

## Step 2 — Shape Questions

Ask the following **one per turn**. Wait for each answer before continuing. Require a substantive answer grounded in the engineer's domain knowledge — if the answer is "whatever you think" or an immediate agreement with no added context, pause and ask for the engineer's own judgement before continuing (see `process-onboarding-agent/rules/engagement.md`).

1. > "**Generic or feature-specific?** Is this a one-off for this feature, or the first instance of something other features will need? Name the concrete near-term reuses if you see any."

   *Default to feature-specific. Build the general case only when there are at least two concrete, near-term uses — premature generalisation is one of the most common failure modes in AI-assisted delivery, because generating the general case has become cheap while maintaining it has not.*

2. > "**Expected usage and scale.** Who uses this, how often, and over what data volume?"

   *The answer determines whether the build needs indexing, pagination, caching, or asynchronous processing — or none of them.*

3. > "**Simplest viable.** What is the smallest implementation that satisfies the intent's 'Success Looks Like'? If the approach you have in mind is bigger than that, what specifically justifies the extra?"

4. > "**Extend, build, or buy?** Does an existing module, internal package, or third-party service already cover most of this? If so, why is extending or adopting it insufficient?"

   *Both new subsystems and new dependencies need justification — check what exists before building.*

5. > "**Reversibility.** If we chose the simple option and it turned out to be wrong, how hard would it be to change later?"

   *Cheap to reverse → bias to the simple option now. Expensive to reverse (data migrations, public API contracts, cross-team interfaces) → invest in design depth up front.*

If any answer reveals that the intent's scope is wrong — too broad, too narrow, or solving the wrong problem — pause and recommend updating the intent's `What`, `Success Looks Like`, or `Out of Scope` sections before continuing.

---

## Step 3 — Convention and Conflict Check

Before recording the shape, check it against the project's established decisions:

- Read `process-onboarding-agent/rules/architecture.md` if it exists. If the emerging shape contradicts an existing ADR, surface the conflict immediately and resolve it before recording.
- Read `process-onboarding-agent/guidelines/forbidden-zones.md` if it exists. If the shape would touch a forbidden zone, stop and flag it.
- If neither file exists (fresh or partial installs), rely on the codebase itself and the engineer's knowledge — and flag anything that appears to duplicate an existing capability.

---

## Step 4 — Record the Solution Shape

Present the summary for sign-off **before writing anything**:

```
Solution Shape — [Intent name]

Shape:           Generic | Feature-specific   (+ one-line reason)
Usage / scale:   [summary → what it implies for the build]
Simplest viable: [the chosen minimal approach]
Extend / build / buy: [reuse X | build new because … | adopt Y]
Reversibility:   [cheap | expensive → how much design depth is warranted]
Open risks:      [or "none"]
```

On confirmation:

1. Append a `## Solution Shape` section containing the confirmed summary, dated, to the intent file — the intent instance, never `_template.md`.
2. Add a `**Shape:**` line to the intent file's header (alongside `Status:` / `Date:` / `Owner:`), e.g. `**Shape:** Feature-specific (YYYY-MM-DD)` — so the decision is visible at a glance, mirroring the `Design:` field the design session adds.

---

## Step 5 — Handoff

State clearly:

> "Solution shape is set and recorded on the intent. The next step is mob elaboration — the design session (Phase 0) will design *within* this shape."

Do not begin designing in this session. Stop after the shape is recorded.
