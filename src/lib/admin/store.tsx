"use client"

/**
 * Store do painel administrativo.
 *
 * Carrega os dados reais do Supabase (client-side, respeitando RLS — o painel
 * só é alcançado por admins autenticados, ver src/app/admin/layout.tsx) e
 * expõe as ações de moderação como mutações reais no banco. Cada ação
 * relevante é registrada em `admin_audit_logs` (RN-024): aprovar/rejeitar/
 * bloquear/desbloquear são auditados automaticamente por trigger; as demais
 * (editar membro, interesses) chamam a RPC `log_admin_action`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { ROLE_LABELS } from "./labels"
import type {
  AdminEvent,
  AdminInterest,
  AdminMember,
  AdminOpportunity,
  AuditAction,
  AuditLogEntry,
  EventInput,
  EventScheduleItem,
  EventStatus,
  MemberRole,
  MemberStatus,
  OccupationArea,
  OpportunityInput,
  OpportunityStatus,
  OpportunityType,
  SocialLink,
  CompanySector,
  CompanyType,
  CompanyReviewStatus,
} from "./types"

export interface CurrentUser {
  id: string
  name: string
  role: MemberRole
}

interface EditableMemberFields {
  displayName: string | null
  city: string
  state: string | null
  company: string | null
  position: string | null
  bio: string | null
}

interface InterestInput {
  name: string
  slug: string
  category: string
  active: boolean
}

interface AdminStore {
  currentUser: CurrentUser

  members: AdminMember[]
  interests: AdminInterest[]
  events: AdminEvent[]
  opportunities: AdminOpportunity[]
  logs: AuditLogEntry[]
  loading: boolean
  error: string | null
  clearError: () => void

  approveMember: (id: string) => void
  rejectMember: (id: string, reason?: string) => void
  blockMember: (id: string, reason?: string) => void
  unblockMember: (id: string) => void
  editMember: (id: string, patch: EditableMemberFields) => void
  changeMemberRole: (member: AdminMember, role: MemberRole) => void

  createInterest: (input: InterestInput) => void
  updateInterest: (id: string, input: InterestInput) => void
  toggleInterest: (id: string) => void

  approveCompany: (id: string) => void
  rejectCompany: (id: string) => void

  createEvent: (input: EventInput) => void
  updateEvent: (id: string, input: EventInput) => void

  createOpportunity: (input: OpportunityInput) => void
  updateOpportunity: (id: string, input: OpportunityInput) => void
}

// TEMP-QA-BYPASS-START: visual QA fixtures only, removed before finishing the task.
function qaDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}
const QA_FIXTURE_MEMBERS: AdminMember[] = [
  {
    id: "qa-1", profileId: "p1", fullName: "Maria Eduarda Lima", displayName: "Duda Lima", email: "a@a.com", phone: "88999990001",
    city: "Crato", state: "CE", bio: "Fundadora de agtech focada em irrigação inteligente no semiárido.", photoUrl: null,
    company: "Kariri Valley", position: "CEO", occupationAreas: ["founder", "empresario"], interests: ["agro", "impacto"],
    needs: ["Investimento"], offers: ["Mentoria"], socialLinks: [{ platform: "linkedin", url: "https://linkedin.com" }],
    status: "approved", role: "admin", isPublic: true, createdAt: qaDaysAgo(210),
    companyName: "AguaCerta", companyType: "startup", companyStage: "seed", companyCnpj: null, companyLogoUrl: null,
    companyProblem: null, companySector: "agro", companyReviewStatus: "approved",
  },
  {
    id: "qa-2", profileId: "p2", fullName: "João Pedro Nogueira", displayName: null, email: "b@b.com", phone: "88999990002",
    city: "Juazeiro do Norte", state: "CE", bio: "Dev full-stack.", photoUrl: null, company: "Freelancer", position: "Dev",
    occupationAreas: ["desenvolvedor"], interests: ["tecnologia"], needs: [], offers: ["Consultoria técnica"], socialLinks: [],
    status: "approved", role: "member", isPublic: true, createdAt: qaDaysAgo(175),
    companyName: null, companyType: null, companyStage: null, companyCnpj: null, companyLogoUrl: null,
    companyProblem: null, companySector: null, companyReviewStatus: null,
  },
  {
    id: "qa-3", profileId: "p3", fullName: "Ana Beatriz Sales", displayName: "Bia Sales", email: "c@c.com", phone: "88999990003",
    city: "Barbalha", state: "CE", bio: "Designer de produto.", photoUrl: null, company: "Estúdio Serra", position: "Design lead",
    occupationAreas: ["designer"], interests: ["design", "tecnologia"], needs: ["Networking"], offers: ["Design de produto"],
    socialLinks: [{ platform: "instagram", url: "https://instagram.com" }], status: "approved", role: "ambassador",
    isPublic: true, createdAt: qaDaysAgo(140),
    companyName: null, companyType: null, companyStage: null, companyCnpj: null, companyLogoUrl: null,
    companyProblem: null, companySector: null, companyReviewStatus: null,
  },
  {
    id: "qa-4", profileId: null, fullName: "Carlos Eduardo Farias", displayName: null, email: "d@d.com", phone: "88999990004",
    city: "Crato", state: "CE", bio: null, photoUrl: null, company: null, position: null, occupationAreas: ["investidor"],
    interests: [], needs: [], offers: [], socialLinks: [], status: "pending", role: "member", isPublic: true, createdAt: qaDaysAgo(2),
    companyName: null, companyType: null, companyStage: null, companyCnpj: null, companyLogoUrl: null,
    companyProblem: null, companySector: null, companyReviewStatus: null,
  },
  {
    id: "qa-5", profileId: null, fullName: "Fernanda Ribeiro Alves", displayName: "Fê Alves", email: "e@e.com", phone: "88999990005",
    city: "Missão Velha", state: "CE", bio: "Empreendedora de turismo rural.", photoUrl: null, company: null, position: null,
    occupationAreas: ["empresario"], interests: ["turismo"], needs: [], offers: [], socialLinks: [], status: "pending",
    role: "member", isPublic: true, createdAt: qaDaysAgo(1),
    companyName: "Trilhas do Cariri", companyType: "tradicional", companyStage: null, companyCnpj: null, companyLogoUrl: null,
    companyProblem: null, companySector: "turismo", companyReviewStatus: "pending",
  },
  {
    id: "qa-6", profileId: "p6", fullName: "Rafael Torres Costa", displayName: null, email: "f@f.com", phone: "88999990006",
    city: "Fortaleza", state: "CE", bio: "Investidor anjo em early-stage.", photoUrl: null, company: null, position: null,
    occupationAreas: ["investidor", "mentor"], interests: ["fintech"], needs: [], offers: ["Investimento anjo"], socialLinks: [],
    status: "approved", role: "member", isPublic: true, createdAt: qaDaysAgo(95),
    companyName: null, companyType: null, companyStage: null, companyCnpj: null, companyLogoUrl: null,
    companyProblem: null, companySector: null, companyReviewStatus: null,
  },
  {
    id: "qa-7", profileId: "p7", fullName: "Patrícia Gomes Melo", displayName: "Pat Melo", email: "g@g.com", phone: "88999990007",
    city: "Crato", state: "CE", bio: "Professora e pesquisadora em deep tech.", photoUrl: null, company: "UFCA",
    position: "Professora", occupationAreas: ["professor", "pesquisador"], interests: ["tecnologia", "educação"],
    needs: [], offers: ["Pesquisa aplicada"], socialLinks: [{ platform: "github", url: "https://github.com" }],
    status: "approved", role: "member", isPublic: true, createdAt: qaDaysAgo(60),
    companyName: null, companyType: null, companyStage: null, companyCnpj: null, companyLogoUrl: null,
    companyProblem: null, companySector: null, companyReviewStatus: null,
  },
  {
    id: "qa-8", profileId: "p8", fullName: "Diego Andrade Souza", displayName: null, email: "h@h.com", phone: "88999990008",
    city: "Juazeiro do Norte", state: "CE", bio: "Founder de startup de saúde digital.", photoUrl: null, company: "SaudeCariri",
    position: "CTO", occupationAreas: ["founder", "desenvolvedor"], interests: ["saude", "tecnologia"], needs: ["Investimento"],
    offers: [], socialLinks: [], status: "approved", role: "member", isPublic: true, createdAt: qaDaysAgo(28),
    companyName: "SaudeCariri", companyType: "startup", companyStage: "pre-seed", companyCnpj: null, companyLogoUrl: null,
    companyProblem: null, companySector: "saude", companyReviewStatus: "approved",
  },
  {
    id: "qa-9", profileId: null, fullName: "Lucas Martins Braga", displayName: null, email: "i@i.com", phone: "88999990009",
    city: "Barbalha", state: "CE", bio: "Estudante de ciência da computação.", photoUrl: null, company: null, position: null,
    occupationAreas: ["estudante"], interests: ["tecnologia"], needs: ["Mentoria"], offers: [], socialLinks: [], status: "blocked",
    role: "member", isPublic: false, createdAt: qaDaysAgo(50),
    companyName: null, companyType: null, companyStage: null, companyCnpj: null, companyLogoUrl: null,
    companyProblem: null, companySector: null, companyReviewStatus: null,
  },
  {
    id: "qa-10", profileId: null, fullName: "Vitória Cavalcante", displayName: null, email: "j@j.com", phone: "88999990010",
    city: "Crato", state: "CE", bio: null, photoUrl: null, company: null, position: null, occupationAreas: [],
    interests: [], needs: [], offers: [], socialLinks: [], status: "rejected", role: "member", isPublic: false,
    createdAt: qaDaysAgo(80),
    companyName: null, companyType: null, companyStage: null, companyCnpj: null, companyLogoUrl: null,
    companyProblem: null, companySector: null, companyReviewStatus: null,
  },
]
const QA_FIXTURE_INTERESTS: AdminInterest[] = [
  { id: "i1", name: "Tecnologia", slug: "tecnologia", category: "geral", active: true, memberCount: 4 },
  { id: "i2", name: "Agro", slug: "agro", category: "geral", active: true, memberCount: 1 },
  { id: "i3", name: "Turismo", slug: "turismo", category: "geral", active: true, memberCount: 1 },
  { id: "i4", name: "Fintech", slug: "fintech", category: "geral", active: true, memberCount: 1 },
  { id: "i5", name: "Design", slug: "design", category: "geral", active: true, memberCount: 1 },
]
// TEMP-QA-BYPASS-END

const AdminContext = createContext<AdminStore | null>(null)

const MEMBER_SELECT = `
  id, profile_id, full_name, display_name, email, phone, city, state, bio, photo_url,
  company, position, occupation_areas, status, is_public, created_at,
  company_name, company_type, company_stage, company_cnpj, company_logo_url, company_problem, company_sector, company_review_status,
  profile:profiles!profile_id(role),
  member_interests(interest:interests(slug)),
  member_needs(title, is_active),
  member_offers(title, is_active),
  member_social_links(platform, url)
`

interface MemberRow {
  id: string
  profile_id: string | null
  full_name: string
  display_name: string | null
  email: string
  phone: string | null
  city: string
  state: string | null
  bio: string | null
  photo_url: string | null
  company: string | null
  position: string | null
  occupation_areas: OccupationArea[] | null
  status: MemberStatus
  is_public: boolean
  created_at: string
  company_name: string | null
  company_type: CompanyType | null
  company_stage: string | null
  company_cnpj: string | null
  company_logo_url: string | null
  company_problem: string | null
  company_sector: CompanySector | null
  company_review_status: CompanyReviewStatus | null
  profile: { role: MemberRole } | null
  member_interests: { interest: { slug: string } | null }[] | null
  member_needs: { title: string; is_active: boolean }[] | null
  member_offers: { title: string; is_active: boolean }[] | null
  member_social_links: { platform: SocialLink["platform"]; url: string }[] | null
}

function mapMember(row: MemberRow): AdminMember {
  return {
    id: row.id,
    profileId: row.profile_id,
    fullName: row.full_name,
    displayName: row.display_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    state: row.state,
    bio: row.bio,
    photoUrl: row.photo_url,
    company: row.company,
    position: row.position,
    occupationAreas: row.occupation_areas ?? [],
    interests: (row.member_interests ?? [])
      .map((mi) => mi.interest?.slug)
      .filter((slug): slug is string => Boolean(slug)),
    needs: (row.member_needs ?? []).filter((n) => n.is_active).map((n) => n.title),
    offers: (row.member_offers ?? []).filter((o) => o.is_active).map((o) => o.title),
    socialLinks: (row.member_social_links ?? []).map((l) => ({ platform: l.platform, url: l.url })),
    status: row.status,
    role: row.profile?.role ?? "member",
    isPublic: row.is_public,
    createdAt: row.created_at,
    companyName: row.company_name,
    companyType: row.company_type,
    companyStage: row.company_stage,
    companyCnpj: row.company_cnpj,
    companyLogoUrl: row.company_logo_url,
    companyProblem: row.company_problem,
    companySector: row.company_sector,
    companyReviewStatus: row.company_review_status,
  }
}

interface InterestRow {
  id: string
  name: string
  slug: string
  category: string | null
  active: boolean
  member_interests: { count: number }[] | null
}

function mapInterest(row: InterestRow): AdminInterest {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category ?? "",
    active: row.active,
    memberCount: row.member_interests?.[0]?.count ?? 0,
  }
}

interface EventRow {
  id: string
  title: string
  description: string | null
  starts_at: string
  location: string | null
  capacity: number | null
  status: EventStatus
  is_public: boolean
  banner_url: string | null
  schedule_items: EventScheduleItem[] | null
  event_registrations: { count: number }[] | null
}

function mapEvent(row: EventRow): AdminEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    startsAt: row.starts_at,
    location: row.location ?? "",
    capacity: row.capacity,
    registrationsCount: row.event_registrations?.[0]?.count ?? 0,
    status: row.status,
    isPublic: row.is_public,
    bannerUrl: row.banner_url,
    scheduleItems: row.schedule_items ?? [],
  }
}

interface OpportunityRow {
  id: string
  title: string
  description: string | null
  opportunity_type: OpportunityType
  external_url: string
  deadline: string | null
  status: OpportunityStatus
}

function mapOpportunity(row: OpportunityRow): AdminOpportunity {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    type: row.opportunity_type,
    externalUrl: row.external_url,
    deadline: row.deadline,
    // opportunities.tags não existe no schema atual — reservado para fase futura.
    tags: [],
    status: row.status,
  }
}

interface LogRow {
  id: number
  action: string
  target_type: AuditLogEntry["targetType"]
  target_id: string | null
  details: Record<string, unknown> | null
  created_at: string
  admin: { full_name: string | null; role: MemberRole } | null
}

/** trg_members_log_status audita toda mudança de status com uma ação genérica; deriva a ação específica a partir de from/to. */
function memberStatusAction(from: unknown, to: unknown): AuditAction {
  if (to === "approved" && from === "blocked") return "unblock_member"
  if (to === "approved") return "approve_member"
  if (to === "rejected") return "reject_member"
  if (to === "blocked") return "block_member"
  return "edit_member"
}

