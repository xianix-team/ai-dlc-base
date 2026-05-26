# Bolt: [name]

**Status:** Planned | In Progress | Done | Blocked
**Goal:** [One sentence — what this bolt delivers when complete]
**Start date:** YYYY-MM-DD
**Target date:** YYYY-MM-DD
**Completed date:** —
**Retrospective:** [ops/operate/retros/YYYY-MM-DD-[bolt-slug].md](../../operate/retros/YYYY-MM-DD-[bolt-slug].md)

---

## Units

| # | Unit | Status | Priority |
|---|---|---|---|
| 1 | [units/[unit-file].md](units/[unit-file].md) | Open | High |

---

## Execution Order

```
[Unit A] → [Unit B] → [Unit C]
                    ↘ [Unit D]
```

[Describe any parallelism or hard sequencing constraints between units.]

---

## Risks and Assumptions

| Risk / Assumption | Likelihood | Mitigation |
|---|---|---|
| [description] | High / Med / Low | [what to do if it materialises] |

---

## Definition of Done

- [ ] All units in this bolt have status Done
- [ ] Integration tests for all affected modules pass
- [ ] No regressions in modules outside this bolt's scope
- [ ] Retrospective file created and filed
- [ ] Backlog updated
