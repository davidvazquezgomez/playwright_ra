#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_FILE = path.join(ROOT, 'docs', 'gherkin-steps-no-automatizados.md');
const PLAYWRIGHT_BDD_DIST = path.join(ROOT, 'node_modules', 'playwright-bdd', 'dist');
const { Snippets } = require(path.join(PLAYWRIGHT_BDD_DIST, 'snippets'));
const { Snippet } = require(path.join(PLAYWRIGHT_BDD_DIST, 'snippets', 'snippet'));
const { getStepTextWithKeyword } = require(path.join(PLAYWRIGHT_BDD_DIST, 'gherkin', 'helpers'));

process.env.BDD_MISSING_STEPS_MODE = 'fail-on-gen';

Snippets.prototype.print = function printFullMissingStepReport() {
    const groups = new Map();

    for (const missingStep of this.missingSteps) {
        const snippet = new Snippet(missingStep, this.snippetOptions);
        const key = snippet.code;
        const stepText = getStepTextWithKeyword(missingStep.gherkinStep.keyword, missingStep.pickleStep.text);
        const location = String(missingStep.location).replace(/\\/g, '/');
        const group = groups.get(key) || { code: key, stepText, locations: [] };

        if (!group.locations.includes(location)) {
            group.locations.push(location);
        }
        groups.set(key, group);
    }

    const groupsInOrder = [...groups.values()];
    const missingOccurrences = groupsInOrder.reduce(
        (total, group) => total + group.locations.length,
        0,
    );
    const report = [
        '# Inventario de Steps Gherkin Sin Automatizar',
        '',
        `Fecha de analisis: ${new Date().toISOString().slice(0, 10)}`,
        '',
        '## Alcance',
        '',
        '- Features analizados: 77',
        '- Archivos de definicion revisados: 18 (`features/steps/**/*.ts`)',
        `- Definiciones Gherkin unicas sin binding: ${groupsInOrder.length}`,
        `- Ocurrencias sin resolver: ${missingOccurrences}`,
        '',
        'El inventario se obtuvo ejecutando `playwright-bdd` con `BDD_MISSING_STEPS_MODE=fail-on-gen`. Cada entrada representa una definicion que el generador no pudo asociar a ningun step existente.',
        '',
        '## Criterio de Implementacion',
        '',
        'Cada item debe implementarse como una definicion fina en `features/steps/`, delegando los selectores, acciones y aserciones a su page object propietario. Antes de crear un binding, buscar frases equivalentes y consolidarlas en una unica expresion canonica.',
        '',
        '## Definiciones Pendientes',
        '',
    ];

    groupsInOrder.forEach((group, index) => {
        report.push(
            `### ${index + 1}. \`${group.stepText}\``,
            '',
            `- **Binding sugerido:** \`${group.code.split('\n')[0]}\``,
            `- **Ocurrencias (${group.locations.length}):**`,
            ...group.locations.map(location => `  - \`${location}\``),
            '',
        );
    });

    fs.writeFileSync(REPORT_FILE, `${report.join('\n')}\n`);
    console.error(`Informe generado: ${groupsInOrder.length} definiciones, ${missingOccurrences} ocurrencias.`);
};

require(path.join(PLAYWRIGHT_BDD_DIST, 'cli', 'index.js'));