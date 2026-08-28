import { SITE_URL } from "@/lib/seo";

export const NEWS_IMAGES_PROXY_PREFIX = "/media/news-images/";

function encodeObjectPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join("/");
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
      return proxiedNewsImageUrl(url.pathname.slice(marker.length));
    }
  } catch {
    return value;
  }

  return value;
}
