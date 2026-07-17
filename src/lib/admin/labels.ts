import type {
  EventStatus,
  MemberRole,
  MemberStatus,
  OccupationArea,
  OpportunityStatus,
  OpportunityType,
  AuditAction,
} from "./types"

export const STATUS_LABELS: Record<MemberStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  blocked: "Bloqueado",
  rejected: "Rejeitado",
}

/** Tom visual de cada status (mapeado para classes utilitárias). */
export const STATUS_TONE: Record<MemberStatus, "amber" | "teal" | "red" | "gray"> = {
  pending: "amber",
  approved: "teal",
  blocked: "red",
  rejected: "gray",
}

export const ROLE_LABELS: Record<MemberRole, string> = {
  member: "Membro",
  curator: "Curador",
  admin: "Administrador",
}

export const OCCUPATION_LABELS: Record<OccupationArea, string> = {
  founder: "Founder",
  estudante: "Estudante",
  desenvolvedor: "Desenvolvedor(a)",
  designer: "Designer",
  marketing_vendas: "Marketing/Vendas",
  pesquisador: "Pesquisador(a)",
  professor: "Professor(a)",
  investidor: "Investidor(a)",
  empresario: "Empresário(a)",
  mentor: "Mentor(a)",
  parceiro_institucional: "Parceiro institucional",
  interessado_inovacao: "Interessado em inovação",
}

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  past: "Encerrado",
}

export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStatus, string> = {
  draft: "Rascunho",
  open: "Aberta",
  closed: "Encerrada",
}

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  edital: "Edital",
  vaga: "Vaga",
  mentoria: "Mentoria",
  investimento: "Investimento",
  parceria: "Parceria",
}

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  approve_member: "Aprovou membro",
  reject_member: "Rejeitou membro",
  block_member: "Bloqueou membro",
  unblock_member: "Desbloqueou membro",
  edit_member: "Editou membro",
  create_interest: "Criou interesse",
  update_interest: "Editou interesse",
  toggle_interest: "Ativou/desativou interesse",
}

export function occupationLabel(value: string): string {
  return OCCUPATION_LABELS[value as OccupationArea] ?? value
}

/** Formata data ISO para pt-BR (curto). */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/** Formata data+hora ISO para pt-BR. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
