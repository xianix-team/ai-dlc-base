# Skill: Hardware-in-the-Loop (HIL) Verification

**Purpose:** The bench/lab-equipment equivalent of `uat.md` for units whose acceptance criteria can only be confirmed against real hardware — not a UI demo. Generates a bench-test script from the unit's ACs, guides the engineer through running it with real equipment, and records pass/fail **with the actual measured value**, not just a verdict.

**Trigger:** Runs when all units under an intent that involve hardware-observable behavior are marked Done, or when the engineer invokes it directly ("run HIL verification for [intent]"). For an intent with both hardware-facing and purely software-facing units, run this skill for the former and `uat.md` for the latter — or run both if the intent has both kinds of behavior.

**Three paths, same as `uat.md`:** conduct now, defer, or mark not required — all three recorded in the intent file. An intent cannot move to Implemented without either a HIL Verification entry (for hardware-facing intents) or explicit confirmation none applies.

---

## Step 1 — Identify the Intent and Read Its Units

Read the intent file and every unit file under it. Collect every AC that describes hardware-observable behavior (a signal, a timing relationship, a measured value, a physical output) — separate these from purely software/UI ACs, which belong to `uat.md` instead.

Confirm:

> "I've found [N] hardware-observable acceptance criteria across [N] units. Do you want to run HIL verification now, defer it, or mark it not required?"

---

## Step 2 — Build the Bench-Test Script

Translate each hardware-observable AC into a bench step:

```
Step N — [what's being verified]
  Setup:      [board state, connections, what equipment to have ready]
  Action:     [what to do — apply input, trigger, send command]
  Measure:    [what to observe and with what instrument — oscilloscope channel, logic analyzer trigger, multimeter reading, protocol analyzer capture]
  Expected:   [the value or timing relationship the AC requires, with tolerance]
```

Present the script and ask:

> "Does this bench-test script cover what you want to validate, and do you have the equipment listed for each step? Adjust before we start."

---

## Step 3 — Run the Session

Work through the script one step at a time:

1. Display the step.
2. > "Run this step and report the **measured value**, not just pass/fail — e.g. 'rise time measured at 8.2µs' rather than just 'pass'."
3. Compare the reported measurement against the AC's expected value and tolerance yourself — do not accept a bare "pass" without the number behind it. If the engineer reports only a verdict with no measurement, ask for the measurement before recording the step.
4. If the measurement is outside tolerance: record **Fail** and ask whether this is a firmware issue, a hardware issue, or a test-setup issue before moving on.

**Why a measurement, not a verdict:** the same discipline `uat.md` applies to software (corroborate a reported result with readable evidence before recording it) applies here with more force — a scope trace or a logic-analyzer capture is the readable evidence, and "looked fine" is not a substitute for the number the AC actually specified a tolerance against.

---

## Step 4 — Record the Session Outcome

```
HIL Verification Complete — [Intent name]
Date: YYYY-MM-DD

Results:
  Pass:    [N] steps (with measured value logged for each)
  Fail:    [N] steps
  Skipped: [N] steps

Overall: [Passed | Passed with findings | Failed | Inconclusive]
```

Same overall-outcome rules as `uat.md`: any Fail → Failed; no Fails but a borderline/marginal pass → Passed with findings; all clean → Passed; more than half skipped → Inconclusive.

For any Fail, ask whether to log a new unit (firmware fix) or a hardware bring-up follow-up (if the root cause looks like a hardware defect rather than a firmware one) — do not assume it's a firmware bug by default.

---

## Step 5 — Write the Sign-off

Write a `## HIL Verification Sign-off` section into the intent file, in the same location and with the same status vocabulary (Passed / Passed with findings / Failed / Deferred / Not required) as `uat.md`'s UAT Sign-off, but with a **Measurements** column added to the results table:

```markdown
## HIL Verification Sign-off

**Status:** [status]
**Date:** YYYY-MM-DD
**Equipment used:** [oscilloscope model, logic analyzer, etc.]

### Session Results

| Step | Description | Measured | Expected | Result | Notes |
|---|---|---|---|---|---|
| 1 | | | | | |

**Overall:** [summary]
```

If the intent also has purely software-facing ACs verified separately through `uat.md`, note in this section that both sign-offs together gate the intent's move to Implemented.
