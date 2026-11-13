import { articleUrl } from "@/lib/seo";
import { parseArticleCode, PUBLIC_ARTICLE_STATUSES } from "@/lib/short-article";
import { supabase } from "@/lib/supabase";

const headers = { "Cache-Control": "no-store" };

export async function GET(_request: Request, { params }: RouteContext<"/n/[code]">) {
  const { code } = await params;
  const id = parseArticleCode(code);
  if (id === null) return new Response(null, { status: 404, headers });

  const { data, error } = await supabase
    .from("news")
    .select("slug, category")
    .eq("id", id)
    .in("status", PUBLIC_ARTICLE_STATUSES)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("Short article lookup failed", error.message);
    return new Response(null, { status: 503, headers });
  }
  if (!data) return new Response(null, { status: 404, headers });

  return new Response(null, {
    status: 308,
    headers: { ...headers, Location: articleUrl(data.slug, id, data.category) },
  });
}

export const HEAD = GET;
