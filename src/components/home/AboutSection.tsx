"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";

/**
 * "O ecossistema" — orgânica: headline + jornada ilustrada do ecossistema
 * (asset próprio) à esquerda; colagem orgânica de fotos com pílulas de
 * membros e selo à direita. Faixa panorâmica da chapada fecha o capítulo.
 */
const MEMBERS = [
  { face: "/media/faces/face-1.jpg", name: "Maria", tag: "STARTUP", dot: "#239D8C" },
  { face: "/media/faces/face-2.jpg", name: "Pedro", tag: "INVESTIMENTO", dot: "#E9B23C" },
  { face: "/media/faces/face-3.jpg", name: "Ana", tag: "EDUCAÇÃO", dot: "#C25A2E" },
  { face: "/media/faces/face-4.jpg", name: "Rafael", tag: "DEV REMOTO", dot: "#239D8C" },
] as const;

/** Selo circular giratório com texto no contorno e diamante central. */
function RotatingSeal() {
  return (
    <div aria-hidden="true" className="kv-slow-spin" style={{ animationDuration: "40s", width: 132, height: 132 }}>
      <svg viewBox="0 0 132 132" width="132" height="132" style={{ display: "block" }}>
        <defs>
          <path id="kv-seal-path" d="M 66,66 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" />
        </defs>
        <text style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, letterSpacing: ".42em", fill: "#C25A2E" }}>
          <textPath href="#kv-seal-path">
            PESSOAS · TERRITÓRIO · OPORTUNIDADES · FUTURO ·
          </textPath>
        </text>
        <rect
          x="59" y="59" width="14" height="14"
          fill="none" stroke="#C25A2E" strokeWidth="1.6"
          transform="rotate(45 66 66)"
        />
        <rect x="63.5" y="63.5" width="5" height="5" fill="#C25A2E" transform="rotate(45 66 66)" />
      </svg>
    </div>
  );
}

/** Pílula de membro com face real. */
function MemberPill({ m }: { m: (typeof MEMBERS)[number] }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--nb-cream)",
        border: "1px solid rgba(22,20,15,.08)",
        borderRadius: 999,
        padding: "5px 14px 5px 6px",
        boxShadow: "0 4px 14px rgba(22,20,15,.12)",
        width: "fit-content",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={m.face}
        alt=""
        style={{ width: 38, height: 38, borderRadius: 999, objectFit: "cover" }}
      />
      <span>
        <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--nb-heading)", lineHeight: 1.2 }}>
          {m.name}
        </span>
        <span className="kv-kicker" style={{ display: "block", fontSize: 8.5, color: "var(--nb-body)", letterSpacing: ".12em" }}>
          {m.tag}
        </span>
      </span>
      <span
        aria-hidden="true"
        style={{ width: 7, height: 7, borderRadius: 999, background: m.dot, marginLeft: 2, flexShrink: 0 }}
      />
    </div>
  );
}

