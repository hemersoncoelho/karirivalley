"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex, MetaDot } from "@/components/ui/editorial";

/**
 * Vitrine do vale — empresas da comunidade (mockado; estrutura espelha
 * CompanyRecord: logo, nome, estágio, setor).
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
      style={{ background: "var(--nb-page-bg)", padding: "0 0 110px" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="04" label="Vitrine do vale" title="empresas da comunidade" />

        <div className="mt-12 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: "var(--nb-line)", border: "1px solid var(--nb-line)", ...fadeUp(0.05) }}>
          {COMPANIES.map((c) => (
            <div
              key={c.name}
              style={{ background: "var(--nb-cream)", padding: "26px 24px 24px", transition: "background .2s" }}
              className="group hover:!bg-[var(--nb-sand-2)]"
            >
              <div style={{ height: 92, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.logo}
                  alt={`Símbolo da ${c.name}`}
                  style={{ maxWidth: "72%", maxHeight: "100%", objectFit: "contain", filter: "grayscale(1) contrast(1.1)" }}
                />
              </div>
              <hr style={{ border: 0, borderTop: "1px solid var(--nb-line-soft)", margin: "0 0 16px" }} />
              <p style={{ margin: "0 0 4px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 19, color: "var(--nb-heading)" }}>
                {c.name}
              </p>
              <p className="kv-meta" style={{ margin: 0, color: "var(--nb-body)" }}>
                {c.sector}
              </p>
              <p
                className="kv-meta"
                style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 7, color: "var(--nb-ink)", border: "1px solid var(--nb-line)", borderRadius: 999, padding: "3px 10px" }}
              >
                <MetaDot role="opportunity" />
                {c.stage}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8" style={fadeUp(0.2)}>
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
