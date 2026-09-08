"use client";

import { useInView } from "@/hooks/useInView";
import type React from "react";
import { DiamondMark, SectionIndex } from "@/components/ui/editorial";
import { MapPin, Rocket, ShieldCheck, Sparkles, Search } from "lucide-react";

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

const TRAIL = [
  { icon: ShieldCheck, label: "Aprovação manual", accent: "#C25A2E", pastel: "#F7E7DF", yOff: -18, rot: -3 },
  { icon: MapPin, label: "12 cidades do Cariri", accent: "#5F8753", pastel: "#E4EBDD", yOff: 16, rot: 2 },
  { icon: Rocket, label: "Perfis de empresa com MRR", accent: "#C99A2E", pastel: "#F3E9CF", yOff: -14, rot: -2 },
  { icon: Sparkles, label: "Indicação entre membros", accent: "#239D8C", pastel: "#DFEAE7", yOff: 18, rot: 2.5 },
  { icon: Search, label: "Busca por interesse", accent: "#1E4D3A", pastel: "#E3E9DC", yOff: -12, rot: -2 },
] as const;

/** Altura da faixa da trilha e centro da linha. */
const TRAIL_H = 170;
const TRAIL_MID = 78;

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
        className="hidden lg:block"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "calc(100% - 260px)",
          width: "min(50%, 820px)",
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

          <div style={{ borderBottom: "1px solid var(--nb-line)", maxWidth: 560 }}>
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
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "var(--nb-body)", maxWidth: 400 }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mini-seção: capacidades como paradas na linha orgânica ── */}
      <div className="relative" style={{ marginTop: 96, ...fadeUp(0.2) }}>
        <div className="mx-auto max-w-[1300px] px-6 lg:px-16">
          <p
            className="kv-kicker"
            style={{ margin: "0 0 6px", display: "flex", alignItems: "center", gap: 9, color: "var(--nb-body-strong)" }}
          >
            <DiamondMark size={7} color="var(--nb-terracotta)" />
            O QUE SUSTENTA O VALE
          </p>

          {/* desktop: linha serpenteante horizontal com paradas */}
          <div className="relative hidden md:block" style={{ height: TRAIL_H }}>
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 170"
              preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <path
                d="M 0 92 C 40 82, 66 76, 100 74 C 170 70, 228 104, 300 106 C 372 108, 430 74, 500 72 C 570 70, 630 102, 700 104 C 772 106, 838 76, 900 74 C 942 72, 972 84, 1000 88"
                fill="none"
                stroke="var(--nb-line)"
                strokeWidth="1.6"
                strokeDasharray="0.5 7"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {TRAIL.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.label}
                  style={{
                    position: "absolute",
                    left: `${i * 20 + 10}%`,
                    top: TRAIL_MID + c.yOff - 21,
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 9,
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      width: 42,
                      height: 42,
                      background: c.pastel,
                      borderRadius: "60% 40% 55% 45% / 50% 55% 45% 50%",
                      transform: `rotate(${c.rot}deg)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 16px rgba(22,20,15,.08)",
                    }}
                  >
                    <Icon size={17} strokeWidth={2.2} color={c.accent} />
                  </span>
                  <span
                    className="kv-kicker"
                    style={{
                      fontSize: 11,
                      color: "var(--nb-body-strong)",
                      background: "var(--nb-page-bg)",
                      padding: "2px 8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* mobile: paradas empilhadas, sem linha */}
          <div className="flex flex-col gap-3 md:hidden" style={{ paddingTop: 10 }}>
            {TRAIL.map(c => {
              const Icon = c.icon;
              return (
                <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 11, width: "fit-content" }}>
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      flexShrink: 0,
                      background: c.pastel,
                      borderRadius: "60% 40% 55% 45% / 50% 55% 45% 50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={14} strokeWidth={2.2} color={c.accent} />
                  </span>
                  <span className="kv-kicker" style={{ fontSize: 11, color: "var(--nb-body-strong)" }}>
                    {c.label}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}