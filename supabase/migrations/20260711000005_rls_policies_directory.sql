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
