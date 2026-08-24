const fs = require('fs');
const path = require('path');

const featureFiles = [];

function collectFeatureFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      collectFeatureFiles(entryPath);
    } else if (entry.name.endsWith('.feature')) {
      featureFiles.push(entryPath);
    }
  }
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((value) => value.trim());
}

collectFeatureFiles('features');

let converted = 0;

for (const featureFile of featureFiles) {
  const lines = fs.readFileSync(featureFile, 'utf8').split(/\r?\n/);

  for (let scenarioIndex = lines.length - 1; scenarioIndex >= 0; scenarioIndex--) {
    if (!/^\s*Scenario:\s+.+$/.test(lines[scenarioIndex])) {
      continue;
    }

    let scenarioEnd = lines.length;
    for (let index = scenarioIndex + 1; index < lines.length; index++) {
      if (/^\s*Scenario(?: Outline)?:|^\s*Rule:/.test(lines[index])) {
        scenarioEnd = index;
        break;
      }
    }

    let examplesIndex = -1;
    for (let index = scenarioIndex + 1; index < scenarioEnd; index++) {
      if (/^\s*Examples:/.test(lines[index])) {
        examplesIndex = index;
        break;
      }
    }

    if (examplesIndex === -1) {
      continue;
    }

    let tableStart = examplesIndex + 1;
    while (tableStart < scenarioEnd && /^\s*$/.test(lines[tableStart])) {
      tableStart++;
    }

    let tableEnd = tableStart;
    while (tableEnd < scenarioEnd && /^\s*\|/.test(lines[tableEnd])) {
      tableEnd++;
    }

    if (tableEnd - tableStart !== 2) {
      continue;
    }

    const headers = parseTableRow(lines[tableStart]);
    const values = parseTableRow(lines[tableStart + 1]);

    if (headers.length !== values.length || headers.some((header) => !header)) {
      throw new Error(`Invalid one-row Examples table in ${featureFile}:${examplesIndex + 1}`);
    }

    for (let index = scenarioIndex + 1; index < examplesIndex; index++) {
      headers.forEach((header, columnIndex) => {
        lines[index] = lines[index].split(`<${header}>`).join(values[columnIndex]);
      });
    }

    lines.splice(examplesIndex, tableEnd - examplesIndex);
    if (examplesIndex < lines.length && /^\s*$/.test(lines[examplesIndex]) && examplesIndex > 0 && /^\s*$/.test(lines[examplesIndex - 1])) {
      lines.splice(examplesIndex, 1);
    }

    converted++;
  }

  fs.writeFileSync(featureFile, lines.join('\n'), 'utf8');
}

console.log(`Converted ${converted} normal Scenarios with one-row Examples.`);