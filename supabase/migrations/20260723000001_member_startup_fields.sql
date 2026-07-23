-- =============================================================
-- Kariri Valley — 0010: campos de startup no perfil do membro
-- =============================================================
-- Versão simples: direto em public.members (sem tabela própria).
-- Ideação não exige CNPJ; a partir de MVP, CNPJ passa a ser obrigatório.

create type public.startup_stage as enum ('ideacao', 'mvp', 'tracao', 'escala');

alter table public.members
  add column if not exists startup_name  text check (char_length(startup_name) <= 120),
  add column if not exists startup_stage public.startup_stage,
  add column if not exists startup_cnpj  text check (startup_cnpj is null or startup_cnpj ~ '^\d{14}$');

alter table public.members
  add constraint members_startup_cnpj_required_check
  check (startup_stage is null or startup_stage = 'ideacao' or startup_cnpj is not null);

-- ---------- VIEWS DO DIRETÓRIO ----------
-- Expõe startup_name/startup_stage com a mesma visibilidade do campo
-- 'company' (reaproveita o toggle "Empresa/cargo públicos"). startup_cnpj
-- nunca entra em view pública, como email/phone.
--
-- Precisa recriar (drop + create) em vez de `create or replace view`
-- porque member_directory_full expande `md.*` — inserir colunas no meio
-- da lista de member_directory quebraria a ordem posicional esperada
-- pelo Postgres num replace.
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
  case when public.can_view_member_field(m.id, 'company')  then m.startup_name  end as startup_name,
  case when public.can_view_member_field(m.id, 'company')  then m.startup_stage end as startup_stage
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
