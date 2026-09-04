"use client";

import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";

const STATS = [
  { n: "214", label: "membros fundadores", note: "perfis aprovados na plataforma" },
  { n: "12", label: "cidades conectadas", note: "Cariri e região do Ceará" },
  { n: "40", label: "encontros realizados", note: "desde 2016, sem parar" },
  { n: "07", label: "trilhas de participação", note: "do interesse ao impacto" },
] as const;

export default function StatsSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--nb-forest)", padding: "88px 0 96px" }}
    >
      {/* Halftone como textura da banda — a trama de pontos conecta sertão × tecnologia */}
      <div
        aria-hidden="true"
        className="kv-photo absolute inset-0"
        style={{ opacity: 0.18, pointerEvents: "none" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/halftone-detail.avif"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Mandacaru emoldurando a banda de impacto */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/deco-layer-11.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -50,
          top: "50%",
          transform: "translateY(-50%) rotate(8deg)",
          width: 280,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex
          index="08"
          label="Impacto"
          accentColor="var(--nb-mustard)"
          style={{ borderTopColor: "rgba(244,238,225,.35)" }}
        />

        <div className="mt-14 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {STATS.map((s, i) => (
            <div key={s.label} style={{ ...fadeUp(0.08 + i * 0.07), borderTop: "1px solid rgba(244,238,225,.35)", paddingTop: 20 }}>
              <p
                className="kv-index-num"
                style={{ margin: 0, fontSize: "clamp(56px, 6vw, 84px)", fontWeight: 700, lineHeight: 1, color: "var(--nb-sand)" }}
              >
                {s.n}
              </p>
              <p className="kv-kicker" style={{ margin: "12px 0 6px", color: "var(--nb-mustard)" }}>
                {s.label}
              </p>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(244,238,225,.65)" }}>
                {s.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
