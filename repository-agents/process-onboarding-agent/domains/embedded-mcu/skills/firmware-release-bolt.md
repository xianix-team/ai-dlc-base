# Skill: Firmware Release Bolt

**Purpose:** A bolt workflow for a planned field firmware update — single-image release (not A/B partition; that's `embedded-linux/skills/ota-ab-update-bolt.md`). Distinct from `hotfix-bolt.md`: this is a planned release, not an emergency. Mandates a rollback test before any field rollout.

**Trigger:** Engineer says "release firmware", "field update for X", or "OTA update for X" on a single-image MCU project. Routed from the master rule file Section 6.

---

## Step 1 — Release Intake

Ask:

> "Three things before we plan this release:
> 1. **What's changing?** Summarize the functional/fix content of this release.
> 2. **What's the current fleet state?** How many devices in the field, and what firmware versions are they running?
> 3. **Does the bootloader support rollback to the previous image if this update fails?** Yes / No / Partial (e.g. dual-bank but no automatic fallback)."

If rollback is not supported, state this explicitly and ask the engineer to confirm they want to proceed:

> "No rollback path exists. A bad update requires physical recovery (JTAG/SWD re-flash) on every affected device. Confirm you want to proceed, or consider adding rollback support before this release."

---

## Step 2 — Version and Changelog

Ask for the version bump (following the project's existing scheme, or propose semver if none exists) and build a changelog from the unit(s)/bolt(s) being released. Confirm with the engineer before proceeding.

---

## Step 3 — Rollback Test

**Mandatory, cannot be skipped.** Before any field rollout:

> "Before we approve this for rollout: has the rollback path been tested on a real device — update applied, then rolled back, confirming the device returns to working state on the previous version? If not, this must happen before rollout."

Do not mark the release ready for rollout without this confirmation, unless the engineer has explicitly accepted the no-rollback risk from Step 1.

---

## Step 4 — Staged Rollout Plan

For fleets above a size the engineer specifies as "worth staging" (ask if unsure — a reasonable default trigger is more than ~20 field devices):

> "Should this roll out to the full fleet at once, or staged (e.g. 5% → monitor → 25% → monitor → 100%)? What's the monitoring signal that gates moving to the next stage, and what's the abort criterion?"

Record the plan. For small fleets or bench/lab-only deployments, a single-stage rollout is acceptable — state that explicitly rather than forcing staging ceremony where it adds no value.

---

## Step 5 — Execute and Close

Execute the release per the plan. After each stage (or after the single rollout), confirm the monitoring signal against the abort criterion before proceeding to the next stage or closing the bolt.

Close with:

```
Firmware Release — [version]

Fleet size:        [N] devices
Rollback tested:    Yes / No (risk accepted)
Rollout plan:        Single-stage / Staged: [stages]
Current stage:       [complete / in progress at stage N]
Monitoring signal:   [what's being watched]
```

A retro is recommended but not mandatory for a planned release with no incident — run one if the rollout surfaced anything unexpected.
