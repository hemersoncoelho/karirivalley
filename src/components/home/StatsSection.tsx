"use client";

import { useInView } from "@/hooks/useInView";
import { MapPin, Users, Zap, CalendarDays } from "lucide-react";
import type React from "react";

const STATS = [
  {
    icon: Users,
    label: "Membros Fundadores",
    sublabel: "Os primeiros inovadores que constroem a comunidade",
    color: "#239D8C",
    bg: "rgba(35,157,140,.08)",
    border: "rgba(35,157,140,.18)",
  },
  {
    icon: MapPin,
    label: "Ecossistema em Mapeamento",
    sublabel: "Cidades, empresas e atores identificados no Cariri",
    color: "#E9B23C",
    bg: "rgba(232,184,75,.08)",
    border: "rgba(232,184,75,.18)",
  },
  {
    icon: Zap,
    label: "Comunidade em Construção",
    sublabel: "Uma plataforma que cresce com cada novo membro",
    color: "#E0715A",
    bg: "rgba(224,113,90,.08)",
    border: "rgba(224,113,90,.18)",
  },
  {
    icon: CalendarDays,
    label: "Expansão Contínua",
    sublabel: "Eventos e oportunidades surgindo a cada semana",
    color: "#85D4B4",
    bg: "rgba(133,212,180,.08)",
    border: "rgba(133,212,180,.18)",
  },
] as const;

export default function StatsSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "#0C1410", padding: "100px 0" }}>

      <div className="absolute pointer-events-none" style={{
        top: "50%", left: "50%",
        width: "60vw", height: "60vw", maxWidth: 800, maxHeight: 800,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        border: "1px solid rgba(35,157,140,.055)",
      }} />
      <div className="absolute pointer-events-none" style={{
        top: "50%", left: "50%",
        width: "80vw", height: "80vw", maxWidth: 1100, maxHeight: 1100,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        border: "1px solid rgba(232,184,75,.03)",
      }} />

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>

        <div className="text-center mb-16" style={fadeUp(0)}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 16px", borderRadius: 999,
            background: "rgba(35,157,140,.1)", border: "1px solid rgba(35,157,140,.22)",
            fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase",
            color: "#239D8C", marginBottom: 20,
          }}>
            <span style={{
              display: "inline-block", width: 5, height: 5,
              borderRadius: "50%", background: "#239D8C",
              animation: "kv-pulse-dot 2.5s ease-in-out infinite",
            }} />
            Construindo juntos
          </span>

          <h2 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(30px, 3.5vw, 46px)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.8px",
            color: "#F4EDDF",
            marginBottom: 14,
          }}>
            Um ecossistema em{" "}
            <span style={{ color: "#239D8C", fontStyle: "italic" }}>movimento</span>
          </h2>

          <p style={{
            fontSize: "clamp(14px, 1.4vw, 15px)",
            color: "rgba(244,237,223,.42)",
            maxWidth: 460,
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Os números virão com o crescimento da comunidade. Por enquanto, o que importa
            é que estamos começando — e estamos começando juntos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  borderRadius: 16,
                  padding: "28px 24px 24px",
                  textAlign: "center",
                  ...fadeUp(0.1 + i * 0.08),
                }}
              >
                <div style={{
                  width: 44, height: 44,
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}35`,
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <Icon size={20} strokeWidth={1.7} color={s.color} />
                </div>
                <div style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: 15, fontWeight: 700,
                  color: s.color, marginBottom: 6, lineHeight: 1.3,
                }}>
                  {s.label}
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(244,237,223,.42)", margin: 0 }}>
                  {s.sublabel}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center" style={fadeUp(0.5)}>
          <p style={{ fontSize: 12, color: "rgba(244,237,223,.28)", fontStyle: "italic" }}>
            Métricas reais serão exibidas aqui assim que a plataforma for lançada.
          </p>
        </div>
      </div>
    </section>
  );
}
