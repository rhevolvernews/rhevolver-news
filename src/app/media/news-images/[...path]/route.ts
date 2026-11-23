import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ONE_YEAR = 31536000;
const BUCKET = "news-images";
const ALLOWED_PREFIXES = ["news/", "video-thumbnails/", "documents/"];

function validSegments(path: string[]) {
  if (
    path.length === 0 ||
    !path.every(
      (segment) =>
        segment.length > 0 &&
        segment !== "." &&
        segment !== ".." &&
        /^[a-zA-Z0-9._-]+$/.test(segment)
    )
  ) {
    return false;
  }

  const objectPath = path.join("/");
  return ALLOWED_PREFIXES.some((prefix) => objectPath.startsWith(prefix));
}

export const revalidate = 31536000;

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  if (!validSegments(path)) {
    return new Response("Ruta no válida.", { status: 400 });
  }

  const objectPath = path.join("/");
  const { data, error } = await getSupabaseAdmin().storage.from(BUCKET).download(objectPath);

  if (error || !data) {
    const notFound = /not[ -]?found|does not exist/i.test(error?.message || "");
    return new Response("Imagen no disponible.", {
      status: notFound ? 404 : 502,
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  }

  const isAllowedImage = data.type.startsWith("image/");
  const isAllowedPdf = objectPath.startsWith("documents/") && data.type === "application/pdf";

  if (!isAllowedImage && !isAllowedPdf) {
    return new Response("Tipo de archivo no permitido.", {
      status: 415,
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
    });
  }

  const body = await data.arrayBuffer();

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": data.type,
      "Cache-Control": `public, max-age=${ONE_YEAR}, s-maxage=${ONE_YEAR}, immutable`,
      "CDN-Cache-Control": `public, s-maxage=${ONE_YEAR}, immutable`,
      "Vercel-CDN-Cache-Control": `public, s-maxage=${ONE_YEAR}, immutable`,
      "X-Content-Type-Options": "nosniff",
      ...(isAllowedPdf ? { "Content-Disposition": `inline; filename="${objectPath.split("/").pop() || "documento.pdf"}"` } : {}),
    },
  });
}
