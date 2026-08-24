#!/usr/bin/env node

const { existsSync } = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const action = process.argv[2];
const localWindowsJdk = 'C:\\Program Files\\Amazon Corretto\\jdk21.0.12_8';

if (!['generate', 'open'].includes(action)) {
  throw new Error('Usage: node scripts/allure-report.js <generate|open>');
}

const javaExecutable = process.platform === 'win32' ? 'java.exe' : 'java';
const configuredJava = process.env.JAVA_HOME
  ? path.join(process.env.JAVA_HOME, 'bin', javaExecutable)
  : undefined;

if (process.platform === 'win32' && (!configuredJava || !existsSync(configuredJava))) {
  process.env.JAVA_HOME = localWindowsJdk;
}

if (action === 'generate') {
  require('./allure-bdd-enhance');
}

const allureExecutable = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'allure.cmd' : 'allure',
);
const argumentsByAction = {
  generate: ['generate', '--config', './config/allure.yml', './allure-results', '-o', './allure-report', '--clean'],
  open: ['open', './allure-report'],
};
const result = spawnSync(allureExecutable, argumentsByAction[action], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);