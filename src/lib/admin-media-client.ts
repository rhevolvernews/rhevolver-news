import { supabase } from "@/lib/supabase";

export async function signedUpload(file: File | Blob, path: string, contentType: string) {
  const authorizationResponse = await fetch("/api/admin/media/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, contentType, size: file.size }),
    cache: "no-store",
  });

  const authorization = (await authorizationResponse.json().catch(() => null)) as
    | { token?: string; publicUrl?: string; error?: string }
    | null;

  if (!authorizationResponse.ok || !authorization?.token || !authorization.publicUrl) {
    throw new Error(authorization?.error || "No se pudo autorizar la carga.");
  }

  const { error } = await supabase.storage
    .from("news-images")
    .uploadToSignedUrl(path, authorization.token, file, {
      contentType,
      cacheControl: "31536000",
    });

  if (error) throw new Error(error.message);
  return authorization.publicUrl;
}
