-- =============================================================
-- Kariri Valley — 0012: campo de empresa (startup ou tradicional)
-- + fluxo de aprovação do admin
-- =============================================================
-- Amplia o antigo campo "Startup" para "Empresa": a pessoa escolhe se é
-- startup ou empresa tradicional. Estágio (ideação/mvp/tração/escala) só
-- se aplica a startups; CNPJ é sempre obrigatório para empresa tradicional
-- (e continua obrigatório a partir do MVP para startups).
--
-- Também introduz company_review_status: toda empresa cadastrada/editada
-- entra como 'pending' e só aparece na vitrine/perfil público depois que
-- um admin aprova — preserva a credibilidade da comunidade.

alter table public.members rename column startup_name      to company_name;
alter table public.members rename column startup_stage     to company_stage;
alter table public.members rename column startup_cnpj       to company_cnpj;
alter table public.members rename column startup_logo_url   to company_logo_url;
alter table public.members rename column startup_problem    to company_problem;
alter table public.members rename column startup_sector     to company_sector;

create type public.company_type as enum ('startup', 'tradicional');
create type public.company_review_status as enum ('pending', 'approved', 'rejected');

alter table public.members
  add column if not exists company_type public.company_type,
  add column if not exists company_review_status public.company_review_status;

alter table public.members drop constraint if exists members_startup_cnpj_required_check;
alter table public.members add constraint members_company_cnpj_required_check
  check (
    company_type is null
    or (company_type = 'startup' and (company_stage = 'ideacao' or company_cnpj is not null))
    or (company_type = 'tradicional' and company_cnpj is not null)
  );

-- Dados que já existiam (todos cadastrados como "startup" no modelo antigo)
-- entram como pendentes de revisão, para o admin confirmar cada um.
update public.members
  set company_type = 'startup'
  where company_name is not null and company_type is null;

update public.members
  set company_review_status = 'pending'
  where company_name is not null and company_review_status is null;

-- ---------- BUCKET DE LOGOS (novo bucket company-logos; startup-logos fica sem uso) ----------
-- Não é possível apagar linhas de storage.objects/storage.buckets via SQL
-- direto (trigger protect_delete do Supabase bloqueia); o bucket antigo
-- fica órfão e sem políticas de escrita, inofensivo.

drop policy if exists "startup_logos_public_read" on storage.objects;
drop policy if exists "startup_logos_insert_own_folder" on storage.objects;
drop policy if exists "startup_logos_update_own_folder" on storage.objects;
drop policy if exists "startup_logos_delete_own_folder" on storage.objects;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'company-logos', 'company-logos', true,
  2097152, array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "company_logos_public_read" on storage.objects
  for select to public
  using (bucket_id = 'company-logos');

create policy "company_logos_insert_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'company-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "company_logos_update_own_folder" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'company-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'company-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "company_logos_delete_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'company-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------- VIEWS DO DIRETÓRIO ----------
-- company_review_status não é filtrado pela visibilidade do campo "company"
-- (é um estado de moderação, não uma preferência de privacidade) — sempre
-- exposto para a camada de aplicação decidir o que mostrar a cada tipo de
-- visitante (a própria pessoa vê "em análise"; os demais só veem aprovadas).

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
  case when public.can_view_member_field(m.id, 'company')  then m.company_name      end as company_name,
  case when public.can_view_member_field(m.id, 'company')  then m.company_type      end as company_type,
  case when public.can_view_member_field(m.id, 'company')  then m.company_stage     end as company_stage,
  case when public.can_view_member_field(m.id, 'company')  then m.company_logo_url  end as company_logo_url,
  case when public.can_view_member_field(m.id, 'company')  then m.company_problem   end as company_problem,
  case when public.can_view_member_field(m.id, 'company')  then m.company_sector    end as company_sector,
  m.company_review_status
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
