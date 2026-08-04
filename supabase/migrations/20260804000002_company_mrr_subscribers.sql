-- =============================================================
-- Kariri Valley — MRR e assinantes da empresa
-- =============================================================
-- Campos opcionais de negócio para quem tem empresa/startup: receita
-- mensal recorrente (MRR) e número de assinantes. company_mrr fica
-- exposto no diretório interno (member_directory), respeitando a mesma
-- visibilidade do campo "company"; company_subscribers fica só no
-- próprio perfil (não sai na view pública/diretório).

alter table public.members
  add column if not exists company_mrr numeric(12, 2),
  add column if not exists company_subscribers integer;

alter table public.members drop constraint if exists members_company_mrr_check;
alter table public.members add constraint members_company_mrr_check
  check (company_mrr is null or company_mrr >= 0);

alter table public.members drop constraint if exists members_company_subscribers_check;
alter table public.members add constraint members_company_subscribers_check
  check (company_subscribers is null or company_subscribers >= 0);

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
  case when public.can_view_member_field(m.id, 'company')  then m.company_mrr       end as company_mrr,
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
