"use client";

import { useInView } from "@/hooks/useInView";
import type React from "react";
import { DiamondMark, SectionIndex } from "@/components/ui/editorial";
import { MapPin, Rocket, ShieldCheck, Sparkles, Search } from "lucide-react";

/**
 * "O que o vale devolve" — benefícios como trilha editorial numerada
 * (hairlines + ícones em círculos pastel) e ilustração colagem em
 * sangria na borda direita. Abaixo, mini-seção "o que sustenta o vale":
 * cinco paradas com ilustrações colagem ligadas por linha pontilhada.
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

const STOPS = [
  {
    asset: "/media/sustenta-1.png",
    icon: ShieldCheck,
    label: "Aprovação manual",
    desc: "Cada perfil é analisado por pessoas reais.",
    num: "01",
    accent: "#C25A2E",
    pastel: "#F7E7DF",
  },
  {
    asset: "/media/sustenta-2.png",
    icon: MapPin,
    label: "12 cidades do Cariri",
    desc: "Talentos e oportunidades em toda a região.",
    num: "02",
    accent: "#5F8753",
    pastel: "#E4EBDD",
  },
  {
    asset: "/media/sustenta-3.png",
    icon: Rocket,
    label: "Perfis de empresa com MRR",
    desc: "Startups em tração, com receita recorrente.",
    num: "03",
    accent: "#C99A2E",
    pastel: "#F3E9CF",
  },
  {
    asset: "/media/sustenta-4.png",
    icon: Sparkles,
    label: "Indicação entre membros",
    desc: "Conexões que geram oportunidades reais.",
    num: "04",
    accent: "#239D8C",
    pastel: "#DFEAE7",
  },
  {
    asset: "/media/sustenta-5.png",
    icon: Search,
    label: "Busca por interesse",
    desc: "Encontre pessoas e projetos alinhados com seus objetivos.",
    num: "05",
    accent: "#1E4D3A",
    pastel: "#E3E9DC",
  },
] as const;

/** Geometria das paradas e da linha pontilhada (desktop). */
const STOP_IMG_H = 180;
const STOP_PT = 24; // padding-top da faixa desktop
const SVG_H = 120;
// centro da linha a partir do topo da faixa desktop (atravessa as ilustrações)
const CIRCLES_MID = STOP_PT + STOP_IMG_H * 0.62;
const SVG_TOP = CIRCLES_MID - SVG_H / 2;
// pontinhos coloridos entre as paradas (x em %, y relativo ao topo do SVG)
const MID_DOTS = [
  { left: "20%", y: 51, color: "#C25A2E" },
  { left: "40%", y: 55, color: "#5F8753" },
  { left: "60%", y: 68, color: "#C99A2E" },
  { left: "80%", y: 65, color: "#239D8C" },
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

      {/* ── Mini-seção: o que sustenta o vale ── */}
      <div className="relative" style={{ marginTop: 96, ...fadeUp(0.2) }}>
        <div className="mx-auto max-w-[1300px] px-6 lg:px-16">
          <p
            className="kv-kicker"
            style={{ margin: "0", display: "flex", alignItems: "center", gap: 9, color: "var(--nb-body-strong)" }}
          >
            <DiamondMark size={7} color="var(--nb-terracotta)" />
            O QUE SUSTENTA O VALE
          </p>

          {/* desktop: linha pontilhada serpenteando pelas 5 paradas */}
          <div className="relative hidden md:block" style={{ paddingTop: STOP_PT }}>
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                top: SVG_TOP,
                left: 0,
                width: "100%",
                height: SVG_H,
                zIndex: 0,
              }}
            >
              <path
                d="M 16 64 C 44 62, 68 60, 100 60 C 160 60, 230 46, 300 46 C 370 46, 430 64, 500 64 C 570 64, 630 72, 700 72 C 770 72, 830 58, 900 58 C 930 58, 960 62, 984 64"
                fill="none"
                stroke="var(--nb-heading)"
                strokeWidth="1.6"
                strokeDasharray="0.5 7"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity="0.55"
              />
            </svg>

            {/* pontinhos coloridos no trajeto */}
            {MID_DOTS.map(d => (
              <span
                key={d.left}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: d.left,
                  top: SVG_TOP + d.y,
                  transform: "translate(-50%, -50%)",
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: d.color,
                  zIndex: 0,
                }}
              />
            ))}

            <div className="grid grid-cols-5" style={{ position: "relative", zIndex: 1 }}>
              {STOPS.map(s => {
                return (
                  <div key={s.num} style={{ textAlign: "center", padding: "0 10px" }}>
                    {/* ilustração colagem */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.asset}
                      alt=""
                      aria-hidden="true"
                      style={{
                        width: "100%",
                        height: STOP_IMG_H,
                        objectFit: "contain",
                        objectPosition: "center bottom",
                        display: "block",
                      }}
                    />
                    <p className="kv-index-num" style={{ margin: "14px 0 0", fontSize: 12, color: s.accent }}>
                      {s.num}
                    </p>
                    <p className="kv-kicker" style={{ margin: "5px 0 0", fontSize: 12, color: "var(--nb-heading)" }}>
                      {s.label}
                    </p>
                    <p style={{ margin: "7px auto 0", fontSize: 13, lineHeight: 1.55, color: "var(--nb-body)", maxWidth: 190 }}>
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* mobile: paradas empilhadas, sem linha */}
          <div className="flex flex-col gap-7 md:hidden" style={{ paddingTop: 20 }}>
            {STOPS.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.asset}
                    alt=""
                    aria-hidden="true"
                    style={{ width: 88, height: 88, objectFit: "contain", flexShrink: 0 }}
                  />
                  <div>
                    <p className="kv-index-num" style={{ margin: "0 0 2px", fontSize: 11, color: s.accent }}>
                      {s.num}
                    </p>
                    <p className="kv-kicker" style={{ margin: "0 0 3px", fontSize: 11.5, color: "var(--nb-heading)" }}>
                      {s.label}
                    </p>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: "var(--nb-body)" }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}