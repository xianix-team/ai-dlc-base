#!/usr/bin/env node
'use strict';

// Run via `prepublishOnly` to bundle repository-agents/ into the package.
// Source: ../repository-agents/ (sibling of npm/ in the base repo)
// Destination: ./repository-agents/ (bundled inside the package)

const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', '..', 'repository-agents');
const dest = path.resolve(__dirname, '..', 'repository-agents');

if (!fs.existsSync(src)) {
  console.error(`sync-agents: source not found: ${src}`);
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log(`sync-agents: copied repository-agents/ into npm/repository-agents/`);