export default function AboutSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section
      id="ecossistema"
      className="relative overflow-hidden"
      style={{ background: "var(--nb-page-bg)" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 pt-24 lg:px-16">
        <SectionIndex index="01" label="Ecossistema" accentColor="#C25A2E" />

        <div className="mt-10 grid grid-cols-1 items-start gap-14 lg:grid-cols-[5fr_6fr]">
          {/* ── Esquerda: headline + jornada ilustrada ── */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2
              className="kv-display"
              style={{
                fontSize: "clamp(38px, 4.4vw, 64px)",
                color: "var(--nb-heading)",
                lineHeight: 1.05,
                margin: 0,
                ...fadeUp(0.05),
              }}
            >
              Um ecossistema
              <br />
              feito por pessoas
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-forest)" }}>
                que constroem
              </em>{" "}
              o Cariri
            </h2>

            <p
              className="kv-kicker"
              style={{
                display: "flex", flexWrap: "wrap", gap: "6px 18px", alignItems: "center",
                margin: "26px 0 0", color: "var(--nb-body-strong)",
                ...fadeUp(0.12),
              }}
            >
              <span>IDEIAS</span>
              <span style={{ color: "#C25A2E" }}>◆</span>
              <span>TALENTOS</span>
              <span style={{ color: "#C25A2E" }}>◆</span>
              <span>INVESTIMENTO</span>
              <span style={{ color: "#C25A2E" }}>◆</span>
              <span>IMPACTO</span>
            </p>

            {/* Jornada ilustrada: as 4 paradas do ecossistema */}
            <div style={{ margin: "18px -8px 0", ...fadeUp(0.2) }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/jornada-ecossistema.png"
                alt="Jornada do ecossistema: startups geram ideias, talentos constroem, empresas transformam e universidades impulsionam"
                style={{ width: "100%", maxWidth: 640, height: "auto", display: "block" }}
              />
            </div>

            <div style={{ marginTop: 10, ...fadeUp(0.3) }}>
              <Link
                href="/sobre"
                className="kv-kicker inline-flex items-center gap-3 no-underline"
                style={{ color: "var(--nb-ink)" }}
              >
                <span style={{ borderBottom: "1.5px solid var(--nb-ink)", paddingBottom: 3 }}>
                  EXPLORAR O ECOSSISTEMA
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* ── Direita: colagem orgânica + selo + pílulas ── */}
          <div style={{ position: "relative", zIndex: 1, ...fadeUp(0.2) }}>
            {/* selo rotativo */}
            <div style={{ position: "absolute", top: -20, right: 6, zIndex: 4 }}>
              <RotatingSeal />
            </div>

            {/* folha atrás da colagem */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/deco-layer-11.png"
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                left: -56,
                top: 60,
                width: 200,
                opacity: 0.95,
                pointerEvents: "none",
                transform: "rotate(-14deg)",
              }}
            />

            {/* colagem orgânica: formas irregulares sobrepostas */}
            <div style={{ position: "relative", paddingRight: 4 }}>
              {/* foto principal */}
              <div
                style={{
                  borderRadius: "58% 42% 46% 54% / 44% 52% 48% 56%",
                  overflow: "hidden",
                  boxShadow: "0 24px 48px rgba(22,20,15,.14)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/comunidade-2.jpg"
                  alt="Apresentadora da comunidade durante encontro no Lumiere"
                  style={{ width: "100%", height: "auto", display: "block", aspectRatio: "5 / 5.4", objectFit: "cover" }}
                />
              </div>

              {/* foto secundária sobreposta */}
              <div
                style={{
                  position: "absolute",
                  left: -18,
                  bottom: -34,
                  width: "46%",
                  borderRadius: "44% 56% 58% 42% / 52% 44% 56% 48%",
                  overflow: "hidden",
                  border: "4px solid var(--nb-page-bg)",
                  boxShadow: "0 16px 32px rgba(22,20,15,.16)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/comunidade-6.webp"
                  alt="Público acompanhando talk"
                  style={{ width: "100%", height: "auto", display: "block", aspectRatio: "1 / 0.9", objectFit: "cover" }}
                />
              </div>

              {/* legenda manuscrita */}
              <p
                style={{
                  position: "absolute",
                  left: 4,
                  bottom: -74,
                  margin: 0,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 22,
                  lineHeight: 1.3,
                  color: "var(--nb-heading)",
                  maxWidth: 240,
                }}
              >
                mais conexões para um Cariri maior
              </p>
            </div>

            {/* pílulas de membros à direita da colagem */}
            <div
              style={{
                position: "absolute",
                top: 140,
                right: -10,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 10,
                zIndex: 3,
              }}
            >
              {MEMBERS.map(m => (
                <MemberPill key={m.name} m={m} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Faixa panorâmica da chapada fechando o capítulo ── */}
      <div style={{ marginTop: 130, position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/paisagem-montanha.png"
          alt="Ilustração da paisagem do Cariri: igreja, chapada, sol e árvores"
          style={{
            width: "100%",
            minWidth: 900,
            height: "auto",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}
