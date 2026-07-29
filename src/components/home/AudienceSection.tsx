"use client";

import { useInView } from "@/hooks/useInView";
import { useNbTheme } from "@/hooks/useNbTheme";
import {
  Rocket, Code2, GraduationCap, FlaskConical,
  BookOpen, Building2, Compass, TrendingUp,
  Handshake, Sparkles,
} from "lucide-react";
import type React from "react";

const ACCENTS = ["#1E4D3A", "#C25A2E", "#E9B23C", "#239D8C", "#0F3B36"] as const;
const ACCENT_TEXT: Record<string, string> = { "#E9B23C": "#16140F" };

const AUDIENCE = [
  { icon: Rocket,         title: "Fundadores de Startups",   desc: "Construindo o próximo grande projeto do Cariri." },
  { icon: Building2,      title: "Área Corporativa",         desc: "Inove com propósito e gere impacto real." },
  { icon: GraduationCap,  title: "Estudantes",                desc: "Quem aprende e quer conectar carreira com inovação." },
  { icon: FlaskConical,   title: "Pesquisadores",             desc: "Academia aplicando ciência para impactar a região." },
  { icon: BookOpen,       title: "Professores",               desc: "Educadores que formam a próxima geração de inovadores." },
  { icon: Compass,        title: "Mentores",                  desc: "Experientes que contribuem com quem está começando." },
  { icon: TrendingUp,     title: "Investidores",              desc: "Quem busca oportunidades no interior do Ceará." },
  { icon: Handshake,      title: "Líderes Públicos",          desc: "Políticas, parcerias e ações que criam futuro." },
  { icon: Code2,          title: "Profissionais de Mercado",  desc: "Conecte-se, cresça e impulsione a região." },
  { icon: Sparkles,       title: "Entusiastas",                desc: "Qualquer pessoa apaixonada por inovação e pelo Cariri." },
] as const;

type AudienceItem = (typeof AUDIENCE)[number];

function AudienceCard({ item, color, fadeStyle }: { item: AudienceItem; color: string; fadeStyle: React.CSSProperties }) {
  const { theme } = useNbTheme();
  const isDark = theme === "dark";
  const Icon = item.icon;
  const iconText = ACCENT_TEXT[color] ?? "var(--nb-sand)";
  return (
    <div
      className="kv-press"
      style={{
        background: "var(--nb-card-bg)",
        backdropFilter: "var(--nb-card-blur)",
        WebkitBackdropFilter: "var(--nb-card-blur)",
        border: "var(--nb-card-border)",
        borderRadius: 12,
        padding: "22px 18px",
        cursor: "default",
        boxShadow: "var(--nb-card-shadow)",
        ...fadeStyle,
      }}
    >
      <div style={{
        width: 40, height: 40,
        background: color,
        border: isDark ? "none" : "2px solid var(--nb-ink)",
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14,
      }}>
        <Icon size={18} strokeWidth={2} color={iconText} />
      </div>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--nb-heading)", marginBottom: 6, lineHeight: 1.35 }}>
        {item.title}
      </h3>
      <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--nb-body)", margin: 0 }}>
        {item.desc}
      </p>
    </div>
  );
}

export default function AudienceSection() {
  const { theme } = useNbTheme();
  const isDark = theme === "dark";
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .65s ease ${delay}s, transform .65s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? "#10100E" : "var(--nb-sand-2)", padding: "110px 0 100px", borderTop: "3px solid var(--nb-navbar-border)" }}>

      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "40vw", height: "40vw", maxWidth: 560, maxHeight: 560,
        top: "-15%", left: "-5%",
        background: "radial-gradient(circle, rgba(232,178,60,.18) 0%, rgba(232,178,60,.04) 55%, transparent 72%)",
        animationDuration: "32s", animationDelay: "-8s",
      }} />
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "30vw", height: "30vw", maxWidth: 400, maxHeight: 400,
        bottom: "-10%", right: "-5%",
        background: "radial-gradient(circle, rgba(35,157,140,.16) 0%, rgba(35,157,140,.04) 55%, transparent 72%)",
        animationDuration: "25s", animationDelay: "-18s", animationDirection: "reverse",
      }} />

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>

        <div className="text-center mb-16" style={fadeUp(0)}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div style={{ width: 28, height: 2, background: "var(--nb-terracotta)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--nb-terracotta)", fontFamily: "var(--font-geo)" }}>
              Para quem é
            </span>
            <div style={{ width: 28, height: 2, background: "var(--nb-terracotta)" }} />
          </div>
          <h2 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(30px, 3.5vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.8px",
            color: "var(--nb-heading)",
            marginBottom: 16,
          }}>
            A Kariri Valley é para{" "}
            <span style={{ color: "var(--nb-terracotta)", fontStyle: "italic" }}>você</span>
          </h2>
          <p style={{
            fontSize: "clamp(14px, 1.4vw, 16px)",
            color: "var(--nb-body)",
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Nossa comunidade é aberta a todos os perfis que queiram construir, colaborar
            e transformar a realidade do Cariri.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {AUDIENCE.map((a, i) => (
            <AudienceCard
              key={a.title}
              item={a}
              color={ACCENTS[i % ACCENTS.length]}
              fadeStyle={fadeUp(0.1 + i * 0.045)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
