# Skill: OTA A/B Update Bolt

**Purpose:** A bolt workflow for a planned field firmware/software update using A/B (or A/B/recovery) partition update tooling — Mender, RAUC, SWUpdate, or a project-specific equivalent. Distinct from the Embedded MCU pack's `firmware-release-bolt.md` (single-image, no atomic partition swap): this workflow assumes atomic update + automatic rollback are available and must be exercised, not just assumed to work.

**Trigger:** Engineer says "OTA update for X", "field update for X", or "release an update for X" on an embedded Linux project. Routed from the master rule file Section 6.

---

## Step 1 — Release Intake

> "Three things:
> 1. **What's changing** — summarize the content of this update (kernel, rootfs, application layer, or a mix)?
> 2. **What's the current fleet state** — how many devices, what versions are they on?
> 3. **Which update tool** is in use (confirm against Section 1's Hardware Profile — Mender/RAUC/SWUpdate/custom) and is the target partition scheme A/B or A/B/recovery?"

---

## Step 2 — Pre-flight Checks

**Mandatory, cannot be skipped:**

> "Before this is approved for rollout:
> 1. Has the update been applied and the device confirmed to boot successfully on the new partition, in a test environment?
> 2. Has a **failed update** been simulated — e.g. power loss during the write, or a corrupt image — and confirmed the device falls back to the previous working partition automatically?
> 3. Is there a 'confirm boot' / health-check mechanism that marks the new partition as good only after it's confirmed working, so an update that boots but is broken still triggers rollback on next reset?"

Do not proceed to rollout planning until all three are answered. If power-loss-during-update has not been tested, state explicitly that this is a real field risk and ask the engineer whether to test it now or accept the risk knowingly.

---

## Step 3 — Version and Changelog

Same as `firmware-release-bolt.md` Step 2 — confirm the version scheme and build a changelog from the units/bolts being released.

---

## Step 4 — Staged Rollout Plan

> "Should this roll out to the full fleet at once, or staged? What's the monitoring signal for each stage (update-success telemetry, crash reports, a specific health metric), and what's the abort criterion — what triggers halting the rollout and investigating?"

For fleets connected to a device management service (Mender server, RAUC's hawkBit, etc.), record the staging configuration in that tool's terms (rollout groups, phased deployment percentages) rather than inventing a parallel scheme.

---

## Step 5 — Execute and Monitor

Execute per the plan. After each stage, confirm the monitoring signal against the abort criterion before proceeding. If the abort criterion is hit, halt and treat the rollback behavior itself as the safety net — confirm affected devices actually rolled back rather than assuming it.

---

## Step 6 — Close

```
OTA Update Release — [version]

Fleet size:           [N] devices
Update tool:           [Mender/RAUC/SWUpdate/custom]
Rollback tested:       Yes (power-loss simulated, boot-confirm mechanism verified)
Rollout plan:          Single-stage / Staged: [stages]
Current stage:         [complete / in progress at stage N]
Monitoring signal:     [what's being watched]
```

A retro is recommended for the first release using a new update mechanism, or any release where the rollout deviated from plan.
