"use client";

import Link from "next/link";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { useNbTheme } from "@/hooks/useNbTheme";
import { CalendarX2, ArrowRight, ExternalLink, Globe, Calendar, MapPin } from "lucide-react";
import type React from "react";
import type { EventRecord } from "@/lib/members/events";

function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

interface EventsSectionProps {
  events: EventRecord[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const { theme } = useNbTheme();
  const isDark = theme === "dark";
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--nb-page-bg)", padding: "110px 0 100px", borderTop: "3px solid var(--nb-navbar-border)" }}>

      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "35vw", height: "35vw", maxWidth: 480, maxHeight: 480,
        top: "-10%", right: "-5%",
        background: "radial-gradient(circle, rgba(35,157,140,.16) 0%, rgba(35,157,140,.04) 55%, transparent 72%)",
        animationDuration: "26s", animationDelay: "-10s",
      }} />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.5 }} />

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>

        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div style={fadeUp(0)}>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: 32, height: 2, background: "var(--nb-turquoise)" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--nb-turquoise)", fontFamily: "var(--font-geo)" }}>
                Agenda
              </span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(28px, 3.2vw, 44px)",
              fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.7px",
              color: "var(--nb-heading)", margin: 0,
            }}>
              Próximos{" "}
              <span style={{ color: "var(--nb-turquoise)", fontStyle: "italic" }}>Eventos</span>
            </h2>
          </div>
          <Link href="/agenda" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 700, color: isDark ? "rgba(244,237,223,.5)" : "var(--nb-forest)", fontFamily: "var(--font-geo)",
            textDecoration: "none",
            ...fadeUp(0.05),
          }}>
            Ver todos <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        {events.length === 0 ? (
          /* Empty state */
          <div style={{
            background: isDark ? "rgba(255,255,255,.028)" : "var(--nb-cream)",
            border: isDark ? "1px solid rgba(255,255,255,.07)" : "3px dashed var(--nb-ink)",
            borderRadius: isDark ? 20 : 18,
            padding: "64px 32px",
            textAlign: "center",
            backdropFilter: isDark ? "blur(12px)" : "none",
            WebkitBackdropFilter: isDark ? "blur(12px)" : "none",
            ...fadeUp(0.15),
          }}>
            <div style={{
              width: 72, height: 72,
              background: isDark ? "rgba(35,157,140,.1)" : "var(--nb-turquoise)",
              border: isDark ? "1px solid rgba(35,157,140,.22)" : "2px solid var(--nb-ink)",
              borderRadius: isDark ? 18 : 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <CalendarX2 size={28} strokeWidth={2} color={isDark ? "var(--nb-turquoise)" : "var(--nb-sand)"} />
            </div>

            <h3 style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(18px, 2vw, 22px)",
              fontWeight: 700, color: "var(--nb-heading)", marginBottom: 12,
            }}>
              Nenhum evento publicado ainda
            </h3>
            <p style={{
              fontSize: "clamp(14px, 1.4vw, 15px)",
              color: "var(--nb-body)",
              lineHeight: 1.7, maxWidth: 420,
              margin: "0 auto 32px",
            }}>
              Em breve, novos encontros da comunidade serão divulgados por aqui.
              Fique de olho nas nossas redes para não perder nada.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="https://instagram.com/karirivalley"
                target="_blank"
                rel="noopener noreferrer"
                className="kv-press"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "10px 20px", borderRadius: isDark ? 999 : 10,
                  fontSize: 13, fontWeight: 700, color: isDark ? "var(--kv-cream)" : "var(--nb-ink)", fontFamily: "var(--font-geo)",
                  background: isDark ? "rgba(255,255,255,.06)" : "var(--nb-sand)",
                  border: isDark ? "1px solid rgba(255,255,255,.12)" : "2px solid var(--nb-ink)",
                  textDecoration: "none",
                }}
              >
                <ExternalLink size={15} strokeWidth={2} />
                Redes Sociais
              </a>
              <Link href="/como-participar" className="kv-press" style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "10px 20px", borderRadius: isDark ? 999 : 10,
                fontSize: 13, fontWeight: 700, color: isDark ? "var(--nb-turquoise)" : "var(--nb-sand)", fontFamily: "var(--font-geo)",
                background: isDark ? "rgba(35,157,140,.1)" : "var(--nb-turquoise)",
                border: isDark ? "1px solid rgba(35,157,140,.25)" : "2px solid var(--nb-ink)",
                boxShadow: isDark ? "none" : "var(--shadow-nb-sm)",
                textDecoration: "none",
              }}>
                <Globe size={15} strokeWidth={2} />
                Acompanhar a comunidade
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event, i) => (
              <div
                key={event.id}
                style={{
                  background: isDark ? "rgba(255,255,255,.03)" : "var(--nb-card-bg)",
                  backdropFilter: isDark ? "blur(12px)" : "var(--nb-card-blur)",
                  WebkitBackdropFilter: isDark ? "blur(12px)" : "var(--nb-card-blur)",
                  border: isDark ? "1px solid rgba(255,255,255,.08)" : "var(--nb-card-border)",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: isDark ? "none" : "var(--nb-card-shadow)",
                  ...fadeUp(0.1 + i * 0.06),
                }}
              >
                {event.banner_url && (
                  <div style={{ position: "relative", width: "100%", height: 150 }}>
                    <Image
                      src={event.banner_url}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div style={{ padding: 24 }}>
                  <p style={{
                    fontSize: 12, fontWeight: 700, letterSpacing: ".3px",
                    color: "var(--nb-turquoise)", textTransform: "capitalize", marginBottom: 8,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <Calendar size={13} strokeWidth={2} />
                    {formatEventDate(event.starts_at)}
                  </p>
                  <h3 style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: 18, fontWeight: 700, color: "var(--nb-heading)", marginBottom: 8,
                  }}>
                    {event.title}
                  </h3>
                  {event.description && (
                    <p style={{
                      fontSize: 13.5, lineHeight: 1.6, color: "var(--nb-body)",
                      marginBottom: 10,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {event.description}
                    </p>
                  )}
                  {event.location && (
                    <p style={{
                      fontSize: 12.5, color: isDark ? "rgba(244,237,223,.5)" : "rgba(22,20,15,.55)",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <MapPin size={12} strokeWidth={2} />
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Categorias de evento — decorativo, reforça o que está por vir */}
        <div className="grid sm:grid-cols-3 gap-4 mt-5">
          {[
            { label: "Workshops e trilhas práticas", icon: Globe },
            { label: "Encontros, talks e painéis", icon: CalendarX2 },
            { label: "Hackathons e desafios", icon: ExternalLink },
          ].map((c, i) => (
            <div
              key={c.label}
              className="flex items-center gap-3"
              style={{
                background: isDark ? "rgba(255,255,255,.03)" : "var(--nb-cream)",
                border: isDark ? "1px solid rgba(255,255,255,.08)" : "2px solid rgba(22,20,15,.25)",
                borderRadius: 12, padding: "16px 18px",
                ...fadeUp(0.2 + i * 0.06),
              }}
            >
              <c.icon size={16} strokeWidth={2} color={isDark ? "rgba(244,237,223,.4)" : "rgba(22,20,15,.4)"} />
              <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? "rgba(244,237,223,.55)" : "rgba(22,20,15,.55)" }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
