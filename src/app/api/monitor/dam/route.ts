import { authorizeMonitor } from "../../../../../monitor/auth";
import { damMeasurementsChanged, validateDamReading, type DamReading } from "../../../../../monitor/dam";
import { monitorKey, redis } from "../../../../../monitor/storage";
export async function POST(req: Request) {
  const denied = authorizeMonitor(req);
  if (denied) return denied;
  let current: DamReading;
  try { current = validateDamReading(await req.json()); }
  catch { return Response.json({ ok: false, error: "Fresh official VTRGR observation with valid measurements required" }, { status: 400 }); }
  try {
    const key = monitorKey("dam:valerio_trujano:last");
    const previousRaw = await redis(["GET", key]);
    const previous: DamReading | null = previousRaw ? JSON.parse(String(previousRaw)) : null;
    if (previous && Date.parse(current.observedAt) < Date.parse(previous.observedAt)) return Response.json({ ok: false, error: "Out of order observation" }, { status: 409 });
    const changed = damMeasurementsChanged(previous, current);
    // Compare-and-set prevents an overlapping request from overwriting a newer observation.
    const stored = await redis(["EVAL", "local old=redis.call('GET',KEYS[1]) if (old or '') ~= ARGV[1] then return 0 end redis.call('SET',KEYS[1],ARGV[2]) return 1", "1", key, previousRaw ? String(previousRaw) : "", JSON.stringify(current)]);
    if (stored !== 1) return Response.json({ ok: false, error: "Concurrent observation; retry" }, { status: 409 });
    return Response.json({ ok: true, changed, previous, current });
  } catch { return Response.json({ ok: false, error: "Monitor storage unavailable" }, { status: 503 }); }
}
