# Skill: Dependency Audit — Embedded Linux Addition

**Purpose:** An addition to `skills/dependency-audit.md`, not a replacement for it — run both when auditing an Embedded Linux project. Covers the Yocto/Buildroot manifests and the license-compliance pass that the standard audit does not know about.

**Trigger:** Any run of `skills/dependency-audit.md` on a project whose master rule file Section 1 Hardware Profile lists Embedded Linux. Run the standard audit first, then this addition, and present the findings together.

---

## Step 1 — Read the Embedded Linux manifests

Read these in addition to the manifests the standard audit finds:

| Build system | Manifests |
|---|---|
| Yocto | `*.bb`, `*.bbappend` recipe files, the layer list in `conf/local.conf` / `conf/bblayers.conf`, `bitbake -g` dependency graph output |
| Buildroot | `.config`, `package/*/Config.in` selections, `manifest.csv` if generated |

For each package, extract its name, pinned version, and declared license (Yocto recipe `LICENSE` field, Buildroot `*_LICENSE` variable).

---

## Step 2 — License compliance pass

Read `{FRAMEWORK_ROOT}/rules/license-compliance.md` for this project's actual license policy, then check the package inventory against it:

- Any package whose license matches the project's **Prohibited licenses** list — a Critical finding regardless of any other severity signal, since it is a legal/compliance issue, not a technical one.
- Any GPL-licensed kernel module (including out-of-tree vendor modules) whose source is not already in the project's source tree or a documented upstream location.
- Any statically linked LGPL dependency — flag it for the engineer to confirm the obligation is met; do not assume it is.
- If the project requires an SBOM (per `license-compliance.md`), confirm one was generated for the last release and flag if it is missing or stale.

---

## Output

Present findings under a clearly labeled "Embedded Linux / License" subsection alongside the standard audit's findings, and rank and convert them into Remediation Bolts using the same Step 5 and Step 6 procedure as the standard audit.
