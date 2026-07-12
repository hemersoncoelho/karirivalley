"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";

const PILLARS = [
  {
    title: "Pessoas & Talentos",
    desc: "Empreendedores, devs, pesquisadores e todos que movem a inovação no Cariri.",
    color: "#239D8C",
    bg: "rgba(35,157,140,.09)",
    border: "rgba(35,157,140,.2)",
  },
  {
    title: "Startups & Empresas",
    desc: "Negócios que transformam desafios locais em oportunidades reais de impacto.",
    color: "#E9B23C",
    bg: "rgba(232,184,75,.08)",
    border: "rgba(232,184,75,.2)",
  },
  {
    title: "Instituições",
    desc: "Universidades, aceleradoras e órgãos públicos que sustentam o ecossistema.",
    color: "#E0715A",
    bg: "rgba(224,113,90,.09)",
    border: "rgba(224,113,90,.2)",
  },
] as const;

export default function AboutSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .75s ease ${delay}s, transform .75s ease ${delay}s`,
  });

  const fadeRight = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateX(0)" : "translateX(36px)",
    transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`,
  });

  return (
    <section id="sobre" className="relative overflow-hidden" style={{ background: "#060D08", padding: "120px 0 100px" }}>

      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "50vw", height: "50vw", maxWidth: 700, maxHeight: 700,
        top: "-20%", right: "-10%",
        background: "radial-gradient(circle, rgba(35,157,140,.16) 0%, rgba(35,157,140,.04) 55%, transparent 72%)",
        animationDuration: "28s", animationDelay: "-6s",
      }} />
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "35vw", height: "35vw", maxWidth: 500, maxHeight: 500,
        bottom: "5%", left: "-8%",
        background: "radial-gradient(circle, rgba(30,77,58,.3) 0%, rgba(30,77,58,.06) 55%, transparent 72%)",
        animationDuration: "22s", animationDelay: "-14s", animationDirection: "reverse",
      }} />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.35 }} />

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>

        <div className="flex items-center gap-3 mb-16" style={fadeUp(0)}>
          <div style={{ width: 32, height: 1, background: "#239D8C" }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#239D8C" }}>
            O Ecossistema
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-20">

          <div>
            <h2 style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(34px, 4vw, 54px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-1px",
              color: "#F4EDDF",
              marginBottom: 24,
              ...fadeUp(0.1),
            }}>
              Uma comunidade que{" "}
              <span style={{ color: "#239D8C", fontStyle: "italic" }}>conecta</span>
              {" "}quem faz a inovação no Cariri
            </h2>

            <p style={{
              fontSize: "clamp(15px, 1.5vw, 17px)",
              lineHeight: 1.78,
              color: "rgba(244,237,223,.52)",
              marginBottom: 32,
              maxWidth: 480,
              ...fadeUp(0.2),
            }}>
              A Kariri Valley é um mapa vivo do ecossistema de inovação do Cariri, CE.
              Reunimos startups, talentos, empresas, universidades e instituições em um único
              espaço — para que quem está construindo o futuro da região possa se
              encontrar, colaborar e crescer junto.
            </p>

            <div style={fadeUp(0.3)}>
              <Link href="/sobre" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 14, fontWeight: 600, color: "#239D8C", textDecoration: "none",
                borderBottom: "1px solid rgba(35,157,140,.4)", paddingBottom: 3,
              }}>
                Conheça nossa história
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center" style={fadeRight(0.35)}>
            <CaririMapVisual />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => (
            <div key={p.title} style={{
              background: p.bg,
              border: `1px solid ${p.border}`,
              borderRadius: 16,
              padding: "28px 24px",
              ...fadeUp(0.4 + i * 0.08),
            }}>
              <div style={{
                width: 36, height: 36,
                background: `${p.color}20`,
                border: `1px solid ${p.color}40`,
                borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <svg width="13" height="13" viewBox="-1 -1 2 2" aria-hidden="true">
                  <polygon points="0,-.72 .72,0 0,.72 -.72,0" fill={p.color}/>
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F4EDDF", marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(244,237,223,.5)", margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaririMapVisual() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
      <svg viewBox="0 0 420 320" style={{ width: "100%", overflow: "visible" }} aria-hidden="true">
        <defs>
          <radialGradient id="about-mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#239D8C" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#239D8C" stopOpacity="0"/>
          </radialGradient>
          <filter id="about-nodeGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <ellipse cx="210" cy="160" rx="185" ry="130" fill="url(#about-mapGlow)"/>
        <ellipse cx="210" cy="160" rx="165" ry="116" fill="none" stroke="rgba(35,157,140,.07)" strokeWidth="1"/>
        <ellipse cx="210" cy="160" rx="130" ry="90" fill="none" stroke="rgba(35,157,140,.055)" strokeWidth="1"/>
        <ellipse cx="210" cy="160" rx="96" ry="66" fill="none" stroke="rgba(35,157,140,.04)" strokeWidth="1"/>
        <line x1="160" y1="130" x2="248" y2="172" stroke="rgba(232,184,75,.22)" strokeWidth="1" strokeDasharray="5 3"/>
        <line x1="248" y1="172" x2="275" y2="208" stroke="rgba(232,184,75,.18)" strokeWidth="1" strokeDasharray="5 3"/>
        <line x1="160" y1="130" x2="275" y2="208" stroke="rgba(232,184,75,.1)" strokeWidth="1" strokeDasharray="5 3"/>
        <line x1="160" y1="130" x2="108" y2="93" stroke="rgba(35,157,140,.13)" strokeWidth=".8" strokeDasharray="3 5"/>
        <line x1="160" y1="130" x2="118" y2="188" stroke="rgba(35,157,140,.1)" strokeWidth=".8" strokeDasharray="3 5"/>
        <line x1="248" y1="172" x2="318" y2="140" stroke="rgba(35,157,140,.13)" strokeWidth=".8" strokeDasharray="3 5"/>
        <line x1="275" y1="208" x2="330" y2="248" stroke="rgba(35,157,140,.1)" strokeWidth=".8" strokeDasharray="3 5"/>
        {([[108,93],[118,188],[318,140],[330,248],[88,242],[355,102],[196,262]] as [number,number][]).map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill="rgba(35,157,140,.38)" stroke="rgba(35,157,140,.28)" strokeWidth="1"/>
        ))}
        <g filter="url(#about-nodeGlow)">
          <circle cx="160" cy="130" r="30" fill="rgba(35,157,140,.06)"/>
          <circle cx="160" cy="130" r="22" fill="rgba(30,77,58,.55)" stroke="rgba(35,157,140,.65)" strokeWidth="1.5"/>
          <text x="160" y="130" textAnchor="middle" dominantBaseline="central" fill="#F4EDDF" fontSize="9" fontWeight="700">JDN</text>
        </g>
        <g filter="url(#about-nodeGlow)">
          <circle cx="248" cy="172" r="24" fill="rgba(232,184,75,.05)"/>
          <circle cx="248" cy="172" r="17" fill="rgba(15,22,8,.6)" stroke="rgba(232,184,75,.55)" strokeWidth="1.5"/>
          <text x="248" y="172" textAnchor="middle" dominantBaseline="central" fill="#E9B23C" fontSize="8" fontWeight="700">CRT</text>
        </g>
        <g filter="url(#about-nodeGlow)">
          <circle cx="275" cy="208" r="20" fill="rgba(224,113,90,.05)"/>
          <circle cx="275" cy="208" r="14" fill="rgba(8,14,18,.6)" stroke="rgba(224,113,90,.5)" strokeWidth="1.5"/>
          <text x="275" y="208" textAnchor="middle" dominantBaseline="central" fill="#E0715A" fontSize="7.5" fontWeight="700">BBL</text>
        </g>
        <polygon points="210,148 222,160 210,172 198,160" fill="none" stroke="rgba(232,184,75,.35)" strokeWidth="1.5"/>
        <polygon points="210,153 217,160 210,167 203,160" fill="rgba(232,184,75,.12)"/>
      </svg>

      <div style={{
        position: "absolute", top: "27%", left: "28%", transform: "translateY(-110%)",
        background: "rgba(30,77,58,.8)", border: "1px solid rgba(35,157,140,.45)",
        borderRadius: 6, padding: "5px 10px", whiteSpace: "nowrap", pointerEvents: "none",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#F4EDDF" }}>Juazeiro do Norte</span>
      </div>
      <div style={{
        position: "absolute", top: "47%", left: "52%", transform: "translateX(-50%)",
        background: "rgba(10,16,6,.8)", border: "1px solid rgba(232,184,75,.4)",
        borderRadius: 6, padding: "5px 10px", whiteSpace: "nowrap", pointerEvents: "none",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#E9B23C" }}>Crato</span>
      </div>
      <div style={{
        position: "absolute", top: "60%", left: "60%",
        background: "rgba(6,10,14,.8)", border: "1px solid rgba(224,113,90,.4)",
        borderRadius: 6, padding: "5px 10px", whiteSpace: "nowrap", pointerEvents: "none",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#E0715A" }}>Barbalha</span>
      </div>
    </div>
  );
}
