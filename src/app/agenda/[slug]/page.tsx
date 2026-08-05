import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, ExternalLink } from "lucide-react";

import { fetchPublicEventBySlug } from "@/lib/members/events";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { ShareButton } from "@/components/ui/share-button";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchPublicEventBySlug(slug);
  if (!event) return {};

  const description = event.description?.slice(0, 200) || "Evento da comunidade Kariri Valley.";

  return {
    title: `${event.title} — Kariri Valley`,
    description,
    openGraph: {
      title: event.title,
      description,
      type: "article",
      images: event.banner_url ? [{ url: event.banner_url }] : undefined,
    },
    twitter: {
      card: event.banner_url ? "summary_large_image" : "summary",
      title: event.title,
      description,
      images: event.banner_url ? [event.banner_url] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await fetchPublicEventBySlug(slug);
  if (!event) notFound();

  return (
    <main className="relative overflow-hidden" style={{ background: "var(--nb-page-bg)" }}>
      <div
        className="kv-aurora absolute pointer-events-none"
        style={{
          width: "40vw", height: "40vw", maxWidth: 560, maxHeight: 560,
          top: "-14%", right: "-6%",
          background: "radial-gradient(circle, rgba(35,157,140,.16) 0%, rgba(35,157,140,.04) 55%, transparent 72%)",
          animationDuration: "26s", animationDelay: "-10s",
        }}
      />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.5 }} />

      <section className="relative max-w-[720px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, padding: "140px 24px 120px" }}>
        <Link
          href="/agenda"
          className="inline-flex items-center gap-1.5 text-sm font-semibold mb-8"
          style={{ color: "var(--nb-label-accent)" }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Voltar para a agenda
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
          {event.banner_url && (
            <div style={{ width: "100%", maxHeight: 560, marginBottom: 24, borderRadius: 14, overflow: "hidden", background: "var(--nb-cream)" }}>
              <Image
                src={event.banner_url}
                alt={event.title}
                width={0}
                height={0}
                sizes="(max-width: 640px) 100vw, 720px"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--nb-turquoise)", textTransform: "capitalize", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={13} strokeWidth={2} />
              {formatEventDate(event.starts_at)}
            </p>
            <ShareButton
              title={event.title}
              text={event.description ?? undefined}
              path={`/agenda/${event.slug}`}
              style={{ fontSize: 12, fontWeight: 700, color: "var(--nb-label-accent)", flexShrink: 0 }}
            />
          </div>

          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, color: "var(--nb-heading)", marginBottom: 14 }}>
            {event.title}
          </h1>

          {event.description && (
            <LinkifiedText
              text={event.description}
              style={{ fontSize: 15, lineHeight: 1.75, color: "var(--nb-body)", marginBottom: 16 }}
            />
          )}

          {event.location && (
            <p style={{ fontSize: 14, color: "var(--nb-body)", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <MapPin size={14} strokeWidth={2} />
              {event.location}
            </p>
          )}

          {event.meeting_url && (
            <a
              href={event.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "var(--nb-label-accent)" }}
            >
              Mais informações
              <ExternalLink size={13} strokeWidth={2} />
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
