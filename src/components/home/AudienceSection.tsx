"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";

/**
 * "Para quem é o vale" — recriação da AudienceSection.
 * Arquétipo: 3 cards fechados grandes (imagem no topo, conteúdo na base),
 * como vitrines de aplicativo — cada um com sua foto tratada em halftone.
 */
const CARDS = [
  {
    title: "Quem empreende",
    desc: "Fundadores e startups encontram sócios, mentores e os primeiros clientes — perto de casa.",
    img: "/media/comunidade-3.jpg",
    alt: "Comunidade reunida em encontro do Kariri Valley",
  },
  {
    title: "Quem constrói",
    desc: "Devs, designers e talentos tech trabalham para fora sem sair do Cariri.",
    img: "/media/comunidade-5.webp",
    alt: "Talentos da comunidade em talk técnica",
  },
  {
    title: "Quem fomenta",
    desc: "Investidores, empresas e universidades descobrem — e aceleram — o que nasce no interior.",
    img: "/media/comunidade-6.webp",
    alt: "Parceiros institucionais em apresentação",
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
          Feito para quem{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-terracotta)" }}>faz</em> —
          de todo jeito.
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <article
              key={c.title}
              style={{
                background: "var(--nb-cream)",
                border: "1px solid rgba(22,20,15,.08)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(22,20,15,.04), 0 12px 32px rgba(22,20,15,.06)",
                display: "flex",
                flexDirection: "column",
                ...fadeUp(0.08 + i * 0.07),
              }}
            >
              <div className="kv-photo" style={{ aspectRatio: "16 / 10" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div style={{ padding: "22px 24px 26px" }}>
                <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 22, color: "var(--nb-heading)" }}>
                  {c.title}
                </h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--nb-body)" }}>
                  {c.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
