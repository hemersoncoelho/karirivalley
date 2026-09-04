import { CalendarX2 } from "lucide-react"

import { fetchUpcomingEvents } from "@/lib/members/events"
import { EmptyState } from "@/components/member/EmptyState"
import { LinkifiedText } from "@/components/ui/linkified-text"
import { ShareButton } from "@/components/ui/share-button"

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
      <h1 className="text-xl font-semibold text-[var(--kv-cream)]">Eventos</h1>
      <p className="mt-1 text-sm text-[var(--kv-cream)]/50">Próximos encontros da comunidade Kariri Valley.</p>

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
              <div
                key={event.id}
                id={`evento-${event.id}`}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-5 scroll-mt-24"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-[var(--kv-teal)] capitalize">{formatEventDate(event.starts_at)}</p>
                  <ShareButton
                    title={event.title}
                    text={event.description ?? undefined}
                    anchorId={`evento-${event.id}`}
                    className="shrink-0 text-xs font-medium text-[var(--kv-cream)]/50 hover:text-[var(--kv-cream)]"
                  />
                </div>
                <p className="mt-1.5 text-base font-semibold text-[var(--kv-cream)]">{event.title}</p>
                {event.description && (
                  <LinkifiedText text={event.description} className="mt-1.5 text-sm leading-relaxed text-[var(--kv-cream)]/55" />
                )}
                {event.location && <p className="mt-2 text-xs text-[var(--kv-cream)]/40">{event.location}</p>}
                {event.meeting_url && (
                  <a
                    href={event.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs font-medium text-[var(--kv-gold)] underline underline-offset-4"
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
