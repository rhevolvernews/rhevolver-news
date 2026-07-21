# Rhevolver CMS v5.1.1 — Correcciones funcionales

Cambios aplicados sobre la base funcional v5.1:

- Menú móvil sin dependencia de JavaScript para abrirse: funciona con controles nativos HTML/CSS en Safari, Chrome y otros navegadores móviles.
- Buscador con formulario GET real hacia `/buscar`; funciona aunque las sugerencias dinámicas no hayan cargado todavía.
- Sugerencias móviles con prioridad visual corregida.
- Portada sin repetir la misma noticia entre carrusel, secundarias, recientes, destacadas, cobertura editorial y videos.
- La sección Videos solo aparece cuando existen noticias con video real o categorías audiovisuales.
- Bloque de compartir completo: Compartir nativo, Facebook, WhatsApp, X y Copiar enlace con confirmación visible.
- Videos subidos directamente al editor se almacenan como un nodo de video válido y se publican dentro del cuerpo de la noticia.
- Página pública de videos detecta videos subidos e incorporados.

Validación:
- `npm run build`: correcto.
- `npm run lint`: 0 errores; 2 advertencias no bloqueantes ya existentes en miniaturas internas del CMS.
