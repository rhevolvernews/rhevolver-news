import { randomUUID } from "node:crypto";
import { authorizeMonitor } from "../../../../../monitor/auth";
import { monitorKey, redis } from "../../../../../monitor/storage";
export async function POST(req: Request) {
  const denied = authorizeMonitor(req);
  if (denied) return denied;
  const key = monitorKey(`test:seen:${randomUUID()}`);
  try {
    const first = await redis(["SET", key, "test", "NX", "EX", "60"]);
    const second = await redis(["SET", key, "test", "NX", "EX", "60"]);
    return Response.json({ ok: first === "OK" && second === null, dedup: { firstAccepted: first === "OK", secondRejected: second === null } });
  } catch { return Response.json({ ok: false, error: "Monitor selftest failed" }, { status: 503 }); }
  finally { try { await redis(["DEL", key]); } catch { /* TTL also bounds cleanup. */ } }
}
