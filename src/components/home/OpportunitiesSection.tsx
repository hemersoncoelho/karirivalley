"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex, MetaDot } from "@/components/ui/editorial";
import type { OpportunityRecord } from "@/lib/members/opportunities";

const TYPE_LABELS: Record<string, string> = {
  edital: "Edital",
  vaga: "Vaga",
  aceleracao: "Aceleração",
  mentoria: "Mentoria",
  chamada_publica: "Chamada pública",
  bolsa: "Bolsa",
  investimento: "Investimento",
  desafio: "Desafio",
  evento_parceiro: "Evento parceiro",
};

function formatDeadline(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" })
    .format(new Date(value))
    .toUpperCase();
}

interface OpportunitiesSectionProps {
  opportunities: OpportunityRecord[];
}

export default function OpportunitiesSection({ opportunities }: OpportunitiesSectionProps) {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--nb-sand-2)", padding: "96px 0 104px", borderTop: "1px solid var(--nb-line)" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex
          index="07"
          label="Oportunidades"
          title="editais · vagas · programas"
          accentColor="#8A5C13"
        />

        <div className="mt-12 flex items-end justify-between gap-4">
          <h2
            className="kv-display"
            style={{ fontSize: "clamp(30px, 3.4vw, 50px)", color: "var(--nb-heading)", margin: 0, ...fadeUp(0) }}
          >
            O que está{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-terracotta)" }}>aberto</em> agora
          </h2>
          <Link
            href="/oportunidades/publicas"
            className="kv-kicker"
            style={{ color: "var(--nb-ink)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, ...fadeUp(0.05) }}
          >
            <span style={{ borderBottom: "1px solid var(--nb-ink)", paddingBottom: 2 }}>Ver todas</span>
            <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
          </Link>
        </div>

        {opportunities.length === 0 ? (
          <div style={{ marginTop: 32, border: "1px dashed var(--nb-line)", padding: "56px 32px", textAlign: "center", ...fadeUp(0.15) }}>
            <MetaDot role="opportunity" style={{ width: 8, height: 8, marginBottom: 14 }} />
            <h3 className="kv-display" style={{ fontSize: 24, color: "var(--nb-heading)", marginBottom: 10 }}>
              Nenhuma oportunidade aberta no momento
            </h3>
            <p className="kv-meta" style={{ color: "var(--nb-body)", maxWidth: 440, margin: "0 auto", textTransform: "none", letterSpacing: ".04em" }}>
              Editais, vagas e programas aparecem aqui — membros acompanham tudo em primeira mão na área logada.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: 24, ...fadeUp(0.15) }}>
            {opportunities.map((op, i) => (
              <Link
                key={op.id}
                href={`/oportunidades/publicas/${op.slug}`}
                className="group"
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  alignItems: "baseline",
                  gap: 20,
                  padding: "20px 4px",
                  textDecoration: "none",
                  borderTop: "1px solid var(--nb-line)",
                  borderBottom: i === opportunities.length - 1 ? "1px solid var(--nb-line)" : "none",
                }}
              >
                <span className="kv-index-num" style={{ fontSize: 13, color: "var(--nb-terracotta)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: 22,
                      color: "var(--nb-heading)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {op.title}
                  </span>
                  <span className="kv-meta" style={{ color: "var(--nb-body)" }}>
                    {TYPE_LABELS[op.opportunity_type] ?? op.opportunity_type}
                  </span>
                </span>
                <span className="kv-meta" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--nb-heading)", whiteSpace: "nowrap" }}>
                  {op.deadline ? (
                    <>
                      <MetaDot role="opportunity" />
                      até {formatDeadline(op.deadline)}
                    </>
                  ) : (
                    "permanente"
                  )}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
