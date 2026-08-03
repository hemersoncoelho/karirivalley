-- =============================================================
-- Kariri Valley — hardening do trigger de WhatsApp (0803000001)
-- Impede chamada direta via RPC da função de trigger; ela só
-- deve rodar automaticamente no contexto do trigger.
-- pg_net não suporta SET SCHEMA no Supabase gerenciado — permanece
-- em public (comportamento esperado, sinalizado pelo linter).
-- =============================================================

revoke execute on function public.notify_member_approved_whatsapp() from public, anon, authenticated;
