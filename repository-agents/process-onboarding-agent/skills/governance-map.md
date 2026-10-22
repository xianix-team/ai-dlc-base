# Skill: Governance Map

**Purpose:** Draw a one-page map of how this project's installed framework governs delivery: which files form the governance layer, which steps each phase runs, which gates the engineer must sign off, which bolt variants exist, and where lessons feed back into the rules. The map is built from the project's actual master rule file, `rules/`, `guidelines/`, `skills/` and ops templates, not from the generic framework description. Two projects running the framework get two different maps.

The map answers "how does work get governed here?" in one picture. That helps a new engineer, a stakeholder who wants to see where humans stay in control, and a team checking that what it believes the process is matches what the files actually say.

This skill is distinct from `process-visualization.md`. Process visualization reconstructs what *happened* during one bolt. This skill draws what the framework *requires* for every bolt.

**Trigger:** Engineer-initiated at any time. Invoked by saying something like "draw the governance map", "show me how the framework governs delivery here", or "regenerate the governance map". Worth offering, never forcing, in two situations:
- At the end of `new-engineer-induction.md`, as a picture to keep alongside the quick-reference card.
- After the Post-Retro Improvement Workflow applies an improvement that adds, removes or changes a gate, a ceremony or a skill routing line, since the existing map is now out of date.

**Never run automatically.** The engineer decides when to generate or regenerate the map.

**Output:** Two files at the framework root, both overwritten on regeneration:
- `governance-map.md`: a Mermaid flowchart plus the two reference tables. It renders in GitHub, GitLab and most IDEs, and diffs cleanly in review.
- `governance-map.html`: a single self-contained blueprint page (inline SVG, inline CSS, no external scripts, fonts or images) for sharing and presenting.

---

## Step 1 — Locate the Framework and Confirm the Output

1. Find the master rule file at the repo root: `CLAUDE.md`, `.cursor/rules/project-rules.mdc` (or any `.mdc` under `.cursor/rules/`), `.cursorrules` (legacy), or `.github/copilot-instructions.md`. If none exists, stop and tell the engineer:
   > "I can't find a master rule file, so there is no installed framework to map. This skill needs the full framework. Run the onboarding agent first."
2. Determine the framework root from the master rule file's Section 6 routing lines: the directory their skill paths point into (for example, `docs/process/intent-execution-framework/`). Do not assume a default path.
3. If `governance-map.md` or `governance-map.html` already exists at the framework root, say so and ask:
   > "A governance map already exists (generated [date from its header]). Should I regenerate it from the current files and overwrite both versions?"
4. Ask:
   > "Should I produce both the Markdown/Mermaid version and the HTML blueprint, or only one of them?"

   Default to both if the engineer has no preference.

---

## Step 2 — Read the Governance Sources

Read all of the following before drawing anything. Do not ask for files one at a time, and do not start building the map while still reading.

| Source | What to extract |
|---|---|
| Master rule file, Section 1 (Project Identity) | Project name; the system boundaries stated as "never" rules |
| Master rule file, Sections 2–5 | Hard stops: anything the AI must refuse or stop on (e.g. the Sensitive Data Check, security never-rules, forbidden zones) |
| Master rule file, Section 6 (AI-DLC Workflow) | Session-start checks; the elaboration turn structure; every skill routing line with its trigger condition and whether it is mandatory, offered, or engineer-invoked |
| Master rule file, Section 7 (Review Behavior) | The review checklist routing |
| Master rule file, Section 9 (Process Configuration) | Archive threshold; `Next dependency audit` date |
| Master rule file, Sections 10–11 | Whether notifications and AI Hub metrics are enabled or disabled. Never copy a webhook URL, API key, endpoint or any other credential into the map |
| `{framework root}/rules/` | The file names, and the one-line purpose of each |
| `{framework root}/guidelines/` | The file names, and the one-line purpose of each |
| `{framework root}/skills/` | Every installed skill file, to cross-check against the Section 6 routing lines |
| `{framework root}/ops/**/_template.md` | The `Status:` vocabulary for intents, units, bolts and improvements, used for the phase status lines |
| `{framework root}/ops/operate/retros/_template.md` | The Post-Retro Improvement Workflow steps |

---

## Step 3 — Build the Map Model

Build the model as a table before rendering anything. Every element must name the file and section it came from. **An element with no source does not go on the map.** Do not fill gaps from the generic framework description or from memory of other projects.

