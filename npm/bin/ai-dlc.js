#!/usr/bin/env node
'use strict';

// `npx @99x-ai-dlc/idf-installer <profile>` — copies a specific profile from the bundled
// repository-agents/ into the target directory, without fetching from GitHub.
// Same interface as `npx ai-dlc-init` in cli/, but reads local bundled files.
//
// PROFILES and TRIGGERS below must stay in sync with:
//   cli/bin/ai-dlc-init.js  — same tables, fetch-based variant
//   README.md "Getting Started" — the per-flow steps reference these profiles

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..', 'repository-agents');

const PROFILES = {
  onboarding: ['process-onboarding-agent', 'process-estimation-agent'],
  diagnostic:  ['process-diagnostic-agent'],
  migration:   ['process-migration-agent', 'process-onboarding-agent', 'process-diagnostic-agent'],
  skills:      ['process-skills-agent', 'process-onboarding-agent'],
  estimation:  ['process-estimation-agent'],
};

const TRIGGERS = {
  onboarding: 'Read process-onboarding-agent/onboard.md and follow the instructions inside it.',
  diagnostic: 'Read process-diagnostic-agent/role-play.md and follow the instructions inside it.',
  migration:  'Read process-migration-agent/migrate.md and follow the instructions inside it.',
  skills:     'Read process-skills-agent/onboard.md and follow the instructions inside it.',
  estimation: 'Read process-estimation-agent/estimate.md and follow the instructions inside it.',
};

function printHelp() {
  console.log(`@99x-ai-dlc/idf-installer — copy AI-DLC agent folders from the installed package into a project

Usage:
  npx @99x-ai-dlc/idf-installer <profile> [options]
  npx @99x-ai-dlc/idf-installer --agents <name>[,<name>...] [options]

Profiles:
${Object.entries(PROFILES)
  .map(([name, agents]) => `  ${name.padEnd(11)} -> ${agents.join(', ')}`)
  .join('\n')}

Options:
  --agents <list>   Comma-separated agent folder names, instead of a profile
  --dest <path>     Directory to copy into (default: current directory)
  --force           Overwrite folders that already exist at the destination
  --list            List available profiles and exit
  -h, --help        Show this help

Examples:
  npx @99x-ai-dlc/idf-installer onboarding
  npx @99x-ai-dlc/idf-installer diagnostic --dest ./my-project
  npx @99x-ai-dlc/idf-installer --agents process-diagnostic-agent
`);
}

function parseArgs(argv) {
  const opts = {
    profile: null,
    agents: null,
    dest: '.',
    force: false,
    list: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '-h':
      case '--help':
        opts.help = true;
        break;
      case '--list':
        opts.list = true;
        break;
      case '--force':
        opts.force = true;
        break;
      case '--agents': {
        const val = argv[++i];
        if (!val || val.startsWith('-')) throw new Error(`--agents requires a value`);
        opts.agents = val.split(',').map((s) => s.trim()).filter(Boolean);
        break;
      }
      case '--dest': {
        const val = argv[++i];
        if (!val || val.startsWith('-')) throw new Error(`--dest requires a path`);
        opts.dest = val;
        break;
      }
      default:
        if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
        if (opts.profile) throw new Error(`Unexpected extra argument: ${arg}`);
        opts.profile = arg;
    }
  }

  return opts;
}

function resolveAgents(opts) {
  if (opts.agents) return opts.agents;
  if (!opts.profile) return null;
  const agents = PROFILES[opts.profile];
  if (!agents) {
    console.error(`Unknown profile "${opts.profile}". Run with --list to see available profiles.`);
    process.exit(1);
  }
  return agents;
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    printHelp();
    process.exit(1);
  }

  if (opts.help) { printHelp(); return; }

  if (opts.list) {
    console.log('Available profiles:');
    for (const [name, agents] of Object.entries(PROFILES)) {
      console.log(`  ${name.padEnd(11)} -> ${agents.join(', ')}`);
    }
    return;
  }

  const agents = resolveAgents(opts);
  if (!agents || agents.length === 0) { printHelp(); process.exit(1); }

  const dest = path.resolve(opts.dest);
  if (!fs.existsSync(dest)) {
    console.error(`Destination does not exist: ${dest}`);
    process.exit(1);
  }

  const conflicts = agents.filter((a) => fs.existsSync(path.join(dest, a)));
  if (conflicts.length && !opts.force) {
    console.error(
      `Refusing to overwrite existing folder(s): ${conflicts.join(', ')}\n` +
      'Re-run with --force to overwrite, or remove them first.'
    );
    process.exit(1);
  }

  console.log(`Copying ${agents.join(', ')} to ${dest} ...`);
  for (const agent of agents) {
    const src = path.join(AGENTS_DIR, agent);
    if (!fs.existsSync(src)) {
      console.error(
        `Agent folder "${agent}" not found in bundled repository-agents/. ` +
        'Run --list to see valid names.'
      );
      process.exit(1);
    }
    const target = path.join(dest, agent);
    fs.rmSync(target, { recursive: true, force: true });
    fs.cpSync(src, target, { recursive: true });
    console.log(`  copied ${agent}/`);
  }

  console.log('\nDone. Open your AI assistant in this repo and say:\n');
  if (opts.profile && TRIGGERS[opts.profile]) {
    console.log(`  "${TRIGGERS[opts.profile]}"\n`);
  } else {
    console.log('  Read the .md entry point inside the copied folder(s) and follow the instructions inside it.\n');
  }
}

main();
