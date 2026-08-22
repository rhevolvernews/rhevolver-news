export const VIDEO_MARKER_PREFIX = "<!--RHEVOLVER_VIDEO:";
export const VIDEO_MARKER_SUFFIX = "-->";
export const PRIVATE_VIDEO_REF_PREFIX = "rhevolver-video:v1:";

const PRIVATE_VIDEO_PATH = /^videos\/[a-zA-Z0-9/_\-.]+$/;

export function createPrivateVideoRef(path: string) {
  const normalized = path.trim();
  if (!PRIVATE_VIDEO_PATH.test(normalized) || normalized.includes("..")) {
    throw new Error("Ruta privada de video no válida.");
  }

  const bytes = new TextEncoder().encode(normalized);
  const encoded = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  return `${PRIVATE_VIDEO_REF_PREFIX}${encoded}`;
}

export function parsePrivateVideoRef(value: string) {
  const candidate = value.trim();
  if (!candidate.startsWith(PRIVATE_VIDEO_REF_PREFIX)) return null;

  const encoded = candidate.slice(PRIVATE_VIDEO_REF_PREFIX.length);
  if (!encoded || encoded.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(encoded)) return null;

  const bytes = new Uint8Array(encoded.length / 2);
  for (let index = 0; index < encoded.length; index += 2) {
    bytes[index / 2] = Number.parseInt(encoded.slice(index, index + 2), 16);
  }

  const path = new TextDecoder().decode(bytes);
  if (!PRIVATE_VIDEO_PATH.test(path) || path.includes("..")) return null;
  return path;
}

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

  // Compatibilidad con videos antiguos que quedaron guardados como URL directa.
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
