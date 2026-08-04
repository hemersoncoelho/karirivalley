import { occupationLabel, sectorLabel, OPPORTUNITY_TYPE_LABELS } from "./labels"
import type {
  AdminEvent,
  AdminInterest,
  AdminMember,
  AdminOpportunity,
  DashboardMetrics,
  EventStats,
  GrowthPoint,
  OpportunityStats,
  RankedItem,
} from "./types"

/** Quantidade de meses exibidos na série de crescimento do dashboard. */
const GROWTH_WINDOW_MONTHS = 6

/** Rótulo do mês corrente (ex.: "julho de 2026"), usado no KPI de novos membros. */
export const CURRENT_MONTH_LABEL = new Date().toLocaleDateString("pt-BR", {
  month: "long",
  year: "numeric",
})

/** Campos considerados no cálculo de completude do perfil. */
const COMPLETENESS_FIELDS: Array<(m: AdminMember) => boolean> = [
  (m) => Boolean(m.displayName),
  (m) => Boolean(m.bio),
  (m) => Boolean(m.photoUrl),
  (m) => Boolean(m.city),
  (m) => Boolean(m.company),
  (m) => Boolean(m.position),
  (m) => m.occupationAreas.length > 0,
  (m) => m.interests.length > 0,
  (m) => m.needs.length > 0,
  (m) => m.offers.length > 0,
  (m) => m.socialLinks.length > 0,
]

/** Percentual de completude do perfil (0–100). */
export function profileCompleteness(member: AdminMember): number {
  const filled = COMPLETENESS_FIELDS.reduce((acc, test) => acc + (test(member) ? 1 : 0), 0)
  return Math.round((filled / COMPLETENESS_FIELDS.length) * 100)
}

/** Perfil é considerado incompleto abaixo deste limiar. */
export const COMPLETENESS_THRESHOLD = 70

export function isIncomplete(member: AdminMember): boolean {
  return profileCompleteness(member) < COMPLETENESS_THRESHOLD
}

function rank(counts: Map<string, number>, limit = 5): RankedItem[] {
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
}

function isSameMonth(iso: string, ref: Date): boolean {
  const d = new Date(iso)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}

/** Dias da semana em pt-BR, começando na segunda (convenção de calendário no Brasil). */
const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
/** Índices de Date.getDay() (0=domingo) na ordem de exibição acima. */
const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

/** Cadastros por dia da semana — derivado de members.created_at, sem recorte de status. */
function computeWeekdaySignups(members: AdminMember[]): RankedItem[] {
  const counts = new Array(7).fill(0)
  for (const m of members) counts[new Date(m.createdAt).getDay()]++
  return WEEKDAY_ORDER.map((dayIndex, i) => ({ label: WEEKDAY_LABELS[i], value: counts[dayIndex] }))
}

const COMPLETENESS_BUCKETS = [
  { label: "0–20%", min: 0, max: 20 },
  { label: "21–40%", min: 21, max: 40 },
  { label: "41–60%", min: 41, max: 60 },
  { label: "61–80%", min: 61, max: 80 },
  { label: "81–100%", min: 81, max: 100 },
]

/** Distribuição de completude de perfil entre membros aprovados, em faixas de 20%. */
function computeCompletenessHistogram(members: AdminMember[]): RankedItem[] {
  const approved = members.filter((m) => m.status === "approved")
  const counts = COMPLETENESS_BUCKETS.map(() => 0)
  for (const m of approved) {
    const pct = profileCompleteness(m)
    const bucketIndex = COMPLETENESS_BUCKETS.findIndex((b) => pct >= b.min && pct <= b.max)
    if (bucketIndex >= 0) counts[bucketIndex]++
  }
  return COMPLETENESS_BUCKETS.map((b, i) => ({ label: b.label, value: counts[i] }))
}

/**
 * Série de crescimento acumulado de membros nos últimos `months` meses,
 * derivada exclusivamente de `members[].createdAt` — sem dados fictícios.
 */
