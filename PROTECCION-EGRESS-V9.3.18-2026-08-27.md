# Rhevolver V9.3.18 — Escudo de egress de Supabase

Objetivo: evitar que las imágenes públicas de Rhevolver.news se entreguen directamente desde Supabase Storage en cada visita o rastreo de redes sociales.

Cambios:

- Se crea `/media/news-images/[...path]` como capa de entrega en Rhevolver.news.
- La ruta obtiene cada objeto desde `news-images` únicamente cuando falta en caché y responde con caché CDN de larga duración.
- Las imágenes nuevas que se suban desde el CMS guardan como URL pública la ruta de Rhevolver.news, no la URL directa de Supabase.
- La biblioteca multimedia devuelve la URL protegida para imágenes existentes.
- Los videos privados de `news-videos` conservan el flujo de URL firmada bajo demanda; no se cambia su protección.
- Los videos legacy de la antigua carpeta `videos/` no se migran automáticamente.

Migración de datos prevista después de desplegar esta versión en producción:

- Reescribir únicamente URLs de `featured_image` que apunten al bucket público `news-images`.
- Reescribir únicamente esas mismas URLs cuando aparezcan dentro de `content` (imágenes de cuerpo, galerías y miniaturas).
- No modificar títulos, textos, slugs, estados, fechas, categorías ni IDs.

La migración debe ejecutarse después de que la ruta CDN esté disponible en producción para evitar referencias a una ruta aún no desplegada.
