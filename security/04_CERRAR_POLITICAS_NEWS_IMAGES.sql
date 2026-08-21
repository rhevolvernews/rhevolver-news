-- RHEVOLVER.NEWS — CIERRE DE POLÍTICAS ANTIGUAS DEL BUCKET news-images
-- Ejecutar DESPUÉS de desplegar el paquete seguro y confirmar que subir/listar/borrar
-- desde Multimedia funciona correctamente.
--
-- Este bloque elimina únicamente políticas de storage.objects cuya expresión menciona
-- explícitamente el bucket news-images. No toca políticas de otros buckets.

begin;

do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and (
        coalesce(qual, '') ilike '%news-images%'
        or coalesce(with_check, '') ilike '%news-images%'
      )
  loop
    execute format('drop policy if exists %I on storage.objects', p.policyname);
  end loop;
end
$$;

commit;

-- Después de esto, la lectura de archivos publicados seguirá funcionando si el bucket
-- news-images está marcado como PUBLIC. Las signed upload URLs no necesitan permisos
-- públicos de escritura.

select policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by cmd, policyname;
