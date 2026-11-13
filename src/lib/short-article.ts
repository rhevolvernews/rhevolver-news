import { absoluteUrl } from "@/lib/seo";

export const PUBLIC_ARTICLE_STATUSES = ["published", "featured", "scheduled"];

export function isPublicNews(status: string | null, publishedAt: string | null) {
  return status !== null && PUBLIC_ARTICLE_STATUSES.includes(status) &&
    publishedAt !== null && Date.parse(publishedAt) <= Date.now();
}

export function shortArticleUrl(id: number) {
  return absoluteUrl(`/n/${id.toString(36)}`);
}

export function parseArticleCode(code: string) {
  if (!/^[1-9a-z][0-9a-z]{0,10}$/.test(code)) return null;
  const id = Number.parseInt(code, 36);
  return Number.isSafeInteger(id) && id.toString(36) === code ? id : null;
}
