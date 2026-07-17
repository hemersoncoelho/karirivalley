-- =============================================================
-- Kariri Valley — PROPOSTA de expansão pós-MVP (NÃO APLICAR AGORA)
-- Mover para migrations/ quando cada fase for priorizada.
-- Reusa: is_admin(), is_member_owner(), set_updated_at(),
-- padrão created_by/updated_by + RLS.
-- =============================================================

-- ---------- EVENTS ----------
create type public.event_status as enum ('draft', 'published', 'cancelled', 'finished');

create table public.events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  description  text,
  location     text,
  is_online    boolean not null default false,
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  capacity     int check (capacity > 0),
  status       public.event_status not null default 'draft',
  cover_url    text,
  created_by   uuid references public.profiles (id) on delete set null,
  updated_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
-- RLS: select público quando status = 'published'; escrita só admin.

-- ---------- EVENT_REGISTRATIONS ----------
create type public.registration_status as enum ('registered', 'waitlisted', 'cancelled', 'attended');

create table public.event_registrations (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references public.events (id) on delete cascade,
  member_id   uuid not null references public.members (id) on delete cascade,
  status      public.registration_status not null default 'registered',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (event_id, member_id)
);
-- RLS: membro gerencia a própria inscrição; admin vê todas.

-- ---------- OPPORTUNITIES (vagas, editais, parcerias) ----------
create type public.opportunity_type as enum ('job', 'internship', 'grant', 'partnership', 'other');

create table public.opportunities (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  type         public.opportunity_type not null,
  description  text,
  company      text,
  city         text,
  external_url text,
  expires_at   timestamptz,
  is_published boolean not null default false,
  posted_by    uuid references public.members (id) on delete set null,
  approved_by  uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
-- RLS: select público quando is_published e não expirada; submissão por
-- membro aprovado, publicação só por admin (curadoria).

-- ---------- POSTS (blog / notícias) ----------
create type public.post_status as enum ('draft', 'published', 'archived');

create table public.posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  content      text,
  cover_url    text,
  status       public.post_status not null default 'draft',
  published_at timestamptz,
  author_id    uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
-- RLS: select público quando published; escrita admin/editor.

-- ---------- CONNECTIONS (membro <-> membro) ----------
create type public.connection_status as enum ('pending', 'accepted', 'declined', 'blocked');

create table public.connections (
  id           uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.members (id) on delete cascade,
  addressee_id uuid not null references public.members (id) on delete cascade,
  status       public.connection_status not null default 'pending',
  message      text check (char_length(message) <= 300),
  responded_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);
-- RLS: só as duas pontas enxergam; requester cria; addressee responde.

-- ---------- BADGES ----------
create table public.badges (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  icon_url    text,
  created_at  timestamptz not null default now()
);

create table public.member_badges (
  member_id  uuid not null references public.members (id) on delete cascade,
  badge_id   uuid not null references public.badges (id) on delete cascade,
  awarded_by uuid references public.profiles (id) on delete set null,
  awarded_at timestamptz not null default now(),
  primary key (member_id, badge_id)
);
-- RLS: leitura pública (membros visíveis); concessão só admin.

-- ---------- COMMUNITY_METRICS (snapshots agregados, sem PII) ----------
create table public.community_metrics (
  id           bigint generated always as identity primary key,
  metric_key   text not null,          -- ex.: members_approved_total
  metric_value numeric not null,
  dimensions   jsonb not null default '{}'::jsonb,  -- ex.: {"city": "Juazeiro"}
  captured_on  date not null default current_date,
  created_at   timestamptz not null default now(),
  unique (metric_key, dimensions, captured_on)
);
-- RLS: select admin (ou público se virarem métricas institucionais);
-- gravação por job agendado (pg_cron/edge function com service role).
