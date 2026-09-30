# Domain Pack: FPGA / RTL — Master Rule Additions

Exact snippets the Domain Overlay merges into the master rule file when FPGA/RTL is a selected profile. Merge into the existing numbered sections — never duplicate a section header.

---

## Merge into Section 1 — Project Identity

```markdown
**Hardware Profile — FPGA/RTL:**
- Target device: <family and part number>
- Toolchain: <Vivado/Quartus/Diamond/open-source>
- HDL: <VHDL/Verilog/SystemVerilog>
- Clock domains: <count and sources, from FPGA-4>
- Timing budget: <target frequencies per domain, max latency requirements, from FPGA-2>
- Resource budget: <target utilization % for LUTs/FFs/BRAM/DSP, margin reserved>
- External interfaces: <from FPGA-3>
```

If more than one hardware profile is selected (Integration Overlay), append: `**Multi-domain system:** this profile shares the board/system with: <list other selected profiles and what each governs>.`

---

## Merge into Section 3 — Code Rules

Add to the hard-stop list (keep the combined list to five items; overflow goes to `rules/rtl-coding-standards.md`):

```markdown
- Never introduce a new clock-domain crossing without a documented synchronization scheme (2-FF synchronizer, handshake, or async FIFO — state which and why)
- Never use an asynchronous reset assert without a documented justification; default is synchronous assert, synchronous de-assert
- Never bypass a timing constraint or add a false-path/multicycle-path exception without engineer sign-off recorded in the unit
- Never merge RTL that has not passed simulation against its block's testbench
```

Prioritize any project-specific rules from interview answer FPGA-6 over these defaults if they conflict.

Add routing line:

```markdown
- RTL coding standards: `{FRAMEWORK_ROOT}/rules/rtl-coding-standards.md`
```

---

## Merge into Section 6 — AI-DLC Workflow

```markdown
**FPGA verification:** read `{FRAMEWORK_ROOT}/skills/fpga-verification.md` as an addition to `review-checklist.md` for every unit that changes RTL — run both, not one instead of the other. No RTL unit is marked Done without passing this skill's simulation/coverage gate.
**Timing closure check:** read `{FRAMEWORK_ROOT}/skills/timing-closure-check.md` before any bolt containing RTL units is marked complete. This is a hard gate on Definition of Done, not an optional check.
**Bitstream release:** read `{FRAMEWORK_ROOT}/skills/bitstream-release.md` when the engineer says "release a bitstream", "tag this build", or "bitstream release for X".
```

---

## Merge into Section 9 — Process Configuration

Optional — add only if the engineer wants a recurring resource/timing budget review distinct from per-unit timing closure (useful on long-running designs where budget creep across many small units goes unnoticed):

```markdown
| **Next resource/timing budget review** | YYYY-MM-DD | Re-check overall utilization and timing margin against Section 1's budget, not just per-unit closure |
```
