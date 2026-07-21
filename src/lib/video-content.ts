export const VIDEO_MARKER_PREFIX = "<!--RHEVOLVER_VIDEO:";
export const VIDEO_MARKER_SUFFIX = "-->";

export function normalizeVideoUrls(urls: string[]) {
  return Array.from(new Set(urls.map((url) => url.trim()).filter(Boolean)));
}

export function extractVideoUrlsFromContent(content: string) {
  const urls = new Set<string>();

  for (const match of content.matchAll(/<video\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    if (match[1]) urls.add(match[1]);
  }

  for (const match of content.matchAll(/data-rhevolver-video-url=["']([^"']+)["']/gi)) {
    if (match[1]) urls.add(match[1]);
  }

  for (const match of content.matchAll(/<!--RHEVOLVER_VIDEO:([\s\S]*?)-->/gi)) {
    const candidate = match[1]?.trim();
    if (candidate) urls.add(candidate);
  }

  // Fallback for an uploaded file URL that survived as plain text/HTML.
  for (const match of content.matchAll(/https?:\/\/[^\s"'<>]+\.(?:mp4|mov|m4v|webm|ogg)(?:\?[^\s"'<>]*)?/gi)) {
    urls.add(match[0]);
  }

  return Array.from(urls);
}

export function ensureVideoMarkers(content: string, urls: string[]) {
  const allUrls = normalizeVideoUrls([...extractVideoUrlsFromContent(content), ...urls]);
  const withoutMarkers = content.replace(/<!--RHEVOLVER_VIDEO:[\s\S]*?-->/gi, "").trim();
  const markers = allUrls.map((url) => `${VIDEO_MARKER_PREFIX}${url}${VIDEO_MARKER_SUFFIX}`).join("\n");
  return markers ? `${withoutMarkers}\n${markers}` : withoutMarkers;
}

export function removeUploadedVideoMarkup(content: string) {
  return content
    .replace(/<!--RHEVOLVER_VIDEO:[\s\S]*?-->/gi, "")
    .replace(/<video\b[^>]*>[\s\S]*?<\/video>/gi, "")
    .replace(/<video\b[^>]*\/>/gi, "")
    .replace(/<p\b[^>]*data-rhevolver-video-url=["'][^"']+["'][^>]*>[\s\S]*?<\/p>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "");
}
