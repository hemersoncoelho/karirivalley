import { occupationLabel } from "./labels"
import type { AdminInterest, AdminMember, DashboardMetrics, RankedItem } from "./types"

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

export function computeMetrics(
  members: AdminMember[],
  interests: AdminInterest[]
): DashboardMetrics {
  const ref = new Date()
  const cities = new Map<string, number>()
  const profiles = new Map<string, number>()

  let pending = 0
  let approved = 0
  let blocked = 0
  let rejected = 0
  let newThisMonth = 0
  let incomplete = 0

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
  }
}
