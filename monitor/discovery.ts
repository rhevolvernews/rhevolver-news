import type { Source } from "./sources";

export function canonicalPublication(raw: string, source: Source): string | null {
  try {
    const u = new URL(raw.replace(/&amp;/g, "&"), source.url);
    const expected = new URL(source.url);
    if (u.protocol !== "https:" || u.username || u.password || (u.port && u.port !== "443")) return null;
    if (u.hostname.replace(/^www\./, "") !== expected.hostname.replace(/^www\./, "")) return null;
    const p = u.pathname;
    let publication = false;
    if (source.scope === "federal" && expected.hostname.endsWith("gob.mx") && expected.pathname.split("/")[1]) {
      const agency = expected.pathname.split("/")[1];
      publication = new RegExp(`^/${agency}/(?:prensa|articulos|documentos)/[^/]+/?$`).test(p) && !p.includes("/archivo/");
    } else if (source.id === "seg-indexed") {
      publication = /^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/?$/.test(p);
      if (u.searchParams.has("p") && /^\d+$/.test(u.searchParams.get("p") || "")) publication = true;
    } else if (source.id === "iepc-gro") {
      publication = /\/sitio\/(?:view_magazine|view_notice|view_news)\/\d+/.test(p) || /\/(?:comunicados|boletines|avisos)\/[^/]+/.test(p) || /\.pdf$/i.test(p);
    } else {
      publication = /\/\d{4}\/\d{2}\/(?:\d{2}\/)?[^/]+/.test(p) || /\/(?:noticias|prensa|comunicados|boletines)\/[^/]+/.test(p);
    }
    if (!publication || /\.(?:css|js|png|jpe?g|gif|svg|mp4)$/i.test(p)) return null;
    u.hostname = expected.hostname;
    u.hash = "";
    for (const key of [...u.searchParams.keys()]) if (key !== "p") u.searchParams.delete(key);
    return u.href;
  } catch { return null; }
}

export function publications(html: string, source: Source) {
  const out = new Set<string>();
  for (const m of html.matchAll(/(?:href|data-file)=["']([^"'#]+)["']/gi)) {
    const u = canonicalPublication(m[1], source);
    if (u) out.add(u);
  }
  return [...out].slice(0, 100);
}

export async function discoverSource(source: Source) {
  const response = await fetch(source.url, { headers: { "User-Agent": "RhevolverMonitor/1.0" }, cache: "no-store", signal: AbortSignal.timeout(12000) });
  const html = await response.text();
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (new URL(response.url || source.url).hostname.replace(/^www\./, "") !== new URL(source.url).hostname.replace(/^www\./, "")) throw new Error("Unexpected source redirect");
  if (/Challenge Validation|captcha|Access Denied/i.test(html)) throw new Error("Source blocked; browser acquisition required");
  return publications(html, source);
}
