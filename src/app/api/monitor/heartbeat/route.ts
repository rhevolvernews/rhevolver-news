import { authorizeMonitor } from "../../../../../monitor/auth";
import { monitorKey, redis } from "../../../../../monitor/storage";
export async function POST(req: Request) {
  const denied = authorizeMonitor(req);
  if (denied) return denied;
  try {
    const heartbeat = new Date().toISOString();
    await redis(["SET", monitorKey("last_heartbeat"), heartbeat]);
    return Response.json({ ok: true, heartbeat });
  } catch { return Response.json({ ok: false, error: "Monitor storage unavailable" }, { status: 503 }); }
}
