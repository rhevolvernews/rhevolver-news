const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v23.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export type FacebookArticleInput = {
  title: string;
  summary?: string | null;
  articleUrl: string;
};

export type FacebookPublishResult = {
  id: string;
};

export function isFacebookPublishingConfigured() {
  return Boolean(
    process.env.META_FACEBOOK_PAGE_ID &&
      process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN
  );
}

export function buildFacebookMessage(article: FacebookArticleInput) {
  const parts = [article.title.trim()];

  if (article.summary?.trim()) {
    parts.push(article.summary.trim());
  }

  parts.push(article.articleUrl);
  return parts.join("\n\n");
}

export async function publishArticleToFacebook(
  article: FacebookArticleInput
): Promise<FacebookPublishResult> {
  const pageId = process.env.META_FACEBOOK_PAGE_ID;
  const accessToken = process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    throw new Error(
      "La publicación en Facebook aún no está configurada. Faltan META_FACEBOOK_PAGE_ID o META_FACEBOOK_PAGE_ACCESS_TOKEN."
    );
  }

  const response = await fetch(`${GRAPH_API_BASE}/${pageId}/feed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: buildFacebookMessage(article),
      link: article.articleUrl,
      access_token: accessToken,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as
    | FacebookPublishResult
    | { error?: { message?: string } };

  if (!response.ok || !("id" in payload)) {
    const message =
      "error" in payload
        ? payload.error?.message
        : "Facebook no devolvió el identificador de la publicación.";

    throw new Error(message || "No fue posible publicar en Facebook.");
  }

  return payload;
}