| Element | Kind | Phase | Source (file § section) | Notes |
|---|---|---|---|---|
| [e.g. Bolt risk assessment] | AI step / Gate / Event-driven / Feedback loop / Variant | Governance / Inception / Build / Operate / Variant band / Scheduled | [path § section] | [trigger, owner, status transition] |

Apply these classification rules:

1. **Gate:** a step that the master rule file or a skill says must not be skipped, needs an engineer sign-off, or blocks the next step ("No unit may begin execution without…", "A retro is not closed until…"). Label it with the wording the source uses: `SIGN-OFF` where the engineer approves something, `GATE` where a check must pass, `REQUIRED` where the step must happen but has no approval. Anything the sources describe as optional, offered or advisory is never drawn as a gate.
2. **AI step:** work the AI drives that the engineer reviews but does not formally sign off.
3. **Event-driven step:** a step triggered by something outside the normal flow, such as an incident, a production break or a due date, rather than by the previous step.
4. **Feedback loop:** a path where an output rewrites an input. At minimum, look for: retro → improvement → edits to `rules/`, `skills/` or `guidelines/`; RCA → new intent; and the review checklist → regenerate loop inside a unit.
5. **Bolt variant:** each bolt-type skill installed and routed in Section 6 (e.g. bug, hotfix, NFR). Record its trigger phrase from Section 6 and its steps in order, marking which of its steps are gates.
6. **Scheduled and on-demand skills:** every routed skill that is not part of the main flow, with its cadence or trigger. Take dates and intervals from Section 9, not from defaults.
7. **Engineer decisions:** every point where the engineer, not the AI, decides an outcome. Record what is decided and where.

Then run two consistency checks and record the results as **Map gaps**:
- A skill file exists in `skills/` with no routing line in Section 6 → "installed but not wired".
- A routing line in Section 6 points to a file that does not exist → "wired but missing".

Do not fix either kind of gap. Report it.

---

## Step 4 — Confirm the Model With the Engineer

Present a short summary before rendering anything:

> "Here is what the map will show, taken from your files:
> - Governance layer: [N] rules files, [N] guideline files, [N] hard stops
> - Inception: [steps, with gates marked]
> - Build: [steps, with gates marked]
> - Operate: [steps, with gates marked]
> - Bolt variants: [names]
> - Map gaps: [list, or 'none']
>
> Is anything missing or wrong? If the files don't say what you expected, that's worth knowing before we draw it."

Wait for the engineer to confirm. If they correct something, check the correction against the files:
- If the files support it, update the model.
- If the files don't support it, do not draw it. Record it in Map gaps as "described by the engineer, not in the framework files" and suggest raising an improvement so the files match how the team actually works.

---

## Step 5 — Render the Markdown Version

Write `{framework root}/governance-map.md` with this structure:

````markdown
# Governance Map — [Project name]

Generated: YYYY-MM-DD from [master rule file name] and `[framework root]/`
Regenerate after any applied improvement that changes a gate, ceremony or skill routing.

## How work is governed

```mermaid
flowchart LR
  subgraph GOV["Governance layer — read at session start and before every code response"]
    ...
  end
  subgraph INC["Inception"]
    ...
  end
  subgraph BLD["Build"]
    ...
  end
  subgraph OPS["Operate"]
    ...
  end
  GOV --> INC
  GOV --> BLD
  GOV --> OPS
  ...
  classDef gate fill:#fbefd9,stroke:#a8650f,stroke-width:2px
  classDef event stroke-dasharray:5 4
  class [gate node ids] gate
  class [event node ids] event
```

Legend: amber nodes are gates the engineer cannot skip. Dashed nodes are event-driven. Dotted arrows (`-.->`) are feedback loops.

## Bolt variants

| Variant | Trigger phrase | Steps (gates in **bold**) |
|---|---|---|

## What the engineer decides

| Decision | Where it happens |
|---|---|

## Scheduled and on-demand skills

| Skill | When it runs |
|---|---|

## Map gaps

[From Step 3 and Step 4, or "None found."]
````

Mermaid rules:
- Use one `subgraph` per phase, in the order Governance, Inception, Build, Operate. Model the "for each unit" loop inside Build as a nested subgraph.
- Draw feedback loops with dotted arrows (`-.->`) and a short label, e.g. `-.->|lessons rewrite the rules|`.
- Keep node labels under about six words. Put file paths in the tables, not in the nodes.
- Quote any label that contains punctuation, e.g. `A["Retro (required)"]`.

---

## Step 6 — Render the HTML Blueprint

