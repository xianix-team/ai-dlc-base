# External Skills

**Purpose:** Let a project adopt a skill that lives in another repository — a skill pack or method maintained outside AI-DLC — without copying that repository's content into the framework. An external skill reaches the project through an **MCP server** its maintainers publish as a versioned package. The AI tool connects to that server and reads the skill's procedures from it at run time. Each external skill is described by one **adapter** file in this folder. The adapter is owned by AI-DLC; the skill's content stays owned by its source repository.

An adapter records six things: where the skill comes from (pinned to an exact package version), which AI tools can run it, what the project needs before it can be offered, when the framework offers it, how its MCP server is launched, and how its outputs fit into the framework's own artifacts.

This file is copied verbatim into the project's `external-skills/` folder alongside the adapters that apply to the project. In a project installed by the onboarding agent, the runtime protocol below is what the experience agent follows. In a project installed by the skills agent there is no master rule file, so statuses and offer points do not apply — only Connecting a Server, Removing a Server, and each adapter's Requirements, Server, Integration Contract, Precedence, and Remove sections do.

---

## Statuses

Every adapter copied into a project has exactly one status, recorded in the master rule file Section 9 `External skills` row:

| Status | Meaning |
|---|---|
| `Installed (<version>)` | The skill's MCP server is in the project's MCP configuration at the pinned version named in brackets. Run the skill at its offer point. |
| `Offer at stage` | Not installed. Offer it once at its offer point; install it if the engineer accepts. |
| `Declined` | The team chose not to use it. Never offer it. Only the engineer changes this status. |

An adapter whose `Supported tools` does not include the project's AI tool is never copied into the project and never offered.

---

## Readiness

Before asking any adapter's question — at onboarding or at an offer point — check its **Requirements** (for example, a minimum Node.js version for an `npx` launch command). Run the check the adapter gives, or ask the engineer to confirm it.

If a requirement is not met, do not ask the question. Tell the engineer in one line what is missing and that the skill will be offered again once it is in place, and keep (or record) the status `Offer at stage`. A skill is only ever offered to a team that is ready to run it.

---

## Offer Points

An adapter's Stage Offer must name one of these offer points. Adding a new offer point is a framework change to this file, `setup-guide.md`, and the skill that hosts the offer — not something an adapter can declare on its own.

| Offer point | Where it runs | Hosted by |
|---|---|---|
| `Pre-elaboration` | At the start of mob elaboration — the design stage — after the Solution Shape check and before elaboration mode selection | `skills/mob-elab-prompts.md` |

---

## Runtime Protocol

At an offer point, for each adapter in this folder (every `.md` file except this README) whose Stage Offer names that point:

1. Read the adapter's status from Section 9.
2. Check the adapter's Stage Offer **Condition** against the current intent. If it does not apply, skip the adapter silently.
3. **`Declined`:** skip silently.
4. **`Offer at stage`:** check **Readiness** first. If the project is ready, ask the adapter's Stage Offer question once. If the engineer accepts, follow **Connecting a Server**, update Section 9 to `Installed (<version>)`, then continue as for `Installed`. If the engineer says no for this intent, proceed without it and do not ask again in this session. If the engineer says never, set Section 9 to `Declined`.
5. **`Installed`:** check that the server's tools are available in this session. If they are not — the server was added in this session, has not been approved, or (in HTTP mode) is not running — tell the engineer what to do from **Connecting a Server**, step 4, and proceed without it. Otherwise ask whether to run the skill for this intent now or proceed without it. If run, follow the adapter's **Integration Contract** to bring its outputs back into the framework before the offer point's host skill continues.

Never block a ceremony on an external skill. An unmet requirement, a server that fails to connect, or a declined offer all mean the same thing: proceed without it and note it in the session.

---

## Connecting a Server

An adapter's **Server** section gives a server name, a stdio launch command, and, if the server supports it, an HTTP launch command and URL. Use stdio unless the engineer asks for HTTP.

1. **Write the entry into the AI tool's project MCP configuration** at the repository root. Merge it into the file if it exists — keep every other server and key unchanged.

   | AI tool | File | stdio entry | HTTP entry |
   |---|---|---|---|
   | Claude Code | `.mcp.json` | `"mcpServers": { "<server>": { "command": "<cmd>", "args": [<args>] } }` | `"mcpServers": { "<server>": { "type": "http", "url": "<url>" } }` |
   | Cursor | `.cursor/mcp.json` | `"mcpServers": { "<server>": { "command": "<cmd>", "args": [<args>] } }` | `"mcpServers": { "<server>": { "url": "<url>" } }` |
   | GitHub Copilot (VS Code) | `.vscode/mcp.json` | `"servers": { "<server>": { "type": "stdio", "command": "<cmd>", "args": [<args>] } }` | `"servers": { "<server>": { "type": "http", "url": "<url>" } }` |

   `<cmd>` and `<args>` come from splitting the adapter's stdio launch command on spaces — the first word is the command, the rest are the arguments, in order. The pinned version stays inside the arguments exactly as the adapter writes it.

