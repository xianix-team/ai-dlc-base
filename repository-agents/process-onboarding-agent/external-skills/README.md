# External Skills

**Purpose:** Let a project adopt a skill that lives in another repository — a plugin, skill pack, or method maintained outside AI-DLC — without copying that repository's content into the framework. Each external skill is described by one **adapter** file in this folder. The adapter is owned by AI-DLC; the skill's content stays owned by its source repository.

An adapter records five things: where the skill comes from (pinned), which AI tools can run it, when the framework offers it, how to install it, and how its outputs fit into the framework's own artifacts.

This file is copied verbatim into the project's `external-skills/` folder alongside the adapters that apply to the project. In a project installed by the onboarding agent, the runtime protocol below is what the experience agent follows. In a project installed by the skills agent there is no master rule file, so statuses and offer points do not apply — only each adapter's Install, Integration Contract, Precedence, and Remove sections do.

---

## Statuses

Every adapter copied into a project has exactly one status, recorded in the master rule file Section 9 `External skills` row:

| Status | Meaning |
|---|---|
| `Installed (<ref>)` | Installed at the pinned ref named in brackets. Run the skill at its offer point. |
| `Offer at stage` | Not installed. Offer it once at its offer point; install it if the engineer accepts. |
| `Declined` | The team chose not to use it. Never offer it. Only the engineer changes this status. |

An adapter whose `Supported tools` does not include the project's AI tool is never copied into the project and never offered.

---

## Offer Points

An adapter's Stage Offer must name one of these offer points. Adding a new offer point is a framework change to this file, `setup-guide.md`, and the skill that hosts the offer — not something an adapter can declare on its own.

| Offer point | Where it runs | Hosted by |
|---|---|---|
| `Pre-elaboration` | At the start of mob elaboration, after the Solution Shape check and before elaboration mode selection | `skills/mob-elab-prompts.md` |

---

## Runtime Protocol

At an offer point, for each adapter in this folder (every `.md` file except this README) whose Stage Offer names that point:

1. Read the adapter's status from Section 9.
2. Check the adapter's Stage Offer **Condition** against the current intent. If it does not apply, skip the adapter silently.
3. **`Declined`:** skip silently.
4. **`Offer at stage`:** ask the adapter's Stage Offer question once. If the engineer accepts, run the adapter's **Install** section, confirm its verification step passed, update Section 9 to `Installed (<ref>)`, then continue as for `Installed`. If the engineer says no for this intent, proceed without it and do not ask again in this session. If the engineer says never, set Section 9 to `Declined`.
5. **`Installed`:** ask whether to run the skill for this intent now or proceed without it. If run, follow the adapter's **Integration Contract** to bring its outputs back into the framework before the offer point's host skill continues.

Never block a ceremony on an external skill. Installation failure, an unavailable tool, or a declined offer all mean the same thing: proceed without it and note it in the session.

---

## Precedence

The master rule file governs the delivery process. An external skill governs only the work named in its adapter's **Scope**.

- If an external skill's own instructions — its hooks, routing rules, or "always use this skill" directives — claim work outside its Scope, the master rule file wins.
- An external skill's outputs are **inputs** to framework ceremonies. They never replace a framework artifact (intent, elaboration, unit, bolt, ADR) and are never written into `ops/` directly. The adapter's Integration Contract says how each output is carried into the framework.
- The Prompt Quality Gate, review checklist, and every gate in Section 6 still apply to any code an external skill causes to be generated.

---

## Adapter Format

Name the file after the external project in `kebab-case.md` (e.g. `ux-os.md`). Every section is required.

```markdown
# External Skill: <Name>

**Source:** <repository URL>
**Pinned ref:** <tag or full commit SHA — never a branch>
**Version:** <the source's own version at that ref>
**License:** <SPDX identifier>
**Supported tools:** <Claude Code / Cursor / GitHub Copilot — only those it actually runs on>
**Scope:** <one or two sentences: the work this skill owns, and nothing else>

---

## Onboarding Offer

**Project types:** <Fresh / Mature / Both / None>

For each project type listed, the onboarding agent asks:

> "<question — what the skill is, what it produces, and the three choices: install now / offer when relevant / never>"

| Answer | Status written to Section 9 |
|---|---|
| Install now | Run Install; `Installed (<ref>)` |
| Offer when relevant | `Offer at stage` |
| Never | `Declined` |

For project types not listed, write `Offer at stage` without asking.

---

## Stage Offer

**Offer point:** <one offer point from external-skills/README.md>
**Condition:** <when the offer applies to an intent; when it is skipped>

> "<question asked at the offer point when the status is Offer at stage>"

---

## Install

<Exact, tool-specific steps. Prefer project-level configuration that is committed and shared by the team over per-engineer commands. End with a verification step the agent can run or ask the engineer to confirm.>

---

## Integration Contract

**Produces:** <what the skill writes, and where>
**Feeds into:** <which framework artifact or ceremony consumes each output, and how>
**Never:** <framework artifacts the skill must not write or replace>

---

## Precedence

<Any known conflict between this skill's own instructions and the master rule file, and how it is resolved. Write "No known conflicts" if none.>

---

## Remove

<Steps to uninstall, and the Section 9 status to set afterwards.>
```

---

## Accepting a New Adapter into the Base Repo

An adapter is added to `ai-dlc-base` only if all of the following hold:

1. **Pinned.** The Pinned ref is a tag or commit SHA. Bumping it is a reviewed PR to this repo, with the upstream changes between the old and new ref summarised in the PR description.
2. **Licensed.** The source carries an open-source license that permits the use described in Install.
3. **Runnable.** It supports at least one of the framework's AI tools, and `Supported tools` lists only the tools it actually runs on.
4. **Bounded.** Its Scope is explicit, and every conflict between its own instructions and the master rule file is resolved in its Precedence section.
5. **Generic.** It passes the generic test in `CONTRIBUTING.md` once its Stage Offer Condition is applied — useful to any project that meets the condition, not to one team's stack or domain.
