import { CalendarX2 } from "lucide-react"

import { fetchUpcomingEvents } from "@/lib/members/events"
import { EmptyState } from "@/components/member/EmptyState"

function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export default async function EventosPage() {
  const events = await fetchUpcomingEvents()

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#F4EDDF]">Eventos</h1>
      <p className="mt-1 text-sm text-[#F4EDDF]/50">Próximos encontros da comunidade Kariri Valley.</p>

      <div className="mt-6">
        {events.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="Nenhum evento publicado ainda"
            description="Em breve, novos encontros da comunidade serão divulgados por aqui."
          />
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs font-medium text-[#239D8C] capitalize">{formatEventDate(event.event_date)}</p>
                <p className="mt-1.5 text-base font-semibold text-[#F4EDDF]">{event.title}</p>
                {event.description && <p className="mt-1.5 text-sm text-[#F4EDDF]/55">{event.description}</p>}
                {event.location && <p className="mt-2 text-xs text-[#F4EDDF]/40">{event.location}</p>}
                {event.external_url && (
                  <a
                    href={event.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs font-medium text-[#E9B23C] underline underline-offset-4"
                  >
                    Mais informações
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
