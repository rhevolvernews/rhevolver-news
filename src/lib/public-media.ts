import { SITE_URL } from "@/lib/seo";

export const NEWS_IMAGES_PROXY_PREFIX = "/media/news-images/";
const IMAGE_PREFIXES = ["news/", "video-thumbnails/"];

function encodeObjectPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join("/");
}

function isImageObjectPath(path: string) {
  return IMAGE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export function proxiedNewsImageUrl(path: string) {
  const safePath = encodeObjectPath(path);
  return new URL(`${NEWS_IMAGES_PROXY_PREFIX}${safePath}`, `${SITE_URL}/`).toString();
}

export function storageNewsImageToProxy(value: string | null | undefined) {
  if (!value) return value || "";

  try {
    const url = new URL(value, `${SITE_URL}/`);
    const marker = "/storage/v1/object/public/news-images/";

    if (url.hostname.endsWith(".supabase.co") && url.pathname.startsWith(marker)) {
      const objectPath = url.pathname.slice(marker.length);
      if (isImageObjectPath(objectPath)) {
        return proxiedNewsImageUrl(objectPath);
      }
    }
  } catch {
    return value;
  }

  return value;
}
