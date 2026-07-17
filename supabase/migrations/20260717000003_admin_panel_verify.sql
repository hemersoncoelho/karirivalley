-- =============================================================
-- Kariri Valley — Verificação do Painel Admin (rode após 0011)
-- Cada consulta deve retornar o esperado, sem erro.
-- =============================================================

-- 1) interests.active criado
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'interests' and column_name = 'active';

-- 2) events.status/capacity + opportunities.status/tags criados
select table_name, column_name from information_schema.columns
where table_schema = 'public'
  and ((table_name = 'events' and column_name in ('status', 'capacity'))
    or (table_name = 'opportunities' and column_name in ('status', 'tags')))
order by table_name, column_name;

-- 3) event_registrations existe
select table_name from information_schema.tables
where table_schema = 'public' and table_name = 'event_registrations';

-- 4) Funções do painel criadas
select routine_name from information_schema.routines
where routine_schema = 'public'
  and routine_name in ('log_admin_action', 'admin_dashboard_metrics')
order by routine_name;

-- 5) Papéis atuais (defina ao menos um admin)
select role, count(*) from public.profiles group by role order by role;
--   update public.profiles set role = 'admin' where email = 'voce@exemplo.com';

-- 6) Métricas — teste pelo app autenticado como admin.
--    (No SQL Editor roda como superusuário: auth.uid() é null e a função
--     retornará "Acesso negado", o que é esperado.)
-- select public.admin_dashboard_metrics();
