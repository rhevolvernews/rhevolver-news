import { NextResponse } from "next/server";

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

async function redis(command: unknown[]) {
  if (!url || !token) throw new Error("Monitor Redis is not configured");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis request failed: ${res.status}`);
  return res.json();
}

export async function GET() {
  const now = new Date().toISOString();
  await redis(["SET", "rhevolver:monitor:last_heartbeat", now]);
  await redis(["SET", "rhevolver:monitor:last_success", now]);
  await redis(["LPUSH", "rhevolver:monitor:history", JSON.stringify({ at: now, source: "vercel", status: "ok" })]);
  await redis(["LTRIM", "rhevolver:monitor:history", "0", "499"]);
  return NextResponse.json({ ok: true, service: "rhevolver-monitor-24-7", heartbeat: now });
}
