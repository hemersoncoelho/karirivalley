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
import type {
  AdminEvent,
  AdminInterest,
  AdminMember,
  AdminOpportunity,
  AuditAction,
  AuditLogEntry,
  EventStatus,
  MemberRole,
  MemberStatus,
  OccupationArea,
  OpportunityStatus,
  OpportunityType,
  SocialLink,
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

  createInterest: (input: InterestInput) => void
  updateInterest: (id: string, input: InterestInput) => void
  toggleInterest: (id: string) => void
}

const AdminContext = createContext<AdminStore | null>(null)

const MEMBER_SELECT = `
  id, profile_id, full_name, display_name, email, phone, city, state, bio, photo_url,
  company, position, occupation_areas, status, is_public, created_at,
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
  event_date: string
  location: string | null
  capacity: number | null
  status: EventStatus
  event_registrations: { count: number }[] | null
}

function mapEvent(row: EventRow): AdminEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    startsAt: row.event_date,
    location: row.location ?? "",
    capacity: row.capacity,
    registrationsCount: row.event_registrations?.[0]?.count ?? 0,
    status: row.status,
  }
}

interface OpportunityRow {
  id: string
  title: string
  description: string | null
  category: OpportunityType
  deadline: string | null
  status: OpportunityStatus
  tags: string[] | null
}

function mapOpportunity(row: OpportunityRow): AdminOpportunity {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    type: row.category,
    deadline: row.deadline,
    tags: row.tags ?? [],
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

  const action = isStatusChange
    ? memberStatusAction(details.from, details.to)
    : (row.action as AuditAction)

  const targetName = isStatusChange
    ? (details.member_slug as string | undefined) ?? row.target_id ?? "—"
    : (details.name as string | undefined) ?? row.target_id ?? "—"

  const reasonDetail = typeof details.reason === "string" ? (details.reason as string) : undefined

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
        "id, title, description, event_date, location, capacity, status, event_registrations(count)"
      )
      .order("event_date", { ascending: false })
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
      .select("id, title, description, category, deadline, status, tags")
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
      createInterest,
      updateInterest,
      toggleInterest,
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
      createInterest,
      updateInterest,
      toggleInterest,
    ]
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin(): AdminStore {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin deve ser usado dentro de <AdminProvider>")
  return ctx
}
