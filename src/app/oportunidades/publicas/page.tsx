import type { Metadata } from "next";
import Image from "next/image";
import { SearchX, Briefcase, ExternalLink } from "lucide-react";

import { fetchPublicOpportunities } from "@/lib/members/opportunities";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { ShareButton } from "@/components/ui/share-button";

export const metadata: Metadata = {
  title: "Oportunidades — Kariri Valley",
  description:
    "Editais, vagas, aceleração, mentoria e outras oportunidades abertas ao ecossistema de inovação do Cariri.",
};

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

function formatDeadline(value: string | null): string | null {
  if (!value) return null;
  return `Prazo: ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value))}`;
}

export default async function PublicOportunidadesPage() {
  const opportunities = await fetchPublicOpportunities();

  return (
    <main className="relative overflow-hidden" style={{ background: "var(--nb-page-bg)" }}>
      <div
        className="kv-aurora absolute pointer-events-none"
        style={{
          width: "38vw", height: "38vw", maxWidth: 520, maxHeight: 520,
          top: "-12%", left: "-6%",
          background: "radial-gradient(circle, rgba(232,178,60,.18) 0%, rgba(232,178,60,.04) 55%, transparent 72%)",
          animationDuration: "28s", animationDelay: "-15s",
        }}
      />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.5 }} />

      <section className="relative max-w-[820px] mx-auto px-6 lg:px-16 text-center" style={{ zIndex: 10, padding: "160px 24px 56px" }}>
        <span
          className="inline-flex items-center gap-2 px-[18px] py-[7px] text-[11px] font-bold tracking-[2px] uppercase mb-7"
          style={{ background: "var(--nb-mustard)", border: "2px solid var(--nb-ink)", borderRadius: 999, color: "var(--nb-ink)", fontFamily: "var(--font-geo)" }}
        >
          <Briefcase size={12} strokeWidth={2.2} />
          Oportunidades
        </span>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(32px, 4.4vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.14,
            letterSpacing: "-1px",
            color: "var(--nb-heading)",
            marginBottom: 16,
          }}
        >
          Oportunidades da{" "}
          <span style={{ color: "var(--nb-terracotta)", fontStyle: "italic" }}>Kariri Valley</span>
        </h1>

        <p
          className="mx-auto"
          style={{
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.7,
            color: "var(--nb-body)",
            maxWidth: 560,
          }}
        >
          Editais, vagas, aceleração, mentoria e outras chamadas abertas ao ecossistema
          de inovação do Cariri.
        </p>
      </section>

      <section className="relative max-w-[900px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, paddingBottom: 120 }}>
        {opportunities.length === 0 ? (
          <div
            className="text-center"
            style={{
              background: "var(--nb-cream)",
              border: "3px dashed var(--nb-ink)",
              borderRadius: 18,
              padding: "64px 32px",
            }}
          >
            <div
              className="flex items-center justify-center mx-auto"
              style={{
                width: 72, height: 72,
                background: "var(--nb-mustard)",
                border: "2px solid var(--nb-ink)",
                borderRadius: 16,
                marginBottom: 24,
              }}
            >
              <SearchX size={28} strokeWidth={2} color="var(--nb-ink)" />
            </div>
            <h2 style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(18px, 2vw, 22px)",
              fontWeight: 700, color: "var(--nb-heading)", marginBottom: 12,
            }}>
              Nenhuma oportunidade publicada no momento
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--nb-body)", maxWidth: 420, margin: "0 auto" }}>
              Em breve, editais, vagas, programas e mentorias estarão disponíveis aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                id={`oportunidade-${opp.id}`}
                className="p-6"
                style={{
                  background: "var(--nb-card-bg)",
                  backdropFilter: "var(--nb-card-blur)",
                  WebkitBackdropFilter: "var(--nb-card-blur)",
                  border: "var(--nb-card-border)",
                  borderRadius: 14,
                  boxShadow: "var(--nb-card-shadow)",
                  scrollMarginTop: 100,
                }}
              >
                {opp.banner_url && (
                  <div style={{ position: "relative", width: "100%", height: 150, marginBottom: 16, borderRadius: 10, overflow: "hidden", background: "var(--nb-cream)" }}>
                    <Image
                      src={opp.banner_url}
                      alt={opp.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 700px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--nb-terracotta)", marginBottom: 8 }}>
                    {TYPE_LABELS[opp.opportunity_type] ?? opp.opportunity_type}
                  </p>
                  <ShareButton
                    title={opp.title}
                    text={opp.description ?? undefined}
                    anchorId={`oportunidade-${opp.id}`}
                    style={{ fontSize: 12, fontWeight: 700, color: "var(--nb-label-accent)", flexShrink: 0 }}
                  />
                </div>
                <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 19, fontWeight: 700, color: "var(--nb-heading)", marginBottom: 8 }}>
                  {opp.title}
                </h3>
                {opp.description && (
                  <LinkifiedText
                    text={opp.description}
                    style={{ fontSize: 14, lineHeight: 1.65, color: "var(--nb-body)", marginBottom: 10 }}
                  />
                )}
                {opp.deadline && (
                  <p style={{ fontSize: 13, color: "var(--nb-body)" }}>{formatDeadline(opp.deadline)}</p>
                )}
                {opp.external_url && (
                  <a
                    href={opp.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: "var(--nb-label-accent)" }}
                  >
                    Saiba mais
                    <ExternalLink size={13} strokeWidth={2} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
