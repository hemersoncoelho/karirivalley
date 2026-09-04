"use client";

import { useRef, useState, useEffect } from "react";
import { MetaDot, Ticker } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";

const COMPANIES_TICKER = [
  "Lumiere", "Inove Base", "Casa do Código CE", "Vale Tech", "Sertão Labs",
  "Cariri Digital", "Base Nova", "Oficina 51", "Prata Digital", "Chapada XR",
];

/**
 * Hero em duas fases: o vídeo da marca ocupa a viewport inteira e, ao
 * terminar, dissolve para o manifesto editorial com a foto da comunidade.
 * prefers-reduced-motion pula direto para o manifesto.
 */
export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"video" | "photo">("video");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPhase("photo");
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: "var(--nb-page-bg)" }}
    >
      {/* ── Fase 1: vídeo cobrindo a área da hero (posição absoluta na section) ── */}
      {phase === "video" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            background: "#0A0A0A",
          }}
        >
          <video
            ref={videoRef}
            src="/media/logo-anim.mp4"
            muted
            playsInline
            autoPlay
            onEnded={() => setPhase("photo")}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* ── Fase 2: manifesto editorial ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          opacity: phase === "photo" ? 1 : 0,
          transform: phase === "photo" ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 1s ease .25s, transform 1.3s cubic-bezier(.16,1,.3,1) .25s",
          pointerEvents: phase === "photo" ? "auto" : "none",
        }}
      >
        {/* Hairline de moldura superior */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: "0 0 auto 0", height: 1, background: "var(--nb-line)", top: 76 }}
        />

        <div className="relative mx-auto grid w-full max-w-[1300px] flex-1 grid-cols-1 items-center gap-12 px-6 pb-10 pt-32 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:px-16 lg:pt-36">
          {/* ── Coluna esquerda: manifesto ── */}
          <div className="flex flex-col items-start">
            <p className="kv-kicker" style={{ color: "var(--nb-label-accent)" }}>
              ◆ Kariri — Ceará — Brasil · Ed. contínua
            </p>

            <h1
              className="kv-display mt-5"
              style={{ fontSize: "clamp(46px, 6.2vw, 96px)", color: "var(--nb-heading)" }}
            >
              <span className="block overflow-hidden">
                <span className="kv-line-up" style={{ animationDelay: ".55s" }}>O vale que</span>
              </span>
              <span className="block overflow-hidden">
                <span className="kv-line-up" style={{ animationDelay: ".7s" }}>
                  <em style={{ fontStyle: "italic", fontWeight: 400 }}>constrói</em> o futuro
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="kv-line-up" style={{ animationDelay: ".85s" }}>do sertão.</span>
              </span>
            </h1>

            <div
              className="mt-8 flex max-w-[520px] items-start gap-4"
              style={{ borderTop: "1px solid var(--nb-line)", paddingTop: 16 }}
            >
              <span className="kv-index-num" style={{ fontSize: 13, color: "var(--nb-terracotta)" }}>01</span>
              <p style={{ fontSize: "clamp(15px, 1.4vw, 16px)", lineHeight: 1.7, color: "var(--nb-body)" }}>
                Um mapa vivo de quem faz inovação no Cariri — e uma publicação
                viva do que está sendo construído aqui.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <EditorialButton href="/como-participar" size="lg">
                Fazer parte
              </EditorialButton>
              <EditorialButton href="/sobre" variant="ghost" size="lg">
                Conhecer o manifesto
              </EditorialButton>
            </div>

            {/* Prova social em números — elemento, não parágrafo */}
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ["214", "membros"],
                ["12", "cidades"],
                ["40", "encontros"],
              ].map(([n, l]) => (
                <div key={l} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span className="kv-index-num" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, color: "var(--nb-heading)" }}>{n}</span>
                  <span className="kv-kicker" style={{ color: "var(--nb-body)" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Coluna direita: fotografia da comunidade ── */}
          <div className="relative hidden lg:block">
            <figure style={{ margin: 0, position: "relative" }}>
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
          </div>
        </div>

        {/* ── Rodapé do hero: ticker de empresas do vale ── */}
        <div style={{ borderTop: "1px solid var(--nb-line)" }}>
          <div className="py-3" style={{ background: "var(--nb-forest)", color: "var(--nb-sand)" }}>
            <Ticker
              items={COMPANIES_TICKER}
              itemStyle={{ color: "var(--nb-sand)" }}
              style={{ ["--nb-heading" as string]: "var(--nb-sand)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
