"use client";

import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";

/**
 * "Quem se encontra no vale" — recriação da antiga AudienceSection.
 * Arquétipo: faixa fotográfica full-bleed (halftone-hands, o gesto de
 * conectar) + públicos como linhas-índice. A imagem carrega a ideia;
 * o texto vira legenda.
 */
const AUDIENCES = [
  { n: "01", t: "Fundadores", d: "validam produto e encontram sócios" },
  { n: "02", t: "Talentos tech", d: "trabalham remoto sem sair do Cariri" },
  { n: "03", t: "Investidores", d: "descobrem o que nasce no interior" },
  { n: "04", t: "Pesquisadores", d: "levam a ciência ao mercado" },
  { n: "05", t: "Estudantes", d: "começam a carreira entre pares" },
] as const;

export default function AudienceSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--nb-page-bg)" }}>
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 pt-24 lg:px-16">
        <SectionIndex index="02" label="Para quem é" title="quem se encontra no vale" />
      </div>

      {/* Faixa fotográfica full-bleed: a mão que encontra a mão */}
      <figure className="relative mt-10" style={{ margin: "40px 0 0", ...fadeUp(0.05) }}>
        <div className="kv-photo" style={{ borderTop: "1px solid var(--nb-line)", borderBottom: "1px solid var(--nb-line)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/halftone-hands.jpg"
            alt="Duas mãos se aproximando — uma fotográfica, outra em trama de pontos"
            style={{ width: "100%", height: "auto", display: "block", maxHeight: 420, objectFit: "cover" }}
          />
        </div>
        <figcaption
          className="kv-meta"
          style={{
            display: "flex", gap: 10, alignItems: "baseline",
            maxWidth: 1300, margin: "10px auto 0", padding: "0 24px",
            color: "var(--nb-body)",
          }}
        >
          <span style={{ color: "var(--nb-label-accent)" }}>FIG. 02</span>
          <span>A conexão é o produto — o vale é o meio.</span>
        </figcaption>
      </figure>

      {/* Públicos: linhas-índice */}
      <div className="mx-auto max-w-[1300px] px-6 pb-24 pt-14 lg:px-16">
        <div ref={ref} className="grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:grid-cols-5">
          {AUDIENCES.map((a, i) => (
            <div
              key={a.n}
              style={{
                borderTop: "1px solid var(--nb-line)",
                paddingTop: 16,
                ...fadeUp(0.1 + i * 0.05),
              }}
            >
              <p className="kv-index-num" style={{ margin: 0, fontSize: 13, color: "var(--nb-terracotta)" }}>{a.n}</p>
              <h3 style={{ margin: "10px 0 5px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 20, color: "var(--nb-heading)" }}>
                {a.t}
              </h3>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--nb-body)" }}>{a.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
