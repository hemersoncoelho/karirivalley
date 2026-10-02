import { loadPublicContent } from "@/lib/public-content";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { fetchPublicOpportunities } from "@/lib/members/opportunities";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { RefreshButton } from "@/components/ui/refresh-button";
import { ShareButton } from "@/components/ui/share-button";
import { SectionIndex } from "@/components/ui/editorial";

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

function formatDeadline(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(value.length === 10 ? `${value}T12:00:00Z` : value),
  );
}

export default async function PublicOportunidadesPage() {
  const { data: opportunities, unavailable } = await loadPublicContent(fetchPublicOpportunities);

  return (
    <main id="conteudo" tabIndex={-1} style={{ background: "var(--nb-page-bg)" }}>
      {/* Header editorial */}
      <section className="mx-auto max-w-[1300px] px-6 lg:px-16" style={{ paddingTop: "clamp(48px, 8vw, 96px)" }}>
        <SectionIndex index="—" label="Oportunidades" accentColor="var(--nb-label-accent)" />
        <h1
          className="kv-display"
          style={{ fontSize: "clamp(42px, 5.6vw, 80px)", color: "var(--nb-heading)", margin: "28px 0 0" }}
        >
          O que está{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-opportunity-accent)" }}>aberto</em> agora
        </h1>
        <div
          className="flex flex-wrap items-end justify-between gap-4"
          style={{ borderTop: "1px solid var(--nb-line)", marginTop: 32, paddingTop: 20 }}
        >
          <p style={{ fontSize: "clamp(15px, 1.4vw, 17px)", lineHeight: 1.7, color: "var(--nb-body)", maxWidth: 560, margin: 0 }}>
            Editais, vagas, aceleração, mentoria e outras chamadas abertas ao ecossistema
            de inovação do Cariri.
          </p>
          <p className="kv-meta" style={{ color: "var(--nb-body)", margin: 0 }}>
            {unavailable ? "" : opportunities.length} {unavailable ? "Atualização indisponível" : opportunities.length === 1 ? "chamada ativa" : "chamadas ativas"}
          </p>
        </div>
      </section>

      {/* Lista-índice com banner */}
      <section className="mx-auto max-w-[900px] px-6 lg:px-16" style={{ paddingTop: 48, paddingBottom: 120 }}>
        {opportunities.length === 0 ? (
          <div className="text-center" style={{ border: "1px dashed var(--nb-line)", padding: "64px 32px" }}>
            <SearchX size={26} strokeWidth={1.8} color="var(--nb-body)" aria-hidden="true" style={{ margin: "0 auto 18px" }} />
            <h2 className="kv-display" style={{ fontSize: 26, color: "var(--nb-heading)", marginBottom: 10 }}>
              {unavailable ? "Não foi possível carregar as oportunidades" : "Nenhuma chamada aberta no momento"}
            </h2>
            <p className="kv-meta" style={{ color: "var(--nb-body)", maxWidth: 420, margin: "0 auto", textTransform: "none", letterSpacing: ".04em" }}>
              {unavailable ? "Tente novamente em alguns instantes. Você também pode conhecer a comunidade e sua trajetória." : "Quando novas vagas, editais e programas forem publicados, você encontra por aqui."}
            </p>
            {unavailable && <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm font-semibold" style={{ color: "var(--nb-heading)" }}><RefreshButton /><Link href="/galeria" className="underline underline-offset-4">Conhecer a galeria</Link></div>}
          </div>
        ) : (
          <div className="flex flex-col">
            {opportunities.map((opp, i) => (
              <article
                key={opp.id}
                id={`oportunidade-${opp.id}`}
                style={{
                  borderTop: "1px solid var(--nb-line)",
                  borderBottom: i === opportunities.length - 1 ? "1px solid var(--nb-line)" : "none",
                  padding: "34px 0",
                  scrollMarginTop: 100,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="kv-meta" style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, color: "var(--nb-opportunity-accent)", fontWeight: 700 }}>
                    <span className="kv-index-num">{String(i + 1).padStart(2, "0")}</span>
                    {TYPE_LABELS[opp.opportunity_type] ?? opp.opportunity_type}
                    {opp.deadline && (
                      <span style={{ color: "var(--nb-body)", fontWeight: 400 }}>
                        · até {formatDeadline(opp.deadline)}
                      </span>
                    )}
                  </p>
                  <ShareButton
                    title={opp.title}
                    text={opp.description ?? undefined}
                    path={`/oportunidades/publicas/${opp.slug}`}
                    style={{ fontSize: 12, fontWeight: 700, color: "var(--nb-label-accent)", flexShrink: 0 }}
                  />
                </div>

                {opp.banner_url && (
                  <div className="kv-photo" style={{ border: "1px solid var(--nb-line-soft)", marginTop: 18 }}>
                    <Image
                      src={opp.banner_url}
                      alt={opp.title}
                      width={0}
                      height={0}
                      sizes="(max-width: 640px) 100vw, 820px"
                      style={{ width: "100%", height: "auto", maxHeight: 440, objectFit: "cover", display: "block" }}
                    />
                  </div>
                )}

                <h2
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "clamp(24px, 2.6vw, 32px)",
                    fontWeight: 400,
                    color: "var(--nb-heading)",
                    margin: "16px 0 10px",
                    lineHeight: 1.2,
                  }}
                >
                  <Link href={`/oportunidades/publicas/${opp.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {opp.title}
                  </Link>
                </h2>

                {opp.description && (
                  <LinkifiedText
                    text={opp.description}
                    style={{ fontSize: 15, lineHeight: 1.7, color: "var(--nb-body)" }}
                  />
                )}

                {opp.external_url && (
                  <a
                    href={opp.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kv-kicker"
                    style={{
                      marginTop: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      color: "var(--nb-ink)",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ borderBottom: "1px solid var(--nb-ink)", paddingBottom: 2 }}>Saiba mais</span>
                    <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
