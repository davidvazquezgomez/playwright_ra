#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const logPath = path.resolve(process.argv[2] || '26-08-2026.log');
const reportDate = path.basename(logPath).match(/(\d{2})-(\d{2})-(\d{4})/)?.slice(1).reverse().join('-') || 'latest';
const outputPath = path.resolve(process.argv[3] || `docs/ALLURE_FEATURE_FAILURES_${reportDate}.html`);
const roles = ['SuperAdmin', 'PortalAdmin', 'DeloitteUser', 'TeamMember', 'TeamLeader', 'ClientUser', 'ClientAdmin'];

if (!fs.existsSync(logPath)) {
    throw new Error(`Pipeline log not found: ${logPath}`);
}

const { failures, excludedApplicationDefects } = parseFeatureFailures(fs.readFileSync(logPath, 'utf8'));
const html = renderHtml(failures, path.basename(logPath));
fs.writeFileSync(outputPath, html);
console.log(`Wrote ${failures.length} technical feature failures to ${path.relative(process.cwd(), outputPath)}; excluded ${excludedApplicationDefects} APPLICATION DEFECT DETECTED failures.`);

function parseFeatureFailures(logContent) {
    const lines = logContent.replace(/\r/g, '').split('\n');
    const failures = [];
    let excludedApplicationDefects = 0;
    const headerPattern = /^\d{4}-\d{2}-\d{2}T[^Z]+Z\s+\d+\) \[desktop\] › .*?\/([^/]+)_([A-Za-z]+)\.feature\.spec\.js:\d+:\d+ › .*? › (.*?) (?:@\w|› )/;

    for (let index = 0; index < lines.length; index += 1) {
        const match = lines[index].match(headerPattern);
        if (!match) {
            continue;
        }

        const [, feature, role, testName] = match;
        const block = [];
        for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
            if (headerPattern.test(lines[cursor])) {
                break;
            }
            block.push(lines[cursor]);
        }

        const message = extractErrorMessage(block);
        if (message.startsWith('Error: APPLICATION DEFECT DETECTED')) {
            excludedApplicationDefects += 1;
            continue;
        }

        failures.push({
            feature,
            role,
            testName: testName.trim(),
            failedStep: extractFailedStep(lines[index]),
            featureLocation: extractFeatureLocation(lines[index]),
            message,
        });
    }

    return { failures, excludedApplicationDefects };
}

function extractFailedStep(headerLine) {
    const match = headerLine.match(/\b(?:Given|When|Then|And|But)\s+.+$/);
    return match ? match[0].trim() : undefined;
}

function extractFeatureLocation(headerLine) {
    const match = headerLine.match(/(features\/.+?\.feature\.spec\.js:\d+:\d+)/);
    return match ? match[1] : 'Feature location was not recorded in the pipeline log.';
}

function extractErrorMessage(lines) {
    const errorIndex = lines.findIndex(line => /^\d{4}-\d{2}-\d{2}T[^Z]+Z\s+Error: /.test(line));
    if (errorIndex === -1) {
        return 'No error message was recorded in the pipeline log.';
    }

    const message = [];
    for (let index = errorIndex; index < lines.length; index += 1) {
        const content = lines[index].replace(/^\d{4}-\d{2}-\d{2}T[^Z]+Z\s+/, '').trim();
        if (!content || content.startsWith('at ') || content.startsWith('attachment ') || content.startsWith('Error Context:') || content.startsWith('Retry #')) {
            break;
        }
        if (/^\d+ \|/.test(content) || content.startsWith('> ')) {
            break;
        }
        message.push(content);
    }

    return sanitizeMessage(message.join(' '));
}

