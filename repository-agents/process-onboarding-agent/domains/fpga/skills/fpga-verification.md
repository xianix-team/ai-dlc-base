# Skill: FPGA Verification

**Purpose:** An addition to `skills/review-checklist.md` for RTL — not a replacement. Run both whenever a unit changes RTL. Where software review checks logic by reading a diff, RTL correctness is established by simulation evidence — this skill defines what evidence is required before an RTL unit can be marked Done.

**Trigger:** Any unit whose Scope includes RTL. Run alongside the standard review checklist before presenting output, and again before the unit is marked Done.

---

## Step 1 — Testbench Requirement

Every new or changed RTL block has a testbench covering its behavior — a unit that changes RTL with no corresponding testbench update is not reviewable. Confirm:

> "What testbench covers this block, and did it change as part of this unit? If this block has no testbench yet, one must be written as part of this unit — not deferred."

---

## Step 2 — Simulation Pass

> "Run the testbench. Report the result — pass/fail per scenario, not just an overall verdict."

A unit is not marked Done on a partial simulation pass. Any failing scenario blocks the unit exactly as a failing test would in the software review checklist.

---

## Step 3 — Coverage Check

> "What's the code coverage (line/branch/toggle) and functional coverage achieved by this testbench? Does it meet this project's coverage target (state the target if one exists, or propose one and confirm with the engineer if this is the first RTL unit)?"

Coverage gaps on the block's critical paths (as identified in the block diagram / design session) are flagged explicitly — a high aggregate coverage number can still hide an untested critical path.

---

## Step 4 — Assertions (SVA) for Critical Invariants

For any block with a stated invariant that must never be violated (a FIFO that must never overflow, a state machine that must never reach an illegal state, a protocol timing relationship) — confirm an assertion exists to catch a violation in simulation, not just a hope that the testbench happens to exercise it.

---

## Step 5 — Formal Verification (only if flagged in interview FPGA-6 or by the engineer)

If this block was flagged as requiring formal verification (safety-critical path, or a specific property the engineer wants proven rather than simulated), do not treat simulation coverage as sufficient. State explicitly that formal verification is outstanding until run, and do not mark the unit Done on simulation evidence alone.

---

## Step 6 — Record the Testbench Report

Write (or update) `ops/testbench-report/[block-slug].md` from the template, with the actual scenario results, coverage numbers, and a reference to the waveform/log evidence — not just a summary claim. Link it from the unit file's Definition of Done.

---

## Output

Present findings from this skill alongside the standard review-checklist findings, under a clearly labeled "FPGA Verification" subsection. A unit with RTL in scope is not marked Done until both this skill and the standard review checklist pass, and `timing-closure-check.md` has passed at the bolt level.
