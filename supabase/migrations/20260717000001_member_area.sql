-- =============================================================
-- Kariri Valley — 0010: área de membros (eventos, oportunidades,
-- view agregada do diretório interno)
-- =============================================================

-- ---------- EVENTS ----------
create table public.events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(title) between 3 and 160),
  description  text check (char_length(description) <= 1000),
  event_date   timestamptz not null,
  location     text check (char_length(location) <= 160),
  external_url text check (external_url ~* '^https?://'),
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);

create index idx_events_event_date on public.events (event_date);

alter table public.events enable row level security;

create policy events_select on public.events
  for select to authenticated
  using (public.is_approved_member() or public.is_admin());

create policy events_admin_write on public.events
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- OPPORTUNITIES ----------
create table public.opportunities (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 3 and 160),
  description text check (char_length(description) <= 1000),
  category    text not null check (category in ('editais', 'vagas', 'aceleracao', 'mentoria', 'programas')),
  url         text check (url ~* '^https?://'),
  deadline    date,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index idx_opportunities_deadline on public.opportunities (deadline);
create index idx_opportunities_category on public.opportunities (category);

alter table public.opportunities enable row level security;

create policy opportunities_select on public.opportunities
  for select to authenticated
  using (public.is_approved_member() or public.is_admin());

create policy opportunities_admin_write on public.opportunities
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- VIEW DO DIRETÓRIO INTERNO (área de membros) ----------
-- Estende member_directory (mesmo filtro de visibilidade) agregando
-- interesses, o que busca/oferece e redes sociais para os filtros do
-- diretório logado. Só para authenticated (não anon) — uso exclusivo
-- de /comunidade dentro da área de membros.
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
