# Unit: [name]

**Status:** Open | Planned | In Progress | Done | Blocked | Deferred
**Intent:** [ops/inception/intents/YYYY-MM-DD-[slug].md](../../inception/intents/YYYY-MM-DD-[slug].md)
**Elaboration:** [ops/inception/elaborations/YYYY-MM-DD-[slug]-session-N.md](../../inception/elaborations/YYYY-MM-DD-[slug]-session-N.md)
**Bolt:** [ops/build/bolts/YYYY-MM-DD-[bolt-slug].md](../bolts/YYYY-MM-DD-[bolt-slug].md)
**Priority:** High | Medium | Low

---

## Context

[One paragraph. Who needs this, what it does, and why it is a discrete unit. Written for an engineer who has not read the intent.]

---

## Acceptance Criteria

1. Given [precondition], when [action], then [outcome].
2. Given [precondition], when [action], then [outcome].
3. Given [precondition — unhappy path], when [action], then [outcome].

---

## Scope

**In scope:**
- [What this unit covers]

**Out of scope:**
- [What is explicitly excluded — handled by another unit or not planned]

---

## Dependencies

| Dependency | Type | Status |
|---|---|---|
| [Unit or external system] | Unit / API / Config | Done / Pending |

---

## Pre-generation Checks

Before generating code for this unit, the agent must run these checks:

- [ ] Grep for existing implementations of [pattern] across the codebase to avoid duplication
- [ ] Confirm the module entry point is listed in `ai-dlc/guidelines/entry-points.md`
- [ ] Confirm no files in scope appear in `ai-dlc/guidelines/forbidden-zones.md`
- [ ] Verify test coverage for affected module meets the gate threshold

---

## Edge Cases to Handle

| ID | Scenario | Required behavior |
|---|---|---|
| EC-001 | [scenario] | [what the code must do] |

---

## Definition of Done

- [ ] All ACs implemented and traceable to code
- [ ] Unit tests written for each AC
- [ ] Integration tests for affected module pass without modification
- [ ] No secrets or hardcoded environment values
- [ ] Auth checked on every new endpoint
- [ ] Reviewed against `ai-dlc/skills/review-checklist.md`
- [ ] Prompt log updated in `ai-dlc/prompts/`
- [ ] Unit status set to Done in backlog

---

## Prompt Log

[ai-dlc/prompts/[unit-name].md](../../../prompts/[unit-name].md)

---

## Notes

[Any decisions made during execution that future engineers should know about.]
