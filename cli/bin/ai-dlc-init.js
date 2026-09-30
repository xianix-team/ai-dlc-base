#!/usr/bin/env node
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_REPO = 'https://github.com/99x-Projects/ai-dlc-base.git';
const DEFAULT_REF = 'main';

// One entry per "Getting Started" flow in the base repo's README.md.
// Keep this in sync with README.md's Getting Started section and each
// agent's own "Prerequisites" block if either changes.
const PROFILES = {
  onboarding: ['process-onboarding-agent', 'process-estimation-agent'],
  diagnostic: ['process-diagnostic-agent'],
  migration: ['process-migration-agent', 'process-onboarding-agent', 'process-diagnostic-agent'],
  skills: ['process-skills-agent', 'process-onboarding-agent'],
  estimation: ['process-estimation-agent'],
};

const TRIGGERS = {
  onboarding: 'Read process-onboarding-agent/onboard.md and follow the instructions inside it.',
  diagnostic: 'Read process-diagnostic-agent/role-play.md and follow the instructions inside it.',
  migration: 'Read process-migration-agent/migrate.md and follow the instructions inside it.',
  skills: 'Read process-skills-agent/onboard.md and follow the instructions inside it.',
  estimation: 'Read process-estimation-agent/estimate.md and follow the instructions inside it.',
};

function printHelp() {
  console.log(`ai-dlc-init — fetch AI-DLC agent folders into a project without cloning the base repo

Usage:
  npx ai-dlc-init <profile> [options]
  npx ai-dlc-init --agents <name>[,<name>...] [options]

Profiles (mirrors README.md "Getting Started"):
${Object.entries(PROFILES)
  .map(([name, agents]) => `  ${name.padEnd(11)} -> ${agents.join(', ')}`)
  .join('\n')}

Options:
  --agents <list>   Comma-separated agent folder names, instead of a profile
  --repo <url>      Git URL to fetch from (default: ${DEFAULT_REPO})
  --ref <ref>       Branch or tag to fetch (default: ${DEFAULT_REF})
  --dest <path>     Directory to copy into (default: current directory)
  --force           Overwrite folders that already exist at the destination
  --list            List available profiles and exit
  -h, --help        Show this help

Examples:
  npx ai-dlc-init onboarding
  npx ai-dlc-init estimation --dest ./my-project
  npx ai-dlc-init --agents process-diagnostic-agent --ref v2.1.0
`);
}

function parseArgs(argv) {
  const opts = {
    profile: null,
    agents: null,
    repo: DEFAULT_REPO,
    ref: DEFAULT_REF,
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
      case '--agents':
        opts.agents = (argv[++i] || '').split(',').map((s) => s.trim()).filter(Boolean);
        break;
      case '--repo':
        opts.repo = argv[++i];
        break;
      case '--ref':
        opts.ref = argv[++i];
        break;
      case '--dest':
        opts.dest = argv[++i];
        break;
      default:
        if (arg.startsWith('-')) {
          throw new Error(`Unknown option: ${arg}`);
        }
        if (opts.profile) {
          throw new Error(`Unexpected extra argument: ${arg}`);
        }
        opts.profile = arg;
    }
  }

  return opts;
}

function run(cmd, args, opts) {
  execFileSync(cmd, args, { stdio: 'inherit', ...opts });
}

function ensureGitAvailable() {
  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' });
  } catch {
    console.error('ai-dlc-init requires git on your PATH. Install git and try again.');
    process.exit(1);
  }
}

function resolveAgents(opts) {
  if (opts.agents) {
    return opts.agents;
  }
  if (!opts.profile) {
    return null;
  }
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

  if (opts.help) {
    printHelp();
    return;
  }

  if (opts.list) {
    console.log('Available profiles:');
    for (const [name, agents] of Object.entries(PROFILES)) {
      console.log(`  ${name.padEnd(11)} -> ${agents.join(', ')}`);
    }
    return;
  }

  const agents = resolveAgents(opts);
  if (!agents || agents.length === 0) {
    printHelp();
    process.exit(1);
  }

  ensureGitAvailable();

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

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-dlc-init-'));

  try {
    console.log(`Fetching ${agents.join(', ')} from ${opts.repo}@${opts.ref} ...`);
    run('git', [
      'clone',
      '--filter=blob:none',
      '--no-checkout',
      '--depth', '1',
      '--branch', opts.ref,
      opts.repo,
      tmpDir,
    ]);
    run('git', ['sparse-checkout', 'init', '--cone'], { cwd: tmpDir });
    run(
      'git',
      ['sparse-checkout', 'set', ...agents.map((a) => `repository-agents/${a}`)],
      { cwd: tmpDir }
    );
    run('git', ['checkout', opts.ref], { cwd: tmpDir });

    for (const agent of agents) {
      const src = path.join(tmpDir, 'repository-agents', agent);
      if (!fs.existsSync(src)) {
        throw new Error(
          `Agent folder "${agent}" was not found in ${opts.repo}@${opts.ref}. Run with --list to see valid names.`
        );
      }
      const target = path.join(dest, agent);
      fs.rmSync(target, { recursive: true, force: true });
      fs.cpSync(src, target, { recursive: true });
      console.log(`  copied ${agent}/`);
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log('\nDone. Next, open your AI assistant in this repo and say:\n');
  if (opts.profile && TRIGGERS[opts.profile]) {
    console.log(`  "${TRIGGERS[opts.profile]}"\n`);
  } else {
    console.log('  Read the .md entry point inside the copied folder(s) and follow the instructions inside it.\n');
  }
}

main();
