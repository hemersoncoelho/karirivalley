"use client";

import { useInView } from "@/hooks/useInView";
import {
  Rocket, Code2, GraduationCap, FlaskConical,
  BookOpen, Building2, Compass, TrendingUp,
  Handshake, Sparkles,
} from "lucide-react";
import type React from "react";

const AUDIENCE = [
  {
    icon: Rocket,
    title: "Fundadores de Startups",
    desc: "Construindo o próximo grande projeto do Cariri",
    color: "#E0715A",
    bg: "rgba(224,113,90,.1)",
    border: "rgba(224,113,90,.18)",
    glow: "rgba(224,113,90,.15)",
  },
  {
    icon: Code2,
    title: "Devs & Engenheiros",
    desc: "Profissionais de tecnologia que criam o futuro",
    color: "#239D8C",
    bg: "rgba(35,157,140,.1)",
    border: "rgba(35,157,140,.18)",
    glow: "rgba(35,157,140,.15)",
  },
  {
    icon: GraduationCap,
    title: "Estudantes",
    desc: "Quem aprende e quer conectar carreira com inovação",
    color: "#E9B23C",
    bg: "rgba(232,184,75,.08)",
    border: "rgba(232,184,75,.18)",
    glow: "rgba(232,184,75,.15)",
  },
  {
    icon: FlaskConical,
    title: "Pesquisadores",
    desc: "Academia aplicando ciência para impactar a região",
    color: "#7BB8E8",
    bg: "rgba(123,184,232,.08)",
    border: "rgba(123,184,232,.18)",
    glow: "rgba(123,184,232,.12)",
  },
  {
    icon: BookOpen,
    title: "Professores",
    desc: "Educadores que formam a próxima geração de inovadores",
    color: "#85D4B4",
    bg: "rgba(133,212,180,.08)",
    border: "rgba(133,212,180,.18)",
    glow: "rgba(133,212,180,.12)",
  },
  {
    icon: Building2,
    title: "Empresas",
    desc: "Negócios consolidados conectando ao ecossistema",
    color: "#E9B23C",
    bg: "rgba(232,184,75,.08)",
    border: "rgba(232,184,75,.18)",
    glow: "rgba(232,184,75,.15)",
  },
  {
    icon: Compass,
    title: "Mentores",
    desc: "Experientes que contribuem com quem está começando",
    color: "#239D8C",
    bg: "rgba(35,157,140,.1)",
    border: "rgba(35,157,140,.18)",
    glow: "rgba(35,157,140,.15)",
  },
  {
    icon: TrendingUp,
    title: "Investidores",
    desc: "Quem busca oportunidades no interior do Ceará",
    color: "#E0715A",
    bg: "rgba(224,113,90,.1)",
    border: "rgba(224,113,90,.18)",
    glow: "rgba(224,113,90,.15)",
  },
  {
    icon: Handshake,
    title: "Instituições Parceiras",
    desc: "Organizações que fortalecem o ecossistema regional",
    color: "#85D4B4",
    bg: "rgba(133,212,180,.08)",
    border: "rgba(133,212,180,.18)",
    glow: "rgba(133,212,180,.12)",
  },
  {
    icon: Sparkles,
    title: "Entusiastas",
    desc: "Qualquer pessoa apaixonada por inovação e pelo Cariri",
    color: "#E9B23C",
    bg: "rgba(232,184,75,.08)",
    border: "rgba(232,184,75,.18)",
    glow: "rgba(232,184,75,.15)",
  },
] as const;

type AudienceItem = (typeof AUDIENCE)[number];

function AudienceCard({ item, fadeStyle }: { item: AudienceItem; delay: number; inView: boolean; fadeStyle: React.CSSProperties }) {
  const Icon = item.icon;
  return (
    <div
      style={{
        background: item.bg,
        border: `1px solid ${item.border}`,
        borderRadius: 14,
        padding: "22px 18px",
        cursor: "default",
        transition: "transform .25s ease, border-color .25s, box-shadow .25s",
        ...fadeStyle,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.borderColor = `${item.color}55`;
        el.style.boxShadow = `0 16px 44px ${item.glow}`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.borderColor = item.border;
        el.style.boxShadow = "none";
      }}
    >
      <div style={{
        width: 40, height: 40,
        background: `${item.color}18`,
        border: `1px solid ${item.color}35`,
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14,
      }}>
        <Icon size={18} strokeWidth={1.8} color={item.color} />
      </div>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: "#F4EDDF", marginBottom: 6, lineHeight: 1.35 }}>
        {item.title}
      </h3>
      <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(244,237,223,.45)", margin: 0 }}>
        {item.desc}
      </p>
    </div>
  );
}

export default function AudienceSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .65s ease ${delay}s, transform .65s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "#10100E", padding: "110px 0 100px" }}>

      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "40vw", height: "40vw", maxWidth: 560, maxHeight: 560,
        top: "-15%", left: "-5%",
        background: "radial-gradient(circle, rgba(232,184,75,.1) 0%, rgba(232,184,75,.02) 55%, transparent 72%)",
        animationDuration: "32s", animationDelay: "-8s",
      }} />
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "30vw", height: "30vw", maxWidth: 400, maxHeight: 400,
        bottom: "-10%", right: "-5%",
        background: "radial-gradient(circle, rgba(35,157,140,.12) 0%, rgba(35,157,140,.03) 55%, transparent 72%)",
        animationDuration: "25s", animationDelay: "-18s", animationDirection: "reverse",
      }} />

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>

        <div className="text-center mb-16" style={fadeUp(0)}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div style={{ width: 28, height: 1, background: "#E9B23C" }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#E9B23C" }}>
              Para quem é
            </span>
            <div style={{ width: 28, height: 1, background: "#E9B23C" }} />
          </div>
          <h2 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(30px, 3.5vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.8px",
            color: "#F4EDDF",
            marginBottom: 16,
          }}>
            A Kariri Valley é para{" "}
            <span style={{ color: "#E9B23C", fontStyle: "italic" }}>você</span>
          </h2>
          <p style={{
            fontSize: "clamp(14px, 1.4vw, 16px)",
            color: "rgba(244,237,223,.48)",
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
              delay={i * 0.045}
              inView={inView}
              fadeStyle={fadeUp(0.1 + i * 0.045)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
