"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";

const AVATAR_BG = ["#1E4D3A", "#239D8C", "#C25A2E", "#0F2240", "#E8B84B"] as const;
const AVATAR_INIT = ["JS", "ML", "PC", "AF", "RB"] as const;

export default function FinalCtaSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "#060D08", padding: "130px 0 120px" }}>

      {/* Aurora blobs */}
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "60vw", height: "60vw", maxWidth: 860, maxHeight: 860,
        top: "-25%", left: "-15%",
        background: "radial-gradient(circle, rgba(30,77,58,.55) 0%, rgba(30,77,58,.14) 55%, transparent 72%)",
        animationDuration: "22s", animationDelay: "-4s",
      }} />
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "50vw", height: "50vw", maxWidth: 700, maxHeight: 700,
        top: "-15%", right: "-12%",
        background: "radial-gradient(circle, rgba(232,184,75,.22) 0%, rgba(232,184,75,.05) 55%, transparent 72%)",
        animationDuration: "30s", animationDelay: "-11s", animationDirection: "reverse",
      }} />
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "45vw", height: "45vw", maxWidth: 620, maxHeight: 620,
        bottom: "-20%", right: "-5%",
        background: "radial-gradient(circle, rgba(35,157,140,.28) 0%, rgba(35,157,140,.06) 55%, transparent 72%)",
        animationDuration: "26s", animationDelay: "-18s",
      }} />
      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "35vw", height: "35vw", maxWidth: 480, maxHeight: 480,
        bottom: "-10%", left: "10%",
        background: "radial-gradient(circle, rgba(194,90,46,.28) 0%, rgba(194,90,46,.06) 55%, transparent 72%)",
        animationDuration: "33s", animationDelay: "-24s", animationDirection: "reverse",
      }} />

      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.4 }} />

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M0 450 Q360 410 720 430 Q1080 450 1440 420" fill="none" stroke="rgba(255,255,255,.018)" strokeWidth="1.5"/>
        <path d="M0 490 Q400 455 800 475 Q1100 492 1440 465" fill="none" stroke="rgba(255,255,255,.012)" strokeWidth="1"/>
      </svg>

      {/* Rotating diamond rings */}
      <div className="absolute pointer-events-none kv-slow-spin" style={{
        top: "50%", left: "50%",
        width: "min(100vw, 900px)", height: "min(100vw, 900px)",
        transform: "translate(-50%, -50%)",
      }} aria-hidden="true">
        <svg viewBox="-1 -1 2 2" style={{ width: "100%", height: "100%" }}>
          <polygon points="0,-1 1,0 0,1 -1,0" fill="none" stroke="rgba(232,184,75,.04)" strokeWidth=".012"/>
          <polygon points="0,-.7 .7,0 0,.7 -.7,0" fill="none" stroke="rgba(35,157,140,.035)" strokeWidth=".01"/>
          <polygon points="0,-.45 .45,0 0,.45 -.45,0" fill="none" stroke="rgba(232,184,75,.025)" strokeWidth=".008"/>
        </svg>
      </div>

      <div ref={ref} className="relative max-w-[860px] mx-auto px-6 text-center" style={{ zIndex: 10 }}>

        {/* Badge */}
        <div style={fadeUp(0)}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "7px 18px", borderRadius: 999,
            background: "rgba(30,77,58,.4)", border: "1px solid rgba(35,157,140,.35)",
            fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase",
            color: "#6DC99A", marginBottom: 28,
          }}>
            <span style={{
              display: "inline-block", width: 5, height: 5,
              borderRadius: "50%", background: "#3ECF8E",
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
          color: "#F4EDDF",
          marginBottom: 24,
          ...fadeUp(0.1),
        }}>
          Faça parte da comunidade que está{" "}
          <span style={{ color: "#239D8C", fontStyle: "italic" }}>conectando</span>
          {" "}a inovação no Cariri
        </h2>

        {/* Description */}
        <p style={{
          fontSize: "clamp(15px, 1.6vw, 18px)",
          lineHeight: 1.72,
          color: "rgba(244,237,223,.52)",
          maxWidth: 560,
          margin: "0 auto 44px",
          ...fadeUp(0.2),
        }}>
          A Kariri Valley está construindo o maior mapa de inovação do interior do Ceará.
          Venha conectar-se com quem está construindo o futuro da região e deixar sua
          marca neste ecossistema.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-14" style={fadeUp(0.3)}>
          <Link href="/como-participar" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "16px 36px", borderRadius: 999,
            fontSize: 15, fontWeight: 600, color: "#F4EDDF",
            background: "#1E4D3A", border: "1px solid rgba(255,255,255,.1)",
            textDecoration: "none",
            transition: "transform .3s cubic-bezier(.4,0,.2,1), box-shadow .3s, background .25s",
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-2px)";
              el.style.background = "#245f47";
              el.style.boxShadow = "0 16px 48px rgba(30,77,58,.55)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.background = "#1E4D3A";
              el.style.boxShadow = "none";
            }}
          >
            Entrar para a comunidade
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "15px 32px", borderRadius: 999,
            fontSize: 15, fontWeight: 500, color: "rgba(244,237,223,.65)",
            background: "transparent", border: "1px solid rgba(255,255,255,.16)",
            textDecoration: "none",
            transition: "color .25s, border-color .25s, background .25s",
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#F4EDDF";
              el.style.borderColor = "rgba(255,255,255,.36)";
              el.style.background = "rgba(255,255,255,.05)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "rgba(244,237,223,.65)";
              el.style.borderColor = "rgba(255,255,255,.16)";
              el.style.background = "transparent";
            }}
          >
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
                  color: bg === "#E8B84B" ? "#1A1A1A" : "#F4EDDF",
                  fontSize: 11, fontWeight: 700,
                  border: "2px solid #060D08",
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
          <p style={{ fontSize: 13, color: "rgba(244,237,223,.5)" }}>
            Junte-se a quem já está{" "}
            <strong style={{ color: "#F4EDDF" }}>construindo o ecossistema</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
