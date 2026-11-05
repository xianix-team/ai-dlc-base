# ai-dlc

Installs the [99x Intent Delivery Framework](https://github.com/99x-Projects/ai-dlc-base) agent folders into your project. Works with Claude Code, Cursor, and GitHub Copilot.

## Install

```sh
npm install ai-dlc
```

Copies **all agent folders** into your project root by default. To copy only the folders you need, set `AIDLC_PROFILE` before installing:

```sh
AIDLC_PROFILE=onboarding npm install ai-dlc
AIDLC_PROFILE=diagnostic npm install ai-dlc
AIDLC_PROFILE=migration  npm install ai-dlc
AIDLC_PROFILE=skills     npm install ai-dlc
AIDLC_PROFILE=estimation npm install ai-dlc
```

| Profile | Copies |
|---|---|
| `onboarding` | `process-onboarding-agent/`, `process-estimation-agent/` |
| `diagnostic` | `process-diagnostic-agent/` |
| `migration` | `process-migration-agent/`, `process-onboarding-agent/`, `process-diagnostic-agent/` |
| `skills` | `process-skills-agent/`, `process-onboarding-agent/` |
| `estimation` | `process-estimation-agent/` |

Then open your AI assistant and say the trigger phrase printed after install.

### Overwrite existing folders

```sh
AIDLC_FORCE=1 npm install ai-dlc
AIDLC_PROFILE=onboarding AIDLC_FORCE=1 npm install ai-dlc
```

### Skip postinstall, copy manually

```sh
npm install ai-dlc --ignore-scripts
npx ai-dlc onboarding          # copy only the onboarding profile
npx ai-dlc --list              # see all profiles
```

## `npx ai-dlc` (manual profile copy)

```sh
npx ai-dlc <profile> [options]
npx ai-dlc --agents <name>[,<name>...] [options]
```

Profiles mirror the [Getting Started](https://github.com/99x-Projects/ai-dlc-base#getting-started) flows:

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
