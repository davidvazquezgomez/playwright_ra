const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const root = path.resolve(__dirname, '..');
const workbookPath = path.join(root, 'result', 'tests_result.xlsx');
const logPaths = [
    path.join(root, 'log-readonly.log'),
    path.join(root, 'log-mutableINT.log'),
    path.join(root, 'log-mutableEXT.log'),
];

const roleHeaders = new Map([
    ['Deloitte Super Admin', 'SuperAdmin'],
    ['Deloitte Portal Admin', 'PortalAdmin'],
    ['Deloitte User', 'DeloitteUser'],
    ['External_Client Admin', 'ClientAdmin'],
    ['External_Team Leader', 'TeamLeader'],
    ['External_Team Member', 'TeamMember'],
    ['External_Client User', 'ClientUser'],
    ['GA Portal', 'GAPortal'],
]);

const featureAliases = [
    ['DashboardUpdates', /updatesdashboard/i],
    ['DashboardActions', /actionsdashboard/i],
    ['DashboardAnalytics', /analyticsdashboard/i],
    ['DashboardOptions', /dashboardoptions/i],
    ['DashboardOptions', /^tc0(?:19|20)dashboards/i],
    ['AutomaticAllocation', /automaticallocation/i],
    ['ClientPortalSetup', /clientportalsetup/i],
    ['ClientPortalList', /clientportallist|portalmanagement|clientportals/i],
    ['Notifications', /notifications/i],
    ['Overview', /overview/i],
    ['FooterLinks', /footerlinks/i],
    ['ProfileSection', /profilesection/i],
    ['TeamManagement', /teammanagement/i],
    ['UserManagement', /usermanagement/i],
    ['ManageImpactAreas', /manageimpactareas/i],
    ['PrivacyNotice', /privacynotice/i],
    ['ReleaseNotes', /realeasnotes|releases?notes/i],
    ['UploadUpdates', /uplaodupdates|uploadupdates/i],
];

function cleanLine(line) {
    return line
        .replace(/^\d{4}-\d{2}-\d{2}T\S+Z\s*/, '')
        .replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '')
        .trimEnd();
}

function normalizeFeatureName(featureFile) {
    const normalized = featureFile.replace(/[^a-z0-9]/gi, '').toLowerCase();
    if (normalized.startsWith('releasesnotes')) return 'ReleaseNotes';
    const known = featureAliases.find(([name]) => normalized.startsWith(name.toLowerCase()));
    return known ? known[0] : featureFile.replace(/_.*$/, '').replace(/\s/g, '');
}

function featureForExcelCase(testCase) {
    const identifier = testCase.split(/_Verify/i, 1)[0];
    const normalized = identifier.replace(/[^a-z0-9]/gi, '');
    return featureAliases.find(([, pattern]) => pattern.test(normalized))?.[0];
}