function mapLog(row: LogRow): AuditLogEntry {
  const details = row.details ?? {}
  const isStatusChange = row.action === "member_status_change"
  const isRoleChange = row.action === "role_change"

  const action = isStatusChange
    ? memberStatusAction(details.from, details.to)
    : (row.action as AuditAction)

  const targetName = isStatusChange
    ? (details.member_slug as string | undefined) ?? row.target_id ?? "—"
    : (details.name as string | undefined) ?? row.target_id ?? "—"

  const reasonDetail = isRoleChange
    ? `${ROLE_LABELS[details.from as MemberRole] ?? details.from} → ${ROLE_LABELS[details.to as MemberRole] ?? details.to}`
    : typeof details.reason === "string"
      ? (details.reason as string)
      : undefined

  return {
    id: String(row.id),
    timestamp: row.created_at,
    actorName: row.admin?.full_name ?? "—",
    actorRole: row.admin?.role ?? "admin",
    action,
    targetType: row.target_type,
    targetName,
    details: reasonDetail,
  }
}

export function AdminProvider({
  children,
  currentUser,
}: {
  children: ReactNode
  currentUser: CurrentUser
}) {
  const [members, setMembers] = useState<AdminMember[]>([])
  const [interests, setInterests] = useState<AdminInterest[]>([])
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [opportunities, setOpportunities] = useState<AdminOpportunity[]>([])
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const fetchMembers = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    const { data, error: err } = await supabase
      .from("members")
      .select(MEMBER_SELECT)
      .order("created_at", { ascending: false })
    if (err) {
      setError(`Não foi possível carregar os membros: ${err.message}`)
      return
    }
    setMembers(((data ?? []) as unknown as MemberRow[]).map(mapMember))
  }, [])

  const fetchInterests = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    const { data, error: err } = await supabase
      .from("interests")
      .select("id, name, slug, category, active, member_interests(count)")
      .order("category", { ascending: true })
    if (err) {
      setError(`Não foi possível carregar os interesses: ${err.message}`)
      return
    }
    setInterests(((data ?? []) as unknown as InterestRow[]).map(mapInterest))
  }, [])

  const fetchEvents = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    const { data, error: err } = await supabase
      .from("events")
      .select(
        "id, title, description, starts_at, location, capacity, status, is_public, banner_url, schedule_items, event_registrations(count)"
      )
      .order("starts_at", { ascending: false })
    if (err) {
      setError(`Não foi possível carregar os eventos: ${err.message}`)
      return
    }
    setEvents(((data ?? []) as unknown as EventRow[]).map(mapEvent))
  }, [])

  const fetchOpportunities = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    const { data, error: err } = await supabase
      .from("opportunities")
      .select("id, title, description, opportunity_type, external_url, deadline, status")
      .order("created_at", { ascending: false })
    if (err) {
      setError(`Não foi possível carregar as oportunidades: ${err.message}`)
      return
    }
    setOpportunities(((data ?? []) as unknown as OpportunityRow[]).map(mapOpportunity))
  }, [])

  const fetchLogs = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    const { data, error: err } = await supabase
      .from("admin_audit_logs")
      .select(
        "id, action, target_type, target_id, details, created_at, admin:profiles!admin_id(full_name, role)"
      )
      .order("created_at", { ascending: false })
      .limit(200)
    if (err) {
      setError(`Não foi possível carregar o log de auditoria: ${err.message}`)
      return
    }
    setLogs(((data ?? []) as unknown as LogRow[]).map(mapLog))
  }, [])

  useEffect(() => {
    // TEMP-QA-BYPASS: visual QA only, reverted before finishing the task.
    if (typeof window !== "undefined" && window.location.search.includes("qaEmpty")) {
      setMembers([])
      setInterests([])
      setLoading(false)
      return
    }
    if (typeof window !== "undefined" && window.location.search.includes("qaFixture")) {
      setMembers(QA_FIXTURE_MEMBERS)
      setInterests(QA_FIXTURE_INTERESTS)
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([fetchMembers(), fetchInterests(), fetchEvents(), fetchOpportunities(), fetchLogs()]).finally(
      () => setLoading(false)
    )
  }, [fetchMembers, fetchInterests, fetchEvents, fetchOpportunities, fetchLogs])

  const setMemberStatus = useCallback(
    async (id: string, status: MemberStatus, auditAction?: AuditAction, reason?: string) => {
      const supabase = getSupabaseBrowserClient()
      const { error: err } = await supabase.from("members").update({ status }).eq("id", id)
      if (err) {
        setError(`Não foi possível atualizar o status do membro: ${err.message}`)
        return
      }
      // O trigger já audita a mudança de status; a RPC guarda o motivo digitado à parte.
      if (reason && auditAction) {
        await supabase.rpc("log_admin_action", {
          p_action: auditAction,
          p_target_type: "member",
          p_target_id: id,
          p_details: { reason },
        })
      }
      await Promise.all([fetchMembers(), fetchLogs()])
    },
    [fetchMembers, fetchLogs]
  )

  const approveMember = useCallback(
    (id: string) => void setMemberStatus(id, "approved"),
    [setMemberStatus]
  )
  const rejectMember = useCallback(
    (id: string, reason?: string) => void setMemberStatus(id, "rejected", "reject_member", reason),
    [setMemberStatus]
  )
  const blockMember = useCallback(
    (id: string, reason?: string) => void setMemberStatus(id, "blocked", "block_member", reason),
    [setMemberStatus]
  )
  const unblockMember = useCallback(
    (id: string) => void setMemberStatus(id, "approved"),
    [setMemberStatus]
  )

  const editMember = useCallback(
    (id: string, patch: EditableMemberFields) => {
      void (async () => {
        const supabase = getSupabaseBrowserClient()
        const { error: err } = await supabase
          .from("members")
          .update({
            display_name: patch.displayName,
            city: patch.city,
            state: patch.state,
            company: patch.company,
            position: patch.position,
            bio: patch.bio,
          })
          .eq("id", id)
        if (err) {
          setError(`Não foi possível salvar as alterações: ${err.message}`)
          return
        }
        await supabase.rpc("log_admin_action", {
          p_action: "edit_member",
          p_target_type: "member",
          p_target_id: id,
          p_details: { name: patch.displayName },
        })
        await Promise.all([fetchMembers(), fetchLogs()])
      })()
    },
    [fetchMembers, fetchLogs]
  )

  /** profiles.role fica fora de members — precisa do profile_id (conta ativada). */
  const changeMemberRole = useCallback(
    (member: AdminMember, role: MemberRole) => {
      void (async () => {
        if (!member.profileId) {
          setError("Este membro ainda não ativou a conta — não é possível alterar o papel.")
          return
        }
        const supabase = getSupabaseBrowserClient()
        const { error: err } = await supabase
          .from("profiles")
          .update({ role })
          .eq("id", member.profileId)
        if (err) {
          setError(`Não foi possível alterar o papel: ${err.message}`)
          return
        }
        await Promise.all([fetchMembers(), fetchLogs()])
      })()
    },
    [fetchMembers, fetchLogs]
  )

  const setCompanyReviewStatus = useCallback(
    (id: string, status: CompanyReviewStatus, action: "approve_company" | "reject_company") => {
      void (async () => {
        const supabase = getSupabaseBrowserClient()
        const { error: err } = await supabase
          .from("members")
          .update({ company_review_status: status })
          .eq("id", id)
        if (err) {
          setError(`Não foi possível atualizar a empresa: ${err.message}`)
          return
        }
        await supabase.rpc("log_admin_action", {
          p_action: action,
          p_target_type: "member",
          p_target_id: id,
          p_details: {},
        })
        await Promise.all([fetchMembers(), fetchLogs()])
      })()
    },
    [fetchMembers, fetchLogs]
  )

  const approveCompany = useCallback(
    (id: string) => setCompanyReviewStatus(id, "approved", "approve_company"),
    [setCompanyReviewStatus]
  )
  const rejectCompany = useCallback(
    (id: string) => setCompanyReviewStatus(id, "rejected", "reject_company"),
    [setCompanyReviewStatus]
  )

  /**
   * event_type e format são NOT NULL sem default no banco (schema aplicado
   * fora do escopo deste form). Como o formulário não expõe esses campos,
   * gravamos valores neutros fixos para satisfazer a constraint.
   */
  const EVENT_DEFAULT_TYPE = "comunidade"
  const EVENT_DEFAULT_FORMAT = "presencial"

  const createEvent = useCallback(
    (input: EventInput) => {
      void (async () => {
        const supabase = getSupabaseBrowserClient()
        const { error: err } = await supabase.from("events").insert({
          title: input.title,
          description: input.description || null,
          starts_at: input.startsAt,
          location: input.location || null,
          capacity: input.capacity,
          status: input.status,
          is_public: input.isPublic,
          banner_url: input.bannerUrl,
          schedule_items: input.scheduleItems,
          event_type: EVENT_DEFAULT_TYPE,
          format: EVENT_DEFAULT_FORMAT,
          created_by: currentUser.id,
          updated_by: currentUser.id,
        })
        if (err) {
          setError(`Não foi possível criar o evento: ${err.message}`)
          return
        }
        await fetchEvents()
      })()
    },
    [fetchEvents, currentUser.id]
  )

  const updateEvent = useCallback(
    (id: string, input: EventInput) => {
      void (async () => {
        const supabase = getSupabaseBrowserClient()
        const { error: err } = await supabase
          .from("events")
          .update({
            title: input.title,
            description: input.description || null,
            starts_at: input.startsAt,
            location: input.location || null,
            capacity: input.capacity,
            status: input.status,
            is_public: input.isPublic,
            banner_url: input.bannerUrl,
            schedule_items: input.scheduleItems,
            updated_by: currentUser.id,
          })
          .eq("id", id)
        if (err) {
          setError(`Não foi possível salvar o evento: ${err.message}`)
          return
        }
        await fetchEvents()
      })()
    },
    [fetchEvents, currentUser.id]
  )

  const createOpportunity = useCallback(
    (input: OpportunityInput) => {
      void (async () => {
        const supabase = getSupabaseBrowserClient()
        const { error: err } = await supabase.from("opportunities").insert({
          title: input.title,
          description: input.description || null,
          opportunity_type: input.type,
          external_url: input.externalUrl,
          deadline: input.deadline,
          status: input.status,
          created_by: currentUser.id,
          updated_by: currentUser.id,
        })
        if (err) {
          setError(`Não foi possível criar a oportunidade: ${err.message}`)
          return
        }
        await fetchOpportunities()
      })()
    },
    [fetchOpportunities, currentUser.id]
  )

  const updateOpportunity = useCallback(
    (id: string, input: OpportunityInput) => {
      void (async () => {
        const supabase = getSupabaseBrowserClient()
        const { error: err } = await supabase
          .from("opportunities")
          .update({
            title: input.title,
            description: input.description || null,
            opportunity_type: input.type,
            external_url: input.externalUrl,
            deadline: input.deadline,
            status: input.status,
            updated_by: currentUser.id,
          })
          .eq("id", id)
        if (err) {
          setError(`Não foi possível salvar a oportunidade: ${err.message}`)
          return
        }
        await fetchOpportunities()
      })()
    },
    [fetchOpportunities, currentUser.id]
  )

  const createInterest = useCallback(
    (input: InterestInput) => {
      void (async () => {
        const supabase = getSupabaseBrowserClient()
        const { data, error: err } = await supabase
          .from("interests")
          .insert({ name: input.name, slug: input.slug, category: input.category, active: input.active })
          .select("id")
          .single()
        if (err) {
          setError(`Não foi possível criar o interesse: ${err.message}`)
          return
        }
        await supabase.rpc("log_admin_action", {
          p_action: "create_interest",
          p_target_type: "interest",
          p_target_id: (data as { id: string } | null)?.id ?? null,
          p_details: { name: input.name },
        })
        await Promise.all([fetchInterests(), fetchLogs()])
      })()
    },
    [fetchInterests, fetchLogs]
  )

  const updateInterest = useCallback(
    (id: string, input: InterestInput) => {
      void (async () => {
        const supabase = getSupabaseBrowserClient()
        const { error: err } = await supabase
          .from("interests")
          .update({ name: input.name, slug: input.slug, category: input.category, active: input.active })
          .eq("id", id)
        if (err) {
          setError(`Não foi possível salvar o interesse: ${err.message}`)
          return
        }
        await supabase.rpc("log_admin_action", {
          p_action: "update_interest",
          p_target_type: "interest",
          p_target_id: id,
          p_details: { name: input.name },
        })
        await Promise.all([fetchInterests(), fetchLogs()])
      })()
    },
    [fetchInterests, fetchLogs]
  )

  const toggleInterest = useCallback(
    (id: string) => {
      void (async () => {
        const target = interests.find((i) => i.id === id)
        if (!target) return
        const supabase = getSupabaseBrowserClient()
        const { error: err } = await supabase
          .from("interests")
          .update({ active: !target.active })
          .eq("id", id)
        if (err) {
          setError(`Não foi possível alterar o interesse: ${err.message}`)
          return
        }
        await supabase.rpc("log_admin_action", {
          p_action: "toggle_interest",
          p_target_type: "interest",
          p_target_id: id,
          p_details: { name: target.name },
        })
        await Promise.all([fetchInterests(), fetchLogs()])
      })()
    },
    [interests, fetchInterests, fetchLogs]
  )

  const value = useMemo<AdminStore>(
    () => ({
      currentUser,
      members,
      interests,
      events,
      opportunities,
      logs,
      loading,
      error,
      clearError,
      approveMember,
      rejectMember,
      blockMember,
      unblockMember,
      editMember,
      changeMemberRole,
      createInterest,
      updateInterest,
      toggleInterest,
      approveCompany,
      rejectCompany,
      createEvent,
      updateEvent,
      createOpportunity,
      updateOpportunity,
    }),
    [
      currentUser,
      members,
      interests,
      events,
      opportunities,
      logs,
      loading,
      error,
      clearError,
      approveMember,
      rejectMember,
      blockMember,
      unblockMember,
      editMember,
      changeMemberRole,
      createInterest,
      updateInterest,
      toggleInterest,
      approveCompany,
      rejectCompany,
      createEvent,
      updateEvent,
      createOpportunity,
      updateOpportunity,
    ]
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin(): AdminStore {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin deve ser usado dentro de <AdminProvider>")
  return ctx
}
