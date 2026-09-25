# Domain Packs — Embedded, RTOS, Linux, and FPGA

← [Back to README](../README.md)

---

## What This Is

The 99x Intent Delivery Framework's onboarding, elaboration, risk-assessment, and dependency-audit ceremonies were originally written for software (web/backend/mobile) projects. **Domain packs** extend the same framework — the same intent → design → elaborate → build → UAT/verify → retro loop — to cover mid-to-large embedded and RTL engineering:

| Domain Profile | Covers |
|---|---|
| **Embedded MCU** | Bare-metal or RTOS firmware on microcontrollers |
| **Embedded Linux** | Yocto/Buildroot-based systems — kernel, BSP, and userspace |
| **FPGA / RTL** | RTL design, simulation, timing closure |

Selecting **Software** (the default) leaves the framework completely unchanged — nothing described here is read, asked, or written for a software-only project. A hardware Domain Profile is opt-in, selected once during onboarding.

---

## How It Works

During onboarding (`process-onboarding-agent/onboard.md`), the engineer is asked which domain(s) apply — **multiple selections are supported**, since a real board often combines more than one (e.g. a Linux applications processor, an MCU coprocessor for real-time sensor control, and an FPGA for signal processing, all on one system). Whichever profile(s) are selected, the **Domain Overlay** (defined in `repository-agents/process-onboarding-agent/setup-guide.md`) layers the matching pack(s) from `repository-agents/process-onboarding-agent/domains/` on top of the standard onboarding flow:

- The domain pack's `interview.md` replaces the generic tech-stack questions with domain-relevant ones (target hardware, real-time/power/resource budget, communication interfaces, storage/update strategy, and — for embedded Linux — build system and license policy).
- The domain pack's `master-rule-additions.md` merges a Hardware Profile subsection, domain-specific hard-stop rules, and skill routing lines into the generated master rule file.
- The domain pack's `rules/`, `skills/`, and `ops/` files are copied into the project's installed framework alongside the standard ones.

Nothing in the base framework is removed or rewritten by this — it is strictly additive, the same pattern the framework already uses for Fresh vs. Mature project onboarding.

**If two or more hardware profiles are selected**, an **Integration Overlay** also activates: the Phase 0 design session gains a step for the inter-processor interface (e.g. Linux↔MCU, Linux↔FPGA) as its own Interface Control Document, and the bolt risk assessment's blast-radius table gains a Domain column, since a defect on an Embedded Linux processor (OTA/SSH rollback) and one on an MCU coprocessor (JTAG re-flash, possibly requiring physical access) are not equivalent-cost failures.

---

## What Each Pack Adds

**Embedded MCU** (`domains/embedded-mcu/`) — bare-metal or RTOS design decisions folded into the Phase 0 design session (task priority, stack budget, ISR-vs-deferred-work split); firmware coding standards and fail-safe/watchdog/ISR rules; a hardware bring-up bolt (first power-on and peripheral checkout); a HIL (hardware-in-the-loop) verification skill that replaces UAT's plain-language demo with a bench-test script and requires a measured value, not just a pass/fail verdict; a BOM/component-EOL audit (opt-in, hardware track only); a single-image firmware release bolt; and an errata bolt for silicon workarounds that protects the workaround from being "cleaned up" by a later unit that doesn't know why it exists.

**Embedded Linux** (`domains/embedded-linux/`) — kernel/driver coding style (checkpatch-aligned) and userspace coding standards; a license-compliance rule file covering GPL/LGPL obligations and SBOM requirements; a Linux-specific board bring-up bolt (bootloader → kernel → device tree → rootfs, distinct from the MCU pack's register-level bring-up); an A/B partition OTA update bolt that mandates a simulated power-loss-during-update test before any field rollout; and a kernel-driver review addition layered onto the standard review checklist. Its dependency audit needs are met by **extending** the framework's existing `dependency-audit.md` — adding Yocto/Buildroot manifest types and a license-classification pass — rather than by a separate skill, since the shape of that ceremony (manifest → scan → classify → remediation bolt) already fits.

**FPGA / RTL** (`domains/fpga/`) — synchronous-design and clock-domain-crossing coding rules; an FPGA verification skill that layers onto the review checklist and requires testbench/simulation/coverage evidence (not a diff read) before an RTL unit is marked Done; a timing-closure check that gates bolt completion on static timing analysis and resource-utilization results, not just functional simulation; and a bitstream release skill that records build provenance (RTL commit, toolchain version, timing margin, target board revision) with every release.

---

## Compliance and the Hardware Track — Both Opt-In

- **Compliance checklists** (MISRA-C, IEC 61508, ISO 26262, DO-178C, or equivalents) are never run automatically. They run only when the engineer explicitly asks. If asked without naming a specific standard, the framework defaults to the relevant open/publicly-available reference for that context rather than assuming a specific paid or proprietary scheme.
- **The hardware track** (schematic/PCB review, BOM sourcing and component-lifecycle tracking) is off by default in every pack. It activates only if the engineer opts in during the domain interview — otherwise hardware is treated as a fixed interface the firmware/RTL works against.

---

## Adopting a Single Skill Without the Full Framework

Domain-pack skills follow the same bespoke-adoption path as the base framework's skills (see [Skills for bespoke processes](skills-for-bespoke-processes.md)) — a team that wants just, say, the HIL verification skill or the timing-closure check without the full governance layer can adopt it standalone through `process-skills-agent/`.
