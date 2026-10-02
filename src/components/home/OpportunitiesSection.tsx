import Link from "next/link";
import { SectionIndex } from "@/components/ui/editorial";
import { ArrowUpRight } from "lucide-react";
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
    .format(new Date(value.length === 10 ? `${value}T12:00:00Z` : value))
    .toUpperCase();
}

interface OpportunitiesSectionProps {
  unavailable?: boolean;
  opportunities: OpportunityRecord[];
}

export default function OpportunitiesSection({ opportunities, unavailable = false }: OpportunitiesSectionProps) {
  if (unavailable || opportunities.length === 0) return null;

  return (
    <section
      className="kv-live-section relative overflow-hidden"
      style={{ background: "var(--nb-page-bg)", padding: "0 0 112px" }}
    >
      <div className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="05" label="Oportunidades" title="editais · vagas · programas" accentColor="var(--nb-label-accent)" />

        <div className="kv-live-heading mt-8 flex items-end justify-between gap-4">
          <h2
            className="kv-display"
            style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--nb-heading)", margin: 0, }}
          >
            O que está{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-opportunity-accent)" }}>aberto</em> agora
          </h2>
          <Link
            href="/oportunidades/publicas"
            className="kv-kicker"
            style={{ color: "var(--nb-heading)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, }}
          >
            <span style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}>Ver todas</span>
            <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {opportunities.map((op) => (
            <Link
              key={op.id}
              href={`/oportunidades/publicas/${op.slug}`}
              className="kv-opportunity-row group"
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto",
                alignItems: "center",
                gap: 18,
                background: "var(--nb-card-bg)",
                border: "1px solid var(--nb-line-soft)",
                borderRadius: 16,
                padding: "18px 22px",
                textDecoration: "none",
                boxShadow: "0 1px 2px rgba(22,20,15,.04)",
                transition: "transform .2s ease, box-shadow .2s ease",
              }}
            >
              <span
                className="kv-kicker"
                style={{
                  fontSize: 10, padding: "5px 12px", borderRadius: 999,
                  background: "rgba(194,90,46,.09)", color: "var(--nb-opportunity-accent)",
                  whiteSpace: "nowrap",
                }}
              >
                {TYPE_LABELS[op.opportunity_type] ?? op.opportunity_type}
              </span>
              <span
                className="kv-opportunity-title"
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
                <span className="kv-opportunity-deadline kv-meta" style={{ color: "var(--nb-body)", whiteSpace: "nowrap" }}>
                  até {formatDeadline(op.deadline)}
                </span>
              )}
              <span
                aria-hidden="true"
                className="kv-opportunity-arrow"
                style={{
                  width: 30, height: 30, borderRadius: 999,
                  border: "1px solid rgba(22,20,15,.12)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: "var(--nb-heading)", flexShrink: 0,
                }}
              >
                <ArrowUpRight size={14} strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
