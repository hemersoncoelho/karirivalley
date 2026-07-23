import Link from "next/link"
import { CalendarX2, SearchX, UserPlus2, Users } from "lucide-react"

import { getCurrentMember } from "@/lib/members/current-member"
import { fetchProfileBundle } from "@/lib/members/profile-bundle"
import { computeProfileCompleteness } from "@/lib/members/completeness"
import { fetchRecommendedMembers } from "@/lib/members/directory"
import { fetchUpcomingEvents } from "@/lib/members/events"
import { fetchOpportunities } from "@/lib/members/opportunities"
import { MemberCard } from "@/components/member/MemberCard"
import { EmptyState } from "@/components/member/EmptyState"
import { KaririMark } from "@/components/ui/KaririMark"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-semibold text-[#F4EDDF]">
      <KaririMark size={14} />
      {children}
    </h2>
  )
}

function formatMemberSince(approvedAt: string | null): string | null {
  if (!approvedAt) return null
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(approvedAt))
}

function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(
    new Date(value)
  )
}

export default async function DashboardPage() {
  const { member } = await getCurrentMember()
  if (!member) return null // guardado pelo layout — nunca acontece na prática

  const [bundle, recommended, events, opportunities] = await Promise.all([
    fetchProfileBundle(member.id),
    fetchRecommendedMembers(member.id),
    fetchUpcomingEvents(3),
    fetchOpportunities(3),
  ])

  const completeness = computeProfileCompleteness({ member, bundle })
  const firstName = (member.display_name || member.full_name).split(" ")[0]
  const memberSince = formatMemberSince(member.approved_at)

  return (
    <div className="space-y-8">
      <div className="kv-fade-in-up flex items-center gap-3">
        <KaririMark size={28} />
        <div>
          <h1 className="text-2xl font-semibold text-[#F4EDDF]">Olá, {firstName}!</h1>
          {memberSince && <p className="mt-1 text-sm text-[#F4EDDF]/50">Membro desde {memberSince}</p>}
        </div>
      </div>

      <section
        className="kv-fade-in-up rounded-2xl border border-white/8 bg-white/[0.03] p-6"
        style={{ animationDelay: ".05s" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#F4EDDF]">Completude do perfil</p>
            {completeness.nextStepLabel && (
              <p className="mt-1 text-xs text-[#F4EDDF]/50">{completeness.nextStepLabel}</p>
            )}
          </div>
          <span className="text-lg font-semibold text-[#E9B23C]">{completeness.percent}%</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#E0715A] via-[#E9B23C] to-[#239D8C] transition-[width] duration-700"
            style={{ width: `${completeness.percent}%` }}
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/perfil/editar"
            className="rounded-xl bg-[#E9B23C] px-5 py-2.5 text-sm font-semibold text-[#2C2221] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f0c05a] hover:shadow-[0_12px_32px_rgba(233,178,60,.35)]"
          >
            Editar perfil
          </Link>
          <Link
            href="/comunidade/indicar"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-[#F4EDDF]/80 transition hover:border-white/30 hover:bg-white/5"
          >
            <UserPlus2 size={15} /> Indicar novo membro
          </Link>
        </div>
      </section>

      <section className="kv-fade-in-up" style={{ animationDelay: ".1s" }}>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Próximos eventos</SectionTitle>
          <Link href="/eventos" className="text-xs font-medium text-[#F4EDDF]/50 hover:text-[#F4EDDF]">
            Ver todos
          </Link>
        </div>
        {events.length === 0 ? (
          <EmptyState icon={CalendarX2} title="Nenhum evento publicado ainda" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <p className="text-xs font-medium text-[#239D8C]">{formatEventDate(event.event_date)}</p>
                <p className="mt-1.5 text-sm font-semibold text-[#F4EDDF]">{event.title}</p>
                {event.location && <p className="mt-1 text-xs text-[#F4EDDF]/45">{event.location}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="kv-fade-in-up" style={{ animationDelay: ".15s" }}>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Membros recomendados</SectionTitle>
          <Link href="/comunidade" className="text-xs font-medium text-[#F4EDDF]/50 hover:text-[#F4EDDF]">
            Ver diretório
          </Link>
        </div>
        {recommended.length === 0 ? (
          <EmptyState icon={Users} title="Ainda não há outros membros para recomendar" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((rec) => (
              <MemberCard key={rec.id} member={rec} />
            ))}
          </div>
        )}
      </section>

      <section className="kv-fade-in-up" style={{ animationDelay: ".2s" }}>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Oportunidades em destaque</SectionTitle>
          <Link href="/oportunidades" className="text-xs font-medium text-[#F4EDDF]/50 hover:text-[#F4EDDF]">
            Ver todas
          </Link>
        </div>
        {opportunities.length === 0 ? (
          <EmptyState icon={SearchX} title="Nenhuma oportunidade publicada no momento" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <p className="text-xs font-medium text-[#E9B23C] capitalize">{opp.category}</p>
                <p className="mt-1.5 text-sm font-semibold text-[#F4EDDF]">{opp.title}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
