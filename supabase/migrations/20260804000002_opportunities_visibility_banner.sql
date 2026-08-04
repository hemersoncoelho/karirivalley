-- =============================================================
-- Kariri Valley — Oportunidades: visibilidade (site vs. membros)
-- e imagem de capa, espelhando o que já existe em events.
-- =============================================================

alter table public.opportunities
  add column if not exists is_public boolean not null default true;

comment on column public.opportunities.is_public is
  'true = aparece no site público (visitantes); false = visível apenas na área de membros.';

alter table public.opportunities
  add column if not exists banner_url text;

comment on column public.opportunities.banner_url is
  'URL pública da imagem de capa da oportunidade (bucket opportunity-banners).';

drop policy if exists opportunities_select_public on public.opportunities;
create policy opportunities_select_public on public.opportunities
  for select to anon
  using (status = 'published' and is_public = true);

-- ---------- BUCKET DE IMAGEM DA OPORTUNIDADE ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'opportunity-banners', 'opportunity-banners', true,
  2097152, array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "opportunity_banners_public_read" on storage.objects
  for select to public
  using (bucket_id = 'opportunity-banners');

create policy "opportunity_banners_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'opportunity-banners' and public.is_admin());

create policy "opportunity_banners_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'opportunity-banners' and public.is_admin())
  with check (bucket_id = 'opportunity-banners' and public.is_admin());

create policy "opportunity_banners_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'opportunity-banners' and public.is_admin());