function sanitizeMessage(message) {
    return message
        .replace(/https:\/\/[^\s"']+/g, '[URL omitted]')
        .replace(/\|/g, '\\|')
        .replace(/\s+/g, ' ')
        .trim();
}

function renderHtml(failures, sourceLog) {
    const counts = new Map();
    for (const failure of failures) {
        const key = failure.role;
        counts.set(key, (counts.get(key) || 0) + 1);
    }

    const summaryRows = roles.map(role => {
        return `<tr><th>${escapeHtml(role)}</th><td>${counts.get(role) || 0}</td></tr>`;
    }).join('');
    const features = [...new Set(failures.map(failure => failure.feature))].sort((first, second) => first.localeCompare(second));
    const featuresHtml = features.map(feature => {
        const roleGroups = roles.map(role => {
            const roleFailures = failures.filter(failure => failure.feature === feature && failure.role === role);
            if (!roleFailures.length) return '';
            const failuresHtml = roleFailures.map((failure, index) => {
                const messageId = `${feature}-${role}-${index}`.replace(/[^a-z0-9-]/gi, '-');
                const stepHtml = failure.failedStep
                    ? `<p class="failed-step"><strong>Failed step</strong><code>${escapeHtml(failure.failedStep)}</code></p>`
                    : '<p class="step-unavailable"><strong>Failed step</strong> Playwright did not emit the exact step for this failure.</p>';
                return `<article class="failure"><h4>${escapeHtml(failure.testName)}</h4><button class="copy" data-copy="${messageId}">Copy details</button><div id="${messageId}">${stepHtml}<p class="feature-location"><strong>Test location</strong><code>${escapeHtml(failure.featureLocation)}</code></p><pre>${escapeHtml(failure.message)}</pre></div></article>`;
            }).join('');
            return `<details><summary>${escapeHtml(role)} <span>${roleFailures.length}</span></summary>${failuresHtml}</details>`;
        }).join('');
        const featureCount = failures.filter(failure => failure.feature === feature).length;
        return `<section><h2>${escapeHtml(feature)} <span>${featureCount}</span></h2>${roleGroups || '<p class="empty">No failures found.</p>'}</section>`;
    }).join('');

    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Feature Failure Summary</title><style>
:root{color-scheme:light;--ink:#172027;--muted:#52616b;--line:#d5dde1;--paper:#f7f8f6;--card:#fff;--accent:#006d77;--alert:#b54708}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px Georgia,serif}main{max-width:1240px;margin:auto;padding:32px 20px 64px}h1,h2,h3,h4,button,summary,th{font-family:Arial,sans-serif;letter-spacing:0}h1{font-size:30px;margin:0 0 8px}h2{font-size:21px;margin:34px 0 12px;padding-bottom:8px;border-bottom:2px solid var(--accent)}h2 span,summary span{background:#d9f0ed;color:#07545a;border-radius:12px;padding:2px 8px;font-size:13px}p{color:var(--muted);line-height:1.5}.meta{font-family:Consolas,monospace;font-size:13px}table{width:100%;border-collapse:collapse;background:var(--card);font-family:Arial,sans-serif;font-size:14px}th,td{padding:10px;text-align:right;border-bottom:1px solid var(--line)}th:first-child{text-align:left}details{background:var(--card);border:1px solid var(--line);margin:10px 0}summary{cursor:pointer;padding:13px 15px;font-weight:700;list-style:none}summary::-webkit-details-marker{display:none}summary:before{content:'+';display:inline-block;width:20px;color:var(--accent)}details[open] summary:before{content:'-'}summary span{float:right}.failure{padding:15px;border-top:1px solid var(--line);position:relative}.failure h4{margin:0 105px 10px 0;font-size:14px}.copy{position:absolute;right:15px;top:14px;border:1px solid var(--accent);background:#fff;color:var(--accent);padding:6px 9px;cursor:pointer;font-weight:700}.copy:hover{background:#e4f5f2}.failed-step,.feature-location,.step-unavailable{margin:0 0 10px;color:var(--ink);font-family:Arial,sans-serif;font-size:13px}.failed-step strong,.feature-location strong,.step-unavailable strong{display:block;color:var(--alert);margin-bottom:4px;text-transform:uppercase;font-size:11px}.failed-step code,.feature-location code{display:block;white-space:pre-wrap;overflow-wrap:anywhere;background:#e8f3f1;border-left:3px solid var(--accent);padding:9px;font:13px/1.45 Consolas,monospace}.step-unavailable{background:#fff3df;border-left:3px solid var(--alert);padding:9px}pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;background:#fbf5ec;border-left:3px solid var(--alert);padding:12px;font:13px/1.45 Consolas,monospace}.empty{padding:14px;background:var(--card)}@media(max-width:650px){main{padding:22px 12px}table{font-size:12px}th,td{padding:7px}.failure h4{margin-right:0}.copy{position:static;margin:0 0 10px}}
</style></head><body><main><h1>Feature Failure Summary</h1><p class="meta">Source: ${escapeHtml(sourceLog)}. ${failures.length} final Playwright failure blocks parsed from the pipeline log.</p><p>Open each feature and role to review every failed test. Every entry includes the exact failing step when Playwright reports it. Use <strong>Copy details</strong> to copy the available diagnosis.</p><h2>Summary by Role</h2><table><thead><tr><th>Role</th><th>Failures</th></tr></thead><tbody>${summaryRows}<tr><th>Total</th><td><strong>${failures.length}</strong></td></tr></tbody></table>${featuresHtml}</main><script>document.querySelectorAll('.copy').forEach(button=>button.addEventListener('click',async()=>{const text=document.getElementById(button.dataset.copy).innerText;try{await navigator.clipboard.writeText(text)}catch{const area=document.createElement('textarea');area.value=text;document.body.append(area);area.select();document.execCommand('copy');area.remove()}const original=button.textContent;button.textContent='Copied';setTimeout(()=>button.textContent=original,1200)}));</script></body></html>`;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}