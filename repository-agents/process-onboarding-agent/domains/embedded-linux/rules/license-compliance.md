# License Compliance — Embedded Linux

Copied into `{FRAMEWORK_ROOT}/rules/license-compliance.md` by the Domain Overlay. Read by `skills/dependency-audit.md`'s license-classification step (added to that shared skill when this domain pack is installed) and referenced whenever a new package/layer is added to the build.

## Project License Policy

State this project's actual policy, captured from interview answer LNX-6 — do not leave these as placeholders:

- **Prohibited licenses:** [e.g. "no GPLv3 or AGPL in any component linked into a commercial closed-source userspace binary" — or "none, this project is fully open-source"]
- **SBOM requirement:** [is a Software Bill of Materials required for every release? If yes, what format (SPDX, CycloneDX) and who consumes it?]

## GPL/LGPL Obligations — What to Check

- **Kernel and kernel modules (GPL-2.0):** any kernel module shipped with this project, including out-of-tree vendor modules, is GPL-licensed — the source (or a written offer for it) must be available to anyone who receives the compiled image. Flag any kernel module whose source is not already in the project's source tree or a documented upstream location.
- **Statically linked LGPL libraries:** static linking against an LGPL library imposes different obligations than dynamic linking (typically requiring the ability to relink with a modified version of the library). Flag any LGPL dependency and confirm whether it's linked statically or dynamically before treating the obligation as satisfied.
- **Copyleft packages pulled in transitively:** a Yocto recipe or Buildroot package can pull in a copyleft dependency that isn't obvious from the top-level package list. The dependency-audit skill's manifest read (recipes/package lists) is where this is checked — not just the packages the engineer explicitly added.

## SBOM Generation

If the project requires an SBOM, state where it's generated from (Yocto's built-in license manifest / `bitbake -g` dependency graph, Buildroot's `legal-info` target, or a separate SBOM tool) and where the output is stored per release.

## Escalation

Any finding that looks like a genuine license conflict (a prohibited license actually present in the build) is not something the AI resolves unilaterally — flag it to the engineer immediately, do not silently swap the dependency or silently proceed.
