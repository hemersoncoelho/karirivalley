-- The members_select_nominator policy queried public.members directly inside
-- a policy defined on public.members, without going through a SECURITY DEFINER
-- helper (unlike every other members policy). That causes Postgres to raise
-- "infinite recursion detected in policy for relation members" on any
-- authenticated SELECT against members. It also had a self-referential bug
-- (me.id = me.nominated_by compares a row to itself instead of correlating
-- to the outer row), so it never actually matched the intended "ambassador
-- sees who they nominated" case.

create or replace function public.is_ambassador_member(m_id uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select exists (
    select 1 from public.members me
    join public.profiles p on p.id = me.profile_id
    where me.id = m_id
      and me.profile_id = auth.uid()
      and p.role = 'ambassador'
  );
$$;

drop policy if exists members_select_nominator on public.members;

create policy members_select_nominator on public.members
  for select
  to authenticated
  using (nominated_by is not null and public.is_ambassador_member(nominated_by));
