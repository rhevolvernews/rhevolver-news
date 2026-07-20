import { NextRequest, NextResponse } from "next/server";
import { adminSession, isValidAdminSession } from "@/lib/admin-auth";

const protectedPrefixes = [
  "/admin",
  "/nueva-noticia",
  "/noticias",
  "/multimedia",
  "/categorias",
  "/api/ai",
  "/api/facebook",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) return NextResponse.next();

  const session = request.cookies.get(adminSession.cookieName)?.value;
  if (await isValidAdminSession(session)) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, private");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/nueva-noticia/:path*",
    "/noticias/:path*",
    "/multimedia/:path*",
    "/categorias/:path*",
    "/api/ai/:path*",
    "/api/facebook/:path*",
  ],
};
