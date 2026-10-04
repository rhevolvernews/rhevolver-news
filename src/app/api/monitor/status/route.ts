import { NextResponse } from "next/server";

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_READ_ONLY_TOKEN || process.env.KV_REST_API_TOKEN;

async function redis(command: unknown[]) {
  if (!url || !token) throw new Error("Monitor Redis is not configured");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis request failed: ${res.status}`);
  const data = await res.json();
  return data.result;
}

export async function GET() {
  const heartbeat = await redis(["GET", "rhevolver:monitor:last_heartbeat"]);
  const lastSuccess = await redis(["GET", "rhevolver:monitor:last_success"]);
  const dam = await redis(["GET", "rhevolver:monitor:dam:valerio_trujano:last"]);
  const ageMs = heartbeat ? Date.now() - Date.parse(String(heartbeat)) : null;
  return NextResponse.json({
    service: "rhevolver-monitor-24-7",
    heartbeat,
    lastSuccess,
    heartbeatAgeSeconds: ageMs === null ? null : Math.floor(ageMs / 1000),
    healthy: ageMs !== null && ageMs < 30 * 60 * 1000,
    valerioTrujanoLastDatum: dam ? JSON.parse(String(dam)) : null,
  });
}