Write `{framework root}/governance-map.html` as one self-contained file: inline `<style>` and inline `<svg>`, with no `<script>`, no external fonts, stylesheets or images, and no network requests of any kind. It must open correctly from the file system with no connection.

**Page structure, top to bottom:**
1. **Header:** a small monospace kicker (`[Project name] · [framework root]`), an `h1` stating what the page shows, and a two- or three-sentence lede summarising the loop and who decides at the gates. Write the lede from this project's model. Do not reuse generic wording.
2. **Legend:** an AI-driven step, a gate, an event-driven step, a work-flow arrow and a feedback arrow.
3. **Diagram:** one inline SVG in a horizontally scrollable container (`overflow-x: auto`, SVG `min-width` around 980px, `width: 100%`, a `viewBox` matching the content).
4. **Two reference tables side by side** (stacking on narrow screens): "What the engineer decides" and "Scheduled and on-demand skills", with the same content as the Markdown version.
5. **Map gaps**, only if any were found.

**Diagram layout:**
- **Governance band** across the top: the master rule file, `rules/` and `guidelines/` as three labelled columns, each with one or two lines naming its key contents. Short arrows down into each phase, labelled "every phase reads these first".
- **Three phase columns** (Inception, Build, Operate). Each column has an eyebrow (`PHASE 1`), a title, its ops folder path, and a status line taken from the templates' `Status:` vocabulary.
- **Inside each column**, the steps in order as rounded boxes. Each box has a title, a one-line description, and (where useful) the file path in monospace. Gate boxes use the gate colour and carry their label (`SIGN-OFF`, `GATE`, `REQUIRED`) right-aligned in the box. Event-driven boxes use a dashed border. The Build column draws the per-unit loop as a dashed container labelled `FOR EACH UNIT`, with a loop-back arrow from review to the start of the loop.
- **Connectors between columns:** Inception's last step → "Plan a bolt" (labelled e.g. "units ready → plan a bolt"), and Build's last step → the retro (labelled e.g. "bolt done → retro").
- **Feedback loops** as dashed arrows in the accent colour: the approved-improvement step back up into the governance band ("lessons rewrite the rules"), and the incident/RCA step back to the first Inception step ("root cause needs a redesign → new intent"). Give arrow labels a background halo (`paint-order: stroke`) so they stay readable where they cross lines.
- **Bolt variants band** across the bottom: one row per variant, with its name and trigger phrase on the left and its steps as a chain of chips separated by `›`. Gate steps use gate-coloured chips. Band heading: "Bolt variants · skip or compress elaboration, keep every gate", unless the files say otherwise.

**Styling rules:**
- Define all colours as CSS custom properties on `:root`: background, surface, sunk surface, ink, muted ink, line, accent, accent-soft, gate and gate-soft. Redefine them for dark mode under `@media (prefers-color-scheme: dark)`.
- Use system font stacks only: a sans-serif stack for text and a monospace stack for paths, tags and eyebrows.
- Apply colours inside the SVG through classes that use the custom properties, so the diagram follows dark mode too. Arrowheads are `<marker>` elements, one per arrow kind.
- Keep the page readable on a phone: a 16px side gutter, tables that stack, and only the diagram scrolling sideways.
- Plan box positions on a grid before writing any coordinates, so that no text overflows its box and no arrow passes through a box. Size each box from its longest line of text.

---

## Step 7 — Verify, Save and Report

Before telling the engineer the map is ready:

1. Check every gate on the map against its source in the Step 3 table. Remove anything that has no source.
2. Check that every routed skill in Section 6 appears somewhere: in a phase, in a variant row, or in the scheduled/on-demand table.
3. Check that no credential, webhook URL, API key or personal data appears in either file.
4. For the HTML: confirm it contains no `<script>` tag, no `<link>` tag, and no `src`, `href` or CSS `url()` pointing to an `http://` or `https://` address (the SVG `xmlns` namespace attribute is fine), and that every `marker-end` references a defined marker.

Then confirm:

> "Governance map saved:
> - `[framework root]/governance-map.md`, which renders in your Git host and IDE
> - `[framework root]/governance-map.html`, a self-contained page you can open directly or share
>
> Map gaps: [list, or 'none']. Regenerate it whenever an applied improvement changes a gate, a ceremony or a skill routing line."

If any Map gaps were found, offer once to file each one as an improvement using `{framework root}/ops/operate/improvements/_template.md`. Do not file them without the engineer's go-ahead.
