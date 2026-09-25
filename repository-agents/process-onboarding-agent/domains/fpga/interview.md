# Domain Pack: FPGA / RTL — Interview

Covers FPGA/RTL design projects. Used by the Domain Overlay in place of Questions 2–8 of the base Fresh Project — Structured Interview. Question 1 (Product identity) and Question 9 (Documentation archive threshold) stay generic.

**Mature project usage:** for a Mature project, use these as Phase M1 extraction categories for any segment identified as RTL — read the existing RTL, testbenches, and constraint files rather than asking directly, and confirm findings with the engineer.

Ask one question at a time. Wait for each answer before continuing.

---

**FPGA-1 (fills interview slot Question 2) — Target device & toolchain**

> "What FPGA family and part number (Xilinx/AMD, Intel/Altera, Lattice, Microchip)? Which toolchain (Vivado, Quartus, Diamond, or an open-source flow)? Which HDL — VHDL, Verilog, or SystemVerilog — and is there a house style/lint tool already in use?"

---

**FPGA-2 (fills interview slot Question 3) — Timing & resource budget**

> "What are the target clock frequencies for each clock domain in this design? What's the maximum acceptable latency for the critical data path(s)? What's the resource budget — target utilization (as a percentage of device capacity) for LUTs, flip-flops, BRAM, and DSP slices, and how much margin do you want reserved for future work?"

---

**FPGA-3 (fills interview slot Question 4) — Interfaces & external systems**

> "What does this FPGA talk to — a host CPU (PCIe, AXI-Lite/AXI-Stream, a parallel bus), other chips (LVDS, SPI, a custom serial link), ADC/DAC interfaces, or a network interface (Ethernet MAC/PHY)? List each interface and its role."

---

**FPGA-4 (fills interview slot Question 5) — Clock & reset architecture**

> "How many independent clock domains does this design have, and what are their sources (external oscillator, PLL/MMCM outputs, a recovered clock)? What's the reset strategy — synchronous or asynchronous assert with synchronous de-assert, and is there a single global reset or per-domain resets? Which signal boundaries are clock-domain-crossing (CDC) sensitive?"

---

**FPGA-5 (fills interview slot Question 6) — Domain language**

> "List the key terms this system's domain uses — protocol names, signal-naming conventions, block names. For each, a one-sentence definition."
>
> *Keep asking "any more?" until the engineer says done.*

---

**FPGA-6 (fills interview slot Question 7) — Known constraints**

> "Are there RTL choices already decided that must not be changed? Are there existing, verified RTL blocks that must not be modified without sign-off? Is there a licensed IP core in use, and what does its license permit (evaluation-only, per-seat, per-shipped-unit)? Does any part of this design require formal verification (safety-critical paths, a specific assertion set) rather than simulation alone being sufficient?"

---

**FPGA-7 (fills interview slot Question 8) — First capability**

> "What is the first RTL capability you want to build? Give it a name and one sentence describing what it does."

---

After all seven questions, hand the answers to the Domain Overlay's remaining steps, same as the base interview does for Questions 2–8.
