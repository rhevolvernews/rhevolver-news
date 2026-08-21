-- RHEVOLVER.NEWS — AUDITORÍA SEGURA DE STORAGE
-- NO modifica nada; muestra las políticas actuales.
-- Esta versión del código ya no requiere permisos públicos de escritura/listado/borrado
-- en el bucket news-images: usa signed uploads y rutas administrativas protegidas.

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by cmd, policyname;
