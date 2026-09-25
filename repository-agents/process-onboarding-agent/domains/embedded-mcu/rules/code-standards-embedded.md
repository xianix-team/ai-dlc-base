# Firmware Coding Standards — Embedded MCU

Copied into `{FRAMEWORK_ROOT}/rules/code-standards-embedded.md` by the Domain Overlay. This is a starting checklist populated further from actual retro findings, same as the base `code-standards.md`.

## Language & Runtime

- State the C/C++ standard in use (e.g. C11, C++17 with embedded restrictions) and any compiler-specific extensions relied on.
- If a MISRA C subset applies (per interview answer MCU-6), name the exact rule set (e.g. "MISRA C:2012 mandatory + required rules") — do not assume the full standard applies unless the engineer said so.

## Naming Conventions

- Peripheral/register-adjacent identifiers match the vendor HAL's own casing convention rather than inventing a new one.
- Prefix or suffix convention for ISR handlers, so they're identifiable at a glance (e.g. `_IRQHandler` suffix, or project equivalent).
- Units in variable names where ambiguity is possible (`timeout_ms`, not `timeout`).

## Memory & Allocation

- State the project's dynamic allocation policy explicitly (from MCU-6): none after init, a fixed memory pool, or unrestricted with mandatory return-value checks.
- Stack usage: state how stack depth is verified (static analysis, linker map review, stack-painting at runtime) and the safety margin required.
- No unbounded recursion in firmware code — flag any recursive function for explicit sign-off.

## HAL / BSP Layering

- Application logic calls the HAL/BSP layer, never raw registers directly, unless MCU-6 recorded an explicit exception (e.g. a latency-critical path that bypasses the HAL).
- Any register-level access outside the HAL must be commented with the datasheet section/register name it corresponds to.

## Error Handling & Fail-Safe Behavior

- Every peripheral init call's return value is checked; failure path returns the system to the fail-safe state defined in `hardware-safety.md`, not a silent continue.
- No `while(1)` busy-loops on error without a watchdog-safe path or explicit rationale — an unhandled error must not lock up the system silently.

## Testing Requirements

- Pure logic (parsers, state machines, calculations, protocol framing) gets host-side unit tests with the HAL mocked out (Unity/Ceedling, GoogleTest with a fake HAL layer, or the project's equivalent).
- Code that only makes sense on-target (ISR timing, actual peripheral behavior) is verified through `hil-verification.md`, not host-side unit tests — do not write a unit test that fakes hardware behavior no one has confirmed matches reality.
- Static analysis (Cppcheck, PC-lint, Coverity, or the project's chosen tool) runs before code is considered reviewable; findings above the project's configured severity threshold block merge.

## Anti-Patterns

Add entries here as retros surface them — e.g. "framework function X looks reentrant but isn't", "vendor HAL function Y blocks internally despite its non-blocking name". These turn real failures into permanent rules, same as the base framework's `code-standards.md`.
