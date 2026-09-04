"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type React from "react";
import { DiamondMark } from "@/components/ui/editorial";

export default function FinalCtaSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`,
  });

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--nb-forest-dark)", padding: "120px 0 110px" }}
    >
      {/* Chapada ao fundo do fechamento */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/deco-layer-13.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -10,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1100px, 105vw)",
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />
      {/* Bromélia emergindo na lateral */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/deco-layer-4.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -30,
          top: "50%",
          transform: "translateY(-50%) rotate(-10deg)",
          width: 210,
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-[900px] px-6 text-center">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22, ...fadeUp(0) }}>
          <DiamondMark size={11} />
        </div>

        <p className="kv-kicker" style={{ color: "var(--nb-mustard)", marginBottom: 26, ...fadeUp(0.05) }}>
          Edição aberta — novas inscrições
        </p>

        <h2
          className="kv-display"
          style={{ fontSize: "clamp(38px, 5.4vw, 72px)", color: "var(--nb-sand)", marginBottom: 26, ...fadeUp(0.1) }}
        >
          Faça parte da edição que está{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-mustard)" }}>conectando</em>{" "}
          o Cariri
        </h2>

        <p
          style={{
            fontSize: "clamp(15px, 1.5vw, 17px)",
            lineHeight: 1.7,
            color: "rgba(244,238,225,.72)",
            maxWidth: 520,
            margin: "0 auto 44px",
            ...fadeUp(0.2),
          }}
        >
          A comunidade se constrói a cada novo membro. Traga seu trabalho,
          sua ideia ou sua curiosidade — a ponte já está aqui.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4" style={fadeUp(0.3)}>
          <Link
            href="/como-participar"
            className="kv-press kv-kicker inline-flex items-center"
            style={{
              height: 50,
              padding: "0 28px",
              borderRadius: 2,
              background: "var(--nb-mustard)",
              color: "var(--nb-ink)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Entrar para a comunidade
          </Link>
          <Link
            href="/login"
            className="kv-kicker inline-flex items-center"
            style={{
              height: 50,
              padding: "0 26px",
              borderRadius: 2,
              border: "1px solid rgba(244,238,225,.5)",
              color: "var(--nb-sand)",
              textDecoration: "none",
            }}
          >
            Já sou membro
          </Link>
        </div>
      </div>
    </section>
  );
}
