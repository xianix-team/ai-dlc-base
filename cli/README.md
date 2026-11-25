# ai-dlc-init

Fetches only the AI-DLC agent folders you need from `repository-agents/` in the base repo, without cloning the whole repo or its history. Replaces the "copy this folder from the base repo into your project root" step described in the main [README.md](../README.md#getting-started) with one command.

Uses a git blobless clone + sparse checkout under the hood — it needs `git` on your `PATH`, nothing else.

## Usage

```sh
npx ai-dlc-init <profile> [options]
```

Profiles mirror the flows in the base repo's [Getting Started](../README.md#getting-started) section:

| Profile | Copies |
|---|---|
| `onboarding` | `process-onboarding-agent/`, `process-estimation-agent/` |
| `diagnostic` | `process-diagnostic-agent/` |
| `migration` | `process-migration-agent/`, `process-onboarding-agent/`, `process-diagnostic-agent/` |
| `skills` | `process-skills-agent/`, `process-onboarding-agent/` |
| `estimation` | `process-estimation-agent/` |

```sh
npx ai-dlc-init onboarding                       # in your project root
npx ai-dlc-init estimation --dest ./my-project   # into a specific folder
npx ai-dlc-init --agents process-diagnostic-agent --ref v2.1.0
```

After it finishes, it prints the exact trigger phrase to say to your AI assistant (e.g. `"Read process-onboarding-agent/onboard.md and follow the instructions inside it."`).

## Options

- `--agents <list>` — comma-separated agent folder names, instead of a named profile
- `--repo <url>` — git URL to fetch from (default: this repo's canonical remote)
- `--ref <ref>` — branch or tag to fetch (default: `main`)
- `--dest <path>` — directory to copy into (default: current directory)
- `--force` — overwrite folders that already exist at the destination
- `--list` — list available profiles and exit

## Maintenance note

`PROFILES` and `TRIGGERS` in [`bin/ai-dlc-init.js`](bin/ai-dlc-init.js) are a copy of the folder lists and trigger phrases documented in the main README's "Getting Started" section and in each agent's own entry-point file. If a flow's required folders or trigger phrase change there, update this file too.
