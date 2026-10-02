import Link from "next/link";
import Image from "next/image";
import { SectionIndex } from "@/components/ui/editorial";
import type { EventRecord } from "@/lib/members/events";

function formatEventDateShort(value: string): { day: string; month: string; rest: string } {
  const d = new Date(value);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", timeZone: "America/Fortaleza" }).format(d);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "America/Fortaleza" }).format(d).replace(".", "").toUpperCase();
  const rest = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Fortaleza" }).format(d);
  return { day, month, rest };
}

interface EventsSectionProps {
  unavailable?: boolean;
  events: EventRecord[];
}

export default function EventsSection({ events, unavailable = false }: EventsSectionProps) {
  if (unavailable || events.length === 0) return null;

  return (
    <section
      className="kv-live-section relative overflow-hidden"
      style={{ background: "var(--nb-page-bg)", padding: "0 0 112px" }}
    >
      <div className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="04" label="Agenda" title="o que acontece no vale" />

        <div className="kv-live-heading mt-8 flex items-end justify-between gap-4">
          <h2
            className="kv-display"
            style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--nb-heading)", margin: 0, }}
          >
            Próximos <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-community-accent)" }}>encontros</em>
          </h2>
          <Link
            href="/agenda"
            className="kv-kicker"
            style={{ color: "var(--nb-heading)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, }}
          >
            <span style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}>Agenda completa</span>
            <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const d = formatEventDateShort(event.starts_at);
            return (
              <Link
                key={event.id}
                href={`/agenda/${event.slug}`}
                className="group"
                style={{
                  textDecoration: "none",
                  display: "block",
                  background: "var(--nb-card-bg)",
                  border: "1px solid var(--nb-line-soft)",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 1px 2px rgba(22,20,15,.04), 0 12px 32px rgba(22,20,15,.06)",
                  transition: "transform .25s ease, box-shadow .25s ease",
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
                  <p className="kv-meta" style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, color: "var(--nb-community-accent)", fontWeight: 700 }}>
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
      </div>
    </section>
  );
}
