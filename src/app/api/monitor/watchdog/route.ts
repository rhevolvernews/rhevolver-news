import { authorizeMonitor } from "../../../../../monitor/auth";
import { executeWatchdog } from "../../../../../monitor/sweep";
export const maxDuration = 300;
export async function POST(req: Request) {
  const denied = authorizeMonitor(req);
  if (denied) return denied;
  try {
    const result = await executeWatchdog();
    return Response.json(result, { status: result.ok ? 200 : ("busy" in result && result.busy ? 409 : 503) });
  } catch { return Response.json({ ok: false, error: "Monitor execution failed" }, { status: 503 }); }
}
