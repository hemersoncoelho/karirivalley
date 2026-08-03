-- =============================================================
-- Kariri Valley — correção do segredo do trigger de e-mail (0803000003)
-- Edge function secrets no Supabase são globais ao projeto: a env
-- var WEBHOOK_SECRET já está configurada com o valor de
-- 'whatsapp_webhook_secret' (usada por send-whatsapp-welcome).
-- O trigger de e-mail precisa enviar esse MESMO valor, não um
-- segredo novo, senão send-email-welcome sempre responde 401.
-- =============================================================

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
    where name = 'whatsapp_webhook_secret';

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

delete from vault.secrets where name = 'email_webhook_secret';
