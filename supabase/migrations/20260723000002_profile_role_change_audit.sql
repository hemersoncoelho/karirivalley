-- =============================================================
-- Kariri Valley — 0011: auditoria automática de mudança de papel
-- =============================================================
-- Espelha log_member_status_change (0004): dispara sempre que
-- profiles.role muda, independente do caminho (app, SQL editor etc).
-- protect_profile_role (0002) já garante que só admin muda papéis e que
-- ninguém remove o próprio admin; este trigger só registra o que já foi
-- permitido a acontecer (RN-024).

create or replace function public.log_profile_role_change()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    insert into public.admin_audit_logs (admin_id, action, target_type, target_id, details)
    values (
      auth.uid(),
      'role_change',
      'profile',
      new.id::text,
      jsonb_build_object('from', old.role, 'to', new.role, 'name', coalesce(new.full_name, new.email))
    );
  end if;
  return new;
end;
$$;

create trigger trg_profiles_log_role_change
  after update on public.profiles
  for each row execute function public.log_profile_role_change();
