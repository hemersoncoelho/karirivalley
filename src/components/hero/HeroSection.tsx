"use client";

import { DiamondMark, MetaDot, Ticker } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";

const CITIES_TICKER = [
  "Juazeiro do Norte", "Crato", "Barbalha", "Missão Velha", "Lavras da Mangabeira",
  "Brejo Santo", "Mauriti", "Milagres", "Cedro", "Icó",
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: "var(--nb-page-bg)" }}
    >
      {/* Hairline de moldura superior — a página como folha impressa */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: "0 0 auto 0", height: 1, background: "var(--nb-line)", top: 76 }}
      />

      <div className="relative mx-auto grid w-full max-w-[1300px] flex-1 grid-cols-1 items-center gap-12 px-6 pb-10 pt-32 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:px-16 lg:pt-36">
        {/* ── Coluna esquerda: manifesto ── */}
        <div className="flex flex-col items-start">
          <p className="kv-kicker kv-fade-in-up" style={{ color: "var(--nb-label-accent)", animationDelay: ".1s" }}>
            ◆ Kariri — Ceará — Brasil · Ed. contínua
          </p>

          <h1
            className="kv-display mt-5"
            style={{ fontSize: "clamp(46px, 6.2vw, 96px)", color: "var(--nb-heading)" }}
          >
            <span className="block overflow-hidden">
              <span className="kv-line-up" style={{ animationDelay: ".2s" }}>O vale que</span>
            </span>
            <span className="block overflow-hidden">
              <span className="kv-line-up" style={{ animationDelay: ".34s" }}>
                <em style={{ fontStyle: "italic", fontWeight: 400 }}>constrói</em> o futuro
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="kv-line-up" style={{ animationDelay: ".48s" }}>do sertão.</span>
            </span>
          </h1>

          <div
            className="kv-fade-in-up mt-8 flex max-w-[520px] items-start gap-4"
            style={{ animationDelay: ".75s", borderTop: "1px solid var(--nb-line)", paddingTop: 16 }}
          >
            <span className="kv-index-num" style={{ fontSize: 13, color: "var(--nb-terracotta)" }}>01</span>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 17px)", lineHeight: 1.7, color: "var(--nb-body)" }}>
              Um mapa vivo de quem faz inovação no Cariri — pessoas, startups,
              universidades e investidores se encontram aqui para transformar
              o interior do Ceará.
            </p>
          </div>

          <div className="kv-fade-in-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".9s" }}>
            <EditorialButton href="/como-participar" size="lg">
              Fazer parte
            </EditorialButton>
            <EditorialButton href="/sobre" variant="ghost" size="lg">
              Conhecer o manifesto
            </EditorialButton>
          </div>
        </div>

        {/* ── Coluna direita: fotografia da comunidade ── */}
        <div className="kv-fade-in-up relative hidden lg:block" style={{ animationDelay: ".55s" }}>
          <figure style={{ margin: 0 }}>
            <div className="kv-photo" style={{ border: "1px solid var(--nb-line)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/comunidade-2.jpg"
                alt="Encontro da comunidade Kariri Valley"
                style={{ width: "100%", height: "auto", display: "block", aspectRatio: "4 / 5", objectFit: "cover" }}
              />
            </div>
            <figcaption
              className="kv-meta"
              style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10, color: "var(--nb-body)" }}
            >
              <span style={{ color: "var(--nb-label-accent)" }}>FIG. 01</span>
              <span>Encontro da comunidade — Cariri, CE</span>
              <MetaDot role="highlight" style={{ marginLeft: "auto", alignSelf: "center" }} />
            </figcaption>
          </figure>

          {/* Carimbo de edição */}
          <div
            aria-hidden="true"
            className="kv-slow-spin"
            style={{
              position: "absolute",
              top: -26,
              left: -26,
              animationDuration: "60s",
            }}
          >
            <svg width="86" height="86" viewBox="0 0 86 86" style={{ display: "block" }}>
              <defs>
                <path id="kv-stamp-circle" d="M 43,43 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" />
              </defs>
              <circle cx="43" cy="43" r="42" fill="none" stroke="var(--nb-ink)" strokeWidth="1" />
              <circle cx="43" cy="43" r="22" fill="none" stroke="var(--nb-ink)" strokeWidth="1" />
              <rect x="39.5" y="39.5" width="7" height="7" fill="var(--nb-mustard)" transform="rotate(45 43 43)" />
              <text style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 9.5, letterSpacing: ".22em", fill: "var(--nb-ink)" }}>
                <textPath href="#kv-stamp-circle">KARIRI VALLEY · COMUNIDADE · VALE DO CARIRI ·</textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Rodapé do hero: métricas + ticker de cidades ── */}
      <div className="relative" style={{ borderTop: "1px solid var(--nb-line)" }}>
        <div
          className="mx-auto flex max-w-[1300px] flex-wrap items-center gap-x-10 gap-y-3 px-6 py-4 lg:px-16"
          style={{ borderBottom: "1px solid var(--nb-line)" }}
        >
          {[
            ["214", "membros"],
            ["12", "cidades"],
            ["40", "encontros"],
          ].map(([n, l]) => (
            <p key={l} style={{ display: "flex", alignItems: "baseline", gap: 8, margin: 0 }}>
              <span className="kv-index-num" style={{ fontSize: 22, fontWeight: 700, color: "var(--nb-heading)" }}>{n}</span>
              <span className="kv-kicker" style={{ color: "var(--nb-body)" }}>{l}</span>
            </p>
          ))}
          <p className="kv-kicker" style={{ margin: "0 0 0 auto", color: "var(--nb-body)" }}>
            desde 2016
          </p>
        </div>

        <div className="py-3" style={{ background: "var(--nb-forest)", color: "var(--nb-sand)" }}>
          <Ticker
            items={CITIES_TICKER}
            itemStyle={{ color: "var(--nb-sand)" }}
            style={{ ["--nb-heading" as string]: "var(--nb-sand)" }}
          />
        </div>
      </div>
    </section>
  );
}
