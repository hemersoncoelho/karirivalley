"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { useNbTheme } from "@/hooks/useNbTheme";
import { ArrowRight, SearchX } from "lucide-react";
import { useState } from "react";
import type React from "react";

const CATEGORIES = [
  { id: "all", label: "Todas" },
  { id: "editais", label: "Editais" },
  { id: "vagas", label: "Vagas" },
  { id: "aceleracao", label: "Aceleração" },
  { id: "mentoria", label: "Mentoria" },
  { id: "programas", label: "Programas" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

export default function OpportunitiesSection() {
  const { theme } = useNbTheme();
  const isDark = theme === "dark";
  const { ref, inView } = useInView();
  const [activeTab, setActiveTab] = useState<CategoryId>("all");

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? "var(--nb-page-bg)" : "var(--nb-sand-2)", padding: "110px 0 100px", borderTop: "3px solid var(--nb-navbar-border)" }}>

      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "38vw", height: "38vw", maxWidth: 520, maxHeight: 520,
        top: "-12%", left: "-6%",
        background: "radial-gradient(circle, rgba(232,178,60,.18) 0%, rgba(232,178,60,.04) 55%, transparent 72%)",
        animationDuration: "28s", animationDelay: "-15s",
      }} />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.5 }} />

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>

        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div style={fadeUp(0)}>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: 32, height: 2, background: "var(--nb-mustard)" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: isDark ? "var(--nb-mustard)" : "#8A5C13", fontFamily: "var(--font-geo)" }}>
                Oportunidades
              </span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(28px, 3.2vw, 44px)",
              fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.7px",
              color: "var(--nb-heading)", margin: 0,
            }}>
              Oportunidades em{" "}
              <span style={{ color: "var(--nb-terracotta)", fontStyle: "italic" }}>Destaque</span>
            </h2>
          </div>
          <Link href="/oportunidades" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 700, color: isDark ? "rgba(244,237,223,.5)" : "var(--nb-forest)", fontFamily: "var(--font-geo)",
            textDecoration: "none",
            ...fadeUp(0.05),
          }}>
            Ver todas <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8" style={fadeUp(0.1)}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={activeTab === cat.id ? "" : "kv-press"}
              style={{
                padding: "7px 16px", borderRadius: isDark ? 999 : 8,
                fontSize: 13, fontWeight: 700, fontFamily: "var(--font-geo)",
                border: isDark ? `1px solid ${activeTab === cat.id ? "var(--nb-mustard)" : "rgba(255,255,255,.1)"}` : "2px solid var(--nb-ink)",
                cursor: "pointer",
                transition: "background .2s, color .2s, box-shadow .2s, border-color .2s",
                background: isDark
                  ? (activeTab === cat.id ? "var(--nb-mustard)" : "rgba(255,255,255,.04)")
                  : (activeTab === cat.id ? "var(--nb-mustard)" : "var(--nb-cream)"),
                boxShadow: !isDark && activeTab === cat.id ? "var(--shadow-nb-sm)" : "none",
                color: isDark
                  ? (activeTab === cat.id ? "var(--kv-dark)" : "rgba(244,237,223,.6)")
                  : "var(--nb-ink)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div style={{
          background: isDark ? "rgba(255,255,255,.025)" : "var(--nb-cream)",
          border: isDark ? "1px solid rgba(255,255,255,.07)" : "3px dashed var(--nb-ink)",
          borderRadius: isDark ? 20 : 18, padding: "60px 32px",
          textAlign: "center",
          backdropFilter: isDark ? "blur(12px)" : "none",
          WebkitBackdropFilter: isDark ? "blur(12px)" : "none",
          ...fadeUp(0.18),
        }}>
          <div style={{
            width: 64, height: 64,
            background: isDark ? "rgba(232,184,75,.1)" : "var(--nb-mustard)",
            border: isDark ? "1px solid rgba(232,184,75,.22)" : "2px solid var(--nb-ink)",
            borderRadius: isDark ? 16 : 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <SearchX size={26} strokeWidth={2} color={isDark ? "var(--nb-mustard)" : "var(--nb-ink)"} />
          </div>

          <h3 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(17px, 1.8vw, 21px)",
            fontWeight: 700, color: "var(--nb-heading)", marginBottom: 10,
          }}>
            Nenhuma oportunidade publicada no momento
          </h3>
          <p style={{
            fontSize: "clamp(13px, 1.3vw, 15px)",
            color: "var(--nb-body)",
            lineHeight: 1.7, maxWidth: 380,
            margin: "0 auto 28px",
          }}>
            Em breve, editais, vagas, programas e mentorias estarão disponíveis aqui
            para os membros da comunidade.
          </p>

          <Link href="/como-participar" className="kv-press" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "10px 22px", borderRadius: isDark ? 999 : 10,
            fontSize: 13, fontWeight: 700, color: isDark ? "var(--kv-dark)" : "var(--nb-ink)", fontFamily: "var(--font-geo)",
            background: "var(--nb-mustard)",
            border: isDark ? "none" : "2px solid var(--nb-ink)",
            boxShadow: isDark ? "none" : "var(--shadow-nb-sm)",
            textDecoration: "none",
          }}>
            Entrar para a comunidade
          </Link>
        </div>

        {/* Opportunity type labels */}
        <div className="flex flex-wrap gap-3 mt-6" style={fadeUp(0.28)}>
          {["Editais", "Vagas", "Programas de Aceleração", "Mentoria", "Bolsas e Fomento"].map(label => (
            <span key={label} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 999,
              fontSize: 11, fontWeight: 700,
              color: isDark ? "rgba(244,237,223,.3)" : "rgba(22,20,15,.5)",
              background: isDark ? "rgba(255,255,255,.03)" : "var(--nb-cream)",
              border: isDark ? "1px solid rgba(255,255,255,.06)" : "1.5px solid rgba(22,20,15,.2)",
            }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: isDark ? "rgba(232,184,75,.4)" : "var(--nb-terracotta)", display: "inline-block" }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
