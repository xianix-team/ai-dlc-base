# Skill: Bitstream Release

**Purpose:** Version and release a bitstream build — the FPGA equivalent of `embedded-mcu/skills/firmware-release-bolt.md`. Ensures every released bitstream is traceable to the RTL that produced it, the timing/utilization it closed at, and the board revision it targets.

**Trigger:** Engineer says "release a bitstream", "tag this build", or "bitstream release for X". Routed from the master rule file Section 6.

---

## Step 1 — Pre-release Checks

Confirm `timing-closure-check.md` has passed for the build being released — a bitstream is not released from a build that hasn't cleared that gate. If it hasn't been run against this exact build, run it first.

---

## Step 2 — Version and Release Notes

> "What version number does this bitstream get (follow the project's existing scheme, or propose one)? Summarize the RTL changes included since the last release."

Build the release notes from the units/bolts included since the last tagged release.

---

## Step 3 — Record Build Provenance

Capture, for the release record:

- RTL source commit/tag this bitstream was built from
- Toolchain version used (synthesis/implementation tool and version — bitstreams are not always reproducible across toolchain versions)
- Timing margin at release (WNS/TNS from the timing closure check)
- Resource utilization at release
- Target board revision(s) this bitstream is compatible with — cross-reference `ops/hardware-revision-log.md` if the Embedded MCU pack is also installed and shares this board

---

## Step 4 — IP Licensing Check

If this design includes licensed third-party IP cores, confirm the release doesn't violate the license terms recorded in interview answer FPGA-6 (e.g. an evaluation-only IP core shipped in a production bitstream) before proceeding.

---

## Step 5 — Close

```
Bitstream Release — [version]

RTL source:            [commit/tag]
Toolchain:              [tool + version]
Timing margin:          WNS [value] / TNS [value]
Utilization:            LUTs [%] / FFs [%] / BRAM [%] / DSP [%]
Target board rev(s):    [list]
IP licensing:           [Clear / Flagged — see note]
```

Store the release record alongside the bitstream artifact (path per project convention) and link it from the bolt file.
