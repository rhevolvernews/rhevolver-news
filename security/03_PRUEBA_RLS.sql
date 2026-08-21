-- Comprobación de RLS. Solo lectura.
select c.relname as tabla, c.relrowsecurity as rls_activo, c.relforcerowsecurity as rls_forzado
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname = 'news';

select policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'news';
