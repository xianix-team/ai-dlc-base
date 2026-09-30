# Skill: Timing Closure Check

**Purpose:** A hard gate before any bolt containing RTL units is marked complete — distinct from per-unit `fpga-verification.md`, which checks functional correctness in simulation. This skill checks that the design still meets its timing and resource budget after synthesis and place-and-route, which simulation alone cannot confirm.

**Trigger:** Before a bolt containing RTL units is marked complete. Mandatory — no RTL bolt closes without this gate passing, or an explicit, engineer-approved exception recorded.

---

## Step 1 — Run Synthesis and Implementation

Confirm the project's synthesis/implementation flow has been run against the current RTL (Vivado/Quartus/Diamond, or the open-source flow named in Section 1). If it hasn't been run since the bolt's units were merged, this gate cannot pass — run it before proceeding.

---

## Step 2 — Static Timing Analysis (STA)

> "Report the STA summary: worst negative slack (WNS) and total negative slack (TNS) across all constrained paths. Are there any timing violations?"

Any violation on a real (non-false-path, non-exception) constraint fails this gate. If a false-path or multicycle-path exception is involved, confirm it was sign-off recorded in a unit per the Section 3 hard-stop — an exception that was never reviewed does not count as "no violation," it counts as an unreviewed timing risk.

---

## Step 3 — Resource Utilization

> "Report utilization against the budget in Section 1's Hardware Profile — LUTs, flip-flops, BRAM, DSP slices, each as a percentage of device capacity. Is utilization within budget, and is the reserved margin still intact?"

Utilization creeping toward the device's limit without margin is flagged even if it technically fits — closing timing gets harder as utilization rises, and this is the signal that catches it before it becomes a crisis on a later bolt.

---

## Step 4 — CDC/RDC Re-check

If this bolt touched any clock-domain-crossing or reset-domain-crossing boundary, confirm the CDC/RDC analysis tool was re-run against the current build, not just relied on from an earlier check — a boundary that was clean before can be broken by a change elsewhere in the same domain.

---

## Step 5 — Gate Decision

```
Timing Closure — [Bolt name]

WNS / TNS:              [values] — [Clean / Violations present]
Resource utilization:    LUTs [%] / FFs [%] / BRAM [%] / DSP [%] — [within budget / over budget]
CDC/RDC:                 [Clean / Re-check needed / N/A this bolt]

Gate result: [PASS / FAIL — blocked on: list]
```

If FAIL, the bolt does not close. State exactly what must change (timing fix, resource reduction, re-run CDC check) before the gate can be re-run. The engineer may explicitly accept a documented exception (e.g. a known non-critical path violation with a recorded rationale) — record it if so, do not silently pass a failing gate.
