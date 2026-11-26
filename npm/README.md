# @99x-ai-dlc/idf-installer

Installs the [99x Intent Delivery Framework](https://github.com/99x-Projects/ai-dlc-base) agent folders into your project. Works with Claude Code, Cursor, and GitHub Copilot.

## Usage

No install required. Run the profile you need directly:

```sh
npx @99x-ai-dlc/idf-installer onboarding    # process-onboarding-agent/ + process-estimation-agent/
npx @99x-ai-dlc/idf-installer diagnostic    # process-diagnostic-agent/
npx @99x-ai-dlc/idf-installer migration     # process-migration-agent/ + process-onboarding-agent/ + process-diagnostic-agent/
npx @99x-ai-dlc/idf-installer skills        # process-skills-agent/ + process-onboarding-agent/
npx @99x-ai-dlc/idf-installer estimation    # process-estimation-agent/
```

Then open your AI assistant and say the trigger phrase printed after the command completes.

To pin a specific version (works for any project, including non-Node):

```sh
npx @99x-ai-dlc/idf-installer@0.1.1 onboarding
```

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

`repository-agents/` inside this package is bundled from the base repo at publish time via `npm run prepack` (`scripts/sync-agents.js`). To publish, push a tag named `v<version>` (for example `v0.2.1`). The publish workflow uses that tag as the package version and ignores the `version` field in `package.json`.

`PROFILES` and `TRIGGERS` in [`bin/idf-installer.js`](bin/idf-installer.js) are a copy of the same tables in `cli/bin/ai-dlc-init.js` and mirror the per-flow steps in the main `README.md` "Getting Started" section. If a flow's required folders or trigger phrase change in any of those three places, update all three.
