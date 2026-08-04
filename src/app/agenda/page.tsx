import type { Metadata } from "next";
import { CalendarX2, Calendar, MapPin, ExternalLink } from "lucide-react";

import { fetchPublicUpcomingEvents } from "@/lib/members/events";
import { LinkifiedText } from "@/components/ui/linkified-text";

export const metadata: Metadata = {
  title: "Eventos — Kariri Valley",
  description:
    "Próximos encontros, workshops e talks da comunidade Kariri Valley — o ecossistema de inovação do Cariri.",
};

function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function PublicAgendaPage() {
  const events = await fetchPublicUpcomingEvents();

  return (
    <main className="relative overflow-hidden" style={{ background: "var(--nb-page-bg)" }}>
      <div
        className="kv-aurora absolute pointer-events-none"
        style={{
          width: "40vw", height: "40vw", maxWidth: 560, maxHeight: 560,
          top: "-14%", right: "-6%",
          background: "radial-gradient(circle, rgba(35,157,140,.16) 0%, rgba(35,157,140,.04) 55%, transparent 72%)",
          animationDuration: "26s", animationDelay: "-10s",
        }}
      />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.5 }} />

      <section className="relative max-w-[820px] mx-auto px-6 lg:px-16 text-center" style={{ zIndex: 10, padding: "160px 24px 56px" }}>
        <span
          className="inline-flex items-center gap-2 px-[18px] py-[7px] text-[11px] font-bold tracking-[2px] uppercase mb-7"
          style={{ background: "var(--nb-turquoise)", border: "2px solid var(--nb-ink)", borderRadius: 999, color: "var(--nb-sand)", fontFamily: "var(--font-geo)" }}
        >
          <Calendar size={12} strokeWidth={2.2} />
          Agenda
        </span>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(32px, 4.4vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.14,
            letterSpacing: "-1px",
            color: "var(--nb-heading)",
            marginBottom: 16,
          }}
        >
          Eventos da{" "}
          <span style={{ color: "var(--nb-turquoise)", fontStyle: "italic" }}>Kariri Valley</span>
        </h1>

        <p
          className="mx-auto"
          style={{
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.7,
            color: "var(--nb-body)",
            maxWidth: 560,
          }}
        >
          Encontros, workshops e talks abertos à comunidade e a quem quer conhecer o
          ecossistema de inovação do Cariri.
        </p>
      </section>

      <section className="relative max-w-[900px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, paddingBottom: 120 }}>
        {events.length === 0 ? (
          <div
            className="text-center"
            style={{
              background: "var(--nb-cream)",
              border: "3px dashed var(--nb-ink)",
              borderRadius: 18,
              padding: "64px 32px",
            }}
          >
            <div
              className="flex items-center justify-center mx-auto"
              style={{
                width: 72, height: 72,
                background: "var(--nb-turquoise)",
                border: "2px solid var(--nb-ink)",
                borderRadius: 16,
                marginBottom: 24,
              }}
            >
              <CalendarX2 size={28} strokeWidth={2} color="var(--nb-sand)" />
            </div>
            <h2 style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(18px, 2vw, 22px)",
              fontWeight: 700, color: "var(--nb-heading)", marginBottom: 12,
            }}>
              Nenhum evento publicado ainda
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--nb-body)", maxWidth: 420, margin: "0 auto" }}>
              Em breve, novos encontros da comunidade serão divulgados por aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-6"
                style={{
                  background: "var(--nb-card-bg)",
                  backdropFilter: "var(--nb-card-blur)",
                  WebkitBackdropFilter: "var(--nb-card-blur)",
                  border: "var(--nb-card-border)",
                  borderRadius: 14,
                  boxShadow: "var(--nb-card-shadow)",
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--nb-turquoise)", textTransform: "capitalize", marginBottom: 8 }}>
                  {formatEventDate(event.starts_at)}
                </p>
                <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 19, fontWeight: 700, color: "var(--nb-heading)", marginBottom: 8 }}>
                  {event.title}
                </h3>
                {event.description && (
                  <LinkifiedText
                    text={event.description}
                    style={{ fontSize: 14, lineHeight: 1.65, color: "var(--nb-body)", marginBottom: 10 }}
                  />
                )}
                {event.location && (
                  <p style={{ fontSize: 13, color: "var(--nb-body)", display: "flex", alignItems: "center", gap: 6 }}>
                    <MapPin size={13} strokeWidth={2} />
                    {event.location}
                  </p>
                )}
                {event.meeting_url && (
                  <a
                    href={event.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: "var(--nb-label-accent)" }}
                  >
                    Mais informações
                    <ExternalLink size={13} strokeWidth={2} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
