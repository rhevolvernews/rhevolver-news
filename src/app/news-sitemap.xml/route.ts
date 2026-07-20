import { supabase } from "@/lib/supabase";
import {
  SITE_NAME,
  articleUrl,
  escapeXml,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from("news")
    .select("id, title, slug, published_at, created_at")
    .in("status", ["published", "featured", "scheduled"])
    .lte("published_at", now.toISOString())
    .gte("published_at", twoDaysAgo.toISOString())
    .order("published_at", { ascending: false })
    .limit(1000);

  if (error) {
    console.error("Error al generar News Sitemap:", error.message);
  }

  const urls = (data ?? [])
    .map((item) => {
      const publicationDate = new Date(
        item.published_at || item.created_at
      ).toISOString();

      return `
  <url>
    <loc>${escapeXml(articleUrl(item.slug, item.id))}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
