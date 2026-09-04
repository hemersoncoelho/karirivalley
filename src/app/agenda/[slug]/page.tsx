import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchPublicEventBySlug } from "@/lib/members/events";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { ShareButton } from "@/components/ui/share-button";
import { MetaDot } from "@/components/ui/editorial";

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
    <main style={{ background: "var(--nb-page-bg)" }}>
      <article className="mx-auto max-w-[820px] px-6 lg:px-16" style={{ paddingTop: 130, paddingBottom: 110 }}>
        <Link
          href="/agenda"
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
          Agenda
        </Link>

        {/* Cabeçalho de matéria */}
        <header style={{ borderTop: "1px solid var(--nb-line)", paddingTop: 22 }}>
          <div className="flex items-start justify-between gap-4">
            <p className="kv-meta" style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, color: "var(--nb-turquoise)", fontWeight: 700 }}>
              <MetaDot role="event" />
              {formatEventDate(event.starts_at)}
            </p>
            <ShareButton
              title={event.title}
              text={event.description ?? undefined}
              path={`/agenda/${event.slug}`}
              style={{ fontSize: 12, fontWeight: 700, color: "var(--nb-label-accent)", flexShrink: 0 }}
            />
          </div>

          <h1
            className="kv-display"
            style={{ fontSize: "clamp(34px, 4.4vw, 56px)", color: "var(--nb-heading)", margin: "18px 0 0" }}
          >
            {event.title}
          </h1>

          {event.location && (
            <p
              className="kv-meta"
              style={{
                margin: "18px 0 0",
                color: "var(--nb-body)",
                borderTop: "1px solid var(--nb-line-soft)",
                paddingTop: 14,
              }}
            >
              ◆ Local — {event.location}
            </p>
          )}
        </header>

        {event.banner_url && (
          <div className="kv-photo" style={{ border: "1px solid var(--nb-line)", marginTop: 28 }}>
            <Image
              src={event.banner_url}
              alt={event.title}
              width={0}
              height={0}
              sizes="(max-width: 640px) 100vw, 760px"
              style={{ width: "100%", height: "auto", maxHeight: 520, objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        <div style={{ borderTop: "1px solid var(--nb-line)", marginTop: 28, paddingTop: 24 }}>
          {event.description && (
            <LinkifiedText
              text={event.description}
              style={{ fontSize: "clamp(15px, 1.5vw, 17px)", lineHeight: 1.8, color: "var(--nb-body)" }}
            />
          )}

          {event.meeting_url && (
            <a
              href={event.meeting_url}
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
              <span style={{ borderBottom: "1px solid var(--nb-ink)", paddingBottom: 2 }}>Mais informações</span>
              <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
            </a>
          )}
        </div>
      </article>
    </main>
  );
}
