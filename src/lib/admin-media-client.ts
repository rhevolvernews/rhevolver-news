import { supabase } from "@/lib/supabase";

export type MediaBucket = "news-images" | "news-videos";

export async function signedUpload(
  file: File | Blob,
  path: string,
  contentType: string,
  bucket: MediaBucket = "news-images"
) {
  const authorizationResponse = await fetch("/api/admin/media/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, contentType, size: file.size, bucket }),
    cache: "no-store",
  });

  const authorization = (await authorizationResponse.json().catch(() => null)) as
    | {
        token?: string;
        publicUrl?: string;
        fileRef?: string;
        bucket?: MediaBucket;
        error?: string;
      }
    | null;

  const uploadBucket = authorization?.bucket;
  const resultReference = uploadBucket === "news-videos" ? authorization?.fileRef : authorization?.publicUrl;

  if (
    !authorizationResponse.ok ||
    !authorization?.token ||
    !uploadBucket ||
    uploadBucket !== bucket ||
    !resultReference
  ) {
    throw new Error(authorization?.error || "No se pudo autorizar la carga.");
  }

  const { error } = await supabase.storage
    .from(uploadBucket)
    .uploadToSignedUrl(path, authorization.token, file, {
      contentType,
      cacheControl: "31536000",
    });

  if (error) throw new Error(error.message);
  return resultReference;
}
