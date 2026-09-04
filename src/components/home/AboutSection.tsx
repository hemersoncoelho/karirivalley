"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex, DiamondMark } from "@/components/ui/editorial";

/**
 * "O ecossistema" — reconstruída a partir da referência aprovada:
 * headline com palavra em serifa itálica colorida; 4 chips ilustrados dos
 * atores com ícones PNG; à direita, a paisagem do Cariri (montanha) em
 * moldura orgânica com selo rotativo, pílulas de membros (faces reais)
 * sobrepostas e rótulo manuscrito.
 */
const ACTORS = [
  { icon: "/media/icone-foguete.png", label: "STARTUPS", bg: "#F1E9D8", fg: "#C25A2E" },
  { icon: "/media/icone-talentos.png", label: "TALENTOS", bg: "#E4EBDD", fg: "#5F8753" },
  { icon: "/media/icone-empresa.png", label: "EMPRESAS", bg: "#F3E9CF", fg: "#C99A2E" },
  { icon: "/media/icone-universidade.png", label: "UNIVERSIDADES", bg: "#DFEFEA", fg: "#166E62" },
] as const;

const MEMBERS = [
  { face: "/media/faces/face-1.jpg", name: "Maria", tag: "STARTUP", dot: "#239D8C" },
  { face: "/media/faces/face-2.jpg", name: "Pedro", tag: "INVESTIMENTO", dot: "#E9B23C" },
  { face: "/media/faces/face-3.jpg", name: "Ana", tag: "EDUCAÇÃO", dot: "#C25A2E" },
  { face: "/media/faces/face-4.jpg", name: "Rafael", tag: "DEV REMOTO", dot: "#239D8C" },
] as const;

/** Selo circular giratório com texto no contorno. */
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
        {/* diamante central do selo */}
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
      style={{ background: "var(--nb-page-bg)", padding: "104px 0 60px" }}
    >
      {/* folhas de mandacaru atrás da composição */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/deco-layer-11.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "38%",
          top: "6%",
          width: 300,
          opacity: 0.9,
          pointerEvents: "none",
          transform: "rotate(-14deg)",
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="01" label="Ecossistema" accentColor="#C25A2E" />

        <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[6fr_5fr]">
          {/* ── Esquerda: headline + chips ilustrados ── */}
          <div>
            <h2
              className="kv-display"
              style={{
                fontSize: "clamp(40px, 4.8vw, 72px)",
                color: "var(--nb-heading)",
                lineHeight: 1.02,
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
              }}
            >
              <span>IDEIAS</span>
              <DiamondMark size={5} color="#C25A2E" />
              <span>TALENTOS</span>
              <DiamondMark size={5} color="#C25A2E" />
              <span>INVESTIMENTO</span>
              <DiamondMark size={5} color="#C25A2E" />
              <span>IMPACTO</span>
            </p>

            {/* chips ilustrados com ícones PNG */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4" style={fadeUp(0.2)}>
              {ACTORS.map(a => (
                <div
                  key={a.label}
                  style={{
                    background: a.bg,
                    borderRadius: 22,
                    padding: "22px 14px 18px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.icon} alt="" aria-hidden="true" style={{ width: 46, height: 46, objectFit: "contain" }} />
                  <p className="kv-kicker" style={{ margin: 0, color: a.fg, fontSize: 11, textAlign: "center" }}>
                    {a.label}
                  </p>
                  <span aria-hidden="true" style={{ color: a.fg, fontSize: 15, lineHeight: 1 }}>→</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 34, ...fadeUp(0.3) }}>
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

          {/* ── Direita: paisagem + selo + pílulas de membros ── */}
          <div style={{ position: "relative", ...fadeUp(0.2) }}>
            {/* selo rotativo */}
            <div style={{ position: "absolute", top: -38, right: "14%", zIndex: 3 }}>
              <RotatingSeal />
            </div>

            {/* mancha mostarda */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/deco-layer-9.png"
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -12,
                right: "4%",
                width: 150,
                zIndex: 0,
                pointerEvents: "none",
              }}
            />

            {/* moldura fotográfica da paisagem */}
            <div
              style={{
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(22,20,15,.1)",
                boxShadow: "0 24px 48px rgba(22,20,15,.12)",
                zIndex: 1,
                background: "#2A2417",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/comunidade-3.jpg"
                alt="Paisagem do Cariri ao entardecer, com chapada e mandacarus"
                style={{ width: "100%", height: "auto", display: "block" }}
              />

              {/* legenda manuscrita sobre a imagem */}
              <p
                style={{
                  position: "absolute",
                  left: 22,
                  bottom: 20,
                  margin: 0,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 21,
                  lineHeight: 1.3,
                  color: "#FBF6EA",
                  textShadow: "0 1px 12px rgba(6,13,8,.55)",
                  maxWidth: 200,
                }}
              >
                mais conexões para um Cariri maior
              </p>
            </div>

            {/* pílulas de membros sobre a foto */}
            <div
              style={{
                position: "absolute",
                top: 64,
                right: -14,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                zIndex: 4,
              }}
            >
              {MEMBERS.map(m => (
                <div
                  key={m.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "var(--nb-cream)",
                    border: "1px solid rgba(22,20,15,.08)",
                    borderRadius: 999,
                    padding: "5px 14px 5px 6px",
                    boxShadow: "0 4px 14px rgba(22,20,15,.1)",
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
              ))}
            </div>

            {/* rótulo lateral vertical */}
            <p
              className="kv-kicker"
              style={{
                position: "absolute",
                right: -34,
                bottom: 60,
                margin: 0,
                writingMode: "vertical-rl",
                color: "var(--nb-body)",
                zIndex: 2,
              }}
            >
              DO CARIRI PARA O MUNDO
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
