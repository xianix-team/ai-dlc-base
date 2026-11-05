#!/usr/bin/env node
'use strict';

// Runs automatically after `npm install ai-dlc`.
//
// Default: copies all agent folders.
// Profile: set AIDLC_PROFILE=<profile> to copy only that profile's folders.
// Overwrite: set AIDLC_FORCE=1 to overwrite existing folders.
// Skip entirely: npm install ai-dlc --ignore-scripts
//   (use `npx ai-dlc <profile>` manually instead)

const fs = require('fs');
const path = require('path');

const PROFILES = {
  onboarding: ['process-onboarding-agent', 'process-estimation-agent'],
  diagnostic:  ['process-diagnostic-agent'],
  migration:   ['process-migration-agent', 'process-onboarding-agent', 'process-diagnostic-agent'],
  skills:      ['process-skills-agent', 'process-onboarding-agent'],
  estimation:  ['process-estimation-agent'],
};

const TRIGGERS = {
  'process-onboarding-agent':  'Read process-onboarding-agent/onboard.md and follow the instructions inside it.',
  'process-diagnostic-agent':  'Read process-diagnostic-agent/role-play.md and follow the instructions inside it.',
  'process-migration-agent':   'Read process-migration-agent/migrate.md and follow the instructions inside it.',
  'process-skills-agent':      'Read process-skills-agent/onboard.md and follow the instructions inside it.',
  'process-estimation-agent':  'Read process-estimation-agent/estimate.md and follow the instructions inside it.',
};

function main() {
  const dest = process.env.INIT_CWD || process.cwd();
  const force = process.env.AIDLC_FORCE === '1';
  const profileName = process.env.AIDLC_PROFILE || null;
  const agentsDir = path.join(__dirname, '..', 'repository-agents');

  if (!fs.existsSync(agentsDir)) {
    console.warn(
      '[ai-dlc] Bundled repository-agents/ not found. ' +
      'Run `npm run prepublishOnly` in npm/ to sync them, then reinstall.'
    );
    return;
  }

  // Resolve agent list: profile or all
  let agents;
  if (profileName) {
    const resolved = PROFILES[profileName];
    if (!resolved) {
      console.error(
        `[ai-dlc] Unknown profile "${profileName}". ` +
        `Valid profiles: ${Object.keys(PROFILES).join(', ')}`
      );
      process.exit(1);
    }
    agents = resolved;
    console.log(`[ai-dlc] Profile: ${profileName} — copying ${agents.join(', ')} ...`);
  } else {
    agents = fs.readdirSync(agentsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    console.log(`[ai-dlc] No AIDLC_PROFILE set — copying all agent folders to ${dest} ...`);
  }

  const conflicts = agents.filter((a) => fs.existsSync(path.join(dest, a)));
  if (conflicts.length && !force) {
    console.error(
      `[ai-dlc] Refusing to overwrite existing folder(s): ${conflicts.join(', ')}\n` +
      'Set AIDLC_FORCE=1 to overwrite, or remove them first.'
    );
    process.exit(1);
  }

  for (const agent of agents) {
    const src = path.join(agentsDir, agent);
    const target = path.join(dest, agent);
    fs.rmSync(target, { recursive: true, force: true });
    fs.cpSync(src, target, { recursive: true });
    console.log(`  copied ${agent}/`);
  }

  console.log('\n[ai-dlc] Done. Open your AI assistant in this repo and say:\n');
  for (const agent of agents) {
    if (TRIGGERS[agent]) {
      console.log(`  ${agent}: "${TRIGGERS[agent]}"`);
    }
  }
  console.log('');
}

main();
