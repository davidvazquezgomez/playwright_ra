#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { generateMessages } = require('@cucumber/gherkin');
const { IdGenerator, SourceMediaType } = require('@cucumber/messages');

const ROOT = process.cwd();
const FEATURES_DIR = path.join(ROOT, 'features');
const WRITE_MODE = process.argv.includes('--write');
const CLASSIFICATION_TAGS = new Set(['@readOnly', '@mutable']);
const newId = IdGenerator.uuid();

const mutationPatterns = [
  /\b(toggle|check|uncheck)\b/i,
  /\bupload\b/i,
  /\b(mark|unmark)\b.*\b(unread|read|favo(?:u)?rite)\b/i,
  /\b(create|delete|remove|reassign|deactivate|reactivate)\b/i,
  /\b(edit|update)\b.*\b(action|allocation|client|impact area|portal|privacy|release|team|update|user)\b/i,
  /\b(add|adding)\b.*\b(action|allocation|attachment|comment|member|portal|team|user)\b/i,
  /\bsave\b.*\b(action|allocation|changes|filter|portal|privacy|release|settings|team|update|user)\b/i,
  /press "(?:Save|Save Settings|Update Portal|Update Portal Now|Comment|Delete|Create anyway)" button/i,
  /save the team from/i,
  /\b(private action|leave team)\b/i,
];
const readOnlyScenarioPatterns = [
  /\breset the filter\b/i,
  /\bapply a predefined filter\b/i,
  /\bapply a customized filter\b/i,
  /\bclear all filters\b/i,
  /\bapply two filters\b/i,
];

const featureFiles = findFeatureFiles(FEATURES_DIR);
const issues = [];
let readOnlyScenarios = 0;
let mutableScenarios = 0;
let changedFiles = 0;

for (const featureFile of featureFiles) {
  const source = fs.readFileSync(featureFile, 'utf8');
  const document = parseFeature(source, featureFile);
  const scenarios = collectScenarios(document.feature?.children || []);
  const lines = source.split(/\r?\n/);
  const insertions = [];

  for (const scenario of scenarios) {
    const existingTags = scenario.tags
      .map(tag => tag.name)
      .filter(tag => CLASSIFICATION_TAGS.has(tag));
    const expectedTag = isMutableScenario(scenario) ? '@mutable' : '@readOnly';

    if (expectedTag === '@mutable') mutableScenarios += 1;
    else readOnlyScenarios += 1;

    if (existingTags.length === 1 && existingTags[0] === expectedTag) {
      continue;
    }

    const relativeFile = path.relative(ROOT, featureFile).replace(/\\/g, '/');
    issues.push({
      file: relativeFile,
      line: scenario.location.line,
      scenario: scenario.name,
      expectedTag,
      existingTags,
    });

    if (WRITE_MODE) {
      const firstTagLine = scenario.tags.length > 0
        ? Math.min(...scenario.tags.map(tag => tag.location.line))
        : scenario.location.line;
      const indentation = lines[scenario.location.line - 1].match(/^\s*/)?.[0] || '';
      insertions.push({
        index: firstTagLine - 1,
        line: `${indentation}${expectedTag}`,
        existingTagLines: scenario.tags
          .filter(tag => CLASSIFICATION_TAGS.has(tag.name))
          .map(tag => tag.location.line - 1),
      });
    }
  }

  if (WRITE_MODE && insertions.length > 0) {
    const obsoleteTagLines = new Set(insertions.flatMap(insertion => insertion.existingTagLines));
    const updatedLines = lines.filter((_, index) => !obsoleteTagLines.has(index));
    const removedBefore = index => [...obsoleteTagLines].filter(lineIndex => lineIndex < index).length;

    for (const insertion of [...insertions].sort((first, second) => second.index - first.index)) {
      updatedLines.splice(insertion.index - removedBefore(insertion.index), 0, insertion.line);
    }

    const eol = source.includes('\r\n') ? '\r\n' : '\n';
    fs.writeFileSync(featureFile, updatedLines.join(eol));
    changedFiles += 1;
  }
}

if (WRITE_MODE) {
  console.log(
    `Scenario classification updated in ${changedFiles} feature file(s): ` +
    `${readOnlyScenarios} @readOnly, ${mutableScenarios} @mutable.`,
  );
  process.exit(0);
}

if (issues.length > 0) {
  console.error(`Scenario classification failed with ${issues.length} missing or stale tag(s):`);
  for (const issue of issues.slice(0, 50)) {
    console.error(
      `- ${issue.file}:${issue.line} ${issue.scenario}: expected ${issue.expectedTag}, ` +
      `found ${issue.existingTags.join(', ') || 'no classification tag'}.`,
    );
  }
  if (issues.length > 50) {
    console.error(`- ... ${issues.length - 50} additional issue(s).`);
  }
  console.error('Run: node scripts/classify-bdd-scenarios.js --write');
  process.exit(1);
}

console.log(
  `Scenario classification validated across ${featureFiles.length} feature file(s): ` +
  `${readOnlyScenarios} @readOnly, ${mutableScenarios} @mutable.`,
);

function parseFeature(source, filePath) {
  const envelopes = generateMessages(
    source,
    path.relative(ROOT, filePath).replace(/\\/g, '/'),
    SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN,
    {
      defaultDialect: 'en',
      includeSource: false,
      includeGherkinDocument: true,
      includePickles: false,
      newId,
    },
  );
  const parseError = envelopes.find(envelope => envelope.parseError)?.parseError;
  if (parseError) {
    throw new Error(`${filePath}: ${parseError.message}`);
  }
  return envelopes.find(envelope => envelope.gherkinDocument)?.gherkinDocument;
}

function collectScenarios(children) {
  return children.flatMap(child => {
    if (child.scenario) return [child.scenario];
    if (child.rule) return collectScenarios(child.rule.children || []);
    return [];
  });
}

function isMutableScenario(scenario) {
  if (readOnlyScenarioPatterns.some(pattern => pattern.test(scenario.name))) {
    return false;
  }

  return scenario.steps.some(step => mutationPatterns.some(pattern => pattern.test(step.text)));
}

function findFeatureFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findFeatureFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.feature') ? [entryPath] : [];
  });
}
