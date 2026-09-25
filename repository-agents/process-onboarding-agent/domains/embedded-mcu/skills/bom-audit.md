# Skill: BOM / Component Audit

**Purpose:** Audit the project's bill of materials for component end-of-life (EOL) risk, single-source risk, lead-time risk, and price volatility. Produces a ranked findings list and converts actionable findings into Remediation Bolts, the same shape as `dependency-audit.md` but for physical components instead of software packages. Only installed if the engineer opted into the hardware track during onboarding (Domain Overlay step 4).

**Trigger:** Engineer-initiated, or prompted automatically at session start when the `Next component/BOM audit` date in the master rule file Process Configuration has been reached. Invoked by saying "run BOM audit" or "run component risk check."

**Important limitation:** the AI analyses the BOM using training knowledge of well-known EOL/legacy parts and cannot query live distributor stock or lead times. For current data, the engineer must check a distributor/aggregator (DigiKey, Mouser, Octopart) and share what they find — this is Step 3, the same tool-assisted pattern `dependency-audit.md` uses for CVE data.

---

## Step 1 — Confirm Scope

Ask the engineer:

> "Should I audit the full BOM, or a specific subassembly? Where does the current BOM live (spreadsheet, ECAD tool export, plain list)?"

Read the `Next component/BOM audit` and `Last component/BOM audit` dates from Section 9. Confirm the last audit date, then proceed to Step 2.

---

## Step 2 — Read the BOM

Read the BOM in whatever format the engineer provided. Extract for each line item: reference designator(s), part number, manufacturer, and whether it's flagged as single-source or multi-source (if the BOM records this).

---

## Step 3 — Request the Tool-Assisted Check

> "To get current lead-time and stock data, please check the following parts on your distributor/aggregator of choice and share what you find — particularly anything marked 'not recommended for new designs', 'last time buy', or with a lead time over [N] weeks:
>
> [list parts the AI flags as worth checking first, based on Step 4]
>
> If you don't have time to check all of them, prioritize the ones I've flagged. Type 'skip' to proceed with AI-only analysis."

Wait for the response before proceeding to Step 5.

---

## Step 4 — AI Analysis

Using training knowledge, flag:

- **Known EOL or NRND (not recommended for new design) parts** — components with a publicly known end-of-life notice or successor part as of training knowledge.
- **Single-source risk** — a part with no documented second source on the BOM, especially for a part with historically volatile supply (MCUs, specific passives during a shortage era, connectors from a single vendor).
- **Package/footprint risk** — a part in a package known for assembly yield issues at the project's likely production volume (fine-pitch BGAs at low volume without an established assembly partner, for instance) — flag as a note, not a hard finding, since this is context-dependent.

State plainly that this list has a training-data cutoff and is not a substitute for a live distributor check.

---

## Step 5 — Classify and Rank Findings

Combine Step 3 and Step 4 findings, deduplicate, classify:

| Severity | Criteria |
|---|---|
| **Critical** | Confirmed EOL with no drop-in replacement identified, or last-time-buy date within the project's expected production window |
| **High** | NRND with a replacement path not yet validated, or lead time long enough to threaten the next production run |
| **Medium** | Single-source with no known supply issue yet, or lead time elevated but manageable |
| **Low** | Minor lead-time increase, or a part with a known but not-yet-scheduled EOL |

```
BOM Audit Findings — YYYY-MM-DD

| # | Ref Des | Part Number | Issue | Severity | Source | Recommended action |
|---|---|---|---|---|---|---|
| 1 | | | | Critical/High/Medium/Low | Scanner/AI | [find alternate, redesign around, place last-time buy, monitor] |
```

---

## Step 6 — Present and Confirm

Present the table, then ask:

> "Which findings should become Remediation Bolts? You can say 'all Critical and High', list numbers, or 'none' to record findings without backlog items."

---

## Step 7 — Create Remediation Bolts

For each approved finding, create a unit at `process-onboarding-agent/ops/build/units/YYYY-MM-DD-<unix_timestamp>-bom-[part-slug].md` with Context (the finding in plain language), Acceptance Criteria (`Given the BOM is reviewed, when [part] is sourced, then a qualified alternate or last-time-buy quantity is confirmed and recorded`), and Priority mapped from severity. Add to the backlog.

---

## Step 8 — Schedule the Next Audit

> "When should the next BOM audit run? Recommended interval is 90 days, or tied to your next production run planning."

Update Section 9's `Last component/BOM audit` and `Next component/BOM audit` rows.
