-- =============================================================
-- Kariri Valley — 0012: hardening das RPCs do painel admin
-- =============================================================
-- O Supabase advisor apontou que admin_dashboard_metrics() e
-- log_admin_action() ficaram executáveis por anon (grant PUBLIC padrão
-- do CREATE FUNCTION). Ambas já bloqueiam não-admins internamente via
-- is_admin(), mas seguindo o mesmo padrão da migration 0006, restringe
-- o EXECUTE a authenticated.

revoke execute on function public.admin_dashboard_metrics() from public, anon;
revoke execute on function public.log_admin_action(text, text, text, jsonb) from public, anon;
