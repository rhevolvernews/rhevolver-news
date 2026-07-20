# Publicar Rhevolver.news desde GitHub

## 1. Subir el proyecto

Crea un repositorio privado o público y sube el contenido de esta carpeta. `.env.local` está ignorado y no se publica.

## 2. Importar en Vercel

1. En Vercel selecciona **Add New Project**.
2. Importa el repositorio de Rhevolver.
3. Vercel detectará Next.js automáticamente.
4. Copia las variables de `.env.local` a **Project Settings → Environment Variables**.
5. Despliega.

## 3. Variables imprescindibles

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL=https://rhevolver.news`

## 4. Variables opcionales

- Google Analytics: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Meta: `META_FACEBOOK_PAGE_ID`, `META_FACEBOOK_PAGE_ACCESS_TOKEN`
- OpenAI: `OPENAI_API_KEY`

Mantén `NEXT_PUBLIC_ENABLE_AI=false` y `NEXT_PUBLIC_ENABLE_FACEBOOK=false` mientras no estén activadas.

## 5. Dominio

En Vercel abre **Settings → Domains**, agrega `rhevolver.news` y aplica los registros DNS que te indique el panel.

## 6. Comprobaciones después del despliegue

- `/`
- `/admin`
- `/api/health`
- `/robots.txt`
- `/sitemap.xml`
- `/news-sitemap.xml`
- `/rss.xml`

GitHub Actions ejecutará automáticamente lint y build en cada cambio.
