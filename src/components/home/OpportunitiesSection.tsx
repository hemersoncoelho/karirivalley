"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
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
  const { ref, inView } = useInView();
  const [activeTab, setActiveTab] = useState<CategoryId>("all");

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "#060D08", padding: "110px 0 100px" }}>

      <div className="kv-aurora absolute pointer-events-none" style={{
        width: "38vw", height: "38vw", maxWidth: 520, maxHeight: 520,
        top: "-12%", left: "-6%",
        background: "radial-gradient(circle, rgba(232,184,75,.1) 0%, rgba(232,184,75,.02) 55%, transparent 72%)",
        animationDuration: "28s", animationDelay: "-15s",
      }} />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.25 }} />

      <div ref={ref} className="relative max-w-[1300px] mx-auto px-6 lg:px-16" style={{ zIndex: 10 }}>

        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div style={fadeUp(0)}>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: 32, height: 1, background: "#E9B23C" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#E9B23C" }}>
                Oportunidades
              </span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(28px, 3.2vw, 44px)",
              fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.7px",
              color: "#F4EDDF", margin: 0,
            }}>
              Oportunidades em{" "}
              <span style={{ color: "#E9B23C", fontStyle: "italic" }}>Destaque</span>
            </h2>
          </div>
          <Link href="/oportunidades" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600, color: "rgba(244,237,223,.5)",
            textDecoration: "none", transition: "color .2s",
            ...fadeUp(0.05),
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#F4EDDF"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(244,237,223,.5)"; }}
          >
            Ver todas <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8" style={fadeUp(0.1)}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                padding: "7px 16px", borderRadius: 999,
                fontSize: 13, fontWeight: 600,
                border: "1px solid",
                cursor: "pointer",
                transition: "background .2s, border-color .2s, color .2s",
                background: activeTab === cat.id ? "#E9B23C" : "rgba(255,255,255,.04)",
                borderColor: activeTab === cat.id ? "#E9B23C" : "rgba(255,255,255,.1)",
                color: activeTab === cat.id ? "#060D08" : "rgba(244,237,223,.6)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div style={{
          background: "rgba(255,255,255,.025)",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 20, padding: "60px 32px",
          textAlign: "center", backdropFilter: "blur(12px)",
          ...fadeUp(0.18),
        }}>
          <div style={{
            width: 64, height: 64,
            background: "rgba(232,184,75,.1)",
            border: "1px solid rgba(232,184,75,.22)",
            borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <SearchX size={26} strokeWidth={1.5} color="#E9B23C" />
          </div>

          <h3 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(17px, 1.8vw, 21px)",
            fontWeight: 700, color: "#F4EDDF", marginBottom: 10,
          }}>
            Nenhuma oportunidade publicada no momento
          </h3>
          <p style={{
            fontSize: "clamp(13px, 1.3vw, 15px)",
            color: "rgba(244,237,223,.42)",
            lineHeight: 1.7, maxWidth: 380,
            margin: "0 auto 28px",
          }}>
            Em breve, editais, vagas, programas e mentorias estarão disponíveis aqui
            para os membros da comunidade.
          </p>

          <Link href="/como-participar" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "10px 22px", borderRadius: 999,
            fontSize: 13, fontWeight: 600, color: "#060D08",
            background: "#E9B23C",
            textDecoration: "none",
            transition: "opacity .2s, transform .2s",
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.opacity = "0.88";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }}
          >
            Entrar para a comunidade
          </Link>
        </div>

        {/* Opportunity type labels */}
        <div className="flex flex-wrap gap-3 mt-6" style={fadeUp(0.28)}>
          {["Editais", "Vagas", "Programas de Aceleração", "Mentoria", "Bolsas e Fomento"].map(label => (
            <span key={label} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 999,
              fontSize: 11, fontWeight: 600,
              color: "rgba(244,237,223,.3)",
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.06)",
            }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(232,184,75,.4)", display: "inline-block" }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
