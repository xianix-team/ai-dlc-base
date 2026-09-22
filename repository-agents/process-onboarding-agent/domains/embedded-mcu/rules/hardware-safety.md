# Hardware Safety Rules — Embedded MCU

Copied into `{FRAMEWORK_ROOT}/rules/hardware-safety.md` by the Domain Overlay. Defines the fail-safe behavior every unit must design toward, and the interrupt/watchdog discipline that protects it.

## Fail-Safe State

Define, in this file, what "fail-safe" means for this specific project — the framework cannot assume it. At minimum, state:
- The output state actuators/outputs must fall to on any unrecoverable error (e.g. motor driver disabled, relay open, heater off).
- Whether the fail-safe state is achieved by software (last resort — can fail if the fault took down the software) or by hardware default (preferred — e.g. a pull-down that de-energizes a relay if the MCU stops driving it).
- The maximum time allowed between fault detection and reaching the fail-safe state.

## Watchdog Policy

- Which watchdog is used (independent/windowed hardware watchdog vs. a software watchdog) and its timeout period.
- Every task/loop that must feed the watchdog, and the maximum interval between feeds it can tolerate before the system should be considered hung.
- The watchdog is never disabled in shipping firmware. A debug-build-only disable must be behind a compile-time flag that cannot reach a release build undetected (e.g. a build-config assertion, not just a comment).

## Brown-out & Power-Loss Handling

- Brown-out detection threshold and the action taken when it trips (safe shutdown sequence, state save if applicable).
- What state, if any, must survive a power loss (calibration data, fault history, position/counters) and how it's made power-loss-safe (write ordering, redundant copies, CRC-checked).

## ISR Discipline

- Maximum time budget for any single ISR — state the number and how it was derived (worst-case interrupt latency budget from the real-time requirements in Section 1).
- ISRs do only the minimum needed to acknowledge the interrupt and hand off work (flag set, queue post) — heavier processing happens in task/main-loop context, never in the ISR itself.
- Shared state between an ISR and task/main-loop context is protected (critical section, atomic access, or lock-free primitive appropriate to the platform) — document which mechanism this project uses.
- Interrupt priority scheme: which interrupts can preempt which, and why (derived from the real-time budget in Section 1, not arbitrary).

## Peripheral Init Failure

Every peripheral init path has a defined failure behavior — state it here per peripheral as they're added, rather than leaving it implicit in code. Default: init failure on a safety-relevant peripheral halts startup and enters the fail-safe state rather than continuing with that peripheral silently unavailable.
