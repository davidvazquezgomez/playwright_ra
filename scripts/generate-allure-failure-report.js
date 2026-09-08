#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const inputDirectory = path.resolve(process.argv[2] || 'allure-results');
const outputDirectory = path.resolve(process.argv[3] || 'allure-failure-report');
const applicationDefectPattern = /APPLICATION DEFECT DETECTED/;
const failedStatuses = new Set(['failed', 'broken']);

if (!fs.existsSync(inputDirectory)) {
    throw new Error(`Allure results directory not found: ${inputDirectory}`);
}

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(path.join(outputDirectory, 'images'), { recursive: true });

const files = listFiles(inputDirectory);
const attachmentFiles = new Map(
    files.map(file => [path.basename(file), file]),
);
const finalResults = getFinalResults(loadResults(inputDirectory, files));
const failures = finalResults
    .map(result => buildFailure(result, attachmentFiles, outputDirectory))
    .filter(Boolean)
    .sort((first, second) => first.feature.localeCompare(second.feature)
        || first.role.localeCompare(second.role)
        || first.name.localeCompare(second.name));

fs.writeFileSync(path.join(outputDirectory, 'index.html'), renderHtml(failures));
console.log(`Wrote ${failures.length} technical failures to ${path.relative(process.cwd(), outputDirectory)}.`);

function buildFailure(result, attachmentFiles, outputDirectory) {
    if (!failedStatuses.has(result.status)) {
        return undefined;
    }

    const statusText = collectStatusText(result);
    if (applicationDefectPattern.test(statusText)) {
        return undefined;
    }

    const failedStep = findFailedStep(result.steps);
    const message = failedStep?.statusDetails?.message || result.statusDetails?.message || 'No error message was recorded by Allure.';
    const screenshots = copyScreenshots(result, attachmentFiles, outputDirectory);
    const { feature, role } = getFeatureAndRole(result);

    return {
        feature,
        role,
        name: result.name || 'Unnamed scenario',
        failedStep: failedStep?.name,
        message: sanitizeMessage(message),
        screenshots,
    };
}

