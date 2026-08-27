#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const csvPath = path.resolve(process.argv[2] || 'docs/tests.csv');
const logPath = path.resolve(process.argv[3] || '27-08-2026.log');
const excelPath = path.resolve(process.argv[4] || 'docs/tests.xlsx');
const roles = {
    'Deloitte Super Admin': 'SuperAdmin',
    'Deloitte Portal Admin': 'PortalAdmin',
    'Deloitte User': 'DeloitteUser',
    'External_Client Admin': 'ClientAdmin',
    'External_Team Leader': 'TeamLeader',
    'External_Team Member': 'TeamMember',
    'External_Client User': 'ClientUser',
    'GA Portal': 'GAPortal',
};

if (!fs.existsSync(csvPath)) {
    throw new Error(`Test inventory CSV not found: ${csvPath}`);
}

if (!fs.existsSync(logPath)) {
    throw new Error(`Pipeline log not found: ${logPath}`);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

async function main() {
    const logContent = fs.readFileSync(logPath, 'utf8');
    const results = parseResults(logContent, parseFailureTypes(logContent));
    const { rows, matchedRows, noResultRows } = buildReportRows(fs.readFileSync(csvPath, 'utf8'), results);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Results');

    worksheet.columns = [
        { header: 'Test Case', key: 'testCase', width: 110 },
        { header: 'Result', key: 'result', width: 24 },
        { header: 'Failure type', key: 'failureType', width: 28 },
    ];
    worksheet.addRows(rows);
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9EAF7' } };
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    for (const row of worksheet.getRows(2, worksheet.rowCount - 1) || []) {
        if (!row.getCell('result').value) {
            row.font = { bold: true };
            row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2F0D9' } };
        }
    }

    await workbook.xlsx.writeFile(excelPath);
    console.log(`Created ${path.relative(process.cwd(), excelPath)}: ${matchedRows} case row(s) matched, ${noResultRows} without a result in ${path.basename(logPath)}.`);
}

function parseResults(logContent, failureTypes) {
    const results = [];
    const resultPattern = /^\d{4}-\d{2}-\d{2}T[^Z]+Z\s+([✓✘])\s+\d+\s+\[desktop\]\s+›\s+.*?\/([^/]+)_([A-Za-z]+)\.feature\.spec\.js:\d+:\d+\s+›\s+.*?\s+›\s+(.*?)\s+@(.*)$/;

    for (const line of logContent.replace(/\r/g, '').split('\n')) {
        const match = line.match(resultPattern);
        if (!match) {
            continue;
        }

        const [, marker, feature, role, scenarioWithExample] = match;
        const scenarioId = scenarioWithExample.match(/^(TC\d+(?:_\d+)*)_/i)?.[1];
        if (!scenarioId) {
            continue;
        }

        const scenario = scenarioWithExample.replace(/\s+\(retry #\d+\)\s*$/i, '').trim();
        results.push({
            feature: normalize(feature),
            role,
            scenarioId: scenarioId.toUpperCase(),
            scenario,
            status: marker === '✓' ? 'Passed' : 'Failed',
            failureType: marker === '✘' ? failureTypes.get(buildScenarioKey(feature, role, scenario)) || 'Automation failure' : '',
        });
    }

    return results;
}

function parseFailureTypes(logContent) {
    const failureTypes = new Map();
    const failureHeaderPattern = /^\d{4}-\d{2}-\d{2}T[^Z]+Z\s+\d+\)\s+\[desktop\]\s+›\s+.*?\/([^/]+)_([A-Za-z]+)\.feature\.spec\.js:\d+:\d+\s+›\s+.*?\s+›\s+(.*?)\s+@/;
    let currentScenarioKey;

    for (const line of logContent.replace(/\r/g, '').split('\n')) {
        const headerMatch = line.match(failureHeaderPattern);
        if (headerMatch) {
            const [, feature, role, scenarioWithExample] = headerMatch;
            const scenario = scenarioWithExample.replace(/\s+\(retry #\d+\)\s*$/i, '').trim();
            currentScenarioKey = buildScenarioKey(feature, role, scenario);
            failureTypes.set(currentScenarioKey, 'Automation failure');
            continue;
        }

        if (currentScenarioKey && line.includes('APPLICATION DEFECT DETECTED')) {
            failureTypes.set(currentScenarioKey, 'Application failure');
        }
    }

    return failureTypes;
}

function buildReportRows(csvContent, results) {
    let currentRole;
    let matchedRows = 0;
    let noResultRows = 0;
    const rows = [];

    for (const sourceLine of csvContent.replace(/^Test case,Resultado\r?\n/i, '').replace(/\r/g, '').split('\n')) {
        const testCase = sourceLine.split(',')[0].trim();
        if (!testCase) {
            continue;
        }

        if (roles[testCase]) {
            currentRole = roles[testCase];
            rows.push({ testCase, result: '', failureType: '' });
            continue;
        }

        const match = testCase.match(/^(TC\d+)_([^_]+(?:_[^_]+)*)_Verify\b/i);
        if (!match || !currentRole) {
            rows.push({ testCase, result: 'No result', failureType: '' });
            noResultRows += 1;
            continue;
        }

        const [, testCaseId, category] = match;
        const matchingResults = finalResultsForCase(results, currentRole, testCaseId, category);
        const status = summarizeResults(matchingResults);
        rows.push({ testCase, result: status, failureType: summarizeFailureTypes(matchingResults) });

        if (matchingResults.length) {
            matchedRows += 1;
        } else {
            noResultRows += 1;
        }
    }

    return { rows, matchedRows, noResultRows };
}

function summarizeResults(results) {
    if (!results.length) {
        return 'No result';
    }

    const statuses = new Set(results.map(result => result.status));
    if (statuses.size === 1) {
        return results[0].status;
    }

    return 'Passed with some fail';
}

function summarizeFailureTypes(results) {
    const failureTypes = [...new Set(results
        .filter(result => result.status === 'Failed')
        .map(result => result.failureType))];
    return failureTypes.join('; ');
}

function finalResultsForCase(results, role, testCaseId, category) {
    const categoryKey = normalize(category);
    const scenarioPrefix = testCaseId.toUpperCase();
    const matchingRuns = results.filter(result =>
        result.role === role &&
        (result.scenarioId === scenarioPrefix || result.scenarioId.startsWith(`${scenarioPrefix}_`)) &&
        categoryMatches(categoryKey, result.feature)
    );
    const finalByScenario = new Map();

    for (const result of matchingRuns) {
        const previous = finalByScenario.get(result.scenario);
        if (!previous || result.status === 'Passed') {
            finalByScenario.set(result.scenario, result);
        }
    }

    return [...finalByScenario.values()].sort((first, second) => first.scenario.localeCompare(second.scenario));
}

function categoryMatches(category, feature) {
    const comparableCategory = category.replace(/dashboards?|of|section/g, '');
    const comparableFeature = feature.replace(/dashboards?|of|section/g, '');
    return comparableFeature.includes(comparableCategory) || comparableCategory.includes(comparableFeature);
}

function normalize(value) {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/s(?=$|[a-z])/g, '');
}

function buildScenarioKey(feature, role, scenario) {
    return `${feature}|${role}|${scenario}`;
}
