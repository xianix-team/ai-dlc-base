# Domain Packs

This folder holds optional, additive **domain packs** — extensions to the AI-DLC onboarding agent for non-software engineering domains (embedded firmware, embedded Linux, FPGA/RTL). They are used only when the engineer selects a hardware domain in Question 2 (Domain Profile) of `process-onboarding-agent/setup-guide.md` — Before You Begin. Selecting Software only (the default) means nothing in this folder is ever read.

The mechanism — what a pack contains, and exactly how and when its content is layered onto the base onboarding flow — is defined in `process-onboarding-agent/setup-guide.md` under **Domain Overlay**. This README only tracks which packs currently exist.

## Pack status

| Pack | Folder | Status |
|---|---|---|
| Embedded MCU (bare-metal or RTOS) | `embedded-mcu/` | Built |
| Embedded Linux (Yocto/Buildroot, kernel + userspace) | `embedded-linux/` | Built |
| FPGA / RTL | `fpga/` | Built |

If an engineer selects a profile whose pack folder does not yet exist, the Domain Overlay's fallback instruction applies: onboarding proceeds with the Software default for that profile, and the engineer is told that domain support isn't available in this copy of the framework yet. This fallback stays in place even now that all three packs are built — it protects any future pack added the same way.
