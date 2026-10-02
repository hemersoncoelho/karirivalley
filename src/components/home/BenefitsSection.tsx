import { DiamondMark, SectionIndex } from "@/components/ui/editorial";
import { MapPin, Rocket, ShieldCheck, Sparkles, Search } from "lucide-react";
import styles from "./BenefitsSection.module.css";

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
    desc: "Conheça quem faz parte do ecossistema, compartilhe o que você busca e descubra como pode contribuir.",
    num: "01",
    accent: "#C25A2E",
    pastel: "#FBE4DC",
  },
  {
    icon: "/media/icone-universidade.png",
    title: "Vale em movimento",
    desc: "Conversas, eventos e trocas de experiência para aprender com quem está perto e criar novas conexões.",
    num: "02",
    accent: "#239D8C",
    pastel: "#E4EBDD",
  },
  {
    icon: "/media/icone-empresa.png",
    title: "Caminhos para suas ideias",
    desc: "Vagas, editais, mentorias e programas que circulam no ecossistema e podem impulsionar seu próximo passo.",
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
    label: "Todo o Cariri",
    desc: "Talentos e oportunidades em toda a região.",
    num: "02",
    accent: "#5F8753",
    pastel: "#E4EBDD",
  },
  {
    asset: "/media/sustenta-3.png",
    icon: Rocket,
    label: "Ideias que viram negócios",
    desc: "Empresas e startups que nascem no território.",
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

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--nb-page-bg)" }}
    >
      <div className={styles.overview}>
        {/* Ilustração colagem em sangria, ancorada na borda direita */}
        <div

          aria-hidden="true"
          className="hidden lg:block"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: "min(45%, 740px)",
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
              style={{ fontSize: "clamp(30px, 3.4vw, 48px)", color: "var(--nb-heading)", margin: "40px 0 0", maxWidth: 640, lineHeight: 1.08 }}
            >
              O que a gente faz{" "}
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-opportunity-accent)" }}>circular.</em>
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--nb-body)", margin: "16px 0 32px", maxWidth: 480 }}>
              Pessoas, conhecimento e oportunidades. Da conversa à colaboração, cada encontro pode abrir um novo caminho.
            </p>

            <div style={{ borderBottom: "1px solid var(--nb-line)", maxWidth: 560 }}>
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  style={{
                    borderTop: "1px solid var(--nb-line)",
                    padding: "26px 0",
                  }}
                >
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
              ))}
            </div>
          </div>
        </div>

        {/* A mesma colagem também aparece na composição móvel. */}
        <div className="mx-auto mt-8 max-w-[480px] px-6 lg:hidden" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/colagem-beneficios.png" alt="" loading="lazy" style={{ width: "100%", height: "auto" }} />
        </div>
      </div>
      {/* ── Mini-seção: o que sustenta o vale ── */}
      <div className={`relative kv-fusion-foundation ${styles.foundation}`}>
        <div className="mx-auto max-w-[1300px] px-6 lg:px-16">
          <p
            className="kv-kicker"
            style={{ margin: "0 0 14px", display: "flex", alignItems: "center", gap: 9, color: "var(--nb-body-strong)" }}
          >
            <DiamondMark size={7} color="var(--nb-terracotta)" />
            O QUE SUSTENTA O VALE
          </p>
          <h2
            className="kv-display"
            style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--nb-heading)", margin: "0 0 44px", lineHeight: 1.08 }}
          >
            Uma base sólida,{" "}
            <span style={{ fontWeight: 400, color: "#777" }}>construída para você se apoiar</span>{" "}

          </h2>

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
