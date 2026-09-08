"use client";

import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";

/**
 * "O que o vale devolve" — benefícios como trilha editorial numerada
 * (hairlines + ícones em círculos pastel) e ilustração colagem em
 * sangria na borda direita. Conforme mockup aprovado.
 */
const BENEFITS = [
  {
    icon: "/media/icone-talentos.png",
    title: "Rede verificada",
    desc: "Perfis reais, aprovados um a um, com o que cada membro busca e oferece. Sem ruído, sem portas fechadas.",
    num: "01",
    accent: "#C25A2E",
    pastel: "#FBE4DC",
  },
  {
    icon: "/media/icone-universidade.png",
    title: "Vale em movimento",
    desc: "Encontros, talks e workshops constantes — a agenda que mantém o ecossistema vivo e visível.",
    num: "02",
    accent: "#239D8C",
    pastel: "#E4EBDD",
  },
  {
    icon: "/media/icone-empresa.png",
    title: "Oportunidades em primeira mão",
    desc: "Editais, vagas, mentorias e investimento circulam aqui antes de qualquer canal aberto.",
    num: "03",
    accent: "#C99A2E",
    pastel: "#F7EFD9",
  },
] as const;

export default function BenefitsSection() {
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
      {/* Ilustração colagem em sangria, ancorada na borda direita */}
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(52%, 860px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/colagem-beneficios.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "right center",
            display: "block",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1300px] px-6 lg:px-16" style={{ zIndex: 1 }}>
        <SectionIndex index="03" label="Benefícios" title="o que o vale devolve" />

        {/* ── Esquerda: headline + trilha de benefícios ── */}
        <div style={{ maxWidth: 720, position: "relative", zIndex: 1 }}>
          <h2
            className="kv-display"
            style={{ fontSize: "clamp(30px, 3.4vw, 48px)", color: "var(--nb-heading)", margin: "40px 0 0", maxWidth: 640, lineHeight: 1.08, ...fadeUp(0) }}
          >
            Feito para o trabalho{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-terracotta)" }}>real</em>{" "}
            de empreender
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--nb-body)", margin: "16px 0 32px", maxWidth: 480, ...fadeUp(0.05) }}>
            A plataforma cuida da estrutura. Você cuida do que só você pode fazer.
          </p>

          <div style={{ borderBottom: "1px solid var(--nb-line)", maxWidth: 700 }}>
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                style={{
                  borderTop: "1px solid var(--nb-line)",
                  padding: "26px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  ...fadeUp(0.1 + i * 0.07),
                }}
              >
                {/* ícone em círculo pastel */}
                <span
                  style={{
                    width: 76,
                    height: 76,
                    flexShrink: 0,
                    background: b.pastel,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.icon} alt="" aria-hidden="true" style={{ width: 46, height: 46, objectFit: "contain" }} />
                </span>
                <div>
                  <p className="kv-index-num" style={{ margin: "0 0 3px", fontSize: 11.5, color: b.accent }}>
                    {b.num}
                  </p>
                  <h3 style={{ margin: "0 0 5px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 21, color: "var(--nb-heading)" }}>
                    {b.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "var(--nb-body)", maxWidth: 460 }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}