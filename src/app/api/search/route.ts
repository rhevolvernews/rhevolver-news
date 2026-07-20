import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MAX_RESULTS = 6;

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
    .limit(MAX_RESULTS);

  if (error) {
    console.error("Search suggestions error:", error.message);
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  return NextResponse.json(
    { results: data ?? [] },
    {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
      },
    }
  );
}
