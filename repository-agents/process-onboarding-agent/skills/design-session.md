# Skill: Design Session (Phase 0 of Mob Elaboration)

**Purpose:** Establish an agreed design foundation — API contracts, data model, and architectural pattern decisions — at the opening of a mob elaboration session before any units are proposed. The design output becomes binding constraints that govern every unit and AC produced in the session.

**Trigger:** Runs automatically at the start of every mob elaboration session, before the first unit is proposed. It is not a separate ceremony — it is the opening phase of elaboration. The `mob-elab-prompts.md` skill calls this phase explicitly.

The phase may be brief or extensive depending on the intent's complexity. For a simple, well-understood intent with no new interfaces or data entities, it may conclude in two or three questions. For an intent introducing new API surfaces or data structures, it will take longer. The length is determined by the scope questions in Step 2 — not by a fixed number of turns.

---

## Step 1 — Read and Anchor the Intent

Read the intent file fully before saying anything. Then open the session by reflecting the intent back to the engineer in plain language:

> "I've read the intent for [intent name]. As I understand it, we're building [one-sentence summary of goal]. Before we break this into units, I want to establish the design foundation — the interfaces, data shapes, and patterns we'll be building against. This becomes the baseline for every AC we write.
>
> If the intent is more complex than it appears, or if you want to adjust the goal before we design, now is the time."

Wait for the engineer to confirm or correct the understanding. Do not proceed until the intent goal is agreed.

---

## Step 2 — Scope the Design

Ask the engineer three questions to determine which design areas are relevant — four if this project's Domain Profile (master rule file Section 1) includes a hardware profile (Embedded MCU, Embedded Linux, or FPGA). Ask them all together — this is the one exception to the one-question-per-turn rule, because the answers are interdependent:

> "Before we design, I need to scope the work:
> 1. Does this feature expose or consume API endpoints or external interfaces?
> 2. Does it introduce new data entities or change the shape of existing ones?
> 3. Does it require an architectural pattern not already established in this codebase?"
> *(Hardware-domain projects only, asked as a fourth question:)*
> 4. Does it introduce or change a hardware interface (register map, pinout, timing contract), an RTOS task/thread, or an interface to another processor/domain in this system (e.g. Linux↔MCU, Linux↔FPGA)?

Record the answers. Use this to decide which steps to run:

| Answer | Steps to include |
|---|---|
| API: yes or unsure | Step 3 |
| Data model: yes or unsure | Step 4 |
| Architectural pattern: yes or unsure | Step 5 |
| Hardware/RTOS/inter-domain interface: yes or unsure | Step 3.5 |

Skip any step answered definitively "no". For any "unsure", include the step and mark the relevant section as provisional in the design artifact.

If all applicable questions are "no", confirm with the engineer:

> "This intent doesn't appear to introduce new interfaces, data entities, architectural patterns, or hardware/RTOS changes — the design foundation is inherited from existing conventions. Shall I move straight to unit decomposition?"

If confirmed, skip to Step 6 (no design artifact is needed).

---

## Step 3 — API Contract

*Run only if Step 2 scoped in API endpoints or external interfaces.*

Work through each interface one at a time. **Never work on more than one endpoint per turn.**

For each endpoint, ask the following in sequence — one question per turn:

1. > "Describe this endpoint in one sentence — what triggers it and what does the caller get back?"

2. > "What is the method and path? (or the equivalent if this is not a REST interface)"

3. > "What does the request contain? List the field names and types. Mark any that are optional."

4. > "What does a successful response look like? List the fields and types."

5. > "What error states must the caller handle?"

6. > "Who can call this? What authentication or authorization does it require?"

After each endpoint, ask:

> "Is there another endpoint to design, or is the contract complete?"

**Domain term check:** Read `process-onboarding-agent/guidelines/domain-glossary.md` if it exists. If any field name is a synonym or informal variant of a glossary term, flag it before moving on:

> "The field [name] looks like a synonym for [glossary term]. Should I use [glossary term] to stay consistent with the domain language?"

---

## Step 3.5 — Hardware / RTOS / Inter-Domain Interface

*Run only if Step 2 scoped in a hardware, RTOS, or inter-domain interface, and only for projects whose Domain Profile includes a hardware profile.*

Work through whichever of the following apply to this intent, one at a time — **never more than one register block, task set, or inter-domain interface per turn.**

**If this intent touches a register map or pinout (Embedded MCU or FPGA):**

1. > "Which peripheral or register block does this intent touch — existing or new?"
2. > "For a new or changed register: name, address/offset, bit-fields, access (R/W/RW), and reset value?"
3. > "For a new or changed pin: name, function, direction, and any electrical notes (voltage domain, pull-up/down, drive strength)?"
4. > "What is the timing contract — setup/hold requirements, maximum response latency, or protocol timing this interface must meet?"

Write confirmed entries to `{FRAMEWORK_ROOT}/ops/inception/register-map/` (Embedded MCU) or the project's equivalent hardware ICD location.

**If this intent introduces or changes RTOS tasks/threads (Embedded MCU with RTOS selected):**

1. > "Does this introduce a new task/thread, or change an existing one's priority, stack size, or period?"
2. > "What is this task's priority relative to existing tasks, and why? Could it invert priority with a lower-priority task holding a shared resource?"
3. > "What is the worst-case stack usage, and what margin is budgeted above it?"
4. > "How does this task communicate with others — queue, semaphore, mutex, event flag? Could it block unboundedly?"

