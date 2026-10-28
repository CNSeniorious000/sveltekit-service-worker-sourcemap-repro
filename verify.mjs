import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SourceMap } from 'node:module';

const output = '.svelte-kit/output/client/service-worker.js';
const generated = readFileSync(output, 'utf8').split('\n');
const original = readFileSync('src/service-worker.js', 'utf8').split('\n');
const payload = JSON.parse(readFileSync(`${output}.map`, 'utf8'));
const generatedLine = generated.findIndex(line => line.includes('console.log'));
const originalLine = original.findIndex(line => line.includes('console.log'));
assert.notEqual(generatedLine, -1, 'Built service worker must contain the marker');
const entry = new SourceMap(payload).findEntry(generatedLine, generated[generatedLine].indexOf('console.log'));
console.log(JSON.stringify({ sources: payload.sources, mapping: entry }, null, 2));
assert.equal(entry.originalLine, originalLine, 'Service worker mapping must recover the original line');
assert.equal(entry.originalColumn, original[originalLine].indexOf('console.log'), 'Service worker mapping must recover the original column');
assert.ok(entry.originalSource?.endsWith('/src/service-worker.js'), 'Mapping must point to the original service worker');
console.log('Service worker source location is correct');
