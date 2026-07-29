"use client";

import { useInView } from "@/hooks/useInView";
import { useNbTheme } from "@/hooks/useNbTheme";
import { MapPin, Users, Zap, CalendarDays } from "lucide-react";
import type React from "react";
import { DiamondDivider } from "@/components/ui/patterns";

const STATS = [
  {
    icon: Users,
    label: "Membros Fundadores",
    sublabel: "Os primeiros inovadores que constroem a comunidade",
    color: "#239D8C",
  },
  {
    icon: MapPin,
    label: "Ecossistema em Mapeamento",
    sublabel: "Cidades, empresas e atores identificados no Cariri",
    color: "#E9B23C",
  },
  {
    icon: Zap,
    label: "Comunidade em Construção",
    sublabel: "Uma plataforma que cresce com cada novo membro",
    color: "#C25A2E",
  },
  {
    icon: CalendarDays,
    label: "Expansão Contínua",
    sublabel: "Eventos e oportunidades surgindo a cada semana",
    color: "#0F3B36",
  },
] as const;

export default function StatsSection() {
  const { theme } = useNbTheme();
  const isDark = theme === "dark";
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? "#0C1410" : "var(--nb-forest)", padding: "100px 0", borderTop: "3px solid var(--nb-navbar-border)", borderBottom: "3px solid var(--nb-navbar-border)" }}>

      <div className="absolute pointer-events-none" style={{ top: 24, left: 24, width: 64, height: 64, opacity: 0.5 }} aria-hidden="true">
        <DiamondDivider className="!gap-1.5" color="var(--nb-mustard)" />
      </div>
      <div className="absolute pointer-events-none" style={{ bottom: 24, right: 24, width: 64, height: 64, opacity: 0.5 }} aria-hidden="true">
        <DiamondDivider className="!gap-1.5" color="var(--nb-mustard)" />
      </div>

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>

        <div className="text-center mb-16" style={fadeUp(0)}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 16px", borderRadius: 999,
            background: "var(--nb-mustard)", border: "2px solid var(--nb-ink)",
            fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
            color: "var(--nb-ink)", marginBottom: 20,
          }}>
            <span style={{
              display: "inline-block", width: 5, height: 5,
              borderRadius: "50%", background: "var(--nb-ink)",
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
            color: "var(--nb-sand)",
            marginBottom: 14,
          }}>
            Um ecossistema em{" "}
            <span style={{ color: "var(--nb-mustard)", fontStyle: "italic" }}>movimento</span>
          </h2>

          <p style={{
            fontSize: "clamp(14px, 1.4vw, 15px)",
            color: isDark ? "rgba(244,237,223,.42)" : "rgba(244,238,225,.68)",
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
                  background: isDark ? `${s.color}14` : "var(--nb-cream)",
                  border: isDark ? `1px solid ${s.color}30` : "3px solid var(--nb-ink)",
                  borderRadius: 14,
                  padding: "28px 24px 24px",
                  textAlign: "center",
                  boxShadow: isDark ? "none" : "var(--shadow-nb-sand)",
                  ...fadeUp(0.1 + i * 0.08),
                }}
              >
                <div style={{
                  width: 44, height: 44,
                  background: isDark ? `${s.color}18` : s.color,
                  border: isDark ? `1px solid ${s.color}35` : "2px solid var(--nb-ink)",
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <Icon size={20} strokeWidth={2} color={isDark ? s.color : (s.color === "#E9B23C" ? "var(--nb-ink)" : "var(--nb-sand)")} />
                </div>
                <div style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: 15, fontWeight: 700,
                  color: isDark ? s.color : "var(--nb-ink)", marginBottom: 6, lineHeight: 1.3,
                }}>
                  {s.label}
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.6, color: isDark ? "rgba(244,237,223,.42)" : "rgba(22,20,15,.55)", margin: 0 }}>
                  {s.sublabel}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center" style={fadeUp(0.5)}>
          <p style={{ fontSize: 12, color: isDark ? "rgba(244,237,223,.28)" : "rgba(244,238,225,.55)", fontStyle: "italic" }}>
            Métricas reais serão exibidas aqui assim que a plataforma for lançada.
          </p>
        </div>
      </div>
    </section>
  );
}
