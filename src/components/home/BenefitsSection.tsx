"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import {
  Users, Megaphone, CalendarDays, Target,
  UserCheck, Share2, Globe,
} from "lucide-react";
import type React from "react";

const BENEFITS = [
  {
    icon: Users,
    title: "Encontrar pessoas",
    desc: "Conecte-se com fundadores, devs, pesquisadores e entusiastas do Cariri que compartilham sua visão.",
    color: "#239D8C",
  },
  {
    icon: Megaphone,
    title: "Divulgar projetos",
    desc: "Dê visibilidade para o que você está construindo dentro de uma rede que já entende o contexto regional.",
    color: "#E9B23C",
  },
  {
    icon: CalendarDays,
    title: "Participar de eventos",
    desc: "Acesse meetups, hackathons, workshops e encontros que conectam quem está transformando o Cariri.",
    color: "#E0715A",
  },
  {
    icon: Target,
    title: "Acessar oportunidades",
    desc: "Editais, vagas, programas de aceleração e mentorias em um só lugar, filtradas para o ecossistema.",
    color: "#239D8C",
  },
  {
    icon: UserCheck,
    title: "Encontrar mentores",
    desc: "Conecte-se com pessoas experientes que já percorreram o caminho e podem acelerar sua jornada.",
    color: "#E9B23C",
  },
  {
    icon: Share2,
    title: "Conectar com talentos",
    desc: "Encontre co-fundadores, membros de time, parceiros e colaboradores para seus projetos.",
    color: "#E0715A",
  },
  {
    icon: Globe,
    title: "Fortalecer o ecossistema",
    desc: "Contribua para que o Cariri seja reconhecido como polo de inovação no Nordeste e no Brasil.",
    color: "#239D8C",
  },
] as const;

export default function BenefitsSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  const fadeLeft = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateX(0)" : "translateX(-32px)",
    transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "#060D08", padding: "110px 0 100px" }}>

      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "45vw", height: "45vw", maxWidth: 620, maxHeight: 620,
        top: "-10%", right: "-8%",
        background: "radial-gradient(circle, rgba(232,184,75,.12) 0%, rgba(232,184,75,.03) 55%, transparent 72%)",
        animationDuration: "30s", animationDelay: "-12s",
      }} />
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "38vw", height: "38vw", maxWidth: 520, maxHeight: 520,
        bottom: "-15%", left: "-6%",
        background: "radial-gradient(circle, rgba(35,157,140,.14) 0%, rgba(35,157,140,.03) 55%, transparent 72%)",
        animationDuration: "24s", animationDelay: "-5s", animationDirection: "reverse",
      }} />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.3 }} />

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>
        <div className="grid lg:grid-cols-[42%_1fr] gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div className="lg:sticky top-32">
            <div className="flex items-center gap-3 mb-8" style={fadeLeft(0)}>
              <div style={{ width: 32, height: 1, background: "#E9B23C" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#E9B23C" }}>
                Por que participar
              </span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(32px, 3.8vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.8px",
              color: "#F4EDDF",
              marginBottom: 20,
              ...fadeLeft(0.1),
            }}>
              Fazer parte muda o que você{" "}
              <span style={{ color: "#E9B23C", fontStyle: "italic" }}>consegue</span>
              {" "}criar
            </h2>

            <p style={{
              fontSize: "clamp(14px, 1.4vw, 16px)",
              lineHeight: 1.78,
              color: "rgba(244,237,223,.5)",
              marginBottom: 40,
              ...fadeLeft(0.2),
            }}>
              A Kariri Valley não é só um diretório — é uma rede viva de pessoas,
              projetos e oportunidades que se potencializam quando estão conectadas.
            </p>

            <div style={fadeLeft(0.3)}>
              <Link href="/como-participar" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", borderRadius: 999,
                fontSize: 14, fontWeight: 600, color: "#F4EDDF",
                background: "#1E4D3A", border: "1px solid rgba(255,255,255,.1)",
                textDecoration: "none",
                transition: "transform .25s ease, box-shadow .25s ease, background .25s ease",
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-2px)";
                  el.style.background = "#245f47";
                  el.style.boxShadow = "0 12px 36px rgba(30,77,58,.45)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.background = "#1E4D3A";
                  el.style.boxShadow = "none";
                }}
              >
                Quero participar
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path d="M3 7.5h9M9 4l3.5 3.5L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="hidden lg:block mt-16" style={{ opacity: 0.1 }}>
              <svg width="72" height="72" viewBox="-1 -1 2 2" aria-hidden="true">
                <polygon points="0,-1 1,0 0,1 -1,0" fill="none" stroke="#E9B23C" strokeWidth=".04"/>
                <polygon points="0,-.6 .6,0 0,.6 -.6,0" fill="none" stroke="#239D8C" strokeWidth=".04"/>
              </svg>
            </div>
          </div>

          {/* Right: benefits */}
          <div>
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "20px 0",
                    borderBottom: i < BENEFITS.length - 1 ? "1px solid rgba(255,255,255,.06)" : "none",
                    ...fadeUp(0.1 + i * 0.07),
                  }}
                >
                  <div style={{
                    width: 40, height: 40,
                    background: `${b.color}15`,
                    border: `1px solid ${b.color}30`,
                    borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 2,
                  }}>
                    <Icon size={17} strokeWidth={1.8} color={b.color} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: b.color, opacity: 0.7 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F4EDDF", margin: 0 }}>
                        {b.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(244,237,223,.48)", margin: 0 }}>
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
