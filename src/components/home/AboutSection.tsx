"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";
import { ArrowRight } from "lucide-react";

/**
 * "O ecossistema" — headline editorial à esquerda com cards ilustrados dos
 * atores; à direita, o "mapa vivo": painel do diretório com membros
 * conectados por rotas tracejadas ao diamante central da marca.
 */
const ACTORS = [
  { icon: "🚀", label: "Startups", role: "quem constrói produto", bg: "#F7E7DF", fg: "#A24A32", arrow: "#C25A2E" },
  { icon: "💻", label: "Talentos", role: "quem executa e ensina", bg: "#E4EBDD", fg: "#4E6B45", arrow: "#5F8753" },
  { icon: "🏢", label: "Empresas", role: "quem fomenta", bg: "#F3E9CF", fg: "#8A5C13", arrow: "#C99A2E" },
  { icon: "🎓", label: "Universidades", role: "quem forma e articula", bg: "#DFEFEA", fg: "#166E62", arrow: "#239D8C" },
] as const;

const MAP_MEMBERS = [
  { initials: "ML", name: "Maria Lima", city: "Crato", tag: "Startups", bg: "#1E4D3A", x: 20, y: 16 },
  { initials: "PC", name: "Pedro Costa", city: "Juazeiro", tag: "Investimento", bg: "#C25A2E", x: 72, y: 22 },
  { initials: "AF", name: "Ana Ferreira", city: "Barbalha", tag: "Educação", bg: "#239D8C", x: 22, y: 62 },
  { initials: "RB", name: "Rafael Bezerra", city: "Lavras", tag: "Dev · Remoto", bg: "#0F3B36", x: 68, y: 68 },
] as const;

