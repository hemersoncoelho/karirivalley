"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { useState } from "react";
import EcosystemNetwork from "./ecosystem/EcosystemNetwork";

export default function AboutSection() {
  const { ref, inView } = useInView();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

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
    <section id="ecossistema" className="relative overflow-hidden" style={{ background: "#060D08", padding: "88px 0 110px" }}>

      {/* Bridge connector — continuação do fio que desce do Hero */}
      <div className="absolute left-1/2 pointer-events-none" style={{ top: 0, transform: "translateX(-50%)", zIndex: 11 }} aria-hidden="true">
        <div className="kv-bridge-line kv-bridge-line-up" />
      </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-16 lg:gap-14 items-center">

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
              Um ecossistema formado por{" "}
              <span style={{ color: "#239D8C", fontStyle: "italic" }}>quem constrói</span>
              {" "}o Cariri
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
              Da ideia ao investimento, do laboratório à política pública — reunimos
              todos os agentes que fazem o futuro da região acontecer, para que possam
              se encontrar, colaborar e crescer juntos.
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

          <div className="flex items-center justify-center mt-2 lg:mt-0" style={fadeRight(0.35)}>
            <EcosystemNetwork inView={inView} activeId={activeGroupId} onActiveChange={setActiveGroupId} />
          </div>
        </div>
      </div>
    </section>
  );
}

