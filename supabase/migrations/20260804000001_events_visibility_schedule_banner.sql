-- =============================================================
-- Kariri Valley — Eventos: visibilidade (site vs. membros),
-- programação e bucket de imagem do evento
-- =============================================================

alter table public.events
  add column if not exists is_public boolean not null default true;

comment on column public.events.is_public is
  'true = aparece no site público (visitantes); false = visível apenas na área de membros.';

alter table public.events
  add column if not exists schedule_items jsonb not null default '[]'::jsonb;

comment on column public.events.schedule_items is
  'Programação do evento: array de { "time": "16:30", "title": "Credenciamento" }.';

-- Visitantes anônimos passam a poder ler eventos publicados e marcados como
-- públicos (hoje a policy events_select é "to authenticated" apenas, o que
-- bloqueia totalmente a home pública e qualquer página fora da área de
-- membros). A policy de authenticated existente continua valendo — membros
-- e admins seguem vendo tudo que já viam.
drop policy if exists events_select_public on public.events;
create policy events_select_public on public.events
  for select to anon
  using (status = 'published' and is_public = true);

-- ---------- BUCKET DE IMAGEM DO EVENTO ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-banners', 'event-banners', true,
  2097152, array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "event_banners_public_read" on storage.objects
  for select to public
  using (bucket_id = 'event-banners');

create policy "event_banners_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'event-banners' and public.is_admin());

create policy "event_banners_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'event-banners' and public.is_admin())
  with check (bucket_id = 'event-banners' and public.is_admin());

create policy "event_banners_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'event-banners' and public.is_admin());
