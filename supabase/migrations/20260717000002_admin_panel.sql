-- =============================================================
-- Kariri Valley — 0011: suporte ao Painel Administrativo
-- =============================================================
--
-- COMO EXECUTAR (manual): cole este arquivo no SQL Editor do Supabase
-- (projeto do app) e rode. É idempotente e ADITIVO — não recria o que já
-- existe (profiles.role, is_admin(), members, interests, events,
-- opportunities, admin_audit_logs e respectivas policies/triggers).
--
-- MAPEAMENTO DE PAPÉIS (o painel usa profiles.role):
--   admin      -> acesso total ao /admin
--   ambassador -> "curador"/embaixador (acesso limitado; NÃO modera)
--   member     -> sem acesso ao /admin
--
-- MODERAÇÃO DE MEMBROS: já funciona sem RPCs. Basta um admin fazer
--   UPDATE public.members SET status = 'approved'|'rejected'|'blocked' WHERE id = ...
-- Os triggers existentes cuidam de: travar não-admins, impedir auto-bloqueio
-- (RN-023), carimbar approved_at/by e registrar em admin_audit_logs (RN-024).
-- Desbloquear = UPDATE ... SET status = 'approved'.
-- =============================================================

-- ---------- 1) INTERESSES: ativar/desativar ----------
-- Catálogo já possui `category`; falta apenas o flag de ativo.
alter table public.interests
  add column if not exists active boolean not null default true;

create index if not exists idx_interests_active on public.interests (active);

-- Esconde interesses inativos de quem não é admin (some do cadastro público).
drop policy if exists interests_select on public.interests;
create policy interests_select on public.interests
  for select to anon, authenticated
  using (active or public.is_admin());

-- ---------- 2) LOG GENÉRICO DE AÇÕES ADMIN ----------
-- O trigger existente audita mudanças de status de membro automaticamente.
-- Para auditar as demais ações do painel (interesses, eventos, oportunidades),
-- o frontend chama esta função após a escrita direta na tabela.
create or replace function public.log_admin_action(
  p_action      text,
  p_target_type text,
  p_target_id   text default null,
  p_details     jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso negado: apenas administradores';
  end if;

  insert into public.admin_audit_logs (admin_id, action, target_type, target_id, details)
  values (auth.uid(), p_action, p_target_type, p_target_id, coalesce(p_details, '{}'::jsonb));
end;
$$;

grant execute on function public.log_admin_action(text, text, text, jsonb) to authenticated;

-- ---------- 3) MÉTRICAS DO DASHBOARD (uma chamada só) ----------
-- Retorna JSON com todos os indicadores do painel. Completude segue a mesma
-- heurística de 11 campos do frontend (incompleto < 8 campos ≈ 70%).
create or replace function public.admin_dashboard_metrics()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Acesso negado: apenas administradores';
  end if;

  with m as (
    select
      mm.id, mm.city, mm.status, mm.created_at, mm.occupation_areas,
      (
        (mm.display_name is not null and mm.display_name <> '')::int +
        (mm.bio is not null and mm.bio <> '')::int +
        (mm.photo_url is not null and mm.photo_url <> '')::int +
        (mm.city is not null and mm.city <> '')::int +
        (mm.company is not null and mm.company <> '')::int +
        (mm.position is not null and mm.position <> '')::int +
        (coalesce(array_length(mm.occupation_areas, 1), 0) > 0)::int +
        (exists (select 1 from public.member_interests mi where mi.member_id = mm.id))::int +
        (exists (select 1 from public.member_needs mn where mn.member_id = mm.id))::int +
        (exists (select 1 from public.member_offers mo where mo.member_id = mm.id))::int +
        (exists (select 1 from public.member_social_links ms where ms.member_id = mm.id))::int
      ) as filled
    from public.members mm
  )
  select jsonb_build_object(
    'total',          (select count(*) from m),
    'pending',        (select count(*) from m where status = 'pending'),
    'approved',       (select count(*) from m where status = 'approved'),
    'blocked',        (select count(*) from m where status = 'blocked'),
    'rejected',       (select count(*) from m where status = 'rejected'),
    'new_this_month', (select count(*) from m
                        where date_trunc('month', created_at) = date_trunc('month', now())),
    'incomplete',     (select count(*) from m where filled < 8),
    'top_cities', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select city as label, count(*) as value
        from m where city is not null and city <> ''
        group by city order by value desc, city limit 5
      ) x
    ),
    'top_profiles', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select label, count(*) as value from (
          select unnest(occupation_areas)::text as label from m
        ) t group by label order by value desc, label limit 5
      ) x
    ),
    'top_interests', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select i.name as label, count(distinct mi.member_id) as value
        from public.member_interests mi
        join public.interests i on i.id = mi.interest_id
        group by i.name order by value desc, i.name limit 5
      ) x
    )
  ) into result;

  return result;
end;
$$;

grant execute on function public.admin_dashboard_metrics() to authenticated;

-- ---------- 4) EVENTOS: campos + inscritos (fase futura) ----------
-- A tabela public.events já existe (title, description, event_date, location,
-- external_url). Adiciona status/capacidade e a tabela de inscritos para
-- habilitar a gestão e o "ver inscritos" quando a fase for ativada.
alter table public.events
  add column if not exists status text not null default 'draft'
    check (status in ('draft', 'published', 'past'));

alter table public.events
  add column if not exists capacity integer
    check (capacity is null or capacity >= 0);

create table if not exists public.event_registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events (id) on delete cascade,
  member_id  uuid not null references public.members (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, member_id)
);

create index if not exists idx_event_registrations_event on public.event_registrations (event_id);

alter table public.event_registrations enable row level security;

drop policy if exists event_registrations_admin_all on public.event_registrations;
create policy event_registrations_admin_all on public.event_registrations
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists event_registrations_own on public.event_registrations;
create policy event_registrations_own on public.event_registrations
  for all to authenticated
  using (public.is_member_owner(member_id))
  with check (public.is_member_owner(member_id));

-- ---------- 5) OPORTUNIDADES: status + tags (fase futura) ----------
-- A tabela public.opportunities já existe (title, description, category, url,
-- deadline). Adiciona status e tags para o painel da fase futura.
alter table public.opportunities
  add column if not exists status text not null default 'draft'
    check (status in ('draft', 'open', 'closed'));

alter table public.opportunities
  add column if not exists tags text[] not null default '{}';

create index if not exists idx_opportunities_status on public.opportunities (status);
