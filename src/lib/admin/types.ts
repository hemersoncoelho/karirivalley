/**
 * Tipos do painel administrativo.
 *
 * Esta camada espelha o schema esperado do banco (Supabase) para que a troca
 * dos dados mockados pela integração real seja direta. Os nomes de campos em
 * camelCase mapeiam 1:1 com as colunas snake_case das tabelas correspondentes.
 */

/** members.status */
export type MemberStatus = "pending" | "approved" | "blocked" | "rejected"

/** profiles.role (enum user_role) — controle de acesso ao painel. */
export type MemberRole = "member" | "ambassador" | "admin"

/** members.occupation_areas (enum public.occupation_area) */
export type OccupationArea =
  | "founder"
  | "estudante"
  | "desenvolvedor"
  | "designer"
  | "marketing_vendas"
  | "pesquisador"
  | "professor"
  | "investidor"
  | "empresario"
  | "mentor"
  | "parceiro_institucional"
  | "interessado_inovacao"

export interface SocialLink {
  platform: "linkedin" | "instagram" | "github" | "website"
  url: string
}

/** members.company_sector (enum public.company_sector) */
export type CompanySector =
  | "agro"
  | "turismo"
  | "saude"
  | "deep_tech"
  | "fintech"
  | "edtech"
  | "varejo_ecommerce"
  | "industria"
  | "impacto_social"
  | "outro"

/** members.company_type (enum public.company_type) */
export type CompanyType = "startup" | "tradicional"

/** members.company_review_status (enum public.company_review_status) */
export type CompanyReviewStatus = "pending" | "approved" | "rejected"

/** Espelha a tabela `members` (+ relações agregadas para exibição). */
export interface AdminMember {
  id: string
  profileId: string | null
  fullName: string
  displayName: string | null
  email: string
  phone: string | null
  city: string
  state: string | null
  bio: string | null
  photoUrl: string | null
  company: string | null
  position: string | null
  occupationAreas: OccupationArea[]
  /** slugs de interests (member_interests) */
  interests: string[]
  /** member_needs.title */
  needs: string[]
  /** member_offers.title */
  offers: string[]
  socialLinks: SocialLink[]
  status: MemberStatus
  role: MemberRole
  isPublic: boolean
  /** ISO date — members.created_at */
  createdAt: string
  companyName: string | null
  companyType: CompanyType | null
  companyStage: string | null
  companyCnpj: string | null
  companyLogoUrl: string | null
  companyProblem: string | null
  companySector: CompanySector | null
  companyReviewStatus: CompanyReviewStatus | null
}

/** Espelha a tabela `interests` + contagem de uso. */
export interface AdminInterest {
  id: string
  name: string
  slug: string
  category: string
  active: boolean
  memberCount: number
}

/** Estrutura para a fase futura de eventos. */
export type EventStatus = "draft" | "published" | "past"

export interface AdminEvent {
  id: string
  title: string
  description: string
  /** ISO datetime */
  startsAt: string
  location: string
  capacity: number | null
  registrationsCount: number
  status: EventStatus
}

/** Estrutura para a fase futura de oportunidades. */
export type OpportunityStatus = "draft" | "open" | "closed"
/** opportunities.category */
export type OpportunityType = "editais" | "vagas" | "aceleracao" | "mentoria" | "programas"

export interface AdminOpportunity {
  id: string
  title: string
  description: string
  type: OpportunityType
  /** ISO date */
  deadline: string | null
  tags: string[]
  status: OpportunityStatus
}

/** Log de auditoria — RN-024. */
export type AuditAction =
  | "approve_member"
  | "reject_member"
  | "block_member"
  | "unblock_member"
  | "edit_member"
  | "role_change"
  | "create_interest"
  | "update_interest"
  | "toggle_interest"
  | "approve_company"
  | "reject_company"

export interface AuditLogEntry {
  id: string
  /** ISO datetime */
  timestamp: string
  actorName: string
  actorRole: MemberRole
  action: AuditAction
  targetType: "member" | "profile" | "interest" | "event" | "opportunity"
  targetName: string
  details?: string
}

/** Métricas agregadas do dashboard. */
export interface DashboardMetrics {
  total: number
  pending: number
  approved: number
  blocked: number
  rejected: number
  newThisMonth: number
  incomplete: number
  topCities: RankedItem[]
  topInterests: RankedItem[]
  topProfiles: RankedItem[]
  companiesCount: number
  pendingCompaniesCount: number
  topSectors: RankedItem[]
}

export interface RankedItem {
  label: string
  value: number
}
