-- =============================================================
-- Kariri Valley — 0007: suporte ao fluxo de onboarding autenticado
-- =============================================================

-- ---------- PERFIS DE COMUNIDADE (Etapa 3 do onboarding) ----------
alter type public.occupation_area add value if not exists 'founder';
alter type public.occupation_area add value if not exists 'designer';
alter type public.occupation_area add value if not exists 'marketing_vendas';
alter type public.occupation_area add value if not exists 'pesquisador';
alter type public.occupation_area add value if not exists 'professor';
alter type public.occupation_area add value if not exists 'empresario';
alter type public.occupation_area add value if not exists 'mentor';
alter type public.occupation_area add value if not exists 'parceiro_institucional';
alter type public.occupation_area add value if not exists 'interessado_inovacao';

-- ---------- INSERT AUTENTICADO (conta criada antes do cadastro) ----------
-- Usuário logado cria a própria solicitação já vinculada ao profile,
-- sempre 'pending' (RN-001) e com o e-mail da própria conta.
create policy members_insert_own on public.members
  for insert to authenticated
  with check (
    profile_id = auth.uid()
    and status = 'pending'
    and approved_at is null
    and approved_by is null
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- ---------- SEED DO CATÁLOGO DE INTERESSES (Etapa 4) ----------
insert into public.interests (name, slug, category) values
  ('Startups',                'startups',                'tema'),
  ('Tecnologia',              'tecnologia',              'tema'),
  ('Inteligência Artificial', 'inteligencia-artificial', 'tema'),
  ('Agro',                    'agro',                    'tema'),
  ('Turismo',                 'turismo',                 'tema'),
  ('Economia criativa',       'economia-criativa',       'tema'),
  ('Educação',                'educacao',                'tema'),
  ('Saúde',                   'saude',                   'tema'),
  ('Impacto social',          'impacto-social',          'tema'),
  ('Indústria',               'industria',               'tema'),
  ('Vendas e negócios',       'vendas-negocios',         'tema'),
  ('Captação de recursos',    'captacao-recursos',       'tema'),
  ('Editais',                 'editais',                 'tema'),
  ('Produto',                 'produto',                 'tema'),
  ('UX/UI',                   'ux-ui',                   'tema'),
  ('Programação',             'programacao',             'tema')
on conflict (slug) do nothing;