/** Nó de membro no mapa: avatar circular + nome/cidade + chip de área. */
function MemberNode({ m }: { m: (typeof MAP_MEMBERS)[number] }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${m.x}%`,
        top: `${m.y}%`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--nb-cream)",
        border: "1px solid rgba(22,20,15,.08)",
        borderRadius: 999,
        padding: "6px 14px 6px 6px",
        boxShadow: "0 2px 8px rgba(22,20,15,.08)",
        whiteSpace: "nowrap",
        zIndex: 2,
      }}
    >
      <span
        style={{
          width: 40, height: 40, borderRadius: 999, background: m.bg,
          color: "var(--nb-sand)", display: "inline-flex", alignItems: "center",
          justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0,
        }}
      >
        {m.initials}
      </span>
      <span>
        <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--nb-heading)", lineHeight: 1.2 }}>{m.name}</span>
        <span style={{ display: "block", fontSize: 11, color: "var(--nb-body)", lineHeight: 1.3 }}>{m.city}</span>
      </span>
      <span
        className="kv-kicker"
        style={{
          fontSize: 9, padding: "3px 9px", borderRadius: 999,
          background: "rgba(30,77,58,.08)", color: "var(--nb-forest)",
        }}
      >
        {m.tag}
      </span>
    </div>
  );
}

/** Painel "mapa vivo" — o diretório como território conectado. */
function LivingMap() {
  return (
    <div
      style={{
        background: "var(--nb-cream)",
        border: "1px solid rgba(22,20,15,.08)",
        borderRadius: 24,
        boxShadow: "0 2px 4px rgba(22,20,15,.04), 0 24px 48px rgba(22,20,15,.08)",
        padding: "22px 22px 18px",
        width: "100%",
      }}
    >
      <p
        className="kv-kicker"
        style={{ textAlign: "center", color: "var(--nb-body)", margin: "0 0 8px" }}
      >
        Kariri Valley · Diretório
      </p>

      {/* Território conectado */}
      <div style={{ position: "relative", aspectRatio: "1 / 0.92" }}>
        {/* rotas tracejadas */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {[
            "M 20 16 Q 33 30 50 42",
            "M 72 22 Q 62 32 50 42",
            "M 50 42 Q 36 52 22 62",
            "M 50 42 Q 60 55 68 68",
            "M 20 16 Q 22 40 22 62",
            "M 72 22 Q 71 45 68 68",
          ].map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="rgba(22,20,15,.18)"
              strokeWidth="0.35"
              strokeDasharray="1.6 2.2"
              strokeLinecap="round"
            />
          ))}
          {/* contorno suave do território */}
          <ellipse
            cx="50" cy="44" rx="38" ry="36"
            fill="rgba(30,77,58,.035)"
            stroke="rgba(30,77,58,.14)"
            strokeWidth="0.3"
            strokeDasharray="1 2"
          />
        </svg>

        {/* hub central: diamante da marca */}
        <div
          style={{
            position: "absolute", left: "50%", top: "42%",
            transform: "translate(-50%,-50%)",
            width: 64, height: 64, borderRadius: 999,
            background: "var(--nb-forest)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 16px rgba(30,77,58,.35)",
            zIndex: 2,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 22, height: 22,
              background: "transparent",
              border: "2.5px solid var(--nb-sand)",
              transform: "rotate(45deg)",
            }}
          />
        </div>

        {/* pontos de interesse */}
        {[
          { emoji: "👥", x: 8, y: 38, bg: "#239D8C" },
          { emoji: "📈", x: 88, y: 40, bg: "#E9B23C" },
          { emoji: "💡", x: 86, y: 58, bg: "#C25A2E" },
          { emoji: "🌵", x: 44, y: 86, bg: "transparent", plain: true },
          { emoji: "📍", x: 52, y: 74, bg: "#E9B23C" },
        ].map((p, i) => (
          <span
            key={i}
            style={{
              position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
              transform: "translate(-50%,-50%)",
              width: p.plain ? undefined : 34, height: p.plain ? undefined : 34,
              borderRadius: 999,
              background: p.bg,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: p.plain ? 20 : 14,
              zIndex: 1,
            }}
          >
            {p.emoji}
          </span>
        ))}

        {MAP_MEMBERS.map(m => (
          <MemberNode key={m.initials} m={m} />
        ))}
      </div>

      {/* rodapé do painel: lema + CTA */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, marginTop: 10, flexWrap: "wrap",
        }}
      >
        <p
          style={{
            margin: 0, fontFamily: "var(--font-fraunces), Georgia, serif",
            fontStyle: "italic", fontSize: 17, color: "var(--nb-heading)",
          }}
        >
          “Do sertão nasce o futuro.”
        </p>
        <Link
          href="/membros"
          className="kv-kicker inline-flex items-center gap-2 no-underline"
          style={{
            background: "var(--nb-forest)", color: "var(--nb-cream)",
            padding: "11px 18px", borderRadius: 12, fontSize: 11,
          }}
        >
          Ver todos os membros
          <ArrowRight size={13} strokeWidth={2.2} />
        </Link>
      </div>
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
                fontSize: "clamp(36px, 4.2vw, 60px)",
                color: "var(--nb-heading)",
                marginBottom: 20,
                lineHeight: 1.04,
                ...fadeUp(0.05),
              }}
            >
              Um ecossistema formado por{" "}
              <em
                style={{
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--nb-turquoise)",
                  borderBottom: "3px solid var(--nb-mustard)",
                  paddingBottom: 2,
                }}
              >
                quem constrói
              </em>{" "}
              o Cariri{" "}
              <span aria-hidden="true" style={{ color: "var(--nb-terracotta)", fontSize: ".55em", verticalAlign: "super" }}>✦</span>
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

            {/* cards ilustrados dos atores */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" style={fadeUp(0.25)}>
              {ACTORS.map(a => (
                <div
                  key={a.label}
                  style={{
                    background: a.bg,
                    borderRadius: 18,
                    padding: "16px 14px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 30, lineHeight: 1 }}>{a.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: "var(--nb-heading)" }}>{a.label}</p>
                    <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: a.fg }}>{a.role}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 26, height: 26, borderRadius: 999,
                      background: a.arrow, color: "var(--nb-cream)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      marginTop: 2,
                    }}
                  >
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, ...fadeUp(0.3) }}>
              <Link
                href="/sobre"
                className="kv-kicker inline-flex items-center gap-2 no-underline"
                style={{
                  background: "var(--nb-ink)", color: "var(--nb-cream)",
                  padding: "13px 20px", borderRadius: 12, fontSize: 11,
                }}
              >
                Ler o manifesto completo
                <ArrowRight size={13} strokeWidth={2.2} />
              </Link>
            </div>
          </div>

          <div style={fadeUp(0.2)}>
            <LivingMap />
          </div>
        </div>
      </div>
    </section>
  );
}
