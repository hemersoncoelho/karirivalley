"use client";

import { useEffect, useRef, useState } from "react";
import { Ticker } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";
import PixelField from "./PixelField";
import { useNbTheme } from "@/hooks/useNbTheme";

const COMPANIES_TICKER = [
  "Lumiere", "Inove Base", "Casa do Código CE", "Vale Tech", "Sertão Labs",
  "Cariri Digital", "Base Nova", "Oficina 51", "Prata Digital", "Chapada XR",
];

/**
 * Hero-capa: campo de pixels interativo (halftone vivo) no lugar de foto/vídeo
 * de fundo. O vídeo da marca sobrevive como "selo" discreto em moldura no
 * canto da composição.
 */
export default function HeroSection() {
  const { theme } = useNbTheme();
  const dark = theme === "dark";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  const fg = dark ? "var(--nb-sand)" : "var(--nb-ink)";
  const body = dark ? "rgba(244,238,225,.72)" : "rgba(22,20,15,.62)";
  const hair = dark ? "rgba(244,238,225,.35)" : "rgba(22,20,15,.85)";

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: dark ? "var(--kv-dark)" : "var(--nb-page-bg)" }}
    >
      {/* ── Vídeo da marca como textura de fundo — lavado e desfocado, em loop ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
      >
        <video
          ref={videoRef}
          src="/media/logo-anim.mp4"
          muted
          playsInline
          autoPlay
          loop
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: dark ? 0.35 : 0.5,
            filter: dark ? "brightness(.8) blur(18px)" : "contrast(1.02) brightness(1.06) blur(18px)",
            transform: "scale(1.08)", // esconde as bordas escurecidas do blur
            mixBlendMode: dark ? "screen" : "multiply",
          }}
        />
      </div>

      <PixelField />

      {/* ── Manifesto central ── */}
      <div
        className="relative flex flex-1 flex-col items-center justify-center px-6 pb-14 pt-32 text-center"
        style={{
          zIndex: 10,
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition: "opacity .9s ease, transform 1.1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <p className="kv-kicker" style={{ color: dark ? "var(--nb-mustard)" : "#8A5C13" }}>
          ◆ Kariri — Ceará — Brasil · Ed. contínua
        </p>

        <h1
          className="kv-display mt-6"
          style={{ fontSize: "clamp(46px, 6.4vw, 100px)", color: fg, maxWidth: 980 }}
        >
          O vale que{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>constrói</em> o
          futuro do sertão.
        </h1>

        <div
          className="mt-9 flex max-w-[560px] items-start gap-4 text-left"
          style={{ borderTop: `1px solid ${hair}`, paddingTop: 16 }}
        >
          <span className="kv-index-num" style={{ fontSize: 13, color: dark ? "var(--nb-mustard)" : "var(--nb-terracotta)" }}>01</span>
          <p style={{ fontSize: "clamp(15px, 1.4vw, 16px)", lineHeight: 1.7, color: body }}>
            Um mapa vivo de quem faz inovação no Cariri — e uma publicação
            viva do que está sendo construído aqui.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <EditorialButton href="/como-participar" size="lg">
            Fazer parte
          </EditorialButton>
          <EditorialButton href="/sobre" variant="ghost" size="lg">
            Conhecer o manifesto
          </EditorialButton>
        </div>
      </div>

      {/* ── Rodapé do hero: ticker de empresas do vale ── */}
      <div style={{ position: "relative", zIndex: 10, borderTop: `1px solid ${hair}` }}>
        <div
          className="py-3"
          style={{
            background: dark ? "rgba(6,13,8,.6)" : "rgba(251,248,239,.72)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Ticker
            items={COMPANIES_TICKER}
            itemStyle={{ color: dark ? "var(--nb-sand)" : "var(--nb-ink)" }}
            style={{ ["--nb-heading" as string]: dark ? "var(--nb-sand)" : "var(--nb-ink)" }}
          />
        </div>
      </div>
    </section>
  );
}