export function computeGrowthSeries(
  members: AdminMember[],
  months: number = GROWTH_WINDOW_MONTHS
): GrowthPoint[] {
  const ref = new Date()
  const windowStart = new Date(ref.getFullYear(), ref.getMonth() - (months - 1), 1)
  const baseline = members.filter((m) => new Date(m.createdAt) < windowStart).length

  let running = baseline
  return Array.from({ length: months }, (_, i) => {
    const monthDate = new Date(ref.getFullYear(), ref.getMonth() - (months - 1 - i), 1)
    const newCount = members.filter((m) => isSameMonth(m.createdAt, monthDate)).length
    running += newCount
    const label = monthDate.toLocaleDateString("pt-BR", { month: "short" }).replace(/\.$/, "")
    return { label, total: running, newCount }
  })
}

export function computeMetrics(
  members: AdminMember[],
  interests: AdminInterest[]
): DashboardMetrics {
  const ref = new Date()
  const cities = new Map<string, number>()
  const profiles = new Map<string, number>()
  const sectors = new Map<string, number>()

  let pending = 0
  let approved = 0
  let blocked = 0
  let rejected = 0
  let newThisMonth = 0
  let incomplete = 0
  let companiesCount = 0
  let pendingCompaniesCount = 0

  for (const m of members) {
    if (m.status === "pending") pending++
    else if (m.status === "approved") approved++
    else if (m.status === "blocked") blocked++
    else if (m.status === "rejected") rejected++

    if (isSameMonth(m.createdAt, ref)) newThisMonth++
    if (isIncomplete(m)) incomplete++

    cities.set(m.city, (cities.get(m.city) ?? 0) + 1)
    for (const area of m.occupationAreas) {
      const label = occupationLabel(area)
      profiles.set(label, (profiles.get(label) ?? 0) + 1)
    }

    if (m.companyName) {
      companiesCount++
      if (m.companyReviewStatus === "pending") pendingCompaniesCount++
      if (m.companySector) {
        const label = sectorLabel(m.companySector)
        sectors.set(label, (sectors.get(label) ?? 0) + 1)
      }
    }
  }

  const topInterests = interests
    .filter((i) => i.memberCount > 0)
    .map((i) => ({ label: i.name, value: i.memberCount }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  return {
    total: members.length,
    pending,
    approved,
    blocked,
    rejected,
    newThisMonth,
    incomplete,
    topCities: rank(cities),
    topInterests,
    topProfiles: rank(profiles),
    companiesCount,
    pendingCompaniesCount,
    topSectors: rank(sectors),
    growthSeries: computeGrowthSeries(members),
    weekdaySignups: computeWeekdaySignups(members),
    completenessHistogram: computeCompletenessHistogram(members),
  }
}

/** Métricas agregadas da seção de eventos (fase futura — estrutura visual). */
export function computeEventStats(events: AdminEvent[]): EventStats {
  const topByRegistrations = events
    .slice()
    .sort((a, b) => b.registrationsCount - a.registrationsCount)
    .slice(0, 5)
    .map((e) => ({ label: e.title, value: e.registrationsCount }))

  return {
    total: events.length,
    published: events.filter((e) => e.status === "published").length,
    draft: events.filter((e) => e.status === "draft").length,
    past: events.filter((e) => e.status === "finished").length,
    totalRegistrations: events.reduce((acc, e) => acc + e.registrationsCount, 0),
    topByRegistrations,
  }
}

/** Métricas agregadas da seção de oportunidades (fase futura — estrutura visual). */
export function computeOpportunityStats(opportunities: AdminOpportunity[]): OpportunityStats {
  const byTypeCounts = new Map<string, number>()
  for (const o of opportunities) {
    const label = OPPORTUNITY_TYPE_LABELS[o.type]
    byTypeCounts.set(label, (byTypeCounts.get(label) ?? 0) + 1)
  }

  return {
    total: opportunities.length,
    open: opportunities.filter((o) => o.status === "published").length,
    draft: opportunities.filter((o) => o.status === "draft").length,
    closed: opportunities.filter((o) => o.status === "archived").length,
    byType: rank(byTypeCounts),
  }
}
