/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS loader compiles isolated TypeScript tests without starting Next.js. */
const fs = require('node:fs');
const ts = require('typescript');
const assert = require('node:assert/strict');
const { test } = require('node:test');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText, filename);
};
const { monitorKey, redis } = require('../monitor/storage.ts');
const { canonicalPublication, publications } = require('../monitor/discovery.ts');
const { monitorSources } = require('../monitor/sources.ts');
const { executeWatchdog } = require('../monitor/sweep.ts');
const { validateDamReading, damMeasurementsChanged, damSourceUrl } = require('../monitor/dam.ts');
const routes = ['run', 'sweep', 'watchdog', 'heartbeat', 'self-test', 'dam'].map(name => require(`../src/app/api/monitor/${name}/route.ts`));
const originalFetch = global.fetch;
const savedEnv = { ...process.env };
test('Monitor isolation, authentication, acquisition, recovery and dam observations', async t => {
  const store = new Map(), commands = [];
  let sourceUsable = false, redisError = false;
  process.env.KV_REST_API_URL = 'https://redis.example.test';
  process.env.KV_REST_API_TOKEN = 'test-token';
  process.env.VERCEL_ENV = 'preview';
  global.fetch = async (url, options) => {
    if (url !== process.env.KV_REST_API_URL) {
      return new Response(sourceUsable && String(url).includes('guerrero.gob.mx') ? '<a href="https://www.guerrero.gob.mx/2026/10/official-update/">Publication</a>' : '<title>Challenge Validation</title>');
    }
    const c = JSON.parse(options.body); commands.push(c);
    let result = null;
    if (c[0] === 'GET') result = store.get(c[1]) ?? null;
    if (c[0] === 'SET') {
      if (!c.includes('NX') || !store.has(c[1])) { store.set(c[1], c[2]); result = 'OK'; }
    }
    if (c[0] === 'DEL') result = Number(store.delete(c[1]));
    if (c[0] === 'EVAL') {
      const count = Number(c[2]), keys = c.slice(3, 3 + count), args = c.slice(3 + count);
      if (c[1].includes('local out=')) {
        result = [];
        keys.forEach((key, i) => { if (!store.has(key)) { store.set(key, args[0]); result.push(i); } });
      } else if (c[1].includes('local old=')) {
        result = (store.get(keys[0]) || '') === args[0] ? 1 : 0;
        if (result) store.set(keys[0], args[1]);
      } else { result = store.get(keys[0]) === args[0] ? Number(store.delete(keys[0])) : 0; }
    }
    return Response.json(redisError ? { error: 'ERR' } : { result });
  };
  const request = (body, secret = 'test-secret') => new Request('https://preview.example.test/api/monitor/run', { method: 'POST', headers: secret ? { authorization: `Bearer ${secret}` } : {}, body: JSON.stringify(body) });
  try {
    await t.test('Missing or incorrect secrets prevent every mutable endpoint from performing IO', async () => {
      delete process.env.RHEVOLVER_MONITOR_SECRET;
      for (const route of routes) assert.equal((await route.POST(request({}))).status, 503);
      process.env.RHEVOLVER_MONITOR_SECRET = 'test-secret';
      for (const route of routes) assert.equal((await route.POST(request({}, 'wrong'))).status, 401);
      assert.equal(commands.length, 0);
      assert(routes.every(route => !route.GET));
    });
    await t.test('Namespaces isolate all environments and reject unknown names', async () => {
      const keys = [];
      for (const env of ['preview', 'production', 'development']) { process.env.VERCEL_ENV = env; keys.push(monitorKey('history')); }
      assert.equal(new Set(keys).size, 3);
      process.env.VERCEL_ENV = 'invalid'; assert.throws(() => monitorKey('history'));
      process.env.VERCEL_ENV = 'preview';
    });
    await t.test('Official publication filtering rejects external, agency-mismatched and navigation URLs', () => {
      const source = monitorSources.find(s => s.id === 'capufe');
      assert.equal(canonicalPublication('https://evil.test/capufe/prensa/fake', source), null);
      assert.equal(canonicalPublication('https://www.gob.mx/fgr/prensa/fake', source), null);
      assert.equal(canonicalPublication('https://www.gob.mx/capufe/archivo/prensa', source), null);
      assert.equal(canonicalPublication('https://www.gob.mx/capufe/prensa/update?utm_source=test#x', source), 'https://www.gob.mx/capufe/prensa/update');
      const iepc = monitorSources.find(s => s.id === 'iepc-gro');
      assert.equal(publications('<a data-file="/principal/uploads/notice.pdf">PDF</a>', iepc).length, 1);
      const fgr = monitorSources.find(s => s.id === 'fgr');
      const story = 'https://www.fgr.org.mx/es/FGR/Prensa/_rid/61/_mod/story?suri=http%3A%2F%2Fwww.FGR.swb%23fgr_Boletin%3A29084';
      assert.equal(canonicalPublication(story + '&p=1&ord=desc', fgr), story);
      assert.equal(canonicalPublication(story + '&p=4', fgr), story);
      assert.equal(canonicalPublication('https://www.fgr.org.mx/es/FGR/Prensa/_rid/61?p=2', fgr), null);
      assert.equal(canonicalPublication(story.replace('www.FGR.swb', 'evil.test'), fgr), null);
    });
    await t.test('Repeated acquisitions deduplicate; empty ingestion and heartbeat do not create success', async () => {
      const run = routes[0];
      assert.equal((await run.POST(request({ items: [] }))).status, 200);
      await routes[3].POST(request({}));
      assert(!store.has(monitorKey('last_success')));
      const payload = { items: [{ source: 'capufe', url: 'https://www.gob.mx/capufe/prensa/update' }] };
      assert.equal((await (await run.POST(request(payload))).json()).newItems, 1);
      assert.equal((await (await run.POST(request(payload))).json()).newItems, 0);
      assert.equal((await run.POST(request({ items: [{ source: 'seg', url: 'https://evil.test/fake' }] }))).status, 400);
      store.delete(monitorKey('last_success'));
    });
    await t.test('Watchdog performs acquisition and refuses recovery when sources fail', async () => {
      const failed = await executeWatchdog();
      assert.equal(failed.stale, true); assert.equal(failed.recovered, false);
      assert(!store.has(monitorKey('last_success')));
      sourceUsable = true;
      const recovered = await executeWatchdog();
      assert.equal(recovered.recovered, true); assert(recovered.sweep.results.length > 0);
      assert(store.has(monitorKey('last_success')));
      assert.equal((await executeWatchdog()).stale, false);
      store.set(monitorKey('last_success'), 'invalid');
      assert.equal((await executeWatchdog()).stale, true);
      store.set(monitorKey('sweep_lock'), 'another-run'); store.delete(monitorKey('last_success'));
      assert.equal((await executeWatchdog()).recovered, false); store.delete(monitorKey('sweep_lock'));
    });
    await t.test('Redis command errors fail instead of reporting success', async () => {
      redisError = true; await assert.rejects(redis(['GET', monitorKey('test')])); redisError = false;
    });
    await t.test('Dam rejects missing, stale, forged and invalid observations; only measurements trigger change', async () => {
      const base = { sourceUrl: damSourceUrl, station: 'VTRGR', observedAt: new Date(Date.now() - 60000).toISOString(), volumeHm3: 15 };
      const reading = validateDamReading(base);
      assert.throws(() => validateDamReading({ ...base, sourceUrl: 'https://evil.test' }));
      assert.throws(() => validateDamReading({ ...base, observedAt: '2020-01-01' }));
      assert.throws(() => validateDamReading({ ...base, volumeHm3: null }));
      assert.throws(() => validateDamReading({ ...base, volumeHm3: '15' }));
      assert.equal(damMeasurementsChanged(reading, { ...reading, observedAt: new Date().toISOString() }), false);
      assert.equal((await routes[5].POST(request(base))).status, 200);
      assert.equal((await (await routes[5].POST(request({ ...base, observedAt: new Date().toISOString() }))).json()).changed, false);
      assert.equal((await routes[5].POST(request(base))).status, 409);
    });
    assert(commands.filter(c => c[0] !== 'EVAL').every(c => typeof c[1] !== 'string' || c[1].startsWith('rhevolver:monitor:preview:')));
  } finally {
    global.fetch = originalFetch;
    for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
    Object.assign(process.env, savedEnv);
  }
});
