# Userspace Coding Standards — Embedded Linux

Copied into `{FRAMEWORK_ROOT}/rules/userspace-code-standards.md` by the Domain Overlay. Applies to applications and services that run in userspace on the device — the on-device equivalent of the base framework's `code-standards.md`, scoped to the constraints of a resource-limited embedded target.

## Language & Runtime

- State the language(s) in use for userspace components (C/C++, Python, Rust, or a mix) and, for each, the cross-compilation toolchain/target sysroot this project builds against.
- Cross-compilation reproducibility: builds must be reproducible from a clean Yocto/Buildroot environment — no dependency on packages installed ad hoc on a developer's host machine.

## Resource Discipline

- State memory and CPU budgets per service where they matter (this is a constrained target, not a server) — a service with no stated budget defaults to "must not visibly degrade other services under normal load," which is checked at review time, not assumed fine.
- Services that run continuously state their expected steady-state memory footprint, and any unbounded growth (a cache with no eviction, a log with no rotation) is flagged before merge.

## Init & Service Management

- New services are registered with the project's init system (systemd unit, or the project's init convention) with correct dependency ordering — a service must not race its own dependencies at boot.
- Services drop privileges / run as a dedicated non-root user unless there's a stated, reviewed reason they need root (matches the Section 3 hard-stop).

## IPC

- State which IPC mechanism this project standardizes on for which purpose (D-Bus for service-to-service calls, Unix sockets for high-throughput data, shared memory for large buffers) — consistency here makes review predictable, same rationale as the RTOS pack's IPC rule.

## Testing

- Logic that doesn't depend on the target hardware is unit-tested on the host/build machine.
- Behavior that only makes sense on-target (device access, real service interaction) is verified through `board-bringup-linux.md` during bring-up, or through the project's on-target integration test suite if one exists — state which.

## Anti-Patterns

Add entries as retros surface them.
