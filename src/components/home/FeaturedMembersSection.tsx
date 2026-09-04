"use client";

import Link from "next/link";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";

/**
 * "Rostos do vale" — membros em destaque (mockado até a plataforma expor
 * destaques). Arquétipo: cards de retrato fechados com chip de área.
 */
const MEMBERS = [
  { name: "Maria Lima", role: "Fundadora", city: "Crato", photo: "/media/faces/face-1.jpg", tag: "Startups" },
  { name: "Pedro Costa", role: "Investidor-anjo", city: "Juazeiro do Norte", photo: "/media/faces/face-2.jpg", tag: "Investimento" },
  { name: "Ana Ferreira", role: "Pesquisadora · UFCA", city: "Barbalha", photo: "/media/faces/face-3.jpg", tag: "Educação" },
  { name: "Rafael Bezerra", role: "Dev sênior · remoto", city: "Lavras da Mangabeira", photo: "/media/faces/face-4.jpg", tag: "Dev" },
] as const;

export default function FeaturedMembersSection() {
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
        <SectionIndex index="06" label="Quem faz" title="perfis verificados" />

        <div className="mt-10 flex items-end justify-between gap-4">
          <h2
            className="kv-display"
            style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--nb-heading)", margin: 0, ...fadeUp(0) }}
          >
            Rostos do <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-turquoise)" }}>vale</em>
          </h2>
          <Link
            href="/membros"
            className="kv-kicker"
            style={{ color: "var(--nb-ink)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, ...fadeUp(0.05) }}
          >
            <span style={{ borderBottom: "1px solid var(--nb-ink)", paddingBottom: 2 }}>Diretório completo</span>
            <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {MEMBERS.map((m, i) => (
            <Link
              key={m.name}
              href="/membros"
              className="group"
              style={{
                textDecoration: "none",
                display: "block",
                background: "var(--nb-cream)",
                border: "1px solid rgba(22,20,15,.08)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(22,20,15,.04), 0 12px 32px rgba(22,20,15,.06)",
                transition: "transform .25s ease, box-shadow .25s ease",
                ...fadeUp(0.08 + i * 0.06),
              }}
            >
              <div className="kv-photo" style={{ aspectRatio: "4 / 5" }}>
                <Image
                  src={m.photo}
                  alt={m.name}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 50vw, 25vw"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div style={{ padding: "16px 18px 18px" }}>
                <p style={{ margin: "0 0 4px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 18, color: "var(--nb-heading)" }}>
                  {m.name}
                </p>
                <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "var(--nb-body)" }}>
                  {m.role} — {m.city}
                </p>
                <span
                  className="kv-kicker"
                  style={{
                    display: "inline-flex", fontSize: 10, padding: "4px 11px",
                    borderRadius: 999, background: "rgba(35,157,140,.1)", color: "#166E62",
                  }}
                >
                  {m.tag}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
