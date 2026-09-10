#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const resultsDirectory = path.resolve(process.env.JUNIT_RESULTS_DIRECTORY || 'test-results');
const attachmentDirective = /\s*\[\[ATTACHMENT\|[^\]]+\]\]/g;

if (!fs.existsSync(resultsDirectory)) {
  console.log('No test-results directory found; no JUnit reports to sanitize.');
  process.exit(0);
}

const junitFiles = fs.readdirSync(resultsDirectory)
  .filter((fileName) => /^junit-.*\.xml$/i.test(fileName));

for (const fileName of junitFiles) {
  const reportPath = path.join(resultsDirectory, fileName);
  const report = fs.readFileSync(reportPath, 'utf8');
  const sanitizedReport = report.replace(attachmentDirective, '');

  if (sanitizedReport !== report) {
    fs.writeFileSync(reportPath, sanitizedReport);
    console.log(`Removed attachment directives from ${path.relative(process.cwd(), reportPath)}.`);
  }
}

if (junitFiles.length === 0) {
  console.log('No JUnit reports found; nothing to sanitize.');
}