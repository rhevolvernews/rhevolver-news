import { NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/admin-request";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { proxiedNewsImageUrl } from "@/lib/public-media";

const BUCKET = "news-images";
const FOLDERS = ["news", "videos"] as const;

export async function GET() {
  if (!(await hasValidAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const bucket = getSupabaseAdmin().storage.from(BUCKET);
  const results = await Promise.all(FOLDERS.map((folder) => bucket.list(folder, { limit: 500, sortBy: { column: "created_at", order: "desc" } })));
  const firstError = results.find((result) => result.error)?.error;
  if (firstError) return NextResponse.json({ error: firstError.message }, { status: 500 });
  const items = results.flatMap((result, index) => {
    const folder = FOLDERS[index];
    return (result.data ?? []).filter((item) => item.name && !item.name.endsWith("/")).map((item) => {
      const path = `${folder}/${item.name}`;
      const isLegacyVideo = folder === "videos";
      return {
        name: item.name,
        path,
        url: isLegacyVideo ? bucket.getPublicUrl(path).data.publicUrl : proxiedNewsImageUrl(path),
        createdAt: item.created_at || null,
        size: typeof item.metadata?.size === "number" ? item.metadata.size : null,
        kind: isLegacyVideo ? ("video" as const) : ("image" as const),
      };
    });
  });
  items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store, private" } });
}
