# ai-dlc

Installs the [99x Intent Delivery Framework](https://github.com/99x-Projects/ai-dlc-base) agent folders into your project. Works with Claude Code, Cursor, and GitHub Copilot.

## Install

```sh
npm install ai-dlc
```

This makes the `ai-dlc` command available. No files are copied automatically — run the command for the flow you need:

```sh
npx ai-dlc onboarding    # process-onboarding-agent/ + process-estimation-agent/
npx ai-dlc diagnostic    # process-diagnostic-agent/
npx ai-dlc migration     # process-migration-agent/ + process-onboarding-agent/ + process-diagnostic-agent/
npx ai-dlc skills        # process-skills-agent/ + process-onboarding-agent/
npx ai-dlc estimation    # process-estimation-agent/
```

Then open your AI assistant and say the trigger phrase printed after the command completes.

## `npx ai-dlc`

```sh
npx ai-dlc <profile> [options]
npx ai-dlc --agents <name>[,<name>...] [options]
```

| Profile | Copies |
|---|---|
| `onboarding` | `process-onboarding-agent/`, `process-estimation-agent/` |
| `diagnostic` | `process-diagnostic-agent/` |
| `migration` | `process-migration-agent/`, `process-onboarding-agent/`, `process-diagnostic-agent/` |
| `skills` | `process-skills-agent/`, `process-onboarding-agent/` |
| `estimation` | `process-estimation-agent/` |

```sh
npx ai-dlc onboarding
npx ai-dlc diagnostic --dest ./my-project
npx ai-dlc --agents process-diagnostic-agent --force
```

Options: `--dest <path>`, `--force`, `--list`, `-h/--help`

## Maintenance note

`repository-agents/` inside this package is bundled from the base repo at publish time via `npm run prepublishOnly` (`scripts/sync-agents.js`). If agent folder contents change in the base repo, bump the package version and publish a new release.
