-- RHEVOLVER.NEWS — CIERRE RLS DE public.news
-- Ejecutar SOLO después de desplegar esta versión segura del código y configurar
-- SUPABASE_SECRET_KEY (o SUPABASE_SERVICE_ROLE_KEY) en Vercel.

begin;

alter table public.news enable row level security;

revoke insert, update, delete, truncate, references, trigger
on table public.news
from anon, authenticated;

grant select
on table public.news
to anon, authenticated;

-- La arquitectura segura ya no necesita políticas antiguas de escritura en news.
do $$
declare p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'news'
  loop
    execute format('drop policy if exists %I on public.news', p.policyname);
  end loop;
end
$$;

create policy "Rhevolver lectura publica de noticias"
on public.news
for select
to anon, authenticated
using (
  status in ('published', 'featured', 'scheduled')
  and published_at is not null
  and published_at <= now()
);

commit;

select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public' and tablename = 'news';

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'news'
order by policyname;
