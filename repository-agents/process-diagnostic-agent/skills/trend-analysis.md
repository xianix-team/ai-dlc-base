# Trend Analysis Skill

This skill compares the current review session's scores and findings against all previous review reports for the same project. It produces a **Trend Analysis** section for inclusion in the final review report.

Run this skill after all eight domains are scored and before the final report is delivered.

---

## Step 1 — Locate past reports

Look in `{REPORTS_PATH}/` for files matching the pattern `YYYY-MM-DD-*-review.md`. Sort them chronologically by the date prefix, oldest first.

- **Zero past reports found:** Record "This is the first review for this project — no historical data available." Produce only the first-review note in the output and skip Steps 2–5.
- **One or more past reports found:** Proceed to Step 2.

---

## Step 2 — Extract comparison data from each past report

For each past report, read and extract:

1. **Date** — from the frontmatter `date:` field
2. **Overall score** — from the frontmatter `overall_score:` field
3. **Domain scores** — from the Review Scorecard table (one row per domain, record the Score column)
4. **Findings** — from the Findings section; for each finding record: severity, domain, and a short description slug (5–8 words that identify the finding uniquely)

If a report is unreadable (missing frontmatter or scorecard), skip it and note it as unreadable in the output.

---

## Step 3 — Build the domain score timeline

Create a table with one column per past report plus one column for the current session:

| Domain | [date 1] | … | [most recent past] | Current | Change |
|---|---|---|---|---|---|
| 1. Foundation | Aligned | … | Partially Aligned | Aligned | ↑ Improved |
| 2. Inception | … | | | | |
| … | | | | | |
| **Overall** | | | | | |

For the **Change** column, classify the movement from the most recent past report to the current session:

| Symbol | Meaning |
|---|---|
| ↑ Improved | Score moved toward Aligned |
| → Stable | Score unchanged |
| ↓ Declined | Score moved toward Not Aligned |

---

## Step 4 — Classify findings across time

Compare each finding from the current session against findings in past reports. Match findings by domain and description slug (exact match not required — use judgment for near-matches). Classify each finding:

| Classification | Definition |
|---|---|
| **New** | Not present in any past report; appeared for the first time in this review |
| **Recurring** | Present in one or more past reports and still present in the current review |
| **Entrenched** | Recurring across three or more consecutive reviews with no change in severity |
| **Worsened** | Present in past reports at a lower severity; current review shows higher severity |
| **Improved** | Present in past reports at a higher severity; current review shows lower severity |
| **Resolved** | Present in one or more past reports; not present in the current review |

---

## Step 5 — Identify systemic patterns

Scan the classified data for the following signals:

| Signal | Condition |
|---|---|
| **Sustained decay** | A domain has declined (↓) across two or more consecutive reviews |
| **Entrenched issue** | A finding is classified Entrenched (recurring 3+ reviews, no severity change) |
| **Significant improvement** | A domain improved (↑) by two or more score levels across all reviews, or a Critical finding has been Resolved |
| **Emerging risk** | A New finding is Critical or Important — flag it as a first-occurrence risk |
| **Stalled recovery** | A domain improved in one review but declined again in the next — flag as unstable |

---

## Output — Trend Analysis section

Produce the following section exactly as shown. Insert it into the final report between the Gap Analysis and the Remediation Plan.

---

### Trend Analysis

**Reviews in this comparison:** [N past reports + current] | **Oldest:** [date] | **Most recent prior:** [date]

> *(If first review: "This is the first review for this project. No historical comparison is available. This report will serve as the baseline for all future trend analysis.")*

#### Domain Score Timeline

[Insert the table from Step 3]

**Since the last review:** Improved — [domains] | Stable — [domains] | Declined — [domains]

#### Finding Trends

| Finding | Domain | Classification | First seen | Severity trend |
|---|---|---|---|---|
| [description slug] | [domain] | New / Recurring / Entrenched / Worsened / Improved / Resolved | [date or "this review"] | [e.g. Critical → Important, or —] |

#### Patterns

[One bullet per systemic pattern identified in Step 5. If none: "No systemic patterns identified across the reviews analysed."]

#### Trajectory Summary

[2–3 sentences: the overall direction of the project's AI-DLC practice. Is it improving, stable, or drifting? Name the single most important trend the team should act on — either the most persistent decay signal or the most significant improvement to build on.]

---
