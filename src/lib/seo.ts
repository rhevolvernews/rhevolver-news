export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://rhevolver.news";

export const SITE_NAME = "Rhevolver.news";
export const PUBLISHER_NAME = "Rhevolver Media Comunicaciones";
export const DEFAULT_DESCRIPTION =
  "Noticias de Iguala, Guerrero, México y el mundo. Información que revoluciona.";

function rewriteSupabaseNewsImage(pathOrUrl: string) {
  try {
    const url = new URL(pathOrUrl);
    const marker = "/storage/v1/object/public/news-images/";

    if (url.hostname.endsWith(".supabase.co") && url.pathname.startsWith(marker)) {
      const objectPath = url.pathname.slice(marker.length);
      if (objectPath.startsWith("news/") || objectPath.startsWith("video-thumbnails/")) {
        return new URL(`/media/news-images/${objectPath}`, `${SITE_URL}/`).toString();
      }
    }
  } catch {
    return pathOrUrl;
  }

  return pathOrUrl;
}

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return rewriteSupabaseNewsImage(pathOrUrl);
  return new URL(pathOrUrl, `${SITE_URL}/`).toString();
}

export function isEnContexto(category: string | null | undefined): boolean {
  return (category || "").trim().toLocaleLowerCase("es-MX") === "en contexto | reporte rhevolver";
}

// Las publicaciones de En Contexto usan ID único para impedir colisiones
// con titulares ya publicados en otras categorías.
export function articlePath(slug: string | null, id: number, category?: string | null) {
  return `/noticia/${isEnContexto(category) ? id : (slug || id)}`;
}

export function articleUrl(slug: string | null, id: number, category?: string | null) {
  return absoluteUrl(articlePath(slug, id, category));
}

export function escapeXml(value: string | null | undefined) {
  return (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function stripHtml(value: string | null | undefined) {
  return (value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}
