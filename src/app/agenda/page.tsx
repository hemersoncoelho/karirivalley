import { loadPublicContent } from "@/lib/public-content";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarX2 } from "lucide-react";

import { fetchPublicUpcomingEvents } from "@/lib/members/events";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { RefreshButton } from "@/components/ui/refresh-button";
import { ShareButton } from "@/components/ui/share-button";
import { SectionIndex, MetaDot } from "@/components/ui/editorial";

export const metadata: Metadata = {
  title: "Eventos — Kariri Valley",
  description:
    "Próximos encontros, workshops e talks da comunidade Kariri Valley — o ecossistema de inovação do Cariri.",
};

function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Fortaleza",
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function PublicAgendaPage() {
  const { data: events, unavailable } = await loadPublicContent(fetchPublicUpcomingEvents);

  return (
    <main id="conteudo" tabIndex={-1} style={{ background: "var(--nb-page-bg)" }}>
      {/* Header editorial */}
      <section className="mx-auto max-w-[1300px] px-6 lg:px-16" style={{ paddingTop: "clamp(48px, 8vw, 96px)" }}>
        <SectionIndex index="—" label="Agenda" />
        <h1
          className="kv-display"
          style={{ fontSize: "clamp(42px, 5.6vw, 80px)", color: "var(--nb-heading)", margin: "28px 0 0" }}
        >
          O que acontece no{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-community-accent)" }}>vale</em>
        </h1>
        <div
          className="flex flex-wrap items-end justify-between gap-4"
          style={{ borderTop: "1px solid var(--nb-line)", marginTop: 32, paddingTop: 20 }}
        >
          <p style={{ fontSize: "clamp(15px, 1.4vw, 17px)", lineHeight: 1.7, color: "var(--nb-body)", maxWidth: 560, margin: 0 }}>
            Encontros, workshops e talks abertos à comunidade e a quem quer conhecer
            o ecossistema de inovação do Cariri.
          </p>
          <p className="kv-meta" style={{ color: "var(--nb-body)", margin: 0 }}>
            {unavailable ? "" : events.length} {unavailable ? "Atualização indisponível" : events.length === 1 ? "edição programada" : "edições programadas"}
          </p>
        </div>
      </section>

      {/* Lista editorial */}
      <section className="mx-auto max-w-[900px] px-6 lg:px-16" style={{ paddingTop: 48, paddingBottom: 120 }}>
        {events.length === 0 ? (
          <div
            className="text-center"
            style={{ border: "1px dashed var(--nb-line)", padding: "64px 32px" }}
          >
            <CalendarX2 size={26} strokeWidth={1.8} color="var(--nb-body)" aria-hidden="true" style={{ margin: "0 auto 18px" }} />
            <h2 className="kv-display" style={{ fontSize: 26, color: "var(--nb-heading)", marginBottom: 10 }}>
              {unavailable ? "Não foi possível carregar a agenda" : "Novos encontros a caminho"}
            </h2>
            <p className="kv-meta" style={{ color: "var(--nb-body)", maxWidth: 420, margin: "0 auto", textTransform: "none", letterSpacing: ".04em" }}>
              {unavailable ? "Tente novamente em alguns instantes. Enquanto isso, conheça os registros dos nossos encontros na galeria." : "Assim que novos encontros forem publicados, você encontra todas as informações por aqui."}
            </p>
            {unavailable && <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm font-semibold" style={{ color: "var(--nb-heading)" }}><RefreshButton /><Link href="/galeria" className="underline underline-offset-4">Conhecer a galeria</Link></div>}
          </div>
        ) : (
          <div className="flex flex-col">
            {events.map((event, i) => (
              <article
                key={event.id}
                id={`evento-${event.id}`}
                style={{
                  borderTop: "1px solid var(--nb-line)",
                  borderBottom: i === events.length - 1 ? "1px solid var(--nb-line)" : "none",
                  padding: "34px 0",
                  scrollMarginTop: 100,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="kv-meta" style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, color: "var(--nb-community-accent)", fontWeight: 700 }}>
                    <MetaDot role="event" />
                    {formatEventDate(event.starts_at)}
                  </p>
                  <ShareButton
                    title={event.title}
                    text={event.description ?? undefined}
                    path={`/agenda/${event.slug}`}
                    style={{ fontSize: 12, fontWeight: 700, color: "var(--nb-label-accent)", flexShrink: 0 }}
                  />
                </div>

                {event.banner_url && (
                  <div className="kv-photo" style={{ border: "1px solid var(--nb-line-soft)", marginTop: 18 }}>
                    <Image
                      src={event.banner_url}
                      alt={event.title}
                      width={0}
                      height={0}
                      sizes="(max-width: 640px) 100vw, 820px"
                      style={{ width: "100%", height: "auto", maxHeight: 440, objectFit: "cover", display: "block" }}
                    />
                  </div>
                )}

                <h2
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "clamp(24px, 2.6vw, 32px)",
                    fontWeight: 400,
                    color: "var(--nb-heading)",
                    margin: "16px 0 10px",
                    lineHeight: 1.2,
                  }}
                >
                  <Link href={`/agenda/${event.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {event.title}
                  </Link>
                </h2>

                {event.description && (
                  <LinkifiedText
                    text={event.description}
                    style={{ fontSize: 15, lineHeight: 1.7, color: "var(--nb-body)" }}
                  />
                )}

                {event.location && (
                  <p className="kv-meta" style={{ marginTop: 12, color: "var(--nb-body)" }}>
                    ◆ {event.location}
                  </p>
                )}

                {event.meeting_url && (
                  <a
                    href={event.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kv-kicker"
                    style={{
                      marginTop: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      color: "var(--nb-ink)",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ borderBottom: "1px solid var(--nb-ink)", paddingBottom: 2 }}>Mais informações</span>
                    <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
