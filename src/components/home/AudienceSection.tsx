"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";

/**
 * "Para quem é o vale" — três audiências com identidade própria:
 * cada card tem pastel, cor de acento e micro-lista distintos
 * (irmãos pela anatomia, únicos pela cor e conteúdo).
 */
const CARDS = [
  {
    num: "01",
    chip: "QUEM EMPREENDE",
    title: "Fundadores e startups",
    desc: "Do primeiro protótipo à rodada: gente construindo negócio no interior.",
    img: "/media/comunidade-3.jpg",
    alt: "Fundadores reunidos em encontro da comunidade",
    bodyBg: "#F7E7DF",
    accent: "#C25A2E",
    finds: ["Sócios e primeiros clientes", "Editais, aceleração e mentoria"],
  },
  {
    num: "02",
    chip: "QUEM CONSTRÓI",
    title: "Talentos tech e criativos",
    desc: "Trabalhe para fora, viva no Cariri — com uma comunidade técnica por perto.",
    img: "/media/comunidade-5.webp",
    alt: "Talentos da comunidade em talk técnica",
    bodyBg: "#E4EBDD",
    accent: "#5F8753",
    finds: ["Projetos remotos e locais", "Talks e comunidade técnica"],
  },
  {
    num: "03",
    chip: "QUEM FOMENTA",
    title: "Investidores e instituições",
    desc: "Descubra e acelere o que nasce no interior — com dados e acesso direto.",
    img: "/media/comunidade-6.webp",
    alt: "Parceiros institucionais em apresentação",
    bodyBg: "#F3E9CF",
    accent: "#C99A2E",
    finds: ["Startups em tração, com MRR", "Talentos prontos para construir"],
  },
] as const;

export default function AudienceSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--nb-page-bg)", padding: "0 0 112px" }}>
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="02" label="Para quem é" title="quem se encontra no vale" />

        <h2
          className="kv-display mt-10"
          style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--nb-heading)", margin: "40px 0 36px", maxWidth: 720, ...fadeUp(0) }}
        >
          O vale é de{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-terracotta)" }}>quem faz</em>{" "}
          acontecer.
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <article
              key={c.num}
              style={{
                borderRadius: 20,
                overflow: "hidden",
                background: "var(--nb-cream)",
                border: "1px solid rgba(22,20,15,.08)",
                boxShadow: "0 1px 2px rgba(22,20,15,.04), 0 12px 32px rgba(22,20,15,.06)",
                display: "flex",
                flexDirection: "column",
                ...fadeUp(0.08 + i * 0.07),
              }}
            >
              <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(1) contrast(1.06)" }}
                />
                {/* duotone: sombras no acento, altas luzes no papel */}
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: c.accent, mixBlendMode: "multiply", opacity: 0.92 }} />
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "#F4EEE1", mixBlendMode: "lighten", opacity: 0.28 }} />
                {/* trama halftone */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "radial-gradient(rgba(6,13,8,.5) 1px, transparent 1.15px)",
                    backgroundSize: "5px 5px",
                    opacity: 0.25,
                  }}
                />
              </div>

              <div style={{ padding: "20px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                <span
                  className="kv-kicker"
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 10, padding: "4px 11px", borderRadius: 999,
                    background: "var(--nb-cream)", color: c.accent,
                    border: `1px solid ${c.accent}33`,
                    marginBottom: 12,
                  }}
                >
                  {c.num} · {c.chip}
                </span>

                <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 21, color: "var(--nb-heading)" }}>
                  {c.title}
                </h3>
                <p style={{ margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.6, color: "var(--nb-body)" }}>
                  {c.desc}
                </p>

                {/* micro-lista: o que encontra no vale */}
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 7 }}>
                  {c.finds.map(f => (
                    <p key={f} style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 8, fontSize: 13, color: "var(--nb-body-strong)" }}>
                      <span aria-hidden="true" style={{ color: c.accent, fontSize: 8 }}>◆</span>
                      {f}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
