# Rhevolver Monitor 24/7

Estado mínimo y deduplicación independientes del Supabase de Rhevolver.news.

## Aislamiento
Este módulo usa exclusivamente las variables KV_REST_API_* creadas por Upstash/Vercel. No importa ni utiliza src/lib/supabase.ts ni src/lib/supabase-admin.ts.

## Claves
- rhevolver:monitor:last_heartbeat
- rhevolver:monitor:last_success
- rhevolver:monitor:history
- rhevolver:monitor:seen:<sha256>
- rhevolver:monitor:dam:valerio_trujano:last

El almacenamiento permanente de imágenes, videos, páginas descargadas o cachés editoriales está prohibido.
