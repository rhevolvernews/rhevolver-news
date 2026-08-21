# Cambio de seguridad RLS — 21/08/2026

Entrega basada en el rediseño editorial Supabase-protegido anterior. No se modificaron `globals.css`, portada pública, página pública de noticia, header, footer, buscador, carrusel ni la lógica editorial de lectura.

Se modificaron únicamente los puntos necesarios para separar lectura pública y escritura administrativa:

- cliente Supabase secreto de servidor;
- validación de sesión administrativa en rutas sensibles;
- API administrativa de noticias;
- API administrativa de media;
- signed upload URLs para imágenes y videos;
- contador de vistas desde servidor;
- páginas administrativas usando acceso de servidor;
- SQL de RLS y auditoría;
- eliminación de `.env.local` del paquete.
