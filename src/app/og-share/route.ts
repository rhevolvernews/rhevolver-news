export const runtime = "edge";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const source = await fetch(`${origin}/og-home.png`, { cache: "no-store" });

  if (!source.ok) {
    return new Response("OG image unavailable", { status: 502 });
  }

  const bytes = await source.arrayBuffer();

  return new Response(bytes, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
