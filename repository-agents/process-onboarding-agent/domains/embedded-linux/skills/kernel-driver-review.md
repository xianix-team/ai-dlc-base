# Skill: Kernel Driver Review Addition

**Purpose:** An addition to `skills/review-checklist.md`, not a replacement for it — run both whenever a unit touches kernel or driver code. Covers failure modes the standard checklist doesn't, because they're specific to code running in kernel space.

**Trigger:** Any unit whose Scope includes a kernel module, driver, or device tree binding change. Run alongside the standard review checklist before presenting output.

---

## Additional Review Items

- **`checkpatch.pl` clean** — run it; unresolved warnings are called out explicitly to the engineer, not silently accepted, per `rules/kernel-coding-style.md`.
- **Locking correctness** — every shared data structure's locking strategy is stated and consistently applied; no sleeping function called while holding a spinlock or in atomic/interrupt context.
- **Error path cleanup** — every probe/init failure path releases every resource acquired before it, in reverse order, using the kernel's `goto`-cleanup pattern; no leaked reference counts on any path.
- **Reference counting balance** — every `get`/`put` (or equivalent) pair is balanced on every path, success and failure alike.
- **No busy-waiting** where a proper sleep/wait/completion primitive is available.
- **Device tree binding correctness** — a new `compatible` string is only introduced if no existing binding fits; the binding is documented in `ops/device-tree-map/` and cross-referenced from the driver.
- **Build-tested against the actual kernel config** this project uses — not just "compiles with generic defconfig." Confirm the engineer has built against the project's actual `.config` before treating this as reviewable.
- **Upstream diff reviewed** if this touches a vendor BSP fork — confirm the change is diffed against the upstream layer it forks from, so the delta is visible and intentional.

---

## Output

Present findings from this addition alongside the standard review-checklist findings, under a clearly labeled "Kernel/Driver Review" subsection, so the engineer sees both in one place rather than two disconnected passes.
