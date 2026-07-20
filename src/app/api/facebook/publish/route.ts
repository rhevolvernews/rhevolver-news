import { NextResponse } from "next/server";
import {
  isFacebookPublishingConfigured,
  publishArticleToFacebook,
} from "@/lib/facebook";

export async function POST(request: Request) {
  if (!isFacebookPublishingConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: "Facebook está preparado, pero faltan las credenciales de Meta.",
      },
      { status: 503 }
    );
  }

  try {
    const payload = (await request.json()) as {
      title?: string;
      summary?: string | null;
      articleUrl?: string;
    };

    if (!payload.title || !payload.articleUrl) {
      return NextResponse.json(
        { ok: false, error: "Faltan título o URL del artículo." },
        { status: 400 }
      );
    }

    const result = await publishArticleToFacebook({
      title: payload.title,
      summary: payload.summary,
      articleUrl: payload.articleUrl,
    });

    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible publicar en Facebook.",
      },
      { status: 500 }
    );
  }
}
