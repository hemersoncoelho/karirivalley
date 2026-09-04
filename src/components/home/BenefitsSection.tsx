"use client";

import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex, MetaDot } from "@/components/ui/editorial";

/**
 * "O que o vale devolve" — recriação da antiga BenefitsSection.
 * Arquétipo: split assimétrico — benefícios em lista-índice à esquerda,
 * halftone-earth (o mapa vivo) como figura-âncora à direita com legenda.
 */
const BENEFITS = [
  { t: "Diretório vivo", d: "perfis reais, verificados, com o que cada um busca e oferece." },
  { t: "Agenda ativa", d: "encontros, talks e workshops que mantêm o vale em movimento." },
  { t: "Oportunidades primeiro", d: "editais, vagas e programas chegam aos membros antes." },
  { t: "Vitrine do território", d: "sua empresa e seu trabalho visíveis para quem decide." },
  { t: "Rede sem intermediário", d: "conexão direta entre quem faz — sem portas fechadas." },
] as const;

export default function BenefitsSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--nb-sand-2)", borderTop: "1px solid var(--nb-line)", padding: "96px 0 104px" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="03" label="Benefícios" title="o que o vale devolve" accentColor="#8A5C13" />

        <div className="mt-12 grid grid-cols-1 items-start gap-14 lg:grid-cols-[6fr_5fr]">
          <div>
            <h2
              className="kv-display"
              style={{ fontSize: "clamp(30px, 3.4vw, 50px)", color: "var(--nb-heading)", margin: "0 0 36px", ...fadeUp(0) }}
            >
              Pertencer tem{" "}
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-terracotta)" }}>retorno</em>.
            </h2>

            {BENEFITS.map((b, i) => (
              <div
                key={b.t}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr",
                  gap: 14,
                  alignItems: "baseline",
                  borderTop: "1px solid var(--nb-line)",
                  borderBottom: i === BENEFITS.length - 1 ? "1px solid var(--nb-line)" : "none",
                  padding: "17px 0",
                  ...fadeUp(0.08 + i * 0.05),
                }}
              >
                <MetaDot role="highlight" style={{ width: 7, height: 7, justifySelf: "start" }} />
                <div>
                  <h3 style={{ margin: 0, fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 19, color: "var(--nb-heading)" }}>
                    {b.t}
                  </h3>
                  <p className="kv-meta" style={{ margin: "4px 0 0", color: "var(--nb-body)", textTransform: "none", letterSpacing: ".03em" }}>
                    {b.d}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Figura-âncora: a comunidade em um encontro — o retorno é ela */}
          <figure style={{ margin: 0, position: "sticky", top: 110, ...fadeUp(0.2) }}>
            <div className="kv-photo" style={{ border: "1px solid var(--nb-line)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/comunidade-2.jpg"
                alt="A comunidade reunida em um encontro do Kariri Valley"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            <figcaption
              className="kv-meta"
              style={{ display: "flex", gap: 10, alignItems: "baseline", marginTop: 10, color: "var(--nb-body)" }}
            >
              <span style={{ color: "var(--nb-label-accent)" }}>FIG. 03</span>
              <span>O retorno tem rosto — a comunidade em um dos encontros.</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
