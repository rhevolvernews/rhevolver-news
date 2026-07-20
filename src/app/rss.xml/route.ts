import { supabase } from "@/lib/supabase";
import {
  DEFAULT_DESCRIPTION,
  PUBLISHER_NAME,
  SITE_NAME,
  SITE_URL,
  articleUrl,
  escapeXml,
  stripHtml,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("news")
    .select(
      "id, title, slug, summary, content, category, author, featured_image, published_at, created_at"
    )
    .in("status", ["published", "featured", "scheduled"])
    .lte("published_at", now)
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error al generar RSS:", error.message);
  }

  const items = (data ?? [])
    .map((item) => {
      const url = articleUrl(item.slug, item.id);
      const publishedAt = new Date(
        item.published_at || item.created_at
      ).toUTCString();
      const description =
        item.summary?.trim() || stripHtml(item.content).slice(0, 320);

      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${publishedAt}</pubDate>
      <dc:creator>${escapeXml(item.author || PUBLISHER_NAME)}</dc:creator>
      <category>${escapeXml(item.category || "Noticias")}</category>
      <description><![CDATA[${description.replace(/]]>/g, "]]]]><![CDATA[>")}]]></description>
      ${
        item.featured_image
          ? `<media:content url="${escapeXml(
              item.featured_image
            )}" medium="image" />`
          : ""
      }
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(DEFAULT_DESCRIPTION)}</description>
    <language>es-mx</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Rhevolver CMS</generator>
    <atom:link href="${escapeXml(
      `${SITE_URL}/rss.xml`
    )}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