function parseTestReference(parts) {
    const pathPart = parts.find(part => part.includes('.feature.spec.js:'));
    const scenarioPart = parts.find(part => /^TC\d+/i.test(part.trim()));
    if (!pathPart || !scenarioPart) return undefined;

    const pathMatch = pathPart.match(/features\/([^/]+)\/([^/:]+)\.feature\.spec\.js/i);
    const scenarioText = scenarioPart.trim().replace(/\s+@\S.*$/, '').trim();
    const scenarioId = scenarioText.split(/\s+-\s+/, 1)[0];
    const tc = scenarioId.match(/^TC\d+/i)?.[0].toUpperCase();
    const example = parts.find(part => /^Example #\d+/i.test(part.trim()))
        ?.trim().match(/^Example #\d+/i)?.[0] || '';
    if (!pathMatch || !tc) return undefined;

    const role = pathMatch[1].match(/_([A-Za-z]+)TestCases$/)?.[1];
    if (!role) return undefined;

    return {
        role,
        feature: normalizeFeatureName(pathMatch[2]),
        tc,
        scenarioId,
        scenarioText,
        example,
        identity: `${role}|${normalizeFeatureName(pathMatch[2])}|${scenarioId}|${example}`,
    };
}

function parseLog(logPath) {
    const lines = fs.readFileSync(logPath, 'utf8').split(/\r?\n/).map(cleanLine);
    const results = new Map();
    const failures = new Map();

    for (const line of lines) {
        const statusMatch = line.match(/^\s*([✓✘])\s+\d+\s+\[desktop\]\s+›\s+/);
        if (!statusMatch || !line.includes('.feature.spec.js:')) continue;
        const reference = parseTestReference(line.split(/\s+›\s+/));
        if (!reference) continue;
        results.set(reference.identity, {
            ...reference,
            status: statusMatch[1] === '✓' ? 'passed' : 'failed',
            log: path.basename(logPath),
        });
    }

    for (let index = 0; index < lines.length; index += 1) {
        if (!/^\s*\d+\) \[desktop\]/.test(lines[index]) || !lines[index].includes('.feature.spec.js:')) continue;
        const header = lines[index];
        const reference = parseTestReference(header.split(/\s+›\s+/));
        if (!reference) continue;

        let end = index + 1;
        while (end < lines.length && !/^\s*\d+\) \[desktop\]/.test(lines[end])) end += 1;
        const block = lines.slice(index + 1, end);
        const retryIndex = block.reduce((last, line, blockIndex) =>
            /Retry #\d+/.test(line) ? blockIndex : last, -1);
        const finalAttempt = retryIndex >= 0 ? block.slice(retryIndex + 1) : block;
        const applicationDefect = finalAttempt.some(line => line.includes('APPLICATION DEFECT DETECTED'));
        const failedStep = header.split(/\s+›\s+/).map(part => part.trim())
            .findLast(part => /^(Given|When|Then|And|But)\s/.test(part));

        let message;
        if (applicationDefect) {
            const businessRule = finalAttempt.find(line => line.trim().startsWith('Business rule:'))?.trim();
            const expected = finalAttempt.find(line => line.trim().startsWith('Expected result:'))?.trim();
            const actual = finalAttempt.find(line => line.trim().startsWith('Actual result:'))?.trim();
            message = ['APPLICATION DEFECT DETECTED', businessRule, expected, actual].filter(Boolean).join(' | ');
        } else {
            message = finalAttempt.find(line => /^\s*(?:Error:|TimeoutError:)/.test(line))?.trim()
                || 'Technical failure (no error message found in the log summary).';
        }

        failures.set(reference.identity, {
            applicationDefect,
            message,
            failedStep,
        });
        index = end - 1;
    }

    for (const result of results.values()) {
        if (result.status === 'failed') result.failure = failures.get(result.identity);
    }
    return [...results.values()];
}

function failureDescription(result) {
    const example = result.example ? ` ${result.example}` : '';
    const detail = result.failure?.message || 'Technical failure (details not found in the log summary).';
    const step = result.failure?.failedStep ? ` | Failed step: ${result.failure.failedStep}` : '';
    return `${result.scenarioId}${example}: ${detail}${step}`;
}

async function main() {
    const parsedLogs = logPaths.map(logPath => ({ logPath, results: parseLog(logPath) }));
    const allResults = parsedLogs.flatMap(({ results }) => results);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(workbookPath);
    const worksheet = workbook.getWorksheet('Test Results');
    const counts = new Map();
    const unresolved = [];
    const auditRows = [];
    let currentRole;

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
        const testCase = String(worksheet.getCell(rowNumber, 1).value || '').trim();
        if (roleHeaders.has(testCase)) {
            currentRole = roleHeaders.get(testCase);
            continue;
        }
        if (!/^TC\d+/i.test(testCase)) continue;

        const tc = testCase.match(/^TC\d+/i)[0].toUpperCase();
        const feature = featureForExcelCase(testCase);
        const matches = feature
            ? allResults.filter(result => result.role === currentRole && result.feature === feature && result.tc === tc)
            : [];
        const failed = matches.filter(result => result.status === 'failed');
        const passed = matches.filter(result => result.status === 'passed');
        const applicationDefects = failed.filter(result => result.failure?.applicationDefect);

        let resultValue;
        if (matches.length === 0) resultValue = 'No result';
        else if (applicationDefects.length > 0) resultValue = 'Passed with bug application';
        else if (failed.length === 0) resultValue = 'Passed';
        else if (passed.length > 0) resultValue = 'Passed with some fail';
        else resultValue = 'Failed';

        worksheet.getCell(rowNumber, 2).value = resultValue;
        worksheet.getCell(rowNumber, 3).value = failed.map(failureDescription).join('\n');
        counts.set(resultValue, (counts.get(resultValue) || 0) + 1);
        auditRows.push({ rowNumber, role: currentRole, testCase, resultValue, matches: matches.length, failed: failed.length });

        if (!feature && !/Ask Deloitte|GA Portal/i.test(testCase)) unresolved.push({ rowNumber, testCase });
    }

    for (const { logPath, results } of parsedLogs) {
        console.log(`${path.basename(logPath)}: ${results.length} final test/example results.`);
    }
    console.log(`Parsed ${allResults.length} final test/example results from ${logPaths.length} logs.`);
    console.log('Workbook result counts:', Object.fromEntries(counts));
    if (process.argv.includes('--audit')) {
        for (const row of auditRows.filter(item =>
            item.resultValue !== 'Passed' || /Notifications/i.test(item.testCase))) {
            console.log(`${row.rowNumber}\t${row.role}\t${row.resultValue}\t${row.matches} matched, ${row.failed} failed\t${row.testCase}`);
        }
    }
    if (unresolved.length > 0) {
        console.error('Unresolved Excel functionality mappings:', unresolved);
        process.exitCode = 1;
        return;
    }

    if (process.argv.includes('--write')) {
        await workbook.xlsx.writeFile(workbookPath);
        console.log(`Updated ${workbookPath}`);
    } else {
        console.log('Dry run only; workbook was not modified.');
    }
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});