Read `{FRAMEWORK_ROOT}/rules/rtos-design-rules.md` before finalizing — flag any conflict with its priority-inversion or unbounded-blocking rules before moving on.

**If this intent crosses a domain/processor boundary (2+ hardware profiles selected, or hardware talking to the software stack):**

1. > "Which two domains does this interface connect (e.g. Linux application ↔ MCU coprocessor, Linux ↔ FPGA fabric)?"
2. > "What is the transport (UART/SPI/I2C/shared memory/AXI/DMA) and the message or register framing?"
3. > "What is the failure behavior if one side of this interface is unavailable or resets independently of the other?"

Record confirmed inter-domain interfaces in an Interface Control Document at `{FRAMEWORK_ROOT}/ops/inception/interface-control-documents/YYYY-MM-DD-<unix_timestamp>-[slug]-icd.md` and link it from the design artifact.

After each block/task/interface, ask:

> "Is there another hardware, RTOS, or inter-domain element to design, or is this step complete?"

---

## Step 4 — Data Model

*Run only if Step 2 scoped in new or changed data entities.*

Work through each entity one at a time. **Never work on more than one entity per turn.**

For each entity, ask the following in sequence — one question per turn:

1. > "Name this entity and describe what it represents in one sentence."

2. > "What are its fields? List each field's name, type, and whether it is required or optional."

3. > "How does it relate to existing entities?"

4. > "Are there any uniqueness constraints, indexes, or a soft-delete pattern?"

5. > "Is any field derived or computed rather than stored? If so, which ones and how?"

After each entity, ask:

> "Is there another entity to design, or is the data model complete?"

**Conflict check:** Before closing the data model, read `process-onboarding-agent/rules/architecture.md`. If any proposed entity name, field name, or relationship contradicts an existing ADR, surface the conflict immediately:

> "The proposed [entity or field] conflicts with ADR-[N] which states [decision]. How should we resolve this before we continue?"

Do not proceed to Step 5 until all conflicts are resolved.

---

## Step 5 — Architectural Patterns

*Run only if Step 2 scoped in new architectural patterns.*

For each new pattern, ask the following in sequence — one question per turn:

1. > "Describe the pattern in one sentence — what problem does it solve and where does it apply?"

2. > "Is there an existing pattern in this codebase that is similar? If yes, why is it insufficient for this case?"

3. > "What are the trade-offs of this approach versus the most obvious alternative?"

4. > "Should this become an ADR?"

If the engineer confirms an ADR, draft it immediately and present it for confirmation before writing:

```markdown
### ADR-[next number] — [Decision title]
**Decision:** [what was decided]
**Why:** [the reasoning]
**Trade-off:** [what you gave up]
```

Write confirmed ADRs to `process-onboarding-agent/rules/architecture.md` before moving to the next pattern.

After each pattern, ask:

> "Is there another pattern to document, or is this step complete?"

---

## Step 6 — Design Sign-off and Artifact

Present a design summary before writing any files:

```
Design Foundation — [Intent name]

API Contract:    [N endpoint(s): list METHOD /path]
Data Model:      [N entity/entities: list names]
Patterns:        [N pattern(s): list names and ADR numbers]
Hardware/RTOS/Inter-domain: [N item(s): list, or "not applicable"]
Provisional:     [anything marked unsure, or "none"]

Shall I record this as the design artifact and move to unit decomposition?
```

If the engineer confirms, create the design artifact at `process-onboarding-agent/ops/inception/designs/YYYY-MM-DD-<unix_timestamp>-[intent-slug]-design.md` and link it from the intent file under a `Design:` field in the intent header.

The artifact uses this structure:

```markdown
# Design: [Intent name]

**Status:** Agreed
**Date:** YYYY-MM-DD
**Intent:** [relative link to intent file]
**Elaboration:** _(to be linked after elaboration runs)_

---

## API Contract

### [Endpoint name] — [METHOD /path]

**Auth:** [requirement]

**Request:**
| Field | Type | Required | Notes |
|---|---|---|---|

**Response (success):**
| Field | Type | Notes |
|---|---|---|

**Error states:**
| Status | Condition |
|---|---|

---

## Data Model

### [Entity name]

[one-sentence description]

**Fields:**
| Field | Type | Required | Notes |
|---|---|---|---|

**Relationships:** [description]
**Constraints:** [or "none"]

---

## Architectural Patterns

### [Pattern name]

[description and trade-off]
**ADR:** [ADR-N, or "no ADR created"]

---

## Hardware / RTOS / Inter-Domain Interface

*(Omit this section entirely for projects with no hardware domain profile, or if Step 3.5 was skipped.)*

### [Register block / task set / inter-domain interface name]

[description]
**Details:** [register/pin table, task priority/stack/IPC summary, or inter-domain transport and failure behavior — whichever applies]
**Reference:** [link to register-map file / rtos-design-rules.md conflict check / ICD file]

---

## Elaboration Constraints

The following decisions are binding during unit decomposition.
ACs must not contradict them. Surface any conflict before writing a unit — do not work around a constraint silently.

- [one binding decision per bullet]
```

---

## Step 7 — Handoff to Unit Decomposition

Once the design artifact is written (or confirmed as not needed), state clearly:

> "Design foundation is set. I'll now propose units — one at a time — starting with the first logical slice of [intent name]."

Continue directly into the mob elaboration turn structure from `mob-elab-prompts.md`. Do not pause for engineer acknowledgment before proposing the first unit.
