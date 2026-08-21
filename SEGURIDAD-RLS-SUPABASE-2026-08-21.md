# Rhevolver.news — Seguridad RLS Supabase

Esta versión mantiene el CMS y el portal, pero cambia dónde se ejecutan las operaciones sensibles.

## Cambios de seguridad

- Crear, editar, duplicar, publicar, archivar y eliminar noticias pasa por `/api/admin/news/*`.
- Cada ruta administrativa valida la cookie privada `rhevolver_admin_session`.
- Las escrituras usan `SUPABASE_SECRET_KEY` (o `SUPABASE_SERVICE_ROLE_KEY`) solo en servidor.
- La clave pública `NEXT_PUBLIC_SUPABASE_ANON_KEY` queda únicamente para lectura pública y para consumir signed upload URLs.
- El contador de vistas usa el servidor y ya no necesita permiso público de UPDATE.
- Imágenes y videos se cargan con signed upload URLs temporales.
- La biblioteca multimedia se lista y elimina desde rutas administrativas protegidas.
- Los videos públicos conservan `preload="none"` y las miniaturas de la biblioteca no precargan videos.

## Variable nueva obligatoria en Vercel

Preferida: `SUPABASE_SECRET_KEY`

Alternativa legacy: `SUPABASE_SERVICE_ROLE_KEY`

Nunca debe llevar el prefijo `NEXT_PUBLIC_`.

## Orden de activación

1. En Supabase > Project Settings > API Keys, copia una Secret key (`sb_secret_...`) o, si tu proyecto aún usa claves legacy, `service_role`.
2. En Vercel > Project > Settings > Environment Variables, crea `SUPABASE_SECRET_KEY` (o `SUPABASE_SERVICE_ROLE_KEY`).
3. Despliega este paquete.
4. Comprueba en el CMS: Dashboard, listado de noticias, crear borrador, editarlo, subir una imagen y borrarlo.
5. Ejecuta primero `security/00_AUDITORIA_RLS.sql` para confirmar las tablas señaladas.
6. Ejecuta `security/01_RLS_NEWS_PRODUCCION.sql` en Supabase SQL Editor.
7. Comprueba portada, categorías, buscador y una nota pública.
8. Vuelve a probar crear/editar/publicar/eliminar desde el CMS.
9. Ejecuta `security/02_AUDITORIA_STORAGE.sql`.
10. Si las políticas antiguas de Storage mencionan `news-images`, ejecuta `security/04_CERRAR_POLITICAS_NEWS_IMAGES.sql` después de confirmar que las signed uploads funcionan.

## Seguridad del paquete

`.env.local` no se incluye. No subas claves secretas a GitHub.
