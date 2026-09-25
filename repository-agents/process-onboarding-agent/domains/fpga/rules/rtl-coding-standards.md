# RTL Coding Standards — FPGA

Copied into `{FRAMEWORK_ROOT}/rules/rtl-coding-standards.md` by the Domain Overlay.

## Synchronous Design

- All sequential logic is clocked by a project-approved clock domain (from Section 1's Hardware Profile) — no derived/gated clocks used as a direct clock source unless generated through the clock-management IP the toolchain provides (MMCM/PLL), never a logic-gated clock.
- One clock per always/process block — do not mix clock domains within a single sequential block.
- No latches — every combinational always/process block assigns every output on every path; flag any inferred latch as a defect, not a style nit.

## Reset Strategy

- Match the project's documented reset strategy (from Section 1 / interview FPGA-4) exactly — do not mix synchronous and asynchronous resets across the same design without explicit justification per instance.
- Reset signal naming convention: state it here (e.g. `rst_n` for active-low, `rst` for active-high) — consistency lets a reviewer spot a polarity mistake at a glance.

## Naming Conventions

- Clock signals: `clk` or `clk_<domain>` prefix.
- Reset signals: per the Reset Strategy convention above.
- Registered (flopped) signals: a project-chosen suffix (e.g. `_r` or `_q`) distinguishing them from combinational signals of the same logical name — state the convention here once decided.
- Active-low signals: `_n` suffix.

## Clock Domain Crossing (CDC)

- Every CDC boundary identified in the interview (FPGA-4) or discovered during design uses a documented synchronization scheme — 2-flop synchronizer for single-bit control signals, a handshake protocol for multi-bit control, or an async FIFO for data — matching the Section 3 hard-stop.
- CDC analysis (a lint tool or the toolchain's built-in CDC checker) runs before a unit touching a new or changed CDC boundary is considered reviewable.

## Parameterization

- Reusable blocks are parameterized (bus widths, depths, feature toggles) rather than duplicated with hand-edited constants — state the project's convention for parameter naming.

## Lint

- RTL is lint-clean (Verilator `--lint-only`, or the toolchain's built-in linter) before it's considered reviewable — unresolved lint warnings are called out explicitly, not silently accepted.

## Anti-Patterns

Add entries as retros surface them — e.g. "IP core X's reset requires N cycles of clock before de-assert, easy to miss."
