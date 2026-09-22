# Domain Pack: Embedded Linux — Interview

Covers Yocto/Buildroot-based embedded Linux systems — kernel, BSP, and userspace. Used by the Domain Overlay in place of Questions 2–8 of the base Fresh Project — Structured Interview. Question 1 (Product identity) and Question 9 (Documentation archive threshold) stay generic.

**Mature project usage:** for a Mature project, use these as Phase M1 extraction categories for any segment identified as embedded Linux (kernel, BSP layer, or on-device userspace) rather than asking them directly — confirm findings with the engineer before writing them into the master rule file.

Ask one question at a time. Wait for each answer before continuing.

---

**LNX-1 (fills interview slot Question 2) — Target platform & build system**

> "What SoC/SoM/board is this running on, and who provides the BSP (vendor BSP, community BSP, or built from scratch)? Build system — Yocto (which release/branch?), Buildroot, or a custom/manual cross-compilation setup? What kernel version and branch (vendor fork, mainline, or an LTS branch)?"

---

**LNX-2 (fills interview slot Question 3) — Driver & userspace split**

> "What needs kernel-space work (new drivers, device tree changes, kernel config changes) versus userspace work (services, applications)? What init system runs userspace (systemd, sysvinit, a custom init)? What IPC do userspace components use to talk to each other (D-Bus, Unix sockets, shared memory)?"

---

**LNX-3 (fills interview slot Question 4) — Storage, filesystem & update strategy**

> "What's the root filesystem strategy — read-only (squashfs) with a writable overlay, ext4 read-write, or something else? What's the field update mechanism — Mender, RAUC, SWUpdate, a custom mechanism, or none yet (needs to be established)? Is it A/B partition (atomic, rollback-capable) or single-copy? What flash wear-leveling applies (UBI/UBIFS, or none needed because storage is eMMC/SD with its own wear-leveling)?"

Record the update tool — it determines which `ota-ab-update-bolt.md` conventions apply.

---

**LNX-4 (fills interview slot Question 5) — Security & provisioning**

> "Is there a secure boot chain (bootloader signature verification through to the kernel/rootfs), and if so how far does the chain of trust extend — just the bootloader, or through to rootfs integrity (dm-verity)? Does each device need a unique identity for provisioning (certificate, TPM/secure element)? Is a mandatory access control policy in place or planned (SELinux, AppArmor)? How is remote access handled (SSH with key-based auth, VPN, no remote access by design)?"

---

**LNX-5 (fills interview slot Question 6) — Domain language**

> "List the key terms this system's domain uses. For each, a one-sentence definition."
>
> *Keep asking "any more?" until the engineer says done.*

---

**LNX-6 (fills interview slot Question 7) — Known constraints and license policy**

> "Are there firmware/software choices already decided that must not be changed by the AI? Are there license restrictions on what can be included — for example, is GPLv3 prohibited in a commercial component, or is there a policy requiring all included packages' licenses to be tracked for a Software Bill of Materials (SBOM)? Are there existing BSP patches or vendor-supplied kernel changes that must not be modified without sign-off?"

Capture license policy verbatim — it feeds `rules/license-compliance.md` and the dependency-audit extension.

---

**LNX-7 (fills interview slot Question 8) — First capability**

> "What is the first capability you want to build? Give it a name and one sentence describing what it does."

---

After all seven questions, hand the answers to the Domain Overlay's remaining steps, same as the base interview does for Questions 2–8.
