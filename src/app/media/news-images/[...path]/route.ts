const ONE_YEAR = 60 * 60 * 24 * 365;

function validSegments(path: string[]) {
  return (
    path.length > 0 &&
    path.every(
      (segment) =>
        segment.length > 0 &&
        segment !== "." &&
        segment !== ".." &&
        /^[a-zA-Z0-9._-]+$/.test(segment)
    )
  );
}

export const revalidate = ONE_YEAR;

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  if (!validSegments(path)) {
    return new Response("Ruta no válida.", { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

  if (!supabaseUrl) {
    return new Response("Origen multimedia no configurado.", { status: 503 });
  }

  const objectPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  const upstreamUrl = `${supabaseUrl}/storage/v1/object/public/news-images/${objectPath}`;

  const upstream = await fetch(upstreamUrl, {
    next: { revalidate: ONE_YEAR },
  });

  if (!upstream.ok) {
    return new Response("Imagen no disponible.", {
      status: upstream.status === 404 ? 404 : 502,
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  }

  const body = await upstream.arrayBuffer();
  const contentType = upstream.headers.get("content-type") || "application/octet-stream";

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": `public, max-age=${ONE_YEAR}, s-maxage=${ONE_YEAR}, immutable`,
      "CDN-Cache-Control": `public, s-maxage=${ONE_YEAR}, immutable`,
      "Vercel-CDN-Cache-Control": `public, s-maxage=${ONE_YEAR}, immutable`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
