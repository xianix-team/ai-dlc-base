# RTOS Design Rules — Embedded MCU

Copied into `{FRAMEWORK_ROOT}/rules/rtos-design-rules.md` by the Domain Overlay **only if** interview answer MCU-1 recorded an RTOS rather than bare-metal. Referenced by `skills/design-session.md`'s hardware/RTOS interface step whenever a unit introduces or changes a task.

## Priority Assignment

- State the priority scheme in use (rate-monotonic, deadline-monotonic, or a project-specific fixed scheme) and where it's documented per task.
- New tasks are assigned a priority derived from the scheme, not an arbitrary "seems about right" value — the design session records the derivation.

## Priority Inversion

- Any mutex or shared resource accessed by tasks of different priority uses a priority-inheritance (or priority-ceiling) mechanism the RTOS provides — a plain binary semaphore across priority levels is a hard-stop unless explicitly justified and recorded.
- Flag, during design, any case where a low-priority task holds a resource a high-priority task needs — this is exactly the condition priority inheritance exists to bound; confirm the mechanism is in place, don't assume it.

## Stack Budgeting

- Every task's stack size is derived from a worst-case call-depth estimate plus a documented safety margin (state the margin percentage this project uses), not a copy-pasted default.
- Stack overflow detection is enabled (RTOS-provided stack-painting/high-water-mark check, or MPU-based guard region) — state which mechanism, and confirm it's checked, not just available.

## ISR-vs-Task Split

- ISRs do the minimum to acknowledge and hand off (same rule as `hardware-safety.md`'s ISR Discipline) — deferred work runs in a task woken by the ISR, not inline in the handler.
- State the hand-off mechanism used (RTOS task notification, queue, semaphore) and its worst-case latency from ISR to task wake.

## Inter-Task Communication

- State which IPC primitives this project uses for which purposes (queues for data, semaphores for signaling, mutexes for exclusion, event groups for multi-condition waits) — consistency here makes review predictable.
- No task blocks unboundedly on a resource another task may never release under a fault condition — every blocking call in application code either has a timeout or a documented reason it's safe to block forever (e.g. a dedicated idle-priority task).

## Task Design Checklist (used by `skills/design-session.md`)

For every new or materially changed task, the design session must record: priority and its derivation, worst-case stack usage and margin, period or triggering condition, IPC primitives used and with which other tasks, and whether it can block unboundedly.
