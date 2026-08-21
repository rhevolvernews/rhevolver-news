-- RHEVOLVER.NEWS — AUDITORÍA RLS (SOLO LECTURA)
-- Muestra todas las tablas del esquema public que aún tengan RLS desactivado.
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

-- En particular, public.news debe quedar con rowsecurity = true después del paso 01.
