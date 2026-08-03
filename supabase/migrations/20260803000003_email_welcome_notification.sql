-- =============================================================
-- Kariri Valley — E-mail de boas-vindas ao aprovar membro sem WhatsApp
-- Ao aprovar um membro sem telefone cadastrado (status -> approved,
-- phone is null), dispara de forma assíncrona a edge function
-- send-email-welcome via pg_net. O segredo compartilhado fica no
-- Vault; nunca em texto plano.
-- =============================================================

select vault.create_secret(
  encode(gen_random_bytes(32), 'hex'),
  'email_webhook_secret',
  'Segredo compartilhado entre o trigger de aprovação e a edge function send-email-welcome'
)
where not exists (
  select 1 from vault.decrypted_secrets where name = 'email_webhook_secret'
);

create or replace function public.notify_member_approved_email()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  v_secret text;
begin
  if new.status = 'approved' and old.status is distinct from 'approved' and new.phone is null then
    select decrypted_secret into v_secret
    from vault.decrypted_secrets
    where name = 'email_webhook_secret';

    perform net.http_post(
      url := 'https://psdipufxmwmhierjywfw.supabase.co/functions/v1/send-email-welcome',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-webhook-secret', v_secret
      ),
      body := jsonb_build_object(
        'member_id', new.id,
        'full_name', new.full_name,
        'display_name', new.display_name,
        'email', new.email
      )
    );
  end if;
  return new;
end;
$$;

revoke execute on function public.notify_member_approved_email() from public, anon, authenticated;

create trigger trg_members_notify_email
  after update on public.members
  for each row execute function public.notify_member_approved_email();
