-- =============================================================
-- Kariri Valley — 0003: tabelas satélites do membro
-- interests, member_interests, member_needs, member_offers,
-- member_social_links, member_visibility_settings
-- =============================================================

-- ---------- INTERESTS (catálogo curado pelo admin) ----------
create table public.interests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique check (char_length(name) <= 60),
  slug       text not null unique,
  category   text check (char_length(category) <= 60),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- MEMBER_INTERESTS (N:N) ----------
create table public.member_interests (
  member_id   uuid not null references public.members (id) on delete cascade,
  interest_id uuid not null references public.interests (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (member_id, interest_id)
);

create index idx_member_interests_interest on public.member_interests (interest_id);

-- ---------- MEMBER_NEEDS (o que o membro busca) ----------
create table public.member_needs (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.members (id) on delete cascade,
  title       text not null check (char_length(title) <= 120),
  description text check (char_length(description) <= 500),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_member_needs_member on public.member_needs (member_id);

create trigger trg_member_needs_updated_at
  before update on public.member_needs
  for each row execute function public.set_updated_at();

-- ---------- MEMBER_OFFERS (o que o membro oferece) ----------
create table public.member_offers (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.members (id) on delete cascade,
  title       text not null check (char_length(title) <= 120),
  description text check (char_length(description) <= 500),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_member_offers_member on public.member_offers (member_id);

create trigger trg_member_offers_updated_at
  before update on public.member_offers
  for each row execute function public.set_updated_at();

-- ---------- MEMBER_SOCIAL_LINKS ----------
create table public.member_social_links (
  id         uuid primary key default gen_random_uuid(),
  member_id  uuid not null references public.members (id) on delete cascade,
  platform   text not null check (platform in ('linkedin', 'github', 'instagram', 'website', 'twitter', 'other')),
  url        text not null check (url ~* '^https?://'),
  created_at timestamptz not null default now(),
  unique (member_id, platform)
);

create index idx_member_social_links_member on public.member_social_links (member_id);

-- ---------- MEMBER_VISIBILITY_SETTINGS (privacidade por campo) ----------
-- Sem linha aqui, vale o padrão: email/phone = private, demais = public
-- (o padrão é aplicado em public.can_view_member_field). [RN-006/009]
create table public.member_visibility_settings (
  member_id  uuid not null references public.members (id) on delete cascade,
  field_name text not null check (field_name in ('email', 'phone', 'city', 'company', 'position', 'bio', 'photo', 'social_links')),
  visibility public.field_visibility not null default 'private',
  updated_at timestamptz not null default now(),
  primary key (member_id, field_name)
);

create trigger trg_member_visibility_updated_at
  before update on public.member_visibility_settings
  for each row execute function public.set_updated_at();

-- Visitante/membro pode ver determinado campo de um membro?
create or replace function public.can_view_member_field(target_member uuid, fname text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select case coalesce(
      (select visibility
         from public.member_visibility_settings
        where member_id = target_member and field_name = fname),
      case when fname in ('email', 'phone')
           then 'private'::public.field_visibility
           else 'public'::public.field_visibility end
    )
    when 'public'  then true
    when 'members' then public.is_approved_member()
    else public.is_member_owner(target_member) or public.is_admin()
  end;
$$;
