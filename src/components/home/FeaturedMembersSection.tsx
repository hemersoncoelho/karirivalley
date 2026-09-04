"use client";

import Link from "next/link";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex, MetaDot } from "@/components/ui/editorial";

/**
 * Membros em destaque — conteúdo mockado até a plataforma expor destaques.
 * A estrutura já consome o formato real de perfil (foto, nome, área, cidade).
 */
const MEMBERS = [
  { name: "Maria Lima", role: "Fundadora · Startup", city: "Crato", photo: "/media/comunidade-5.webp", tag: "startups" },
  { name: "Pedro Costa", role: "Investidor-anjo", city: "Juazeiro do Norte", photo: "/media/comunidade-4.webp", tag: "investimento" },
  { name: "Ana Ferreira", role: "Pesquisadora · UFCA", city: "Barbalha", photo: "/media/comunidade-6.webp", tag: "educação" },
  { name: "Rafael Bezerra", role: "Dev senior · remoto", city: "Lavras da Mangabeira", photo: "/media/comunidade-7.webp", tag: "desenvolvimento" },
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
      style={{ background: "var(--nb-page-bg)", padding: "96px 0 104px" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="05" label="Quem faz" title="perfis verificados" />

        <div className="mt-12 flex items-end justify-between gap-4">
          <h2
            className="kv-display"
            style={{ fontSize: "clamp(30px, 3.4vw, 50px)", color: "var(--nb-heading)", margin: 0, ...fadeUp(0) }}
          >
            Rostos do{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-turquoise)" }}>vale</em>
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

        <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {MEMBERS.map((m, i) => (
            <Link
              key={m.name}
              href="/membros"
              className="group"
              style={{ textDecoration: "none", display: "block", ...fadeUp(0.08 + i * 0.06) }}
            >
              <div className="kv-photo" style={{ border: "1px solid var(--nb-line)" }}>
                <Image
                  src={m.photo}
                  alt={m.name}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 50vw, 25vw"
                  style={{ width: "100%", height: "auto", aspectRatio: "3 / 4", objectFit: "cover", display: "block" }}
                />
              </div>
              <p style={{ margin: "12px 0 3px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 18, color: "var(--nb-heading)" }}>
                {m.name}
              </p>
              <p className="kv-meta" style={{ margin: 0, display: "flex", alignItems: "center", gap: 7, color: "var(--nb-body)" }}>
                <MetaDot role="neutral" />
                {m.role} — {m.city}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
