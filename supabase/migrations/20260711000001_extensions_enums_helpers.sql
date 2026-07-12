-- =============================================================
-- Kariri Valley — 0001: extensões, enums e funções auxiliares
-- =============================================================

create extension if not exists unaccent with schema extensions;

-- ---------- ENUMS ----------

-- Status do membro (RN: pending -> approved | rejected | blocked)
create type public.member_status as enum ('pending', 'approved', 'rejected', 'blocked');

-- Visibilidade por campo (RN-006/008/009)
create type public.field_visibility as enum ('public', 'members', 'private');

-- Papel do usuário na plataforma
create type public.user_role as enum ('member', 'ambassador', 'admin');

-- Área de atuação (formulário de cadastro)
create type public.occupation_area as enum (
  'empreendedor', 'desenvolvedor', 'investidor', 'educador',
  'gestor_publico', 'estudante', 'outro'
);

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
