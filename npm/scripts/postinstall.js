#!/usr/bin/env node
'use strict';

// Runs automatically after `npm install ai-dlc`.
// Copies all AI-DLC agent folders from the bundled repository-agents/
// into the project root (INIT_CWD, set by npm to the installing project's root).
//
// Override: AIDLC_FORCE=1 to overwrite existing folders.
// Skip entirely: npm install ai-dlc --ignore-scripts
//   (postinstall never runs; use `npx ai-dlc <profile>` manually instead)

const fs = require('fs');
const path = require('path');

const TRIGGERS = {
  'process-onboarding-agent':  'Read process-onboarding-agent/onboard.md and follow the instructions inside it.',
  'process-diagnostic-agent':  'Read process-diagnostic-agent/role-play.md and follow the instructions inside it.',
  'process-migration-agent':   'Read process-migration-agent/migrate.md and follow the instructions inside it.',
  'process-skills-agent':      'Read process-skills-agent/onboard.md and follow the instructions inside it.',
  'process-estimation-agent':  'Read process-estimation-agent/estimate.md and follow the instructions inside it.',
};

function main() {
  // npm sets INIT_CWD to the root of the project running `npm install`
  const dest = process.env.INIT_CWD || process.cwd();
  const force = process.env.AIDLC_FORCE === '1';
  const agentsDir = path.join(__dirname, '..', 'repository-agents');

  if (!fs.existsSync(agentsDir)) {
    console.warn(
      '[ai-dlc] Bundled repository-agents/ not found. ' +
      'Run `npm run prepublishOnly` in npm/ to sync them, then reinstall.'
    );
    return;
  }

  const agents = fs.readdirSync(agentsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  if (agents.length === 0) {
    console.warn('[ai-dlc] No agent folders found in bundled repository-agents/.');
    return;
  }

  const conflicts = agents.filter((a) => fs.existsSync(path.join(dest, a)));
  if (conflicts.length && !force) {
    console.error(
      `[ai-dlc] Refusing to overwrite existing folder(s): ${conflicts.join(', ')}\n` +
      'Set AIDLC_FORCE=1 to overwrite, or remove them first.'
    );
    process.exit(1);
  }

  console.log(`[ai-dlc] Copying agent folders to ${dest} ...`);
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
