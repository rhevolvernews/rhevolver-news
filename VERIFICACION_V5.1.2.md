# Rhevolver CMS v5.1.2 — Correcciones verificadas

Cambios incluidos:

- Menú móvil renderizado mediante portal directamente sobre `document.body`.
- Capa máxima para que el menú quede por encima de encabezado, cintillo, buscador y carrusel.
- Fondo oscuro completo detrás del menú.
- Panel con desplazamiento interno y cierre visible permanentemente.
- Bloque Compartir con menú nativo cuando está disponible.
- Copiar enlace con compatibilidad para HTTPS y respaldo para pruebas en red local HTTP.
- Confirmación visible al copiar.
- Secciones sin contenido se ocultan en lugar de mostrar cajas vacías.
- Se conserva la selección sin duplicados entre portada, recientes, destacados, cobertura y videos.

Verificación:

- `npm run lint`: 0 errores, 2 advertencias no bloqueantes preexistentes.
- `npm run build`: compilación de producción completada correctamente.
