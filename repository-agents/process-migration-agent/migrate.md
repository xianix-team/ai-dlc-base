# AI-DLC Migration Prompt

This file migrates a project from the **old AI-DLC structure** (where everything lived inside `ai-dlc/`) to the **new AI-DLC structure** (where the installed framework lives at `{docs}/intent-execution-framework/` and the bootstrap agents are separate folders).

---

## Prerequisites — copy these folders from the AI-DLC base repo before starting

Before reading this file to your AI assistant, copy all three of the following from `repository-agents/` in the base repo into your **project root**:

```
process-migration-agent/     ← the migration agent (this folder)
process-onboarding-agent/    ← the new onboarding agent
process-diagnostic-agent/    ← the new diagnostic agent
```

These three folders are the source of truth for the migration. The migration agent will draw on them during execution.

---

## Trigger

Once the folders above are in your project root, say the following to your AI assistant:

> **"Read `process-migration-agent/migrate.md` and follow the instructions inside it."**

---

## Instructions for the AI Agent

You are about to migrate this repository from the old AI-DLC structure to the new one. Read and follow `process-migration-agent/migration-guide.md` in full. The steps below tell you how to execute it.

---

### Session Brief — Present this to the engineer before asking anything

Before asking any questions or taking any action, present the following overview:

> **AI-DLC Migration — Session Overview**
>
> This session migrates your project from the old AI-DLC structure (where everything lived inside `ai-dlc/`) to the new structure (where the installed framework lives separately from the bootstrap agents). All three AI-DLC agents will be migrated:
>
> - **Onboarding agent** — `ai-dlc/` (old) → `process-onboarding-agent/` (new)
> - **Experience agent** — master rule file path references updated; framework relocated to `intent-execution-framework/`
> - **Diagnostic agent** — `ai-dlc-reviewer/` (old) → `process-diagnostic-agent/` (new, with Trend Analysis capability added)
>
> **What will happen:**
> 1. I'll scan your repository to confirm what old-structure files are present.
> 2. I'll ask where you want your process documentation to live going forward.
> 3. I'll move all generated framework files (rules, skills, guidelines, ops data) to the new location — nothing is deleted until it has been safely moved.
> 4. I'll refresh template-based skill files to the latest versions from the new base repo.
> 5. I'll update every path reference in your master rule file to point to the new location.
> 6. I'll set up the new `process-onboarding-agent/` and `process-diagnostic-agent/` folders.
> 7. I'll remove the old `ai-dlc/` and `ai-dlc-reviewer/` folders once everything is confirmed.
> 8. I'll deliver a migration report listing every change made and flagging anything that needs your review.
>
> **Your operational data (intents, units, bolts, retros) will be preserved exactly as-is.**
>
> Ready to start? I have one quick question before we begin.

---

### Step 0 — Run the pre-flight scan

Read `process-migration-agent/migration-guide.md` from top to bottom before taking any action. Then execute the Pre-Flight Scan defined there.

Do not create or modify any files until Step 0 is complete and the engineer has confirmed the migration plan.