2. **HTTP mode only:** the server is not started by the AI tool. Each engineer runs the adapter's HTTP launch command in a separate terminal and keeps it running while they work. Tell the engineer this, and that the URL in the entry must match the address the server prints on start.

3. **Tell the engineer to commit the file**, so everyone on the team gets the server. If the file is gitignored in this project, say so: each engineer must add the entry on their own machine.

4. **Verify.** MCP servers load when a session starts, not mid-session, and each AI tool asks before using a server from a project file for the first time. Tell the engineer to start a new session and approve the server, then confirm it is connected:
   - **Claude Code:** `claude mcp list` shows `<server>: … ✓ Connected`.
   - **Cursor:** Settings → MCP shows the server enabled with its tools listed.
   - **GitHub Copilot (VS Code):** the **MCP: List Servers** command shows the server as Running.

   If it fails to connect, run the stdio launch command in a terminal — the error it prints is the cause (most often an unmet requirement).

On native Windows, Claude Code needs `npx` launch commands wrapped as `"command": "cmd", "args": ["/c", "npx", ...]`. If the team works across operating systems, tell the engineer and let them choose which form to commit.

---

## Removing a Server

1. Delete the `<server>` entry from the project MCP configuration file written in Connecting a Server, and tell the engineer to commit the file.
2. In HTTP mode, tell the engineers they can stop the server process.
3. Set the skill's Section 9 status to `Declined`.
4. Follow the adapter's own **Remove** section for anything else — usually, what to do with outputs the skill already produced.

---

## Precedence

The master rule file governs the delivery process. An external skill governs only the work named in its adapter's **Scope**.

- If an external skill's own instructions — its MCP server instructions, tool descriptions, or procedures that say "always use this skill first" — claim work outside its Scope, the master rule file wins.
- An external skill's outputs are **inputs** to framework ceremonies. They never replace a framework artifact (intent, elaboration, unit, bolt, ADR) and are never written into `ops/` directly. The adapter's Integration Contract says how each output is carried into the framework.
- The Prompt Quality Gate, review checklist, and every gate in Section 6 still apply to any code an external skill causes to be generated.

---

## Adapter Format

Name the file after the external project in `kebab-case.md` (e.g. `ux-os.md`). Every section is required.

```markdown
# External Skill: <Name>

**Source:** <repository URL>
**Package:** <the published package that runs the MCP server, e.g. an npm package name>
**Pinned version:** <exact package version — never a range, `latest`, or a dist-tag>
**Version:** <the source's own version served by that package version>
**License:** <SPDX identifier>
**Supported tools:** <Claude Code / Cursor / GitHub Copilot — only those it actually runs on>
**Requirements:** <what the project needs before the skill can be offered, each with a check — e.g. "Node.js 20 or later (`node --version`)">
**Scope:** <one or two sentences: the work this skill owns, and nothing else>

---

## Onboarding Offer

**Project types:** <Fresh / Mature / Both / None>

For each project type listed, the onboarding agent asks:

> "<question — what the skill is, what it produces, and the three choices: install now / offer when relevant / never>"

| Answer | Status written to Section 9 |
|---|---|
| Install now | Connect the server; `Installed (<version>)` |
| Offer when relevant | `Offer at stage` |
| Never | `Declined` |

For project types not listed, write `Offer at stage` without asking.

---

## Stage Offer

**Offer point:** <one offer point from external-skills/README.md>
**Condition:** <when the offer applies to an intent; when it is skipped>

> "<question asked at the offer point when the status is Offer at stage>"

---

## Server

**Server name:** <the key used in the project MCP configuration>
**stdio:** `<launch command with the pinned version>`
**HTTP:** `<launch command with the pinned version>`, serving `<URL>` — or "Not supported"

<Anything specific to this server beyond Connecting a Server in external-skills/README.md — e.g. port flags. Write "No additional steps" if none.>

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

<Anything beyond Removing a Server in external-skills/README.md — usually what to do with outputs the skill already produced.>
```

---

## Accepting a New Adapter into the Base Repo

An adapter is added to `ai-dlc-base` only if all of the following hold:

1. **Pinned.** Every launch command names the exact `Pinned version`. Bumping it is a reviewed PR to this repo, with the upstream changes between the old and new version summarised in the PR description.
2. **Licensed.** The source and the package carry an open-source license that permits the use described in its Server section.
3. **Runnable.** It is a published MCP server that starts over stdio with nothing beyond its listed Requirements, it supports at least one of the framework's AI tools, and `Supported tools` lists only the tools it actually runs on.
4. **Bounded.** Its Scope is explicit, and every conflict between its own instructions and the master rule file is resolved in its Precedence section.
5. **Generic.** It passes the generic test in `CONTRIBUTING.md` once its Stage Offer Condition is applied — useful to any project that meets the condition, not to one team's stack or domain.
