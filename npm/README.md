# @99x-ai-dlc/idf-installer

Installs the [99x Intent Delivery Framework](https://github.com/99x-Projects/ai-dlc-base) agent folders into your project. Works with Claude Code, Cursor, and GitHub Copilot.

## Install

```sh
npm install @99x-ai-dlc/idf-installer
```

This makes the `ai-dlc` command available. No files are copied automatically — run the command for the flow you need:

```sh
npx @99x-ai-dlc/idf-installer onboarding    # process-onboarding-agent/ + process-estimation-agent/
npx @99x-ai-dlc/idf-installer diagnostic    # process-diagnostic-agent/
npx @99x-ai-dlc/idf-installer migration     # process-migration-agent/ + process-onboarding-agent/ + process-diagnostic-agent/
npx @99x-ai-dlc/idf-installer skills        # process-skills-agent/ + process-onboarding-agent/
npx @99x-ai-dlc/idf-installer estimation    # process-estimation-agent/
```

Then open your AI assistant and say the trigger phrase printed after the command completes.

## `npx @99x-ai-dlc/idf-installer`

```sh
npx @99x-ai-dlc/idf-installer <profile> [options]
npx @99x-ai-dlc/idf-installer --agents <name>[,<name>...] [options]
```

| Profile | Copies |
|---|---|
| `onboarding` | `process-onboarding-agent/`, `process-estimation-agent/` |
| `diagnostic` | `process-diagnostic-agent/` |
| `migration` | `process-migration-agent/`, `process-onboarding-agent/`, `process-diagnostic-agent/` |
| `skills` | `process-skills-agent/`, `process-onboarding-agent/` |
| `estimation` | `process-estimation-agent/` |

```sh
npx @99x-ai-dlc/idf-installer onboarding
npx @99x-ai-dlc/idf-installer diagnostic --dest ./my-project
npx @99x-ai-dlc/idf-installer --agents process-diagnostic-agent --force
```

Options: `--dest <path>`, `--force`, `--list`, `-h/--help`

## Maintenance note

`repository-agents/` inside this package is bundled from the base repo at publish time via `npm run prepack` (`scripts/sync-agents.js`). If agent folder contents change in the base repo, bump the package version and publish a new release.

`PROFILES` and `TRIGGERS` in [`bin/ai-dlc.js`](bin/ai-dlc.js) are a copy of the same tables in `cli/bin/ai-dlc-init.js` and mirror the per-flow steps in the main `README.md` "Getting Started" section. If a flow's required folders or trigger phrase change in any of those three places, update all three.
