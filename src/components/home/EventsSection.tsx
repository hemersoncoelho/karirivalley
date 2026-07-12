"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { CalendarX2, ArrowRight, ExternalLink, Globe } from "lucide-react";
import type React from "react";

export default function EventsSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "#060D08", padding: "110px 0 100px" }}>

      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "35vw", height: "35vw", maxWidth: 480, maxHeight: 480,
        top: "-10%", right: "-5%",
        background: "radial-gradient(circle, rgba(35,157,140,.14) 0%, rgba(35,157,140,.03) 55%, transparent 72%)",
        animationDuration: "26s", animationDelay: "-10s",
      }} />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.25 }} />

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>

        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div style={fadeUp(0)}>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: 32, height: 1, background: "#239D8C" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#239D8C" }}>
                Agenda
              </span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(28px, 3.2vw, 44px)",
              fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.7px",
              color: "#F4EDDF", margin: 0,
            }}>
              Próximos{" "}
              <span style={{ color: "#239D8C", fontStyle: "italic" }}>Eventos</span>
            </h2>
          </div>
          <Link href="/eventos" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600, color: "rgba(244,237,223,.5)",
            textDecoration: "none", transition: "color .2s",
            ...fadeUp(0.05),
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#F4EDDF"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(244,237,223,.5)"; }}
          >
            Ver todos <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        {/* Empty state */}
        <div style={{
          background: "rgba(255,255,255,.028)",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 20,
          padding: "64px 32px",
          textAlign: "center",
          backdropFilter: "blur(12px)",
          ...fadeUp(0.15),
        }}>
          <div style={{
            width: 72, height: 72,
            background: "rgba(35,157,140,.1)",
            border: "1px solid rgba(35,157,140,.22)",
            borderRadius: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <CalendarX2 size={28} strokeWidth={1.5} color="#239D8C" />
          </div>

          <h3 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(18px, 2vw, 22px)",
            fontWeight: 700, color: "#F4EDDF", marginBottom: 12,
          }}>
            Nenhum evento publicado ainda
          </h3>
          <p style={{
            fontSize: "clamp(14px, 1.4vw, 15px)",
            color: "rgba(244,237,223,.45)",
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
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "10px 20px", borderRadius: 999,
                fontSize: 13, fontWeight: 600, color: "#F4EDDF",
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)",
                textDecoration: "none", transition: "background .2s, border-color .2s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,.1)";
                el.style.borderColor = "rgba(255,255,255,.2)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,.06)";
                el.style.borderColor = "rgba(255,255,255,.12)";
              }}
            >
              <ExternalLink size={15} strokeWidth={1.8} />
              Redes Sociais
            </a>
            <Link href="/como-participar" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "10px 20px", borderRadius: 999,
              fontSize: 13, fontWeight: 600, color: "#239D8C",
              background: "rgba(35,157,140,.1)", border: "1px solid rgba(35,157,140,.25)",
              textDecoration: "none", transition: "background .2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(35,157,140,.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(35,157,140,.1)"; }}
            >
              <Globe size={15} strokeWidth={1.8} />
              Acompanhar a comunidade
            </Link>
          </div>
        </div>

        {/* Skeleton placeholder cards */}
        <div className="grid sm:grid-cols-3 gap-4 mt-5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,.015)",
                border: "1px dashed rgba(255,255,255,.06)",
                borderRadius: 14, padding: "24px 20px",
                opacity: 0.5 - i * 0.12,
                ...fadeUp(0.2 + i * 0.06),
              }}
            >
              <div style={{ width: 48, height: 10, background: "rgba(255,255,255,.06)", borderRadius: 4, marginBottom: 12 }} />
              <div style={{ width: "70%", height: 8, background: "rgba(255,255,255,.05)", borderRadius: 4, marginBottom: 8 }} />
              <div style={{ width: "50%", height: 6, background: "rgba(255,255,255,.04)", borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
