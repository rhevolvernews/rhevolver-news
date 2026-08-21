
import { cookies } from "next/headers";
import { adminSession, isValidAdminSession } from "@/lib/admin-auth";

export async function hasValidAdminSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(adminSession.cookieName)?.value;
  return isValidAdminSession(value);
}
