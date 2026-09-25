# Domain Pack: Embedded Linux — Master Rule Additions

Exact snippets the Domain Overlay merges into the master rule file when Embedded Linux is a selected profile. Merge into the existing numbered sections — never duplicate a section header.

---

## Merge into Section 1 — Project Identity

```markdown
**Hardware Profile — Embedded Linux:**
- Target: <SoC/SoM/board, BSP source>
- Build system: <Yocto release/branch, or Buildroot, or custom>
- Kernel: <version/branch>
- Rootfs strategy: <read-only squashfs + overlay / ext4 rw / other>
- Update mechanism: <Mender / RAUC / SWUpdate / custom / none yet>, <A/B partition / single-copy>
- Security: <secure boot chain extent, MAC policy, provisioning approach>
- Init system: <systemd / sysvinit / custom>
```

If more than one hardware profile is selected (Integration Overlay), append: `**Multi-domain system:** this profile shares the board/system with: <list other selected profiles and what each governs>.`

---

## Merge into Section 3 — Code Rules

Add to the hard-stop list (keep the combined list to five items; overflow goes to `rules/kernel-coding-style.md` / `rules/userspace-code-standards.md`):

```markdown
- Never disable secure boot or dm-verity in a build destined for the field, even temporarily, without an explicit reviewed exception
- Never write directly to a raw flash/MTD device outside the project's designated update mechanism
- Never commit a BSP layer change without a diff reviewed against the upstream layer it forks from
- Never run a userspace service as root when a lower-privilege user or dropped capability set would work
```

Prioritize any project-specific rules from interview answer LNX-4/LNX-6 over these defaults if they conflict.

Add routing lines:

```markdown
- Kernel/driver coding style: `{FRAMEWORK_ROOT}/rules/kernel-coding-style.md`
- Userspace coding standards: `{FRAMEWORK_ROOT}/rules/userspace-code-standards.md`
- License compliance policy: `{FRAMEWORK_ROOT}/rules/license-compliance.md`
```

---

## Merge into Section 6 — AI-DLC Workflow

```markdown
**Linux board bring-up:** read `{FRAMEWORK_ROOT}/skills/board-bringup-linux.md` when the engineer says "bring up Linux on X", "bootloader/kernel port for X", or "first boot for X". Skips elaboration and design session.
**OTA A/B update bolt:** read `{FRAMEWORK_ROOT}/skills/ota-ab-update-bolt.md` when the engineer says "OTA update for X", "field update for X", or "release an update for X" on this project.
**Kernel driver review:** read `{FRAMEWORK_ROOT}/skills/kernel-driver-review.md` as an addition to the standard review checklist whenever a unit touches kernel or driver code — run both, not one instead of the other.
```

**No new dependency-audit routing line is needed** — the base Section 6 template already routes to `skills/dependency-audit.md`, and that skill file itself (in `{FRAMEWORK_ROOT}/skills/`) already covers Yocto/Buildroot manifests and license classification once this domain pack is installed. Do not add a duplicate routing line.

---

## Merge into Section 9 — Process Configuration

No new row required. The existing `Next dependency audit` row (already present in the base Section 9 template) covers this domain's package/license audit too, since `dependency-audit.md` was extended rather than replaced.
