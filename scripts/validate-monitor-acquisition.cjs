/* eslint-disable @typescript-eslint/no-require-imports -- Isolated CI TypeScript loader. */
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
const { canonicalPublication } = require('../monitor/discovery.ts');
const { monitorSources } = require('../monitor/sources.ts');
const acquired = JSON.parse(fs.readFileSync('work/acquisition-raw.json', 'utf8'));
const report = acquired.map(result => {
  const source = monitorSources.find(s => s.id === result.source);
  const urls = source ? [...new Set(result.links.map(link => canonicalPublication(link, source)).filter(Boolean))].slice(0, 100) : [];
  return { source: result.source, usable: urls.length > 0, publications: urls.length, urls, errors: result.errors };
});
fs.writeFileSync('work/acquisition-report.json', JSON.stringify({ at: new Date().toISOString(), results: report }, null, 2));
fs.writeFileSync('work/acquisition-items.json', JSON.stringify({ items: report.flatMap(result => result.urls.map(url => ({ source: result.source, url, official: true }))).slice(0, 100) }));
for (const result of report) console.log(`${result.source}: publications=${result.publications}, acquisitionErrors=${result.errors.length}`);
if (!report.find(r => r.source === 'seg-indexed')?.usable || !report.find(r => r.source === 'iepc-gro')?.usable) process.exitCode = 1;
