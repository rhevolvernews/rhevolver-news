import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MAX_RESULTS = 10;

function cleanQuery(value: string) {
  return value
    .trim()
    .replace(/[,%()]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

export async function GET(request: NextRequest) {
  const query = cleanQuery(request.nextUrl.searchParams.get("q") || "");

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("news")
    .select("id,title,slug,summary,category,featured_image,published_at,created_at")
    .in("status", ["published", "featured", "scheduled"])
    .lte("published_at", now)
    .or(
      `title.ilike.%${query}%,summary.ilike.%${query}%,category.ilike.%${query}%,author.ilike.%${query}%,content.ilike.%${query}%`
    )
    .order("published_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Search suggestions error:", error.message);
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = (data ?? [])
    .map((item) => {
      const title = (item.title || "").toLowerCase();
      const summary = (item.summary || "").toLowerCase();
      const category = (item.category || "").toLowerCase();
      let score = title === query.toLowerCase() ? 100 : title.startsWith(query.toLowerCase()) ? 60 : title.includes(query.toLowerCase()) ? 35 : 0;
      for (const word of words) {
        if (title.includes(word)) score += 12;
        if (summary.includes(word)) score += 5;
        if (category.includes(word)) score += 4;
      }
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || new Date(b.item.published_at || b.item.created_at).getTime() - new Date(a.item.published_at || a.item.created_at).getTime())
    .slice(0, MAX_RESULTS)
    .map(({ item }) => item);

  return NextResponse.json(
    { results },
    {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
      },
    }
  );
}
