import { NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/admin-request";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED_STATUSES = new Set([
  "draft", "published", "featured", "scheduled", "archived", "trash",
]);

type NewsPayload = {
  title?: string; slug?: string | null; summary?: string | null; content?: string;
  featured_image?: string | null; category?: string | null; author?: string | null;
  status?: string | null; published_at?: string | null; views?: number | null;
};

function cleanPayload(body: NewsPayload) {
  const status = body.status || "draft";
  if (!ALLOWED_STATUSES.has(status)) throw new Error("Estado editorial no válido.");
  return {
    title: body.title?.trim() || "",
    slug: body.slug?.trim() || null,
    summary: body.summary?.trim() || "",
    content: body.content?.trim() || "",
    featured_image: body.featured_image?.trim() || null,
    category: body.category?.trim() || null,
    author: body.author?.trim() || "Rhevolver Media",
    status,
    published_at: body.published_at ?? (["published", "featured"].includes(status) ? new Date().toISOString() : null),
    views: Number.isFinite(Number(body.views)) ? Number(body.views) : 0,
  };
}

export async function POST(request: Request) {
  if (!(await hasValidAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as NewsPayload | null;
  if (!body) return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  let payload;
  try { payload = cleanPayload(body); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Datos inválidos." }, { status: 400 }); }
  if (!payload.title || !payload.content) return NextResponse.json({ error: "El título y el contenido son obligatorios." }, { status: 400 });
  const { data, error } = await getSupabaseAdmin().from("news").insert(payload).select("id, slug, status, published_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, news: data }, { status: 201 });
}
