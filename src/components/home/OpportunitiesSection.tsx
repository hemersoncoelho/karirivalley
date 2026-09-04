"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";
import { ArrowUpRight, SearchX } from "lucide-react";
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
      style={{ background: "var(--nb-page-bg)", padding: "0 0 112px" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="05" label="Oportunidades" title="editais · vagas · programas" accentColor="#8A5C13" />

        <div className="mt-10 flex items-end justify-between gap-4">
          <h2
            className="kv-display"
            style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--nb-heading)", margin: 0, ...fadeUp(0) }}
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
          <div
            style={{
              marginTop: 32,
              background: "var(--nb-cream)",
              border: "1px dashed rgba(22,20,15,.2)",
              borderRadius: 20,
              padding: "56px 32px",
              textAlign: "center",
              ...fadeUp(0.15),
            }}
          >
            <SearchX size={26} strokeWidth={1.8} color="var(--nb-body)" style={{ marginBottom: 14 }} />
            <h3 className="kv-display" style={{ fontSize: 24, color: "var(--nb-heading)", marginBottom: 8 }}>
              Nenhuma chamada aberta no momento
            </h3>
            <p className="kv-meta" style={{ color: "var(--nb-body)", margin: 0, textTransform: "none", letterSpacing: ".04em" }}>
              Editais, vagas e programas aparecem aqui — membros veem tudo em primeira mão.
            </p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {opportunities.map((op, i) => (
              <Link
                key={op.id}
                href={`/oportunidades/publicas/${op.slug}`}
                className="group"
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto",
                  alignItems: "center",
                  gap: 18,
                  background: "var(--nb-cream)",
                  border: "1px solid rgba(22,20,15,.08)",
                  borderRadius: 16,
                  padding: "18px 22px",
                  textDecoration: "none",
                  boxShadow: "0 1px 2px rgba(22,20,15,.04)",
                  transition: "transform .2s ease, box-shadow .2s ease",
                  ...fadeUp(0.08 + i * 0.05),
                }}
              >
                <span
                  className="kv-kicker"
                  style={{
                    fontSize: 10, padding: "5px 12px", borderRadius: 999,
                    background: "rgba(194,90,46,.09)", color: "var(--nb-terracotta)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {TYPE_LABELS[op.opportunity_type] ?? op.opportunity_type}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: 19,
                    color: "var(--nb-heading)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {op.title}
                </span>
                {op.deadline && (
                  <span className="kv-meta" style={{ color: "var(--nb-body)", whiteSpace: "nowrap" }}>
                    até {formatDeadline(op.deadline)}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  style={{
                    width: 30, height: 30, borderRadius: 999,
                    border: "1px solid rgba(22,20,15,.12)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    color: "var(--nb-ink)", flexShrink: 0,
                  }}
                >
                  <ArrowUpRight size={14} strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
