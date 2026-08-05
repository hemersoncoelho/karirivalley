import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { fetchPublicOpportunityBySlug } from "@/lib/members/opportunities";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { ShareButton } from "@/components/ui/share-button";

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

function formatDeadline(value: string | null): string | null {
  if (!value) return null;
  return `Prazo: ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value))}`;
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

      <section className="relative max-w-[720px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, padding: "140px 24px 120px" }}>
        <Link
          href="/oportunidades/publicas"
          className="inline-flex items-center gap-1.5 text-sm font-semibold mb-8"
          style={{ color: "var(--nb-label-accent)" }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Voltar para oportunidades
        </Link>

        <div
          className="p-6 sm:p-8"
          style={{
            background: "var(--nb-card-bg)",
            backdropFilter: "var(--nb-card-blur)",
            WebkitBackdropFilter: "var(--nb-card-blur)",
            border: "var(--nb-card-border)",
            borderRadius: 14,
            boxShadow: "var(--nb-card-shadow)",
          }}
        >
          {opp.banner_url && (
            <div style={{ width: "100%", maxHeight: 560, marginBottom: 24, borderRadius: 14, overflow: "hidden", background: "var(--nb-cream)" }}>
              <Image
                src={opp.banner_url}
                alt={opp.title}
                width={0}
                height={0}
                sizes="(max-width: 640px) 100vw, 720px"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--nb-terracotta)", marginBottom: 8 }}>
              {TYPE_LABELS[opp.opportunity_type] ?? opp.opportunity_type}
            </p>
            <ShareButton
              title={opp.title}
              text={opp.description ?? undefined}
              path={`/oportunidades/publicas/${opp.slug}`}
              style={{ fontSize: 12, fontWeight: 700, color: "var(--nb-label-accent)", flexShrink: 0 }}
            />
          </div>

          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, color: "var(--nb-heading)", marginBottom: 14 }}>
            {opp.title}
          </h1>

          {opp.description && (
            <LinkifiedText
              text={opp.description}
              style={{ fontSize: 15, lineHeight: 1.75, color: "var(--nb-body)", marginBottom: 16 }}
            />
          )}

          {opp.deadline && (
            <p style={{ fontSize: 14, color: "var(--nb-body)", marginBottom: 8 }}>{formatDeadline(opp.deadline)}</p>
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
      </section>
    </main>
  );
}
