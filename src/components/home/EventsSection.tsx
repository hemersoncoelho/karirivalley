"use client";

import Link from "next/link";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex, MetaDot } from "@/components/ui/editorial";
import type { EventRecord } from "@/lib/members/events";

function formatEventDateShort(value: string): { day: string; month: string; rest: string } {
  const d = new Date(value);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(d);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(d).replace(".", "").toUpperCase();
  const rest = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(d);
  return { day, month, rest };
}

interface EventsSectionProps {
  events: EventRecord[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--nb-page-bg)", padding: "96px 0 104px" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex
          index="06"
          label="Agenda"
          title="o que acontece no vale"
        />

        <div className="mt-12 flex items-end justify-between gap-4">
          <h2
            className="kv-display"
            style={{ fontSize: "clamp(30px, 3.4vw, 50px)", color: "var(--nb-heading)", margin: 0, ...fadeUp(0) }}
          >
            Próximos <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-turquoise)" }}>encontros</em>
          </h2>
          <Link
            href="/agenda"
            className="kv-kicker"
            style={{ color: "var(--nb-ink)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, ...fadeUp(0.05) }}
          >
            <span style={{ borderBottom: "1px solid var(--nb-ink)", paddingBottom: 2 }}>Agenda completa</span>
            <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
          </Link>
        </div>

        {events.length === 0 ? (
          <div
            style={{
              marginTop: 32,
              border: "1px dashed var(--nb-line)",
              padding: "56px 32px",
              textAlign: "center",
              ...fadeUp(0.15),
            }}
          >
            <MetaDot role="event" style={{ width: 8, height: 8, marginBottom: 14 }} />
            <h3 className="kv-display" style={{ fontSize: 24, color: "var(--nb-heading)", marginBottom: 10 }}>
              A agenda está entre edições
            </h3>
            <p className="kv-meta" style={{ color: "var(--nb-body)", maxWidth: 420, margin: "0 auto 26px", textTransform: "none", letterSpacing: ".04em" }}>
              Em breve, novos encontros da comunidade serão divulgados por aqui.
            </p>
            <Link
              href="https://instagram.com/karirivalley"
              target="_blank"
              rel="noopener noreferrer"
              className="kv-kicker"
              style={{ color: "var(--nb-ink)", textDecoration: "none" }}
            >
              <span style={{ borderBottom: "1px solid var(--nb-ink)", paddingBottom: 2 }}>Acompanhe nas redes</span>
              <span aria-hidden="true" style={{ fontSize: 9, marginLeft: 6 }}>▸</span>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => {
              const d = formatEventDateShort(event.starts_at);
              return (
                <Link
                  key={event.id}
                  href={`/agenda/${event.slug}`}
                  className="group"
                  style={{
                    textDecoration: "none",
                    display: "block",
                    borderTop: "1px solid var(--nb-line)",
                    paddingTop: 18,
                    ...fadeUp(0.1 + i * 0.07),
                  }}
                >
                  {event.banner_url && (
                    <div className="kv-photo" style={{ border: "1px solid var(--nb-line-soft)", marginBottom: 16 }}>
                      <Image
                        src={event.banner_url}
                        alt={event.title}
                        width={0}
                        height={0}
                        sizes="(max-width: 640px) 100vw, 33vw"
                        style={{ width: "100%", height: "auto", aspectRatio: "4 / 3", objectFit: "cover", display: "block" }}
                      />
                    </div>
                  )}
                  <p className="kv-meta" style={{ display: "flex", alignItems: "baseline", gap: 8, margin: 0, color: "var(--nb-body)" }}>
                    <MetaDot role="event" />
                    <span style={{ color: "var(--nb-turquoise)", fontWeight: 700 }}>
                      {d.day} {d.month}
                    </span>
                    <span>· {d.rest}</span>
                  </p>
                  <h3
                    style={{
                      margin: "10px 0 6px",
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: 21,
                      lineHeight: 1.25,
                      color: "var(--nb-heading)",
                    }}
                  >
                    {event.title}
                  </h3>
                  {event.location && (
                    <p className="kv-meta" style={{ margin: 0, color: "var(--nb-body)" }}>
                      {event.location}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
