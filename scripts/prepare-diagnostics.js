#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const sourceDirectory = path.resolve(process.env.TEST_RESULTS_SOURCE || 'test-results');
const destinationDirectory = path.resolve(process.env.DIAGNOSTICS_DIRECTORY || 'test-results/diagnostics');
const excludedDirectories = new Set(['auth-state', 'diagnostics']);

if (!fs.existsSync(sourceDirectory)) {
  console.log('No test-results directory found; no diagnostics prepared.');
  process.exit(0);
}

fs.rmSync(destinationDirectory, { recursive: true, force: true });
fs.mkdirSync(destinationDirectory, { recursive: true });
copyDirectory(sourceDirectory, destinationDirectory);
console.log(`Diagnostics prepared in ${path.relative(process.cwd(), destinationDirectory)}.`);

function copyDirectory(source, destination) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) {
      continue;
    }

    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destinationPath, { recursive: true });
      copyDirectory(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}
