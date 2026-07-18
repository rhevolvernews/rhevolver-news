import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return new NextResponse(
      "Acceso administrativo no configurado.",
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Basic ")) {
    try {
      const encodedCredentials = authorization.slice(6);
      const decodedCredentials = atob(encodedCredentials);
      const separatorIndex = decodedCredentials.indexOf(":");

      const suppliedUsername = decodedCredentials.slice(0, separatorIndex);
      const suppliedPassword = decodedCredentials.slice(separatorIndex + 1);

      if (
        suppliedUsername === username &&
        suppliedPassword === password
      ) {
        return NextResponse.next();
      }
    } catch {
      // Si el encabezado está dañado, se solicitarán nuevamente los datos.
    }
  }

  return new NextResponse("Acceso restringido.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Rhevolver CMS"',
    },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/nueva-noticia/:path*",
    "/noticias/editar/:path*",
  ],
};