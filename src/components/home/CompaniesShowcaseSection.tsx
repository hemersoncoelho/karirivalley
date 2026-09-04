"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex, MetaDot } from "@/components/ui/editorial";

/**
 * Vitrine do vale — empresas da comunidade (mockado; estrutura espelha
 * CompanyRecord: logo, nome, estágio, setor). Cards fechados, cada empresa
 * um "app card" com seu símbolo halftone.
 */
const COMPANIES = [
  { name: "Lumiere", sector: "Educação criativa", stage: "Tração", logo: "/media/halftone-innovation.avif" },
  { name: "Sertão Labs", sector: "Hub de inovação", stage: "Operação", logo: "/media/halftone-platform.avif" },
  { name: "AgroTech Cariri", sector: "Agrotech", stage: "Produto", logo: "/media/halftone-tractor.avif" },
  { name: "Chapada XR", sector: "Realidade imersiva", stage: "Ideia", logo: "/media/halftone-earth.avif" },
] as const;

export default function CompaniesShowcaseSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--nb-page-bg)", padding: "0 0 112px" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="07" label="Vitrine do vale" title="empresas da comunidade" />

        <h2
          className="kv-display mt-10"
          style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--nb-heading)", margin: "40px 0 36px", maxWidth: 680, ...fadeUp(0) }}
        >
          Empresas que{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-terracotta)" }}>nasceram</em> aqui
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COMPANIES.map((c, i) => (
            <div
              key={c.name}
              style={{
                background: "var(--nb-cream)",
                border: "1px solid rgba(22,20,15,.08)",
                borderRadius: 20,
                padding: "24px 22px 22px",
                boxShadow: "0 1px 2px rgba(22,20,15,.04), 0 12px 32px rgba(22,20,15,.06)",
                transition: "transform .25s ease, box-shadow .25s ease",
                ...fadeUp(0.06 + i * 0.05),
              }}
            >
              <div
                style={{
                  height: 84, borderRadius: 14, background: "var(--nb-sand-2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16, overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.logo}
                  alt={`Símbolo da ${c.name}`}
                  style={{ maxWidth: "68%", maxHeight: "80%", objectFit: "contain" }}
                />
              </div>
              <p style={{ margin: "0 0 3px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 19, color: "var(--nb-heading)" }}>
                {c.name}
              </p>
              <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--nb-body)" }}>
                {c.sector}
              </p>
              <span
                className="kv-kicker"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  fontSize: 10, padding: "4px 11px", borderRadius: 999,
                  background: "rgba(194,90,46,.09)", color: "var(--nb-terracotta)",
                }}
              >
                <MetaDot role="opportunity" style={{ width: 5, height: 5 }} />
                {c.stage}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8" style={fadeUp(0.25)}>
          <Link
            href="/como-participar"
            className="kv-kicker"
            style={{ color: "var(--nb-ink)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ borderBottom: "1px solid var(--nb-ink)", paddingBottom: 2 }}>Sua empresa no vale</span>
            <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
