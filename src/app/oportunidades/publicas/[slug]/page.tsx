import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchPublicOpportunityBySlug } from "@/lib/members/opportunities";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { ShareButton } from "@/components/ui/share-button";
import { MetaDot } from "@/components/ui/editorial";

interface OpportunityDetailPageProps {
  params: Promise<{ slug: string }>;
}

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
    new Date(value),
  );
}

export async function generateMetadata({ params }: OpportunityDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const opp = await fetchPublicOpportunityBySlug(slug);
  if (!opp) return {};

  const description = opp.description?.slice(0, 200) || "Oportunidade da comunidade Kariri Valley.";

  return {
    title: `${opp.title} — Kariri Valley`,
    description,
    openGraph: {
      title: opp.title,
      description,
      type: "article",
      images: opp.banner_url ? [{ url: opp.banner_url }] : undefined,
    },
    twitter: {
      card: opp.banner_url ? "summary_large_image" : "summary",
      title: opp.title,
      description,
      images: opp.banner_url ? [opp.banner_url] : undefined,
    },
  };
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { slug } = await params;
  const opp = await fetchPublicOpportunityBySlug(slug);
  if (!opp) notFound();

  return (
    <main id="conteudo" tabIndex={-1} style={{ background: "var(--nb-page-bg)" }}>
      <article className="mx-auto max-w-[820px] px-6 lg:px-16" style={{ paddingTop: 130, paddingBottom: 110 }}>
        <Link
          href="/oportunidades/publicas"
          className="kv-kicker"
          style={{
            color: "var(--nb-body)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 30,
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 9 }}>◂</span>
          Oportunidades
        </Link>

        {/* Cabeçalho de matéria */}
        <header style={{ borderTop: "1px solid var(--nb-line)", paddingTop: 22 }}>
          <div className="flex items-start justify-between gap-4">
            <p className="kv-meta" style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, color: "var(--nb-terracotta)", fontWeight: 700 }}>
              <MetaDot role="opportunity" />
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

          <h1
            className="kv-display"
            style={{ fontSize: "clamp(34px, 4.4vw, 56px)", color: "var(--nb-heading)", margin: "18px 0 0" }}
          >
            {opp.title}
          </h1>
        </header>

        {opp.banner_url && (
          <div className="kv-photo" style={{ border: "1px solid var(--nb-line)", marginTop: 28 }}>
            <Image
              src={opp.banner_url}
              alt={opp.title}
              width={0}
              height={0}
              sizes="(max-width: 640px) 100vw, 760px"
              style={{ width: "100%", height: "auto", maxHeight: 520, objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        <div style={{ borderTop: "1px solid var(--nb-line)", marginTop: 28, paddingTop: 24 }}>
          {opp.description && (
            <LinkifiedText
              text={opp.description}
              style={{ fontSize: "clamp(15px, 1.5vw, 17px)", lineHeight: 1.8, color: "var(--nb-body)" }}
            />
          )}

          {opp.external_url && (
            <a
              href={opp.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="kv-kicker"
              style={{
                marginTop: 26,
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
        </div>
      </article>
    </main>
  );
}
