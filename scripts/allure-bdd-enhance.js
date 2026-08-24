#!/usr/bin/env node
/**
 * allure-bdd-enhance.js
 *
 * Post-processes Allure results to inject BDD steps (Given/When/Then)
 * that were not reached because the test failed earlier.
 *
 * This ensures that the Allure report shows ALL steps in the Gherkin scenario,
 * marking as "skipped" those that were not reached because of an earlier failure.
 *
 * Uso:
 *   node scripts/allure-bdd-enhance.js
 *
 * Runs automatically as part of "npm run allure:generate".
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ALLURE_DIR = path.resolve('allure-results');
const GEN_DIR = path.resolve('.features-gen');
const CATEGORY_FILE = path.resolve('config', 'allure-categories.json');
const ANALYSIS_DIR = path.resolve('test-results', 'analysis');

function escapePropertyValue(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/\r?\n/g, ' ');
}

function writeReportMetadata() {
  if (!fs.existsSync(ALLURE_DIR)) {
    return;
  }

  if (fs.existsSync(CATEGORY_FILE)) {
    fs.copyFileSync(CATEGORY_FILE, path.join(ALLURE_DIR, 'categories.json'));
  }

  const environment = {
    Environment: process.env.ENV || 'local',
    'Base URL': process.env[`${process.env.ENV || 'STAGE'}_URL`] || '',
    Browser: 'Chromium desktop',
    Workers: process.env.WORKERS || 'default',
    Parallel: process.env.PARALLEL_RUN || 'false',
    Retries: process.env.RETRIES ?? (process.env.CI ? '2' : '0'),
  };
  const environmentContent = Object.entries(environment)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${escapePropertyValue(value)}`)
    .join('\n');
  fs.writeFileSync(path.join(ALLURE_DIR, 'environment.properties'), environmentContent);

  const buildUrl = process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI && process.env.SYSTEM_TEAMPROJECT && process.env.BUILD_BUILDID
    ? `${process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI}${process.env.SYSTEM_TEAMPROJECT}/_build/results?buildId=${process.env.BUILD_BUILDID}`
    : undefined;
  const executor = {
    name: process.env.TF_BUILD ? 'Azure Pipelines' : 'Local execution',
    type: process.env.TF_BUILD ? 'azure-pipelines' : 'local',
    buildName: process.env.BUILD_DEFINITIONNAME,
    buildOrder: process.env.BUILD_BUILDID,
    buildUrl,
    reportName: 'Allure Report - Playwright BDD',
    reportUrl: buildUrl,
  };
  fs.writeFileSync(path.join(ALLURE_DIR, 'executor.json'), JSON.stringify(executor, null, 2));
}

function classifyTimeoutFailures() {
  if (!fs.existsSync(ALLURE_DIR)) {
    return;
  }

  const groups = new Map();
  const resultFiles = fs.readdirSync(ALLURE_DIR).filter(file => file.endsWith('-result.json'));

  for (const file of resultFiles) {
    const filePath = path.join(ALLURE_DIR, file);
    const result = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const statusDetails = findTimeoutStatusDetails(result);
    if (!statusDetails) {
      continue;
    }

    const trace = `${statusDetails.message || ''}\n${statusDetails.trace || ''}`;
    const frame = findOwningPageObjectFrame(trace);
    const pageObject = frame?.pageObject || 'UnknownPageObject';
    const method = frame?.method || 'unknownMethod';
    const selector = extractWaitingTarget(trace) || 'No selector reported';
    const groupKey = `${pageObject}.${method}`;
    const group = groups.get(groupKey) || {
      pageObject,
      method,
      count: 0,
      selectors: new Map(),
      scenarios: [],
    };

    group.count += 1;
    group.selectors.set(selector, (group.selectors.get(selector) || 0) + 1);
    group.scenarios.push(result.name);
    groups.set(groupKey, group);

    result.labels = result.labels || [];
    setLabel(result.labels, 'timeoutPage', pageObject);
    setLabel(result.labels, 'timeoutMethod', method);
    fs.writeFileSync(filePath, JSON.stringify(result));
  }

  const timeoutGroups = [...groups.entries()]
    .map(([signature, group]) => ({
      signature,
      pageObject: group.pageObject,
      method: group.method,
      count: group.count,
      selectors: [...group.selectors.entries()]
        .map(([selector, count]) => ({ selector, count }))
        .sort((first, second) => second.count - first.count),
      scenarios: group.scenarios.sort(),
    }))
    .sort((first, second) => second.count - first.count || first.signature.localeCompare(second.signature));

  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(ANALYSIS_DIR, 'timeout-groups.json'),
    JSON.stringify({ totalTimeouts: timeoutGroups.reduce((total, group) => total + group.count, 0), groups: timeoutGroups }, null, 2),
  );

  const configuredCategories = fs.existsSync(CATEGORY_FILE)
    ? JSON.parse(fs.readFileSync(CATEGORY_FILE, 'utf8'))
    : [];
  const timeoutCategories = timeoutGroups
    .filter(group => group.signature !== 'UnknownPageObject.unknownMethod')
    .map(group => ({
      name: `Timeout (${group.count}) - ${group.signature}`,
      matchedStatuses: ['failed', 'broken'],
      traceRegex: `(?s).*${escapeRegularExpression(group.signature)}.*`,
    }));
  fs.writeFileSync(
    path.join(ALLURE_DIR, 'categories.json'),
    JSON.stringify([...timeoutCategories, ...configuredCategories], null, 2),
  );

  console.log(`  ✅ ${timeoutGroups.length} timeout group(s) classified across ${resultFiles.length} result(s).`);
}

function findTimeoutStatusDetails(container) {
  const statusDetails = container?.statusDetails;
  const detailsText = `${statusDetails?.message || ''}\n${statusDetails?.trace || ''}`;
  if (/TimeoutError:|Test timeout of \d+ms exceeded/.test(detailsText)) {
    return statusDetails;
  }

  for (const step of container?.steps || []) {
    const nestedStatusDetails = findTimeoutStatusDetails(step);
    if (nestedStatusDetails) {
      return nestedStatusDetails;
    }
  }

  return undefined;
}

function findOwningPageObjectFrame(trace) {
  const framePattern = /at ([\w$.<>]+) \([^\n]*[\\/]pages[\\/]([^\\/:]+)\.ts:\d+:\d+\)/g;
  for (const match of trace.matchAll(framePattern)) {
    const pageObject = match[2];
    if (pageObject !== 'BasePage') {
      return { pageObject, method: match[1].split('.').pop() };
    }
  }

  return undefined;
}

function extractWaitingTarget(trace) {
  const match = trace.match(/^\s*- waiting for (.+?)(?: to be (?:visible|hidden|attached|detached)|$)/m);
  return match?.[1]?.trim().slice(0, 300);
}

function setLabel(labels, name, value) {
  const label = labels.find(existingLabel => existingLabel.name === name);
  if (label) {
    label.value = value;
  } else {
    labels.push({ name, value });
  }
}

function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── 1. Load bddFileData from generated .spec.js files ───────────────────────

function loadBddDataMap() {
  const map = new Map(); // key: "relPath:line" → bddEntry

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(fullPath); continue; }
      if (!entry.name.endsWith('.spec.js')) continue;

      const content = fs.readFileSync(fullPath, 'utf8');

      // Extract the bddFileData array between the markers
      const dataMatch = content.match(/bdd-data-start\s*\n([\s\S]*?)\n\]; \/\/ bdd-data-end/);
      if (!dataMatch) continue;

      let jsonStr = dataMatch[1].trim();
      if (jsonStr.endsWith(',')) jsonStr = jsonStr.slice(0, -1);

      let entries;
      try {
        entries = JSON.parse(`[${jsonStr}]`);
      } catch (e) {
        console.warn(`  ⚠ Could not parse bddFileData in ${fullPath}: ${e.message}`);
        continue;
      }

      // Key: path relative to .features-gen (without the column for safe matching)
      const relPath = path.relative(GEN_DIR, fullPath).replace(/\\/g, '/');

      for (const bddEntry of entries) {
        const key = `${relPath}:${bddEntry.pwTestLine}`;
        map.set(key, bddEntry);
      }
    }
  }

  walk(GEN_DIR);
  return map;
}

// ─── 2. Procesar resultados de Allure ─────────────────────────────────────────

function enhanceResults(bddMap) {
  if (!fs.existsSync(ALLURE_DIR)) {
    console.log('  The allure-results directory was not found.');
    return;
  }

  const resultFiles = fs.readdirSync(ALLURE_DIR).filter(f => f.endsWith('-result.json'));
  let enhanced = 0;

  for (const file of resultFiles) {
    const filePath = path.join(ALLURE_DIR, file);
    const result = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!result.fullName) continue;

    // Extract file and line from fullName (format: "path/file.spec.js:line:col")
    const fnMatch = result.fullName.match(/^(.+):(\d+):(\d+)$/);
    if (!fnMatch) continue;

    const lookupKey = `${fnMatch[1]}:${fnMatch[2]}`;
    const bddEntry = bddMap.get(lookupKey);
    if (!bddEntry) continue;

    // Separate steps: background (isBg) vs. test body
    const expectedBodySteps = bddEntry.steps.filter(s => !s.isBg);
    if (expectedBodySteps.length === 0) continue;

    // Collect step names already present in the result (recursively)
    const existingNames = new Set();
    function collectNames(steps) {
      if (!steps) return;
      for (const s of steps) {
        if (s.name) existingNames.add(s.name);
        collectNames(s.steps);
      }
    }
    collectNames(result.steps);

    // Identify missing body steps
    const missingSteps = expectedBodySteps.filter(s => !existingNames.has(s.textWithKeyword));
    if (missingSteps.length === 0) continue;

    // Create skipped step entries
    const timestamp = result.stop || result.start || Date.now();
    const skippedSteps = missingSteps.map(s => ({
      name: s.textWithKeyword,
      status: 'skipped',
      statusDetails: {},
      stage: 'pending',
      steps: [],
      attachments: [],
      parameters: [],
      start: timestamp,
      uuid: crypto.randomUUID(),
      stop: timestamp,
    }));

    // Insert after Before Hooks but before attachments and After Hooks
    const insertBeforeNames = new Set(['screenshot', 'video', 'trace', 'After Hooks']);
    let insertIndex = result.steps.findIndex(s => insertBeforeNames.has(s.name));

    if (insertIndex === -1) {
      insertIndex = result.steps.length;
    }

    result.steps.splice(insertIndex, 0, ...skippedSteps);

    fs.writeFileSync(filePath, JSON.stringify(result));
    enhanced++;

    if (process.env.VERBOSE) {
      console.log(`  → ${result.name}: +${skippedSteps.length} skipped steps`);
    }
  }

  console.log(`  ✅ ${enhanced} Allure result(s) enhanced with missing BDD steps.`);
}

function organizeFailureArtifacts() {
  if (!fs.existsSync(ALLURE_DIR)) {
    return;
  }

  const resultFiles = fs.readdirSync(ALLURE_DIR).filter(file => file.endsWith('-result.json'));
  const discardedSources = new Set();
  let organized = 0;

  for (const file of resultFiles) {
    const filePath = path.join(ALLURE_DIR, file);
    const result = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const screenshots = [];
    let changed = filterTechnicalAttachments(result, screenshots, discardedSources);
    changed = filterTechnicalSteps(result.steps, screenshots, discardedSources) || changed;

    const failedStep = findFailedStep(result.steps);
    if (failedStep && screenshots.length > 0) {
      failedStep.attachments = [...(failedStep.attachments || []), ...screenshots];
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(result));
      organized++;
    }
  }

  for (const source of discardedSources) {
    const sourcePath = path.join(ALLURE_DIR, source);
    if (fs.existsSync(sourcePath)) {
      fs.rmSync(sourcePath);
    }
  }

  console.log(`  ✅ ${organized} Allure result(s) organized; ${discardedSources.size} technical attachment(s) removed.`);
}

function filterTechnicalAttachments(container, screenshots, discardedSources) {
  if (!container.attachments) {
    return false;
  }

  const originalCount = container.attachments.length;
  container.attachments = container.attachments.filter(attachment => {
    if (attachment.name === 'screenshot' && attachment.type?.startsWith('image/')) {
      screenshots.push(attachment);
      return false;
    }

    const isTechnicalAttachment =
      ['error-context', 'trace'].includes(attachment.name?.toLowerCase()) ||
      attachment.type === 'application/vnd.allure.playwright-trace';
    if (isTechnicalAttachment && attachment.source) {
      discardedSources.add(attachment.source);
    }

    return !isTechnicalAttachment;
  });

  return container.attachments.length !== originalCount;
}

function filterTechnicalSteps(steps, screenshots, discardedSources) {
  if (!steps) {
    return false;
  }

  let changed = false;
  for (let index = steps.length - 1; index >= 0; index -= 1) {
    const step = steps[index];
    if (['screenshot', 'error-context', 'trace'].includes(step.name?.toLowerCase())) {
      changed = filterTechnicalAttachments(step, screenshots, discardedSources) || changed;
      steps.splice(index, 1);
      changed = true;
      continue;
    }

    changed = filterTechnicalAttachments(step, screenshots, discardedSources) || changed;
    changed = filterTechnicalSteps(step.steps, screenshots, discardedSources) || changed;
  }

  return changed;
}

function findFailedStep(steps) {
  if (!steps) {
    return undefined;
  }

  for (const step of [...steps].reverse()) {
    const failedChild = findFailedStep(step.steps);
    if (failedChild) {
      return failedChild;
    }

    if (step.status === 'failed' || step.status === 'broken') {
      return step;
    }
  }

  return undefined;
}

function normalizeSuiteHierarchy() {
  if (!fs.existsSync(ALLURE_DIR)) {
    return;
  }

  const resultFiles = fs.readdirSync(ALLURE_DIR).filter(file => file.endsWith('-result.json'));
  let normalized = 0;

  for (const file of resultFiles) {
    const filePath = path.join(ALLURE_DIR, file);
    const result = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const titlePath = result.labels?.find(label => label.name === 'titlePath')?.value;
    const subSuite = result.labels?.find(label => label.name === 'subSuite');
    const titleParts = titlePath?.split(' > ').map(part => part.trim()).filter(Boolean) || [];
    const featureFileIndex = titleParts.findIndex(part => part.endsWith('.feature.spec.js'));

    if (!subSuite || featureFileIndex === -1) {
      continue;
    }

    const feature = titleParts[featureFileIndex + 1];
    const scenario = titleParts.slice(featureFileIndex + 2).join(' > ') || result.name;
    const featureFilePath = titleParts[featureFileIndex].replace(/\\/g, '/');
    const featureDirectory = featureFilePath
      .split('/')
      .slice(0, -1)
      .filter(part => part !== 'features')
      .join(' / ');
    if (!feature || !featureDirectory) {
      continue;
    }

    const parentSuite = result.labels.find(label => label.name === 'parentSuite');
    if (parentSuite) {
      parentSuite.value = featureDirectory;
    } else {
      result.labels.push({ name: 'parentSuite', value: featureDirectory });
    }

    const suite = result.labels.find(label => label.name === 'suite');
    if (suite) {
      suite.value = feature;
    } else {
      result.labels.push({ name: 'suite', value: feature });
    }
    subSuite.value = scenario;

    fs.writeFileSync(filePath, JSON.stringify(result));
    normalized++;
  }

  console.log(`  ✅ ${normalized} Allure result(s) grouped by Gherkin feature.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('🔧 Allure BDD Enhance: injecting unreached Gherkin steps...');
writeReportMetadata();
const bddMap = loadBddDataMap();
console.log(`  Loaded ${bddMap.size} test cases from .features-gen.`);
enhanceResults(bddMap);
organizeFailureArtifacts();
classifyTimeoutFailures();
normalizeSuiteHierarchy();
