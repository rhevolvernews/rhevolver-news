import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articleId = Number(id);

  if (!Number.isInteger(articleId) || articleId <= 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { data } = await supabase
    .from("news")
    .select("views")
    .eq("id", articleId)
    .single();

  const currentViews = Number(data?.views || 0);
  const { error } = await supabase
    .from("news")
    .update({ views: currentViews + 1 })
    .eq("id", articleId);

  return NextResponse.json({ ok: !error }, { status: error ? 500 : 200 });
}
