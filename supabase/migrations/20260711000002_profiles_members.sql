-- =============================================================
-- Kariri Valley — 0002: profiles e members (tabelas núcleo)
-- =============================================================

-- ---------- PROFILES (1:1 com auth.users) ----------
-- Dados de identidade/conta. E-mail e papel ficam aqui, nunca no diretório.
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  full_name  text,
  role       public.user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Só admin altera papéis; admin não remove o próprio papel (RN-023)
create or replace function public.protect_profile_role()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' then
    return new;
  end if;
  if new.role is distinct from old.role then
    if not public.is_admin() then
      raise exception 'apenas administradores podem alterar papéis';
    end if;
    if old.id = auth.uid() and old.role = 'admin' and new.role <> 'admin' then
      raise exception 'administradores não podem remover o próprio papel de admin';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Cria profile automaticamente no signup e vincula solicitação de membro
-- pendente/aprovada com o mesmo e-mail (fluxo de ativação).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );

  update public.members
     set profile_id = new.id,
         updated_at = now()
   where email = new.email
     and profile_id is null;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- MEMBERS ----------
-- Solicitação de cadastro + perfil comunitário. Criado pelo visitante
-- (status pending) e vinculado ao profile na ativação da conta.
create table public.members (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid unique references public.profiles (id) on delete set null,

  -- identificação
  full_name        text not null check (char_length(full_name) between 3 and 120),
  display_name     text check (char_length(display_name) <= 80),
  slug             text unique,

  -- contato (sensível — nunca exposto sem visibilidade explícita) [RN-006/020]
  email            text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone            text check (char_length(phone) <= 20),

  -- perfil público
  city             text not null check (char_length(city) <= 80),
  bio              text check (char_length(bio) <= 300),            -- RN-012
  photo_url        text,
  company          text check (char_length(company) <= 120),
  position         text check (char_length(position) <= 120),
  occupation_areas public.occupation_area[] not null default '{}',

  -- dados da solicitação
  how_found        text check (char_length(how_found) <= 500),
  motivation       text check (char_length(motivation) <= 500),
  nominated_by     uuid references public.members (id) on delete set null,

  -- controle / governança
  status           public.member_status not null default 'pending',
  is_public        boolean not null default true,                   -- RN-008
  approved_at      timestamptz,
  approved_by      uuid references public.profiles (id) on delete set null,
  created_by       uuid references public.profiles (id) on delete set null,
  updated_by       uuid references public.profiles (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_members_status       on public.members (status);
create index idx_members_city         on public.members (city);
create index idx_members_created_at   on public.members (created_at desc);
create index idx_members_nominated_by on public.members (nominated_by);

create trigger trg_members_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

-- Slug automático a partir do nome, com sufixo numérico em conflito (RN-013)
create or replace function public.set_member_slug()
returns trigger
language plpgsql security definer
set search_path = public, extensions
as $$
declare
  base_slug text;
  candidate text;
  counter   int := 0;
begin
  if new.slug is not null and new.slug <> '' then
    return new;
  end if;

  base_slug := trim(both '-' from lower(
    regexp_replace(
      extensions.unaccent(coalesce(nullif(new.display_name, ''), new.full_name)),
      '[^a-zA-Z0-9]+', '-', 'g'
    )
  ));
  if base_slug is null or base_slug = '' then
    base_slug := 'membro';
  end if;

  candidate := base_slug;
  while exists (select 1 from public.members where slug = candidate and id <> new.id) loop
    counter := counter + 1;
    candidate := base_slug || '-' || counter;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

create trigger trg_members_set_slug
  before insert or update of slug, full_name, display_name on public.members
  for each row execute function public.set_member_slug();

-- Campos de controle só mudam pela mão de admin (RN-001/002/014/023).
-- Também carimba approved_at/approved_by na aprovação.
create or replace function public.protect_member_control_fields()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' then
    return new;
  end if;

  if not public.is_admin() then
    if new.status is distinct from old.status
       or new.approved_at is distinct from old.approved_at
       or new.approved_by is distinct from old.approved_by then
      raise exception 'apenas administradores podem alterar status/aprovação de membros';
    end if;
  else
    if new.status = 'blocked' and old.profile_id is not null and old.profile_id = auth.uid() then
      raise exception 'administradores não podem bloquear a si mesmos';  -- RN-023
    end if;
    if new.status = 'approved' and old.status is distinct from 'approved' then
      new.approved_at := now();
      new.approved_by := auth.uid();
    end if;
  end if;

  new.updated_by := coalesce(auth.uid(), new.updated_by);
  return new;
end;
$$;

create trigger trg_members_protect_control
  before update on public.members
  for each row execute function public.protect_member_control_fields();
