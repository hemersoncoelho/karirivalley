"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";

const AVATAR_BG = ["#0F3B36", "#239D8C", "#C25A2E", "#123328", "#E9B23C"] as const;
const AVATAR_INIT = ["JS", "ML", "PC", "AF", "RB"] as const;

export default function FinalCtaSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--nb-forest)", padding: "130px 0 120px", borderTop: "3px solid var(--nb-ink)" }}>

      {/* Aurora blobs */}
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "60vw", height: "60vw", maxWidth: 860, maxHeight: 860,
        top: "-25%", left: "-15%",
        background: "radial-gradient(circle, rgba(15,59,54,.65) 0%, rgba(15,59,54,.15) 55%, transparent 72%)",
        animationDuration: "22s", animationDelay: "-4s",
      }} />
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "50vw", height: "50vw", maxWidth: 700, maxHeight: 700,
        top: "-15%", right: "-12%",
        background: "radial-gradient(circle, rgba(232,178,60,.28) 0%, rgba(232,178,60,.06) 55%, transparent 72%)",
        animationDuration: "30s", animationDelay: "-11s", animationDirection: "reverse",
      }} />
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "45vw", height: "45vw", maxWidth: 620, maxHeight: 620,
        bottom: "-20%", right: "-5%",
        background: "radial-gradient(circle, rgba(35,157,140,.3) 0%, rgba(35,157,140,.07) 55%, transparent 72%)",
        animationDuration: "26s", animationDelay: "-18s",
      }} />
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "35vw", height: "35vw", maxWidth: 480, maxHeight: 480,
        bottom: "-10%", left: "10%",
        background: "radial-gradient(circle, rgba(194,90,46,.3) 0%, rgba(194,90,46,.07) 55%, transparent 72%)",
        animationDuration: "33s", animationDelay: "-24s", animationDirection: "reverse",
      }} />

      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.5, filter: "invert(1)" }} />

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M0 450 Q360 410 720 430 Q1080 450 1440 420" fill="none" stroke="rgba(244,238,225,.07)" strokeWidth="1.5"/>
        <path d="M0 490 Q400 455 800 475 Q1100 492 1440 465" fill="none" stroke="rgba(244,238,225,.05)" strokeWidth="1"/>
      </svg>

      {/* Rotating diamond rings — moldura cultural abstrata */}
      <div className="absolute pointer-events-none kv-slow-spin" style={{
        top: "50%", left: "50%",
        width: "min(100vw, 900px)", height: "min(100vw, 900px)",
        transform: "translate(-50%, -50%)",
      }} aria-hidden="true">
        <svg viewBox="-1 -1 2 2" style={{ width: "100%", height: "100%" }}>
          <polygon points="0,-1 1,0 0,1 -1,0" fill="none" stroke="rgba(232,184,75,.16)" strokeWidth=".012"/>
          <polygon points="0,-.7 .7,0 0,.7 -.7,0" fill="none" stroke="rgba(244,238,225,.1)" strokeWidth=".01"/>
          <polygon points="0,-.45 .45,0 0,.45 -.45,0" fill="none" stroke="rgba(232,184,75,.12)" strokeWidth=".008"/>
        </svg>
      </div>

      <div ref={ref} className="relative max-w-[860px] mx-auto px-6 text-center" style={{ zIndex: 10 }}>

        {/* Badge */}
        <div style={fadeUp(0)}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "7px 18px",
            background: "var(--nb-mustard)", border: "2px solid var(--nb-ink)", borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
            color: "var(--nb-ink)", marginBottom: 28, fontFamily: "var(--font-geo)",
          }}>
            <span style={{
              display: "inline-block", width: 5, height: 5,
              borderRadius: "50%", background: "var(--nb-ink)",
              animation: "kv-pulse-dot 2.5s ease-in-out infinite",
            }} />
            Comunidade aberta para novos membros
          </span>
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "clamp(36px, 5.5vw, 70px)",
          fontWeight: 700,
          lineHeight: 1.06,
          letterSpacing: "-1.5px",
          color: "var(--nb-sand)",
          marginBottom: 24,
          ...fadeUp(0.1),
        }}>
          Faça parte da comunidade que está{" "}
          <span style={{ color: "var(--nb-mustard)", fontStyle: "italic" }}>conectando</span>
          {" "}a inovação no Cariri
        </h2>

        {/* Description */}
        <p style={{
          fontSize: "clamp(15px, 1.6vw, 18px)",
          lineHeight: 1.72,
          color: "rgba(244,238,225,.72)",
          maxWidth: 560,
          margin: "0 auto 44px",
          ...fadeUp(0.2),
        }}>
          A Kariri Valley está construindo o futuro para as inovações do interior do Ceará.
          Vamos nos conectar e criar uma grande comunidade de cultura e inovação — basta
          uma ponte para nos encontrarmos.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-14" style={fadeUp(0.3)}>
          <Link href="/como-participar" className="kv-press" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "16px 36px", borderRadius: 10,
            fontSize: 15, fontWeight: 700, color: "var(--nb-ink)", fontFamily: "var(--font-geo)",
            background: "var(--nb-mustard)", border: "3px solid var(--nb-ink)",
            boxShadow: "var(--shadow-nb-sand)",
            textDecoration: "none",
          }}>
            Entrar para a comunidade
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <Link href="/login" className="kv-press" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "15px 32px", borderRadius: 10,
            fontSize: 15, fontWeight: 700, color: "var(--nb-sand)", fontFamily: "var(--font-geo)",
            background: "transparent", border: "3px solid var(--nb-sand)",
            textDecoration: "none",
          }}>
            Já sou membro
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-4" style={fadeUp(0.42)}>
          <div className="flex">
            {AVATAR_BG.map((bg, i) => (
              <div
                key={i}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: bg,
                  color: bg === "#E9B23C" ? "var(--nb-ink)" : "var(--nb-sand)",
                  fontSize: 11, fontWeight: 700,
                  border: "2px solid var(--nb-forest)",
                  marginLeft: i === 0 ? 0 : -9,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: AVATAR_BG.length - i,
                  position: "relative",
                }}
              >
                {AVATAR_INIT[i]}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "rgba(244,238,225,.7)" }}>
            Junte-se a{" "}500+ pessoas que já{" "}
            <strong style={{ color: "var(--nb-sand)" }}>transformam nosso território</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
