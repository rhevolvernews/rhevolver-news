import { NextRequest, NextResponse } from "next/server";

type EditorialRequest = {
  title?: string;
  summary?: string;
  content?: string;
  category?: string;
  notes?: string;
};

type OpenAIResponse = {
  output?: Array<{
    content?: Array<
      | { type: "output_text"; text: string }
      | { type: "refusal"; refusal: string }
    >;
  }>;
  error?: { message?: string };
};

const editorialSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    content: { type: "string" },
    category: { type: "string" },
    seoDescription: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    hashtags: { type: "array", items: { type: "string" } },
    facebookCopy: { type: "string" },
    instagramCopy: { type: "string" },
    xCopy: { type: "string" },
  },
  required: [
    "title",
    "summary",
    "content",
    "category",
    "seoDescription",
    "tags",
    "hashtags",
    "facebookCopy",
    "instagramCopy",
    "xCopy",
  ],
  additionalProperties: false,
} as const;

function getOutputText(payload: OpenAIResponse) {
  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text") {
        return content.text;
      }
      if (content.type === "refusal") {
        throw new Error(content.refusal);
      }
    }
  }

  throw new Error("La IA no devolvió contenido editorial.");
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "La asistencia editorial no está configurada. Agrega OPENAI_API_KEY en .env.local.",
      },
      { status: 503 }
    );
  }

  let body: EditorialRequest;

  try {
    body = (await request.json()) as EditorialRequest;
  } catch {
    return NextResponse.json({ error: "La solicitud no es válida." }, { status: 400 });
  }

  const title = body.title?.trim() || "";
  const summary = body.summary?.trim() || "";
  const content = body.content?.trim() || "";
  const notes = body.notes?.trim() || "";
  const category = body.category?.trim() || "Local";

  if (!title && !summary && !content && !notes) {
    return NextResponse.json(
      { error: "Escribe al menos un título, contenido o notas para trabajar." },
      { status: 400 }
    );
  }

  const input = `
Eres el asistente editorial interno de Rhevolver.news, un medio digital mexicano con sede en Guerrero.

Objetivo:
- Mejorar el material proporcionado sin inventar hechos, nombres, cifras, lugares, fechas, declaraciones ni fuentes.
- Mantener un tono periodístico claro, serio, ágil y natural.
- Evitar sensacionalismo, afirmaciones no verificadas, redundancias y lenguaje que parezca copiado.
- Cuando un dato no esté confirmado, conservar una redacción prudente y atribuirlo correctamente.
- Entregar el contenido en español de México.
- El campo content debe usar HTML editorial sencillo: párrafos con <p>, subtítulos con <h2> cuando sean necesarios y listas solo cuando aporten claridad.
- El título debe ser informativo, atractivo y preferentemente menor de 100 caracteres.
- El resumen debe funcionar para portada y Open Graph, preferentemente entre 120 y 180 caracteres.
- seoDescription debe ser natural y preferentemente entre 140 y 160 caracteres.
- xCopy debe ser breve y apropiado para X.
- Los hashtags deben incluir #RhevolverNews cuando resulte natural y no deben saturar el texto.

Material actual:
Título: ${title || "Sin título"}
Resumen: ${summary || "Sin resumen"}
Categoría actual: ${category}
Contenido: ${content || "Sin contenido redactado"}
Notas adicionales o datos base: ${notes || "Sin notas adicionales"}

Genera un paquete editorial completo. Si el material es escaso, redacta únicamente con lo disponible y no completes vacíos con suposiciones.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6",
        input,
        store: false,
        text: {
          format: {
            type: "json_schema",
            name: "rhevolver_editorial_package",
            strict: true,
            schema: editorialSchema,
          },
        },
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as OpenAIResponse;

    if (!response.ok) {
      throw new Error(payload.error?.message || "OpenAI no pudo procesar la solicitud.");
    }

    const editorialPackage = JSON.parse(getOutputText(payload)) as Record<string, unknown>;
    return NextResponse.json(editorialPackage);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json(
      { error: `No se pudo generar la asistencia editorial: ${message}` },
      { status: 500 }
    );
  }
}
