"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex, DiamondMark } from "@/components/ui/editorial";

const ACTORS = [
  { n: "01", label: "Startups e empreendedores", role: "quem constrói produto" },
  { n: "02", label: "Talentos e profissionais", role: "quem executa e ensina" },
  { n: "03", label: "Empresas e investidores", role: "quem fomenta" },
  { n: "04", label: "Universidades e poder público", role: "quem forma e articula" },
] as const;

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
      style={{ background: "var(--nb-page-bg)", padding: "96px 0 110px" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="02" label="O ecossistema" />

        <div className="mt-12 grid grid-cols-1 items-start gap-14 lg:grid-cols-[5fr_6fr]">
          <div>
            <h2
              className="kv-display"
              style={{
                fontSize: "clamp(34px, 3.8vw, 56px)",
                color: "var(--nb-heading)",
                marginBottom: 28,
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
                maxWidth: 460,
                marginBottom: 34,
                ...fadeUp(0.15),
              }}
            >
              A Kariri Valley é um mapa vivo da inovação do Cariri, CE. Da ideia ao
              investimento, do laboratório à política pública — os agentes se
              encontram, colaboram e crescem juntos.
            </p>

            <div style={fadeUp(0.25)}>
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

          {/* Lista-índice dos atores — a estrutura fala, não o parágrafo */}
          <div style={fadeUp(0.2)}>
            {ACTORS.map((a, i) => (
              <div
                key={a.n}
                className="group"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 18,
                  padding: "22px 4px",
                  borderTop: "1px solid var(--nb-line)",
                  borderBottom: i === ACTORS.length - 1 ? "1px solid var(--nb-line)" : "none",
                }}
              >
                <span className="kv-index-num" style={{ fontSize: 13, color: "var(--nb-terracotta)" }}>
                  {a.n}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 21, color: "var(--nb-heading)" }}>
                    {a.label}
                  </p>
                  <p className="kv-meta" style={{ margin: "4px 0 0", color: "var(--nb-body)" }}>
                    {a.role}
                  </p>
                </div>
                <DiamondMark outline size={8} color="var(--nb-body)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
