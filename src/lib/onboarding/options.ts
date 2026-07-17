export interface ChipOption {
  value: string
  label: string
}

/** Etapa 3 — Perfil na comunidade (valores do enum public.occupation_area) */
export const COMMUNITY_PROFILES: ChipOption[] = [
  { value: "founder", label: "Founder" },
  { value: "estudante", label: "Estudante" },
  { value: "desenvolvedor", label: "Desenvolvedor(a)" },
  { value: "designer", label: "Designer" },
  { value: "marketing_vendas", label: "Marketing/Vendas" },
  { value: "pesquisador", label: "Pesquisador(a)" },
  { value: "professor", label: "Professor(a)" },
  { value: "investidor", label: "Investidor(a)" },
  { value: "empresario", label: "Empresário(a)" },
  { value: "mentor", label: "Mentor(a)" },
  { value: "parceiro_institucional", label: "Parceiro institucional" },
  { value: "interessado_inovacao", label: "Pessoa interessada em inovação" },
]

/** Etapa 5 — O que busca (vira member_needs.title) */
export const NEED_OPTIONS: string[] = [
  "Conhecer pessoas",
  "Encontrar sócio",
  "Participar de eventos",
  "Divulgar projeto",
  "Receber oportunidades",
  "Aprender sobre startups",
  "Encontrar talentos",
  "Encontrar mentores",
  "Buscar investimento",
  "Acessar editais",
  "Conectar com empresas",
]

/** Etapa 6 — O que oferece (vira member_offers.title) */
export const OFFER_OPTIONS: string[] = [
  "Mentoria",
  "Desenvolvimento",
  "Design",
  "Marketing",
  "Vendas",
  "Produto",
  "Pesquisa",
  "Gestão",
  "Palestras",
  "Investimento",
  "Parcerias",
  "Espaço físico",
  "Conteúdo",
  "Conexão institucional",
]

/** Ordem de exibição da Etapa 4 (catálogo vem do banco) */
export const INTEREST_SLUG_ORDER: string[] = [
  "startups",
  "tecnologia",
  "inteligencia-artificial",
  "agro",
  "turismo",
  "economia-criativa",
  "educacao",
  "saude",
  "impacto-social",
  "industria",
  "vendas-negocios",
  "captacao-recursos",
  "editais",
  "produto",
  "ux-ui",
  "programacao",
]

export const BRAZIL_STATES: string[] = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]

export const TOTAL_STEPS = 7

export const STEP_TITLES: string[] = [
  "Crie sua conta",
  "Dados básicos",
  "Seu perfil na comunidade",
  "Temas de interesse",
  "O que você busca",
  "O que você oferece",
  "Visibilidade do perfil",
]
