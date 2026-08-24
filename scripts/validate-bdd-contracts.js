#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const FEATURES_DIR = path.join(ROOT, 'features');
const COMMON_PAGE_FILE = path.join(ROOT, 'pages', 'CommonPage.ts');
const PIPELINE_FILE = path.join(ROOT, 'azure-pipelines.yml');

const commonPageSource = fs.readFileSync(COMMON_PAGE_FILE, 'utf8');
const pipelineSource = fs.readFileSync(PIPELINE_FILE, 'utf8');

const contracts = [
  {
    name: 'named application page',
    stepPattern: /^\s*(?:Given|When|Then|And|But)\s+the "([^"]+)" page is open\s*$/,
    supportedValues: extractObjectKeys(extractMethod(commonPageSource, 'openNamedPage')),
  },
  {
    name: 'shared button',
    stepPattern: /^\s*(?:Given|When|Then|And|But)\s+press "([^"]+)" button\s*$/,
    supportedValues: extractSwitchCases(extractMethod(commonPageSource, 'clickButton')),
  },
  {
    name: 'Save & Continue page',
    stepPattern: /^\s*(?:Given|When|Then|And|But)\s+press "Save & Continue" button on the "([^"]+)" page\s*$/,
    supportedValues: extractSwitchCases(extractMethod(commonPageSource, 'continuePortalConfiguration')),
  },
  {
    name: 'download link',
    stepPattern: /^\s*(?:Given|When|Then|And|But)\s+user click at "([^"]+)" link\s*$/,
    supportedValues: extractSwitchCases(extractMethod(commonPageSource, 'downloadFileFromElement')),
  },
  {
    name: 'Upload Updates option',
    stepPattern: /^\s*(?:Given|When|Then|And|But)\s+click on "([^"]+)" option from the Upload Updates page\s*$/,
    supportedValues: new Set(['Upload files']),
  },
];

const supportedUserTypes = new Set(['deloitte', 'external']);
const supportedRoles = new Set(
  [...pipelineSource.matchAll(/USER_([A-Z][A-Z0-9]+)_PASSWORD/g)].map(match => match[1]),
);
const violations = [];

for (const featureFile of findFeatureFiles(FEATURES_DIR)) {
  const relativePath = path.relative(ROOT, featureFile).replace(/\\/g, '/');
  const lines = fs.readFileSync(featureFile, 'utf8').split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const contract of contracts) {
      const match = line.match(contract.stepPattern);
      if (match && !isScenarioOutlinePlaceholder(match[1]) && !contract.supportedValues.has(match[1])) {
        violations.push({
          file: relativePath,
          line: index + 1,
          contract: contract.name,
          value: match[1],
          supportedValues: [...contract.supportedValues].sort(),
        });
      }
    }

    const loginMatch = line.match(
      /^\s*(?:Given|When|Then|And|But)\s+launch Regulatory Advantage application URL and login as "([^"]+)" user "([^"]+)"\s*$/,
    );
    if (loginMatch) {
      const userType = loginMatch[1].toLowerCase();
      const role = loginMatch[2].toUpperCase();
      if (!supportedUserTypes.has(userType)) {
        violations.push({
          file: relativePath,
          line: index + 1,
          contract: 'authentication user type',
          value: loginMatch[1],
          supportedValues: [...supportedUserTypes].sort(),
        });
      }
      if (!supportedRoles.has(role)) {
        violations.push({
          file: relativePath,
          line: index + 1,
          contract: 'authentication role',
          value: loginMatch[2],
          supportedValues: [...supportedRoles].sort(),
        });
      }
    }
  });
}

if (violations.length > 0) {
  const groupedViolations = new Map();
  for (const violation of violations) {
    const key = `${violation.contract}:${violation.value}`;
    const group = groupedViolations.get(key) || { ...violation, locations: [] };
    group.locations.push(`${violation.file}:${violation.line}`);
    groupedViolations.set(key, group);
  }

  console.error(
    `BDD contract validation failed with ${groupedViolations.size} unsupported value(s) ` +
    `across ${violations.length} step occurrence(s):`,
  );
  for (const violation of groupedViolations.values()) {
    console.error(
      `- [${violation.contract}] "${violation.value}" used ${violation.locations.length} time(s). ` +
      `First locations: ${violation.locations.slice(0, 5).join(', ')}. ` +
      `Supported: ${violation.supportedValues.join(', ')}`,
    );
  }
  process.exit(1);
}

console.log(`BDD business contracts validated across ${findFeatureFiles(FEATURES_DIR).length} feature file(s).`);

function extractMethod(source, methodName) {
  const methodStart = source.indexOf(`async ${methodName}(`);
  if (methodStart === -1) {
    throw new Error(`Method "${methodName}" was not found in ${COMMON_PAGE_FILE}.`);
  }

  const bodyStart = source.indexOf('{', methodStart);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(bodyStart + 1, index);
  }

  throw new Error(`Method "${methodName}" has an unterminated body.`);
}

function extractSwitchCases(source) {
  return new Set([...source.matchAll(/case\s+["']([^"']+)["']\s*:/g)].map(match => match[1]));
}

function extractObjectKeys(source) {
  return new Set([...source.matchAll(/^\s*["']([^"']+)["']\s*:/gm)].map(match => match[1]));
}

function isScenarioOutlinePlaceholder(value) {
  return /^<[^>]+>$/.test(value);
}

function findFeatureFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findFeatureFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.feature') ? [entryPath] : [];
  });
}
