import { NextRequest, NextResponse } from "next/server";
import { adminSession, createAdminSessionValue } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return NextResponse.json(
      { error: "El acceso administrativo no está configurado." },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  if (body?.username !== username || body?.password !== password) {
    return NextResponse.json(
      { error: "Usuario o contraseña incorrectos." },
      { status: 401 }
    );
  }

  const sessionValue = await createAdminSessionValue(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSession.cookieName, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminSession.maxAge,
  });

  return response;
}
