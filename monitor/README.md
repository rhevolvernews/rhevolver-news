# Rhevolver Monitor 24/7

Monitor independiente: usa únicamente Redis/Upstash. No importa ni utiliza Supabase y no publica noticias automáticamente.

## Aislamiento y autenticación

Todas las claves tienen el prefijo `rhevolver:monitor:<VERCEL_ENV>:`. Los entornos permitidos son `preview`, `production` y `development`; fuera de Vercel se utiliza `development`. No se migran ni borran las claves anteriores.

Las credenciales específicas `RHEVOLVER_MONITOR_<PREVIEW|PRODUCTION|DEVELOPMENT>_KV_REST_API_URL`, `_TOKEN` y `_READ_ONLY_TOKEN` tienen prioridad sobre `KV_REST_API_*`. Si se comparte una base, los prefijos separan el estado; las credenciales dedicadas permiten usar bases distintas. Nunca introducir credenciales en el repositorio.

`run`, `sweep`, `watchdog`, `heartbeat`, `self-test` y `dam` sólo admiten POST con `Authorization: Bearer <RHEVOLVER_MONITOR_SECRET>`. Sin configuración responden 503; con secreto incorrecto, 401 antes de consultar fuentes o Redis. `status` es GET y no escribe.

## Recuperación y adquisición

El watchdog mide la antigüedad de `last_success`, ejecuta el mismo barrido real y sólo declara recuperación si encuentra publicaciones oficiales utilizables. Un heartbeat, un ingest vacío o un barrido fallido no generan éxito. El barrido utiliza un bloqueo con caducidad y deduplicación atómica con TTL de 30 días. El historial se limita a 500 entradas.

El barrido acepta publicaciones del dominio y organismo registrado, no enlaces de navegación, medios externos ni páginas de challenge. SEG se consulta adicionalmente desde GitHub Actions por categorías 2, 7 y 16; IEPC utiliza su sección oficial de publicaciones. Las fuentes federales se renderizan con Chromium para permitir el JavaScript del sitio. Si existe bloqueo, se informa como no utilizable; no se evita el control de acceso.

Las pruebas de PR no llaman endpoints externos mutantes. El workflow prueba SEG/IEPC y conserva durante tres días únicamente el reporte de URLs y diagnósticos. La falta de publicaciones SEG/IEPC hace fallar la validación; los bloqueos federales se detallan individualmente y requieren revisión antes de producción.

## Configuración del workflow para Preview

- Variable GitHub `RHEVOLVER_MONITOR_PREVIEW_URL`: `https://rhevolver-news-git-rhevolver-monitor-24-7-rhevolver.vercel.app`.
- Secreto GitHub `RHEVOLVER_MONITOR_SECRET`: mismo valor que la variable de Vercel, limitada a Preview y esta rama.
- Si el Preview tiene protección, secreto GitHub `VERCEL_AUTOMATION_BYPASS_SECRET` autorizado para ese deployment.

La ejecución manual/programada exige exactamente ese host y comprueba que `/status` declara `preview` antes de escribir. No contiene un fallback a `rhevolver.news`. Los workflows programados se ejecutan desde la rama por defecto: este PR no activa una programación nueva mientras permanezca sin fusionar. Mantener activos los monitores anteriores.

## Valerio Trujano

La adquisición utiliza exclusivamente `https://sih.conagua.gob.mx/basedatos/Presas/VTRGR.csv`. El adaptador exige columnas conocidas con unidades explícitas, fecha original y mediciones de las últimas 72 horas. No calcula porcentaje sin capacidad oficial, no interpreta desafíos HTML como CSV y no conserva el archivo descargado. Si la fuente bloquea o cambia de esquema, registra el fallo y no inventa datos.

El esquema SIH observado utiliza `Estacion`, `Fecha`, `Nivel(m)` y `VolumenAlm(Mm3)` (millones de metros cúbicos, equivalentes a hm³). Se exige VTRGR por fila. `ObraToma(m3/s)`, `Vertedor(m3/s)` y `Derrame(m3/s)` se guardan por separado como `outletM3s`, `spillwayM3s` y `overflowM3s`; no se suman ni se etiqueta el nivel como msnm sin referencia explícita. El lector intenta primero HTTP y después una sesión ordinaria de Chromium en el sitio oficial, sin resolver controles de acceso.

`POST /dam` es la entrada autenticada para el adaptador de adquisición: valida procedencia declarada, estación, fecha, números y orden temporal; el almacenamiento usa compare-and-set. `changed` depende sólo de cambios de mediciones, y se actualiza la fecha aunque las mediciones coincidan. La autenticación identifica al recolector confiable; el endpoint no vuelve a descargar el CSV ni debe exponerse el secreto a clientes públicos.

## Verificación local

`node scripts/test-monitor.cjs`, `python scripts/test-monitor-dam.py`, `npx tsc --noEmit` y `npx eslint monitor src/app/api/monitor scripts/test-monitor.cjs scripts/validate-monitor-acquisition.cjs`.

No conservar imágenes, vídeos ni páginas descargadas. Los scripts de adquisición trabajan en memoria; sólo escriben URLs, observaciones mínimas y reportes temporales en `work/`.
