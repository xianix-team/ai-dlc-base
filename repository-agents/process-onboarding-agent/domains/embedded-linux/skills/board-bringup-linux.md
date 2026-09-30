# Skill: Linux Board Bring-up Bolt

**Purpose:** Bring up embedded Linux on a board for the first time — bootloader through kernel through rootfs. Distinct from `embedded-mcu/skills/hardware-bring-up.md`'s register-level peripheral checkout: this is about getting a Linux system booting and reaching a usable shell, with peripheral driver binding checked along the way. Skips elaboration and design session.

**Trigger:** Engineer says "bring up Linux on X", "bootloader/kernel port for X", or "first boot for X". Routed from the master rule file Section 6.

**Requires:** The Embedded Linux domain pack installed. If the board also has an Embedded MCU pack installed for a coprocessor, register-level bring-up for that coprocessor uses `hardware-bring-up.md` instead — this skill covers the Linux-capable processor only.

---

## Step 1 — Bring-up Intake

> "Three things:
> 1. **What stage is this bring-up starting from?** Bootloader not yet booting, bootloader working but kernel not booting, kernel booting but rootfs/userspace not fully up, or a specific peripheral/driver not yet bound?
> 2. **What's your BSP baseline?** Vendor-provided BSP, a community BSP you're adapting, or a from-scratch port?
> 3. **What's your debug access?** Serial console (which UART, baud rate), JTAG/SWD, or console-only?"

---

## Step 2 — Bootloader Checkpoint

*Skip if bootloader already confirmed working (Step 1 answer indicates a later stage).*

> "Does the bootloader (U-Boot or equivalent) reach its interactive prompt over the serial console? Can it read the kernel image and device tree from your chosen boot media?"

Do not proceed to Step 3 until the bootloader reaches its prompt reliably.

---

## Step 3 — Kernel Boot Checkpoint

> "Does the kernel boot far enough to print to the serial console? Where does it stop, if it doesn't reach a shell — panic, a specific driver probe failure, or a hang with no output?"

If the kernel panics or hangs, work through the failure with the engineer as a diagnostic conversation (kernel log analysis) rather than guessing — ask for the actual console output before proposing a cause.

---

## Step 4 — Device Tree Validation

> "Does the device tree in use match this board's actual pinout and peripheral set? Cross-reference against the hardware's register-map/ICD if one exists (from the Embedded MCU pack, if this board also has one, or the board's schematic)."

Record any device tree corrections needed in `ops/device-tree-map/`.

---

## Step 5 — Peripheral Driver Checkout

For each peripheral relevant to this bring-up, one at a time:

> "Does [peripheral]'s driver bind successfully (check `dmesg` / sysfs)? Is there a minimal userspace test that confirms it's functionally working, not just bound?"

Record pass/fail per peripheral, same pattern as the MCU pack's hardware-bring-up peripheral checkout.

---

## Step 6 — Rootfs and Init Checkpoint

> "Does the rootfs mount successfully? Does init reach the expected target (multi-user, graphical, or your project's custom target)? Are the services you expect at boot actually running?"

---

## Step 7 — Log Findings and Sign-off

For every failed checkpoint, log using the same structure as `hardware-bring-up.md`'s Step 5 (Observed / Expected / Suspected cause / Next step).

```
Linux Board Bring-up — [Board name/revision]

Bootloader:   [Working / Blocked]
Kernel boot:  [Working / Blocked]
Device tree:  [Validated / Corrections logged]
Peripherals:  [N] of [N] bound and functionally checked
Rootfs/init:  [Working / Blocked]

Ready for application/service bolts: [Yes / No — blocked on: list]
```

Update `ops/hardware-revision-log.md` (if the Embedded MCU pack is also installed and shares this board) or an equivalent bring-up record with the outcome.
