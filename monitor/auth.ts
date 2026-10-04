import { createHash, timingSafeEqual } from "node:crypto";

export function authorizeMonitor(req: Request): Response | null {
  const secret = process.env.RHEVOLVER_MONITOR_SECRET;
  if (!secret) return Response.json({ ok: false, error: "Monitor authentication is not configured" }, { status: 503 });
  const supplied = req.headers.get("authorization") || "";
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(digest(supplied), digest(`Bearer ${secret}`))) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  return null;
}