function listFiles(directory) {
    const files = [];
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...listFiles(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

function loadResults(directory, files) {
    const rawResultFiles = files.filter(file => file.endsWith('-result.json'));
    if (rawResultFiles.length) {
        return rawResultFiles.map(file => JSON.parse(fs.readFileSync(file, 'utf8')));
    }

    const testCasesDirectory = path.join(directory, 'data', 'test-cases');
    if (!fs.existsSync(testCasesDirectory)) {
        throw new Error(`No Allure result data found in: ${directory}`);
    }

    return listFiles(testCasesDirectory)
        .filter(file => file.endsWith('.json'))
        .map(file => normalizePublishedTestCase(JSON.parse(fs.readFileSync(file, 'utf8'))));
}

function normalizePublishedTestCase(testCase) {
    return {
        uuid: testCase.uid,
        historyId: testCase.historyId,
        name: testCase.name,
        fullName: testCase.fullName,
        labels: testCase.labels,
        status: testCase.status,
        stop: testCase.time?.stop,
        statusDetails: {
            message: testCase.statusMessage,
            trace: testCase.statusTrace,
        },
        attachments: testCase.testStage?.attachments || [],
        steps: (testCase.testStage?.steps || []).map(normalizePublishedStep),
    };
}

function normalizePublishedStep(step) {
    return {
        name: step.name,
        status: step.status,
        statusDetails: {
            message: step.statusMessage,
            trace: step.statusTrace,
        },
        attachments: step.attachments || [],
        steps: (step.steps || []).map(normalizePublishedStep),
    };
}

function getFinalResults(results) {
    const latestByHistoryId = new Map();
    for (const result of results) {
        const key = result.historyId || result.uuid;
        const previous = latestByHistoryId.get(key);
        if (!previous || (result.stop || 0) >= (previous.stop || 0)) {
            latestByHistoryId.set(key, result);
        }
    }
    return [...latestByHistoryId.values()];
}

function collectStatusText(container) {
    const details = `${container.statusDetails?.message || ''}\n${container.statusDetails?.trace || ''}`;
    return `${details}\n${(container.steps || []).map(collectStatusText).join('\n')}`;
}

function findFailedStep(steps) {
    for (const step of steps || []) {
        const failedChild = findFailedStep(step.steps);
        if (failedChild) {
            return failedChild;
        }
        if (failedStatuses.has(step.status)) {
            return step;
        }
    }
    return undefined;
}

function copyScreenshots(result, attachmentFiles, outputDirectory) {
    const attachments = collectAttachments(result);
    const screenshotAttachments = attachments.filter(attachment => attachment.type?.startsWith('image/'));
    return [...new Map(screenshotAttachments.map(attachment => [attachment.source, attachment])).values()]
        .flatMap((attachment, index) => {
            const source = attachmentFiles.get(attachment.source);
            if (!source) {
                return [];
            }
            const extension = path.extname(source) || '.png';
            const target = `${sanitizeFileName(result.uuid || result.historyId || result.name)}-${index + 1}${extension}`;
            fs.copyFileSync(source, path.join(outputDirectory, 'images', target));
            return [`images/${target}`];
        });
}

function collectAttachments(container) {
    return [
        ...(container.attachments || []),
        ...(container.steps || []).flatMap(collectAttachments),
    ];
}

function getFeatureAndRole(result) {
    const labelValues = (result.labels || []).map(label => label.value || '');
    const source = [result.fullName || '', result.name || '', ...labelValues].join('\n');
    const match = source.match(/([^\\/\n]+)_([A-Za-z]+)\.feature(?:\.spec\.js)?/);
    return {
        feature: match?.[1] || 'Other',
        role: match?.[2] || 'Unassigned role',
    };
}

function sanitizeFileName(value) {
    return String(value).replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, 'failure');
}

function sanitizeMessage(message) {
    return String(message)
        .replace(/https:\/\/[^\s"']+/g, '[URL omitted]')
        .replace(/\s+/g, ' ')
        .trim();
}

function renderHtml(failures) {
    const roles = [...new Set(failures.map(failure => failure.role))].sort((first, second) => first.localeCompare(second));
    const summaryRows = roles.map(role => `<tr><th>${escapeHtml(role)}</th><td>${failures.filter(failure => failure.role === role).length}</td></tr>`).join('');
    const features = [...new Set(failures.map(failure => failure.feature))].sort((first, second) => first.localeCompare(second));
    const featureHtml = features.map(feature => {
        const roleHtml = roles.map(role => {
            const entries = failures.filter(failure => failure.feature === feature && failure.role === role);
            if (!entries.length) return '';
            return `<details><summary>${escapeHtml(role)} <span>${entries.length}</span></summary>${entries.map(renderFailure).join('')}</details>`;
        }).join('');
        const count = failures.filter(failure => failure.feature === feature).length;
        return `<section><h2>${escapeHtml(feature)} <span>${count}</span></h2>${roleHtml}</section>`;
    }).join('');

    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Technical Failure Summary</title><style>
:root{color-scheme:light;--ink:#18232a;--muted:#53636c;--line:#cad5d8;--paper:#f4f7f5;--card:#fff;--accent:#006d77;--alert:#a94709}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px Georgia,serif}main{max-width:1240px;margin:auto;padding:32px 20px 64px}h1,h2,h4,summary,th{font-family:Arial,sans-serif;letter-spacing:0}h1{font-size:30px;margin:0 0 8px}h2{font-size:21px;margin:34px 0 12px;padding-bottom:8px;border-bottom:2px solid var(--accent)}h2 span,summary span{background:#d9f0ed;color:#07545a;border-radius:12px;padding:2px 8px;font-size:13px}p{color:var(--muted);line-height:1.5}.meta{font-family:Consolas,monospace;font-size:13px}table{width:100%;border-collapse:collapse;background:var(--card);font-family:Arial,sans-serif;font-size:14px}th,td{padding:10px;text-align:right;border-bottom:1px solid var(--line)}th:first-child{text-align:left}details{background:var(--card);border:1px solid var(--line);margin:10px 0}summary{cursor:pointer;padding:13px 15px;font-weight:700;list-style:none}summary::-webkit-details-marker{display:none}summary:before{content:'+';display:inline-block;width:20px;color:var(--accent)}details[open] summary:before{content:'-'}summary span{float:right}.failure{padding:15px;border-top:1px solid var(--line)}.failure h4{margin:0 0 12px;font-size:14px}.failed-step{margin:0 0 10px;color:var(--ink);font-family:Arial,sans-serif;font-size:13px}.failed-step strong{display:block;color:var(--alert);margin-bottom:4px;text-transform:uppercase;font-size:11px}.failed-step code{display:block;white-space:pre-wrap;overflow-wrap:anywhere;background:#e8f3f1;border-left:3px solid var(--accent);padding:9px;font:13px/1.45 Consolas,monospace}pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;background:#fbf5ec;border-left:3px solid var(--alert);padding:12px;font:13px/1.45 Consolas,monospace}.screenshots{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:14px}.screenshots a{display:block;border:1px solid var(--line);background:#fff}.screenshots img{display:block;width:100%;height:auto}@media(max-width:650px){main{padding:22px 12px}table{font-size:12px}th,td{padding:7px}}
</style></head><body><main><h1>Technical Failure Summary</h1><p class="meta">${failures.length} failed or broken Allure results. Results classified as APPLICATION DEFECT DETECTED are excluded.</p><p>Each entry contains the failing Gherkin step, the recorded error message, and the available error screenshots.</p><h2>Summary by Role</h2><table><thead><tr><th>Role</th><th>Failures</th></tr></thead><tbody>${summaryRows}<tr><th>Total</th><td><strong>${failures.length}</strong></td></tr></tbody></table>${featureHtml}</main></body></html>`;
}

function renderFailure(failure) {
    const step = failure.failedStep || 'Allure did not record a failed Gherkin step.';
    const screenshots = failure.screenshots.length
        ? `<div class="screenshots">${failure.screenshots.map((screenshot, index) => `<a href="${escapeHtml(screenshot)}" target="_blank" rel="noreferrer"><img src="${escapeHtml(screenshot)}" alt="Error screenshot ${index + 1}"></a>`).join('')}</div>`
        : '';
    return `<article class="failure"><h4>${escapeHtml(failure.name)}</h4><p class="failed-step"><strong>Failed step</strong><code>${escapeHtml(step)}</code></p><pre>${escapeHtml(failure.message)}</pre>${screenshots}</article>`;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}