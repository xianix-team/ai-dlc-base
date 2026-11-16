# External Skill: UX-OS

**Source:** https://github.com/xianix-team/UX-OS
**Package:** `@99x-ai-dlc/uxos-skills-mcp` (npm)
**Pinned version:** `0.33.1`
**Version:** UX-OS 0.32.1 — the method and procedures that package version serves
**License:** MIT
**Supported tools:** Claude Code, Cursor, GitHub Copilot
**Requirements:** Node.js 20 or later (`node --version`), and access to the npm registry — `npx` downloads the package the first time the server starts.
**Scope:** UI/UX and product design for user-facing work — understanding the product (domain, users, personas, feature map, journeys), scoping problems, designing journeys and screens, building the design system and a functional prototype, and writing Units as the design handoff. Its working model lives in the git-tracked `uxos/` folder at the repository root.

---

## Onboarding Offer

**Project types:** Fresh

For a fresh project, the onboarding agent asks:

> "Would you like to run the UI/UX design for this project with UX-OS? It's a set of UX design procedures your AI assistant reads from an MCP server. It builds a persistent model of the product — users, personas, journeys, problems — and takes a designer from there through screen specs and a functional prototype to **Units**: buildable slices with Given-When-Then acceptance criteria, which then feed our mob elaboration. You can:
> - **Install it now** — I'll add the UX-OS server to this project's MCP configuration, so everyone on the team gets it
> - **Offer it when relevant** — I'll ask again at the design stage of the first intent that changes what users see
> - **Never** — I won't offer it again"

| Answer | Status written to Section 9 |
|---|---|
| Install now | Connect the server; `Installed (0.33.1)` |
| Offer when relevant | `Offer at stage` |
| Never | `Declined` |

For mature projects, write `Offer at stage` without asking.

---

## Stage Offer

**Offer point:** `Pre-elaboration`
**Condition:** The intent introduces or changes a user-facing surface — screens, flows, journeys, navigation, or UI copy. Skip it for intents with no user-facing change (APIs, data, infrastructure, integrations). Bug, hotfix, and NFR bolts never reach this offer point because they skip elaboration.

> "This intent changes what users see. Would you like to add UX-OS and run the UI/UX design for it first? A designer works through its procedures — journeys, screen specs, and a prototype — and ends with Units and acceptance criteria that we carry into this elaboration. Add it now, skip it for this intent, or never offer it again?"

When the status is `Installed`, ask instead:

> "This intent changes what users see. Run UX-OS for it first — or, if a designer already has, use its Units from `uxos/requirements/` — or proceed without it?"

To run it, ask the assistant to start UX-OS for the intent: it calls the server's `list_skills` and `get_skill` tools and follows the matching procedure, beginning with `next-steps` when it is unclear where to start. UX-OS work is a design activity that can span several sessions. If the engineer chooses to run it, pause elaboration and resume it once the relevant `uxos/requirements/<journey-id>.md` files exist, or continue now with whatever Units are already there.

---

## Server

**Server name:** `uxos`
**stdio:** `npx --yes @99x-ai-dlc/uxos-skills-mcp@0.33.1`
**HTTP:** `npx --yes @99x-ai-dlc/uxos-skills-mcp@0.33.1 --http`, serving `http://127.0.0.1:3333/mcp`

In HTTP mode, `--port <n>` changes the port; change the URL in the MCP entry to match. The server accepts connections from the local machine only.

The server is read-only: it serves UX-OS's procedures, templates, and method. The assistant writes every UX-OS output itself, under `uxos/`.

---

## Integration Contract

**Produces:**
- `uxos/` — the UX model (product context, domain, users, personas, journeys, problems, business rules, screen specs). Owned by the designer; the framework reads it and never edits it.
- `uxos/requirements/<journey-id>.md` — **Units**, the development handoff. Each Unit has an id (`U-J<n>-<k>`), Who / Why / What / How, acceptance criteria numbered `AC-<unit-id>.<n>`, a Readiness line (`ready` / `not-ready`), and a Start here block with build order and how to run the prototype.
- `uxos/design-records/` — the record of what was designed and built where.
- Optionally, a functional prototype on its own branch (when the designer uses the code design path).

**Feeds into:**
- **The intent.** Add a `## UX Design` section to the intent file listing each journey and linking its `uxos/requirements/<journey-id>.md` file. Phase 0 and unit decomposition read these as binding context, the same way they read a recorded Solution Shape.
- **Phase 0 (design session).** The Units' data and business rules are inputs to the Data Model step; the screens and flows they describe shape the API Contract step.
- **Unit decomposition.** Each `ready` UX-OS Unit is a candidate framework unit, and its acceptance criteria are the starting AC set. It still goes through the full elaboration turn structure — edge cases, observability, sign-off. Record the UX-OS Unit id and AC ids in the framework unit's Context so the two stay traceable. Do not elaborate a `not-ready` Unit; raise its open questions with the engineer instead.
- **Commits.** Put the UX-OS Unit id (e.g. `U-J1-2`) in commit messages or PR titles alongside the framework's own references. UX-OS's `code-sync` procedure reads them to keep its model in step with what was built.

**Never:**
- UX-OS writes nothing into the framework's `ops/` folder. Its Units are not framework units, are never copied into `ops/build/units/`, and do not replace elaboration sign-off, bolt planning, or the review checklist.
- Prototype code is a design artifact. It reaches production only through a bolt, like any other code.

---

## Precedence

- **The skill-first rule.** The server's instructions tell the assistant to call `list_skills` and follow a UX-OS procedure "before producing project work", and the method it serves (`uxos://method`) says every task that produces work for the product — "UX or not" — goes through UX-OS first. That reaches beyond this adapter's Scope. **Resolution:** the master rule file governs everything outside Scope. Elaboration, unit and bolt work, production code generation, reviews, retros, and incidents follow the master rule file, even when the UX-OS server is connected. Inside Scope, use the UX-OS procedures.
- **Model sync.** UX-OS procedures may suggest running `code-sync` when the code has moved on since its model was last updated. Follow the designer's answer; it never blocks a framework ceremony.
- **Prototype builds.** Code UX-OS procedures generate for a prototype is still subject to the Prompt Quality Gate and the review checklist.

---

## Remove

Leave the `uxos/` folder in place unless the team asks to delete it — intents and framework units may link to it.
