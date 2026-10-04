import { deduplicate } from "../../../../../monitor/dedup";
import { authorizeMonitor } from "../../../../../monitor/auth";
import { canonicalPublication } from "../../../../../monitor/discovery";
import { monitorSources } from "../../../../../monitor/sources";
import { history, monitorKey, redis } from "../../../../../monitor/storage";
export const maxDuration = 300;
export async function POST(req: Request) {
  const denied = authorizeMonitor(req);
  if (denied) return denied;
  try {
    const text = await req.text();
    if (text.length > 256000) return Response.json({ ok: false, error: "Payload too large" }, { status: 413 });
    let body;
    try { body = JSON.parse(text); } catch { return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }
    if (!Array.isArray(body?.items) || body.items.length > 100) return Response.json({ ok: false, error: "items must be an array of at most 100 publications" }, { status: 400 });
    const items: { url: string; source: string; official: true }[] = [];
    for (const item of body.items) {
      const source = monitorSources.find(s => s.id === item?.source || (item?.source === "seg" && s.id === "seg-indexed"));
      const url = source && typeof item?.url === "string" ? canonicalPublication(item.url, source) : null;
      if (!url || !source) return Response.json({ ok: false, error: "Only registered official publication URLs are accepted" }, { status: 400 });
      items.push({ url, source: source.id, official: true });
    }
    const at = new Date().toISOString();
    const accepted = (await deduplicate(items.map(item => item.url), at)).map(index => items[index]);
    const record = { at, source: "ingest", status: "ok", received: items.length, newItems: accepted.length };
    if (items.length) {
      await redis(["SET", monitorKey("last_heartbeat"), at]);
      await redis(["SET", monitorKey("last_success"), at]);
    }
    await history(record);
    return Response.json({ ok: true, ...record, items: accepted });
  } catch { return Response.json({ ok: false, error: "Monitor ingestion failed" }, { status: 503 }); }
}
