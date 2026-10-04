export function monitorEnvironment() {
  const env = process.env.VERCEL_ENV || "development";
  if (!["preview", "production", "development"].includes(env)) throw new Error("Invalid VERCEL_ENV");
  return env;
}

export function monitorKey(suffix: string) {
  return `rhevolver:monitor:${monitorEnvironment()}:${suffix}`;
}

export async function redis(command: unknown[], readOnly = false): Promise<unknown> {
  const env = monitorEnvironment().toUpperCase();
  // Dedicated credentials take precedence; namespaced keys also isolate a shared database.
  const url = process.env[`RHEVOLVER_MONITOR_${env}_KV_REST_API_URL`] || process.env.KV_REST_API_URL;
  const token = (readOnly && (process.env[`RHEVOLVER_MONITOR_${env}_KV_REST_API_READ_ONLY_TOKEN`] || process.env.KV_REST_API_READ_ONLY_TOKEN)) || process.env[`RHEVOLVER_MONITOR_${env}_KV_REST_API_TOKEN`] || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Monitor Redis is not configured");
  const res = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(command), cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Redis request failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error("Redis command failed");
  return data.result;
}

export async function history(record: unknown) {
  await redis(["LPUSH", monitorKey("history"), JSON.stringify(record)]);
  await redis(["LTRIM", monitorKey("history"), "0", "499"]);
}
