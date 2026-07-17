"use client"

/**
 * Store do painel administrativo.
 *
 * Mantém em memória (client-side) os dados de demonstração e expõe as ações de
 * moderação. Cada ação relevante registra uma entrada no log de auditoria
 * (RN-024). Quando o acesso ao Supabase estiver disponível, basta trocar os
 * corpos das funções por chamadas ao banco mantendo a mesma assinatura.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  MOCK_EVENTS,
  MOCK_INTERESTS,
  MOCK_LOGS,
  MOCK_MEMBERS,
  MOCK_OPPORTUNITIES,
} from "./mock-data"
import type {
  AdminEvent,
  AdminInterest,
  AdminMember,
  AdminOpportunity,
  AuditAction,
  AuditLogEntry,
  MemberRole,
  MemberStatus,
} from "./types"

interface CurrentUser {
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
  setRole: (role: MemberRole) => void

  members: AdminMember[]
  interests: AdminInterest[]
  events: AdminEvent[]
  opportunities: AdminOpportunity[]
  logs: AuditLogEntry[]

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

const INITIAL_USER: CurrentUser = { id: "m-001", name: "Ana Alencar", role: "admin" }

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(INITIAL_USER)
  const [members, setMembers] = useState<AdminMember[]>(MOCK_MEMBERS)
  const [interests, setInterests] = useState<AdminInterest[]>(MOCK_INTERESTS)
  const [events] = useState<AdminEvent[]>(MOCK_EVENTS)
  const [opportunities] = useState<AdminOpportunity[]>(MOCK_OPPORTUNITIES)
  const [logs, setLogs] = useState<AuditLogEntry[]>(MOCK_LOGS)

  const addLog = useCallback(
    (
      action: AuditAction,
      targetType: AuditLogEntry["targetType"],
      targetName: string,
      details?: string
    ) => {
      setLogs((prev) => [
        {
          id: uid("l"),
          timestamp: new Date().toISOString(),
          actorName: currentUser.name,
          actorRole: currentUser.role,
          action,
          targetType,
          targetName,
          details,
        },
        ...prev,
      ])
    },
    [currentUser]
  )

  const setStatus = useCallback(
    (id: string, status: MemberStatus, action: AuditAction, reason?: string) => {
      setMembers((prev) => {
        const target = prev.find((m) => m.id === id)
        if (target) addLog(action, "member", target.displayName || target.fullName, reason)
        return prev.map((m) =>
          m.id === id
            ? { ...m, status, isPublic: status === "approved" ? m.isPublic : false }
            : m
        )
      })
    },
    [addLog]
  )

  const approveMember = useCallback(
    (id: string) => setStatus(id, "approved", "approve_member"),
    [setStatus]
  )
  const rejectMember = useCallback(
    (id: string, reason?: string) => setStatus(id, "rejected", "reject_member", reason),
    [setStatus]
  )
  const blockMember = useCallback(
    (id: string, reason?: string) => setStatus(id, "blocked", "block_member", reason),
    [setStatus]
  )
  const unblockMember = useCallback(
    (id: string) => setStatus(id, "approved", "unblock_member"),
    [setStatus]
  )

  const editMember = useCallback(
    (id: string, patch: EditableMemberFields) => {
      setMembers((prev) => {
        const target = prev.find((m) => m.id === id)
        if (target) addLog("edit_member", "member", target.displayName || target.fullName)
        return prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
      })
    },
    [addLog]
  )

  const createInterest = useCallback(
    (input: InterestInput) => {
      setInterests((prev) => [
        ...prev,
        { id: uid("i"), memberCount: 0, ...input },
      ])
      addLog("create_interest", "interest", input.name)
    },
    [addLog]
  )

  const updateInterest = useCallback(
    (id: string, input: InterestInput) => {
      setInterests((prev) => prev.map((i) => (i.id === id ? { ...i, ...input } : i)))
      addLog("update_interest", "interest", input.name)
    },
    [addLog]
  )

  const toggleInterest = useCallback(
    (id: string) => {
      setInterests((prev) => {
        const target = prev.find((i) => i.id === id)
        if (target) addLog("toggle_interest", "interest", target.name)
        return prev.map((i) => (i.id === id ? { ...i, active: !i.active } : i))
      })
    },
    [addLog]
  )

  const value = useMemo<AdminStore>(
    () => ({
      currentUser,
      setRole: (role) => setCurrentUser((u) => ({ ...u, role })),
      members,
      interests,
      events,
      opportunities,
      logs,
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
