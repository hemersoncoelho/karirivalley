"use client";

import Link from "next/link";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";
import { CalendarX2 } from "lucide-react";
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
      style={{ background: "var(--nb-page-bg)", padding: "0 0 112px" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="04" label="Agenda" title="o que acontece no vale" />

        <div className="mt-10 flex items-end justify-between gap-4">
          <h2
            className="kv-display"
            style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--nb-heading)", margin: 0, ...fadeUp(0) }}
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
              background: "var(--nb-cream)",
              border: "1px dashed rgba(22,20,15,.2)",
              borderRadius: 20,
              padding: "56px 32px",
              textAlign: "center",
              ...fadeUp(0.15),
            }}
          >
            <CalendarX2 size={26} strokeWidth={1.8} color="var(--nb-body)" style={{ marginBottom: 14 }} />
            <h3 className="kv-display" style={{ fontSize: 24, color: "var(--nb-heading)", marginBottom: 8 }}>
              A agenda está entre edições
            </h3>
            <p className="kv-meta" style={{ color: "var(--nb-body)", margin: 0, textTransform: "none", letterSpacing: ".04em" }}>
              Em breve, novos encontros da comunidade serão divulgados por aqui.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    background: "var(--nb-cream)",
                    border: "1px solid rgba(22,20,15,.08)",
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow: "0 1px 2px rgba(22,20,15,.04), 0 12px 32px rgba(22,20,15,.06)",
                    transition: "transform .25s ease, box-shadow .25s ease",
                    ...fadeUp(0.1 + i * 0.07),
                  }}
                >
                  {event.banner_url && (
                    <div className="kv-photo" style={{ aspectRatio: "16 / 9" }}>
                      <Image
                        src={event.banner_url}
                        alt={event.title}
                        width={0}
                        height={0}
                        sizes="(max-width: 640px) 100vw, 33vw"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                  )}
                  <div style={{ padding: "20px 22px 22px" }}>
                    <p className="kv-meta" style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, color: "var(--nb-turquoise)", fontWeight: 700 }}>
                      <span style={{ fontSize: 13 }}>{d.day} {d.month}</span>
                      <span style={{ color: "var(--nb-body)", fontWeight: 400 }}>· {d.rest}</span>
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
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
