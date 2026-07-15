# Rhevolver.news V8

Versión funcional del portal sobre la base visual V7.

## Novedades

- Buscador real sobre títulos, categorías y etiquetas.
- Filtros por categoría.
- Página individual para cada noticia.
- Noticias relacionadas.
- Botones para compartir en Facebook, WhatsApp y X.
- Sección de tendencias.
- SEO básico con Open Graph, Twitter Card y datos estructurados.
- Archivo central `data/noticias.json`.
- Editor local `editor.html` para generar bloques de noticias.
- Ticker continuo configurado a 10 segundos.

## Subir a GitHub Pages

1. Descomprime el ZIP.
2. En tu repositorio entra a **Code → Add file → Upload files**.
3. Sube todos los archivos y carpetas de este paquete.
4. Pulsa **Commit changes**.
5. Espera uno o dos minutos y recarga el sitio.

## Publicar una noticia

Edita `data/noticias.json`. Cada noticia es un objeto JSON. Puedes abrir `editor.html` en el navegador para generar un bloque y copiarlo al archivo.

GitHub Pages es estático: el editor genera el contenido, pero para publicarlo aún debes guardar el cambio en GitHub.
