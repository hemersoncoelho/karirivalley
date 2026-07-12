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
