# Skill: Hardware Bring-up Bolt

**Purpose:** A lightweight bolt workflow for validating a board for the first time — first power-on, clock/rail verification, and peripheral-by-peripheral checkout. Skips elaboration and the design session (there's no software design decision yet — the point is confirming the hardware works as intended). Produces a bring-up log and a sign-off before the board is considered ready for firmware bolts.

**Trigger:** Engineer says "bring up the board", "first power-on for X", or "hardware bring-up for X". Routed from the master rule file Section 6. Load this skill immediately — do not begin elaboration.

**Requires:** The Embedded MCU domain pack installed. If a hardware revision log exists (`ops/hardware-revision-log.md`), read it first — bring-up on a new revision should note any known issues carried over from the previous one.

---

## Step 1 — Bring-up Intake

Ask the engineer:

> "Before we start:
> 1. **Which board revision is this?** (Check against `ops/hardware-revision-log.md` if one exists — is this a new revision or a repeat bring-up?)
> 2. **What's being validated?** List the peripherals/subsystems in scope — power rails, clock, and then each peripheral (e.g. 'power rails, main oscillator, UART0, SPI to the IMU, the LED driver').
> 3. **What's your bench setup?** Current-limited PSU or fixed supply? Do you have a multimeter, oscilloscope, or logic analyzer available for verification?"

Do not proceed to power-on until all three are answered.

---

## Step 2 — Pre-Power Safety Check

Before any power is applied, confirm with the engineer:

> "Before you apply power: confirm reverse-polarity protection is in place or the supply polarity has been double-checked, confirm the bench supply's current limit is set conservatively for a first power-on (not the board's full rated current), and confirm there's no accidental short from assembly (visual inspection under magnification if this is a first-off board)."

Wait for explicit confirmation. Do not proceed to Step 3 without it.

---

## Step 3 — Power-On Sequence

Work through checkpoints one at a time — **never skip ahead to a peripheral before the checkpoint before it passes.**

1. > "Apply power. What does the bench supply show for current draw? Is it within the expected quiescent range, or spiking (indicating a short)?"
2. > "Measure each power rail against its expected voltage. Report each one."
3. > "Confirm the clock is running — main oscillator or crystal, at the expected frequency, if you can measure it."
4. > "Does the core boot? (e.g. a debugger can attach, or a boot LED/UART banner appears, depending on what firmware is already loaded.)"

If any checkpoint fails, stop. Do not proceed to peripheral checkout — log the failure (Step 5) and treat it as a bring-up blocker.

---

## Step 4 — Peripheral Checkout

For each peripheral listed in Step 1, one at a time:

> "Testing [peripheral name]. What's the minimal test — a register read that should return a known ID/reset value, a loopback, a known-good response from an attached device? Run it and report the result."

Record pass/fail per peripheral. A failed peripheral does not block checkout of unrelated peripherals — continue through the list and log all failures together.

---

## Step 5 — Log Findings

For every failed checkpoint or peripheral, create an entry:

```markdown
### [Checkpoint/peripheral name] — FAIL

**Observed:** [what happened]
**Expected:** [what should have happened]
**Suspected cause:** [assembly defect / design defect / component failure / firmware not yet written for this / unknown]
**Next step:** [rework, redesign, defer to firmware bring-up, escalate to hardware engineer]
```

If a failure looks like a hardware defect requiring rework or redesign, this is not fixed by a firmware unit — tell the engineer explicitly and do not attempt to write firmware code to work around an unconfirmed hardware fault.

---

## Step 6 — Sign-off

Present the summary:

```
Hardware Bring-up — [Board name/revision]

Checkpoints passed: [N] of [N]
Peripherals passed:  [N] of [N]
Failures logged:     [N] (see findings above)

Ready for firmware bolts: [Yes / No — blocked on: list]
```

If ready, update `ops/hardware-revision-log.md` with this revision's bring-up outcome and any known issues carried forward. If not ready, the engineer decides whether to proceed with firmware bolts against the working subset of peripherals or wait for hardware rework — record their decision.
