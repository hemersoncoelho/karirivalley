-- =============================================================
-- Kariri Valley — 0001: extensões, enums e funções auxiliares
-- =============================================================

-- As funções abaixo referenciam tabelas criadas na migration 0002;
-- desliga a validação de corpo para permitir a referência futura.
set check_function_bodies = off;

create extension if not exists unaccent with schema extensions;

-- ---------- ENUMS (idempotentes para re-execução segura) ----------

do $$ begin
  -- Status do membro (RN: pending -> approved | rejected | blocked)
  create type public.member_status as enum ('pending', 'approved', 'rejected', 'blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  -- Visibilidade por campo (RN-006/008/009)
  create type public.field_visibility as enum ('public', 'members', 'private');
exception when duplicate_object then null; end $$;

do $$ begin
  -- Papel do usuário na plataforma
  create type public.user_role as enum ('member', 'ambassador', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  -- Área de atuação (formulário de cadastro)
  create type public.occupation_area as enum (
    'empreendedor', 'desenvolvedor', 'investidor', 'educador',
    'gestor_publico', 'estudante', 'outro'
  );
exception when duplicate_object then null; end $$;

-- ---------- FUNÇÕES AUXILIARES ----------

-- Trigger genérico de updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Usuário logado é admin? (security definer para não recursar em RLS)
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Usuário logado é um membro aprovado?
create or replace function public.is_approved_member()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.members
    where profile_id = auth.uid() and status = 'approved'
  );
$$;

-- Usuário logado é dono do registro de membro informado?
create or replace function public.is_member_owner(m_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.members
    where id = m_id and profile_id = auth.uid()
  );
$$;

-- Membro é visível para quem está consultando?
-- (aprovado E: perfil público OU consultante é membro aprovado)  [RN-007/010]
create or replace function public.is_member_visible(m_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.members
    where id = m_id
      and status = 'approved'
      and (is_public or public.is_approved_member())
  );
$$;
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
-- =============================================================
-- Kariri Valley — 0004: log de auditoria administrativa (RN-024)
-- =============================================================

create table public.admin_audit_logs (
  id          bigint generated always as identity primary key,
  admin_id    uuid references public.profiles (id) on delete set null,
  action      text not null,          -- ex.: member_status_change, role_change
  target_type text not null,          -- ex.: member, profile
  target_id   text,
  details     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index idx_audit_logs_admin      on public.admin_audit_logs (admin_id);
create index idx_audit_logs_created_at on public.admin_audit_logs (created_at desc);
create index idx_audit_logs_target     on public.admin_audit_logs (target_type, target_id);

-- Registra automaticamente toda mudança de status de membro
create or replace function public.log_member_status_change()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.admin_audit_logs (admin_id, action, target_type, target_id, details)
    values (
      auth.uid(),
      'member_status_change',
      'member',
      new.id::text,
      jsonb_build_object('from', old.status, 'to', new.status, 'member_slug', new.slug)
    );
  end if;
  return new;
end;
$$;

create trigger trg_members_log_status
  after update on public.members
  for each row execute function public.log_member_status_change();
-- =============================================================
-- Kariri Valley — 0005: RLS, policies e view do diretório
-- =============================================================

alter table public.profiles                   enable row level security;
alter table public.members                    enable row level security;
alter table public.interests                  enable row level security;
alter table public.member_interests           enable row level security;
alter table public.member_needs               enable row level security;
alter table public.member_offers              enable row level security;
alter table public.member_social_links        enable row level security;
alter table public.member_visibility_settings enable row level security;
alter table public.admin_audit_logs           enable row level security;

-- ---------- PROFILES ----------
-- Dono vê/edita o próprio; admin vê/edita todos. Insert só via trigger de signup.
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ---------- MEMBERS ----------
-- Visitante solicita cadastro: insert anônimo sempre nasce 'pending' (RN-001)
create policy members_insert_request on public.members
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and profile_id is null
    and approved_at is null
    and approved_by is null
  );

create policy members_insert_admin on public.members
  for insert to authenticated
  with check (public.is_admin());

-- Leitura direta da tabela: só o dono e admins (o público usa a view member_directory)
create policy members_select on public.members
  for select to authenticated
  using (profile_id = auth.uid() or public.is_admin());

-- Embaixador acompanha quem indicou (somente leitura)
create policy members_select_nominator on public.members
  for select to authenticated
  using (
    nominated_by is not null
    and exists (
      select 1
        from public.members me
        join public.profiles p on p.id = me.profile_id
       where me.id = nominated_by
         and me.profile_id = auth.uid()
         and p.role = 'ambassador'
    )
  );

create policy members_update on public.members
  for update to authenticated
  using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

create policy members_delete_admin on public.members
  for delete to authenticated
  using (public.is_admin());

-- ---------- INTERESTS (catálogo público, curado por admin) ----------
create policy interests_select on public.interests
  for select to anon, authenticated
  using (true);

create policy interests_admin_write on public.interests
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- MEMBER_INTERESTS ----------
create policy member_interests_select on public.member_interests
  for select to anon, authenticated
  using (
    public.is_member_visible(member_id)
    or public.is_member_owner(member_id)
    or public.is_admin()
  );

create policy member_interests_insert on public.member_interests
  for insert to authenticated
  with check (public.is_member_owner(member_id) or public.is_admin());

create policy member_interests_delete on public.member_interests
  for delete to authenticated
  using (public.is_member_owner(member_id) or public.is_admin());

-- ---------- MEMBER_NEEDS ----------
create policy member_needs_select on public.member_needs
  for select to anon, authenticated
  using (
    (is_active and public.is_member_visible(member_id))
    or public.is_member_owner(member_id)
    or public.is_admin()
  );

create policy member_needs_write on public.member_needs
  for all to authenticated
  using (public.is_member_owner(member_id) or public.is_admin())
  with check (public.is_member_owner(member_id) or public.is_admin());

-- ---------- MEMBER_OFFERS ----------
create policy member_offers_select on public.member_offers
  for select to anon, authenticated
  using (
    (is_active and public.is_member_visible(member_id))
    or public.is_member_owner(member_id)
    or public.is_admin()
  );

create policy member_offers_write on public.member_offers
  for all to authenticated
  using (public.is_member_owner(member_id) or public.is_admin())
  with check (public.is_member_owner(member_id) or public.is_admin());

-- ---------- MEMBER_SOCIAL_LINKS ----------
create policy member_social_links_select on public.member_social_links
  for select to anon, authenticated
  using (
    (public.is_member_visible(member_id)
      and public.can_view_member_field(member_id, 'social_links'))
    or public.is_member_owner(member_id)
    or public.is_admin()
  );

create policy member_social_links_write on public.member_social_links
  for all to authenticated
  using (public.is_member_owner(member_id) or public.is_admin())
  with check (public.is_member_owner(member_id) or public.is_admin());

-- ---------- MEMBER_VISIBILITY_SETTINGS ----------
create policy member_visibility_rw on public.member_visibility_settings
  for all to authenticated
  using (public.is_member_owner(member_id) or public.is_admin())
  with check (public.is_member_owner(member_id) or public.is_admin());

-- ---------- ADMIN_AUDIT_LOGS ----------
-- Imutável: sem update/delete. Inserts vêm de triggers (definer) ou admin.
create policy audit_logs_select_admin on public.admin_audit_logs
  for select to authenticated
  using (public.is_admin());

create policy audit_logs_insert_admin on public.admin_audit_logs
  for insert to authenticated
  with check (public.is_admin());

-- ---------- VIEW DO DIRETÓRIO ----------
-- Única superfície pública de leitura de membros. Roda como owner
-- (security_invoker = off) e aplica internamente: só aprovados,
-- respeito a is_public e visibilidade por campo. E-mail/telefone
-- só aparecem se o próprio membro liberar. [RN-007/010/019/020]
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
  m.approved_at                                                              as member_since
from public.members m
where m.status = 'approved'
  and (m.is_public or public.is_approved_member());

grant select on public.member_directory to anon, authenticated;
