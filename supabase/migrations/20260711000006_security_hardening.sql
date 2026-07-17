-- =============================================================
-- Kariri Valley — 0006: hardening (advisors do Supabase)
-- =============================================================

-- search_path fixo na única função que faltava
alter function public.set_updated_at() set search_path = public;

-- Funções de trigger não devem ser chamáveis via RPC (/rest/v1/rpc/*).
-- Revogar EXECUTE não afeta os triggers (rodam como owner da tabela).
revoke execute on function public.set_updated_at()                from public, anon, authenticated;
revoke execute on function public.handle_new_user()               from public, anon, authenticated;
revoke execute on function public.protect_profile_role()          from public, anon, authenticated;
revoke execute on function public.protect_member_control_fields() from public, anon, authenticated;
revoke execute on function public.set_member_slug()               from public, anon, authenticated;
revoke execute on function public.log_member_status_change()      from public, anon, authenticated;

-- As funções auxiliares (is_admin, is_approved_member, is_member_owner,
-- is_member_visible, can_view_member_field) PERMANECEM executáveis por
-- anon/authenticated: as policies de RLS avaliadas por esses papéis
-- dependem delas. Retornam apenas booleanos — sem exposição de dados.

-- A view public.member_directory permanece SECURITY DEFINER por decisão
-- de arquitetura: é a única superfície pública de leitura de membros e
-- filtra internamente status, is_public e visibilidade por campo,
-- evitando conceder SELECT em public.members (e-mail/telefone) ao anon.
