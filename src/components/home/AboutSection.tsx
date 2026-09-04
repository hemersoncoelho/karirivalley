"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";

const ACTORS = [
  { icon: "🚀", label: "Startups", role: "quem constrói produto" },
  { icon: "💻", label: "Talentos", role: "quem executa e ensina" },
  { icon: "🏦", label: "Empresas", role: "quem fomenta" },
  { icon: "🎓", label: "Universidades", role: "quem forma e articula" },
] as const;

/** Mockup da aplicação — a "vitrine viva" do diretório, estilo app nativo. */
function AppMockup() {
  const rows = [
    { initials: "ML", name: "Maria Lima", tag: "Startups", city: "Crato", bg: "#1E4D3A" },
    { initials: "PC", name: "Pedro Costa", tag: "Investimento", city: "Juazeiro", bg: "#C25A2E" },
    { initials: "AF", name: "Ana Ferreira", tag: "Educação", city: "Barbalha", bg: "#239D8C" },
    { initials: "RB", name: "Rafael Bezerra", tag: "Dev · Remoto", city: "Lavras", bg: "#0F3B36" },
  ];
  return (
    <div
      style={{
        background: "var(--nb-cream)",
        border: "1px solid rgba(22,20,15,.08)",
        borderRadius: 20,
        boxShadow: "0 2px 4px rgba(22,20,15,.04), 0 24px 48px rgba(22,20,15,.08)",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Barra da janela */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(22,20,15,.07)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#E0715A", "#E9B23C", "#239D8C"].map(c => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: 999, background: c, opacity: 0.85 }} />
          ))}
        </div>
        <span className="kv-kicker" style={{ fontSize: 10, color: "var(--nb-body)" }}>kariri valley · diretório</span>
        <span style={{ width: 34 }} />
      </div>

      {rows.map((m, i) => (
        <div
          key={m.initials}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "13px 16px",
            borderBottom: i < rows.length - 1 ? "1px solid rgba(22,20,15,.06)" : "none",
          }}
        >
          <span
            style={{
              width: 36, height: 36, borderRadius: 999, background: m.bg,
              color: "var(--nb-sand)", display: "inline-flex", alignItems: "center",
              justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}
          >
            {m.initials}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--nb-heading)" }}>{m.name}</p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--nb-body)" }}>{m.city}</p>
          </div>
          <span
            className="kv-kicker"
            style={{
              fontSize: 10, padding: "4px 10px", borderRadius: 999,
              background: "rgba(30,77,58,.08)", color: "var(--nb-forest)",
            }}
          >
            {m.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AboutSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section
      id="ecossistema"
      className="relative overflow-hidden"
      style={{ background: "var(--nb-page-bg)", padding: "104px 0 112px" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="01" label="O ecossistema" />

        <div className="mt-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-[6fr_5fr]">
          <div>
            <h2
              className="kv-display"
              style={{
                fontSize: "clamp(34px, 3.8vw, 54px)",
                color: "var(--nb-heading)",
                marginBottom: 22,
                ...fadeUp(0.05),
              }}
            >
              Um ecossistema formado por{" "}
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-turquoise)" }}>
                quem constrói
              </em>{" "}
              o Cariri
            </h2>

            <p
              style={{
                fontSize: "clamp(15px, 1.4vw, 17px)",
                lineHeight: 1.75,
                color: "var(--nb-body)",
                maxWidth: 470,
                marginBottom: 36,
                ...fadeUp(0.15),
              }}
            >
              Um mapa vivo da inovação do Cariri, CE. Da ideia ao investimento,
              do laboratório à política pública — os agentes se encontram,
              colaboram e crescem juntos.
            </p>

            {/* Atores como chips definidos, não linhas soltas */}
            <div className="grid grid-cols-2 gap-3" style={fadeUp(0.25)}>
              {ACTORS.map(a => (
                <div
                  key={a.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "var(--nb-cream)",
                    border: "1px solid rgba(22,20,15,.08)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    boxShadow: "0 1px 2px rgba(22,20,15,.04)",
                  }}
                >
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{a.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--nb-heading)" }}>{a.label}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--nb-body)" }}>{a.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, ...fadeUp(0.3) }}>
              <Link
                href="/sobre"
                className="kv-kicker"
                style={{
                  color: "var(--nb-ink)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ borderBottom: "1px solid var(--nb-ink)", paddingBottom: 2 }}>
                  Ler o manifesto completo
                </span>
                <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
              </Link>
            </div>
          </div>

          <div style={fadeUp(0.2)}>
            <AppMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
