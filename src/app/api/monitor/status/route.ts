import { monitorEnvironment, monitorKey, redis } from "../../../../../monitor/storage";
export async function GET() {
  try {
    const [heartbeat, lastSuccess, dam] = await Promise.all([
      redis(["GET", monitorKey("last_heartbeat")], true),
      redis(["GET", monitorKey("last_success")], true),
      redis(["GET", monitorKey("dam:valerio_trujano:last")], true),
    ]);
    const age = lastSuccess ? Date.now() - Date.parse(String(lastSuccess)) : NaN;
    return Response.json({ service: "rhevolver-monitor-24-7", environment: monitorEnvironment(), heartbeat, lastSuccess,
      successAgeSeconds: Number.isFinite(age) ? Math.floor(age / 1000) : null,
      healthy: Number.isFinite(age) && age >= 0 && age < 30 * 60 * 1000,
      valerioTrujanoLastDatum: dam ? JSON.parse(String(dam)) : null });
  } catch { return Response.json({ ok: false, healthy: false, error: "Monitor storage unavailable" }, { status: 503 }); }
}
