#!/usr/bin/env node

const { spawnSync } = require('child_process');

const tag = process.env.DIAGNOSTIC_TAG || process.argv[2] || '@mutable';
const workers = process.env.DIAGNOSTIC_WORKERS || '1';
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = [
  'playwright',
  'test',
  '--config',
  'playwright.bdd.config.ts',
  '--project=desktop',
  '--grep',
  tag,
  '--workers',
  workers,
];

const result = spawnSync(npxCommand, args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    CI: 'true',
    PARALLEL_RUN: 'false',
    RESULTS_GROUP: 'diagnostic',
    TRACE_MODE: 'retain-on-failure',
  },
  shell: process.platform === 'win32',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
