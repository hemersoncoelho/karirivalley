-- =============================================================
-- Kariri Valley — 0011: vitrine de startups (logo, problema, setor)
-- =============================================================
-- Complementa 0010 (nome/estágio/CNPJ) com os campos que faltavam
-- para a vitrine pública da comunidade e para o painel admin.

create type public.startup_sector as enum (
  'agro',
  'turismo',
  'saude',
  'deep_tech',
  'fintech',
  'edtech',
  'varejo_ecommerce',
  'industria',
  'impacto_social',
  'outro'
);

alter table public.members
  add column if not exists startup_logo_url text,
  add column if not exists startup_problem  text check (char_length(startup_problem) <= 300),
  add column if not exists startup_sector   public.startup_sector;

-- ---------- BUCKET DE LOGOS ----------
-- Mesmo padrão do bucket member-photos (0008): 2MB máx., JPG/PNG/WebP,
-- leitura pública, escrita restrita à própria pasta do usuário.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'startup-logos', 'startup-logos', true,
  2097152, array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "startup_logos_public_read" on storage.objects
  for select to public
  using (bucket_id = 'startup-logos');

create policy "startup_logos_insert_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'startup-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "startup_logos_update_own_folder" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'startup-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'startup-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "startup_logos_delete_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'startup-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------- VIEWS DO DIRETÓRIO ----------
-- Mesma visibilidade de startup_name/startup_stage (toggle "Empresa/cargo
-- públicos"). Recriar (drop + create) pela mesma razão de 0010:
-- member_directory_full expande `md.*` posicionalmente.

drop view if exists public.member_directory_full;
drop view if exists public.member_directory;

create view public.member_directory
with (security_invoker = off) as
select
  m.id,
  m.slug,
  coalesce(nullif(m.display_name, ''), m.full_name)                          as name,
  case when public.can_view_member_field(m.id, 'photo')    then m.photo_url end as photo_url,
  case when public.can_view_member_field(m.id, 'city')     then m.city      end as city,
  case when public.can_view_member_field(m.id, 'company')  then m.company   end as company,
  case when public.can_view_member_field(m.id, 'position') then m.position  end as position,
  case when public.can_view_member_field(m.id, 'bio')      then m.bio       end as bio,
  case when public.can_view_member_field(m.id, 'email')    then m.email     end as email,
  case when public.can_view_member_field(m.id, 'phone')    then m.phone     end as phone,
  m.occupation_areas,
  m.approved_at                                                              as member_since,
  case when public.can_view_member_field(m.id, 'company')  then m.startup_name     end as startup_name,
  case when public.can_view_member_field(m.id, 'company')  then m.startup_stage    end as startup_stage,
  case when public.can_view_member_field(m.id, 'company')  then m.startup_logo_url end as startup_logo_url,
  case when public.can_view_member_field(m.id, 'company')  then m.startup_problem  end as startup_problem,
  case when public.can_view_member_field(m.id, 'company')  then m.startup_sector   end as startup_sector
from public.members m
where m.status = 'approved'
  and (m.is_public or public.is_approved_member());

grant select on public.member_directory to anon, authenticated;

create view public.member_directory_full
with (security_invoker = off) as
select
  md.*,
  coalesce(mi.interest_slugs, '{}') as interest_slugs,
  coalesce(mn.need_titles, '{}')    as need_titles,
  coalesce(mo.offer_titles, '{}')   as offer_titles,
  case when public.can_view_member_field(md.id, 'social_links')
       then coalesce(msl.social_links, '[]'::jsonb)
       else '[]'::jsonb
  end as social_links
from public.member_directory md
left join lateral (
  select array_agg(i.slug order by i.slug) as interest_slugs
  from public.member_interests mi2
  join public.interests i on i.id = mi2.interest_id
  where mi2.member_id = md.id
) mi on true
left join lateral (
  select array_agg(n.title order by n.title) as need_titles
  from public.member_needs n
  where n.member_id = md.id and n.is_active
) mn on true
left join lateral (
  select array_agg(o.title order by o.title) as offer_titles
  from public.member_offers o
  where o.member_id = md.id and o.is_active
) mo on true
left join lateral (
  select jsonb_agg(jsonb_build_object('platform', l.platform, 'url', l.url) order by l.platform) as social_links
  from public.member_social_links l
  where l.member_id = md.id
) msl on true;

grant select on public.member_directory_full to authenticated;
