# Domain Pack: Embedded MCU — Master Rule Additions

Exact snippets the Domain Overlay merges into the master rule file when Embedded MCU is a selected profile. Merge into the existing numbered sections — never create duplicate section headers. Replace every `{FRAMEWORK_ROOT}` placeholder with the resolved path, same as the base guide.

---

## Merge into Section 1 — Project Identity

Add as a subsection, populated from interview answers MCU-1 through MCU-4 (or the Mature-path archaeology equivalent):

```markdown
**Hardware Profile — Embedded MCU:**
- Target: <MCU/SoC family and part number>
- Execution model: <Bare-metal / RTOS: name>
- Toolchain: <compiler, build system>
- Power budget: <active/sleep current targets, battery life target, or "mains-powered — not applicable">
- Timing budget: <hard/soft real-time deadlines, control loop rate, interrupt latency requirements>
- Memory budget: <flash size, RAM size, reserved margin>
- External interfaces: <protocols and what's on the other end, from MCU-3>
- Persistent storage: <medium, filesystem, provisioning approach, from MCU-4>
```

If more than one hardware profile is selected (Domain Overlay Integration Overlay), append: `**Multi-domain system:** this profile shares the board/system with: <list other selected profiles and what each governs>.`

---

## Merge into Section 3 — Code Rules

Add to the hard-stop list (keep the combined list — base + all installed packs — to five items maximum in working memory; anything beyond five moves to `rules/code-standards-embedded.md`):

```markdown
- Never disable or starve the watchdog timer without an explicit, reviewed justification recorded in the unit
- Never call a blocking HAL function (delay, blocking I2C/SPI transfer) from an ISR
- Never perform a flash/EEPROM write from within an ISR
- Never assume a dynamic allocation succeeds after system init — avoid dynamic allocation after init entirely, or check every return value
- Never leave a peripheral or interrupt in an undefined state on an error path — always return to a defined, fail-safe state
```

Prioritize any project-specific "must never happen" rules captured in interview answer MCU-4 over these defaults if they conflict; merge, don't duplicate.

Add routing lines:

```markdown
- Firmware coding conventions and anti-patterns: `{FRAMEWORK_ROOT}/rules/code-standards-embedded.md`
- Fail-safe and hardware-safety rules: `{FRAMEWORK_ROOT}/rules/hardware-safety.md`
```

If MCU-1 recorded an RTOS (not bare-metal), also add:

```markdown
- RTOS task/priority/IPC design rules: `{FRAMEWORK_ROOT}/rules/rtos-design-rules.md`
```

---

## Merge into Section 6 — AI-DLC Workflow

Add routing lines:

```markdown
**Hardware bring-up:** read `{FRAMEWORK_ROOT}/skills/hardware-bring-up.md` when the engineer says "bring up the board", "first power-on for X", or "hardware bring-up for X". Skips elaboration and design session — follow the bring-up workflow directly.
**HIL verification:** read `{FRAMEWORK_ROOT}/skills/hil-verification.md` when all units under an intent that touches hardware behavior are marked Done, or when the engineer invokes it directly. This is the bench/lab-equipment equivalent of `uat.md` for this project — prompt for it instead of (or alongside, if the intent also has user-facing software behavior) the standard UAT skill.
**Firmware release bolt:** read `{FRAMEWORK_ROOT}/skills/firmware-release-bolt.md` when the engineer says "release firmware", "field update for X", or "OTA update for X".
**Errata bolt:** read `{FRAMEWORK_ROOT}/skills/errata-bolt.md` when the engineer says "errata workaround", "silicon bug in X", or references a vendor errata sheet.
```

If the hardware track was opted into (Domain Overlay step 4), also add:

```markdown
**BOM audit:** read `{FRAMEWORK_ROOT}/skills/bom-audit.md` when the engineer invokes it, or when the `Next component audit` date in Section 9 has been reached.
```

---

## Merge into Section 9 — Process Configuration

Only if the hardware track was opted into:

```markdown
| **Last component/BOM audit** | — | Updated automatically each time the bom-audit skill runs |
| **Next component/BOM audit** | YYYY-MM-DD | AI prompts at session start on or after this date; default interval is 90 days |
```
