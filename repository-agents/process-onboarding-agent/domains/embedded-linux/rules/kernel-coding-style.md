# Kernel & Driver Coding Style — Embedded Linux

Copied into `{FRAMEWORK_ROOT}/rules/kernel-coding-style.md` by the Domain Overlay. Applies to any code that runs in kernel space — drivers, kernel modules, device tree bindings. Userspace code follows `userspace-code-standards.md` instead.

## Baseline

- Follow the Linux kernel coding style (as enforced by `checkpatch.pl`) for any code submitted to a kernel module or driver — indentation, brace placement, line length, and naming conventions per the kernel's own `Documentation/process/coding-style.rst`. Run `checkpatch.pl` before considering driver code reviewable; unresolved warnings are called out explicitly, not silently ignored.
- No floating-point code in kernel space.
- No busy-waiting where a proper sleep/wait primitive exists — state which primitives this project's drivers use (`wait_event`, completion, etc.).

## Locking & Concurrency

- Every shared data structure accessed from both process and interrupt context states its locking strategy explicitly (spinlock, mutex, RCU) — do not leave this implicit in the code.
- No sleeping function called while holding a spinlock or inside an atomic context — this is a hard-stop, not a style preference; flag any violation before it reaches review.
- State the project's convention for lock ordering where multiple locks are ever held simultaneously, to avoid deadlock.

## Error Paths

- Every driver probe/init function uses the kernel's `goto`-based cleanup pattern (unwind resources in reverse acquisition order on any failure path) rather than duplicating cleanup code at each early return.
- Every error path releases every resource acquired before it, with no leaked reference counts — this is checked explicitly during review, not assumed.

## Reference Counting

- Any structure with a refcount (device, driver, resource) is checked for correct get/put balance on every path, success and failure alike.

## Device Tree

- New device tree bindings follow an existing, documented binding where one exists (check the kernel's `Documentation/devicetree/bindings/` for a compatible existing binding before inventing a new `compatible` string).
- Bindings are recorded in `ops/device-tree-map/` (see that template) alongside the driver that consumes them.

## Submission Checklist (used at review time, alongside `review-checklist.md`)

- `checkpatch.pl` clean (or all warnings explicitly justified)
- No sleeping-in-atomic-context violations
- Every acquired resource released on every path
- Device tree bindings documented and cross-referenced

## Anti-Patterns

Add entries as retros surface them — e.g. "vendor BSP driver X holds a spinlock across a call that can sleep" or similar.
