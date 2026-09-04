"use client";

import { useEffect, useState } from "react";
import { Ticker } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";

const COMPANIES_TICKER = [
  "Lumiere", "Inove Base", "Casa do Código CE", "Vale Tech", "Sertão Labs",
  "Cariri Digital", "Base Nova", "Oficina 51", "Prata Digital", "Chapada XR",
];

/**
 * Hero em camadas: o vídeo da marca roda como fundo escurecido com o
 * manifesto já centralizado sobre ele; ao terminar, dissolve para a
 * fotografia da comunidade no mesmo enquadramento. prefers-reduced-motion
 * pula direto para a foto.
 */
export default function HeroSection() {
  const [phase, setPhase] = useState<"video" | "photo">("video");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPhase("photo");
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: "var(--kv-dark)" }}
    >
      {/* ── Camada de fundo: vídeo → foto (mesmo enquadramento, crossfade) ── */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* Foto: estado final, sempre por baixo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/comunidade-2.jpg"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: phase === "photo" ? 1 : 0,
            transform: phase === "photo" ? "scale(1)" : "scale(1.06)",
            transition: "opacity 1.8s ease, transform 2.6s cubic-bezier(.16,1,.3,1)",
          }}
        />
        {/* Vídeo: some suavemente no fim, revelando a foto */}
        <video
          src="/media/logo-anim.mp4"
          muted
          playsInline
          autoPlay
          onEnded={() => setPhase("photo")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: phase === "video" ? 1 : 0,
            transition: "opacity 1.8s ease .15s",
            display: phase === "video" ? "block" : "none",
          }}
        />
        {/* Escurecimento para leitura — denso nas bordas, respira no centro */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(6,13,8,.8), rgba(6,13,8,.45) 45%, rgba(6,13,8,.72))",
            opacity: phase === "video" ? 1 : 0.9,
            transition: "opacity 1.8s ease",
          }}
        />
        {/* Vignette radial atrás do manifesto — âncora de contraste do texto */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 62% 58% at 50% 46%, rgba(6,13,8,.62), transparent 72%)",
          }}
        />
        {/* Trama halftone — a página imprime sobre a mídia */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(6,13,8,.9) 1px, transparent 1.15px)",
            backgroundSize: "5px 5px",
            opacity: phase === "video" ? 0.55 : 0.4,
            transition: "opacity 1.8s ease",
          }}
        />
      </div>

      {/* ── Manifesto centralizado sobre a mídia, visível desde o vídeo ── */}
      <div
        className="relative flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-36 text-center"
        style={{
          zIndex: 10,
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1.1s ease, transform 1.3s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <p className="kv-kicker" style={{ color: "var(--nb-mustard)" }}>
          ◆ Kariri — Ceará — Brasil · Ed. contínua
        </p>

        <h1
          className="kv-display mt-6"
          style={{
            fontSize: "clamp(46px, 6.4vw, 100px)",
            color: "var(--nb-sand)",
            maxWidth: 980,
          }}
        >
          O vale que{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>
            constrói
          </em>{" "}
          o futuro do sertão.
        </h1>

        <div
          className="mt-9 flex max-w-[560px] items-start gap-4 text-left"
          style={{ borderTop: "1px solid rgba(244,238,225,.35)", paddingTop: 16 }}
        >
          <span className="kv-index-num" style={{ fontSize: 13, color: "var(--nb-mustard)" }}>01</span>
          <p style={{ fontSize: "clamp(15px, 1.4vw, 16px)", lineHeight: 1.7, color: "rgba(244,238,225,.82)" }}>
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
      <div style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(244,238,225,.3)" }}>
        <div className="py-3" style={{ background: "rgba(6,13,8,.55)", backdropFilter: "blur(6px)" }}>
          <Ticker
            items={COMPANIES_TICKER}
            itemStyle={{ color: "var(--nb-sand)" }}
            style={{ ["--nb-heading" as string]: "var(--nb-sand)" }}
          />
        </div>
      </div>
    </section>
  );
}
