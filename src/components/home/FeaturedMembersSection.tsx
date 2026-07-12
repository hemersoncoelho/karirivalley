"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { UserCircle2, ArrowRight } from "lucide-react";
import type React from "react";

const PLACEHOLDER_COLORS = ["#1E4D3A", "#239D8C", "#C25A2E", "#0F2240"] as const;

export default function FeaturedMembersSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "#10100E", padding: "110px 0 100px" }}>

      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "40vw", height: "40vw", maxWidth: 560, maxHeight: 560,
        bottom: "-15%", right: "-8%",
        background: "radial-gradient(circle, rgba(232,184,75,.1) 0%, rgba(232,184,75,.02) 55%, transparent 72%)",
        animationDuration: "30s", animationDelay: "-7s",
      }} />

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>

        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div style={fadeUp(0)}>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: 32, height: 1, background: "#E9B23C" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#E9B23C" }}>
                Comunidade
              </span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(28px, 3.2vw, 44px)",
              fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.7px",
              color: "#F4EDDF", margin: 0,
            }}>
              Membros em{" "}
              <span style={{ color: "#E9B23C", fontStyle: "italic" }}>Destaque</span>
            </h2>
          </div>
          <Link href="/membros" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600, color: "rgba(244,237,223,.5)",
            textDecoration: "none", transition: "color .2s",
            ...fadeUp(0.05),
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#F4EDDF"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(244,237,223,.5)"; }}
          >
            Ver diretório <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        {/* Skeleton placeholder cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
          {PLACEHOLDER_COLORS.map((color, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,.028)",
                border: "1px solid rgba(255,255,255,.06)",
                borderRadius: 16, padding: "28px 20px",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity .7s ease ${0.1 + i * 0.07}s, transform .7s ease ${0.1 + i * 0.07}s`,
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: `${color}45`,
                border: `1px solid ${color}28`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <UserCircle2 size={24} strokeWidth={1.4} color="rgba(244,237,223,.25)" />
              </div>
              <div style={{ width: "65%", height: 9, background: "rgba(255,255,255,.06)", borderRadius: 4, marginBottom: 8 }} />
              <div style={{ width: "85%", height: 7, background: "rgba(255,255,255,.04)", borderRadius: 4, marginBottom: 14 }} />
              <div className="flex gap-2">
                <div style={{ height: 18, width: 52, background: "rgba(255,255,255,.04)", borderRadius: 999 }} />
                <div style={{ height: 18, width: 40, background: "rgba(255,255,255,.03)", borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Empty state notice */}
        <div style={{
          background: "rgba(232,184,75,.04)",
          border: "1px solid rgba(232,184,75,.1)",
          borderRadius: 12, padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 14,
          ...fadeUp(0.42),
        }}>
          <div style={{
            width: 36, height: 36,
            background: "rgba(232,184,75,.1)",
            border: "1px solid rgba(232,184,75,.2)",
            borderRadius: 10, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="13" height="13" viewBox="-1 -1 2 2" aria-hidden="true">
              <polygon points="0,-.72 .72,0 0,.72 -.72,0" fill="#E9B23C"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#F4EDDF", marginBottom: 3 }}>
              Os primeiros membros da comunidade aparecerão aqui em breve.
            </p>
            <p style={{ fontSize: 13, color: "rgba(244,237,223,.45)", margin: 0 }}>
              Seja um dos membros fundadores —{" "}
              <Link href="/como-participar" style={{ color: "#E9B23C", textDecoration: "none", fontWeight: 600 }}>
                solicite sua entrada
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
