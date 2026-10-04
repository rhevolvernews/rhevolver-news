import { randomUUID } from "node:crypto";
import { deduplicate } from "./dedup";
import { monitorSources } from "./sources";
import { discoverSource } from "./discovery";
import { history, monitorKey, redis } from "./storage";

export async function executeSweep() {
  const started = Date.now(), at = new Date(started).toISOString();
  const owner = randomUUID(), lock = monitorKey("sweep_lock");
  if (await redis(["SET", lock, owner, "NX", "EX", "300"]) !== "OK") return { ok: false, busy: true };
  try {
    // Each source has its own bounded fetch; batches avoid a sequential timeout per source.
    const results = [];
    for (let i = 0; i < monitorSources.length; i += 4) {
      results.push(...await Promise.all(monitorSources.slice(i, i + 4).map(async source => {
        try {
          const links = await discoverSource(source);
          const fresh = (await deduplicate(links, at)).length;
          return { id: source.id, reachable: true, usable: links.length > 0, links: links.length, newLinks: fresh, reason: links.length ? null : "no-publications" };
        } catch (e) { return { id: source.id, reachable: false, usable: false, error: e instanceof Error ? e.message : "unknown" }; }
      })));
    }
    const usable = results.filter(x => x.usable).length, finished = new Date().toISOString();
    const record = { at, finished, durationMs: Date.now() - started, source: "sweep", status: usable ? "ok" : "error", sources: results.length, usable };
    // Only real acquisition is allowed to advance success.
    await redis(["SET", monitorKey("last_heartbeat"), finished]);
    if (usable) await redis(["SET", monitorKey("last_success"), finished]);
    await history(record);
    return { ok: usable > 0, ...record, results };
  } finally {
    await redis(["EVAL", "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end", "1", lock, owner]);
  }
}

export async function executeWatchdog() {
  const lastSuccess = await redis(["GET", monitorKey("last_success")]);
  const parsed = lastSuccess ? Date.parse(String(lastSuccess)) : NaN;
  const age = Number.isFinite(parsed) ? Date.now() - parsed : null;
  const stale = age === null || age < 0 || age > 20 * 60 * 1000;
  const sweep = stale ? await executeSweep() : null;
  const recovered = sweep?.ok === true;
  if (stale) await history({ at: new Date().toISOString(), source: "watchdog", status: recovered ? "recovered" : "unrecovered", previousSuccess: lastSuccess });
  return { ok: !stale || recovered, stale, recovered, previousSuccess: lastSuccess, ageSeconds: age === null ? null : Math.floor(age / 1000), sweep };
}
