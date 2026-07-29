import Link from "next/link";
import type { Metadata } from "next";
import { Users2, HeartHandshake, Sparkles, ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre — Kariri Valley",
  description:
    "Conheça a história da Kariri Valley: como nasceu em 2017 a partir do TEDx Giradouro Park e se tornou o ecossistema de inovação do Cariri, CE.",
};

const HISTORIA = [
  {
    year: "2016",
    title: "A semente é plantada",
    desc:
      "O TEDx Giradouro Park é validado no Cariri. A ideia de reunir, em um só palco, quem já articulava empreendedorismo e inovação na região começa a tomar forma.",
  },
  {
    year: "2017",
    title: "Nasce a Kariri Valley",
    desc:
      "Com a realização do TEDx Giradouro Park, um coletivo de pessoas de Juazeiro do Norte, Crato e Barbalha passa a se organizar de forma contínua: nasce a Kariri Valley, com encontros presenciais mensais para alinhar conhecimento, planejar ações e apresentar ideias e negócios da região.",
  },
  {
    year: "2017 – 2019",
    title: "A comunidade ganha ritmo",
    desc:
      "Uma sequência de eventos consolida o ecossistema: Fuck-up Nights, Elevator Pitch, Startup Jua, Campus Party Day, E-week e o Kariri Valley Day, com rodadas de pitch para startups locais.",
  },
  {
    year: "2018",
    title: "Conquista institucional",
    desc:
      "A articulação da comunidade contribui para a Lei Complementar Nº 117/2018, que reduziu impostos para empresas de base tecnológica na região — um marco para quem empreende em tecnologia no Cariri.",
  },
  {
    year: "Hoje",
    title: "Um novo lar, agora digital",
    desc:
      "Depois de anos construindo esse ecossistema presencialmente, a Kariri Valley ganha uma casa digital: uma plataforma para reconhecer, conectar e dar visibilidade a quem faz parte dessa história — de qualquer lugar, o tempo todo.",
  },
] as const;

const PILARES = [
  {
    icon: Users2,
    title: "Espírito de Comunidade",
    desc: "Ações desenhadas de forma coletiva e descentralizada, por quem faz parte do ecossistema.",
    color: "#239D8C",
  },
  {
    icon: HeartHandshake,
    title: "Colaboração Extra-Institucional",
    desc: "Profissionais de empresas, universidades e instituições diferentes trabalhando lado a lado, sem fronteiras.",
    color: "#E9B23C",
  },
  {
    icon: Sparkles,
    title: "Geração de Impacto Positivo",
    desc: "Disseminar a cultura empreendedora como motor de transformação social para o Cariri.",
    color: "#C25A2E",
  },
] as const;

const GALERIA = [
  "TEDx Giradouro Park (2017)",
  "Encontro mensal da comunidade",
  "Kariri Valley Day — Pitch Day",
  "Startup Weekend Nordeste",
] as const;

export default function SobrePage() {
  return (
    <main className="relative overflow-hidden" style={{ background: "var(--nb-page-bg)" }}>
      <div
        className="kv-aurora absolute pointer-events-none"
        style={{
          width: "50vw", height: "50vw", maxWidth: 700, maxHeight: 700,
          top: "-16%", right: "-10%",
          background: "radial-gradient(circle, rgba(35,157,140,.18) 0%, rgba(35,157,140,.04) 55%, transparent 72%)",
          animationDuration: "28s", animationDelay: "-6s",
        }}
      />
      <div
        className="kv-aurora absolute pointer-events-none"
        style={{
          width: "36vw", height: "36vw", maxWidth: 500, maxHeight: 500,
          bottom: "0%", left: "-8%",
          background: "radial-gradient(circle, rgba(232,178,60,.18) 0%, rgba(232,178,60,.04) 55%, transparent 72%)",
          animationDuration: "24s", animationDelay: "-12s", animationDirection: "reverse",
        }}
      />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.5 }} />

      {/* Header */}
      <section className="relative max-w-[900px] mx-auto px-6 lg:px-16 text-center" style={{ zIndex: 10, padding: "168px 24px 64px" }}>
        <span
          className="inline-flex items-center gap-2 px-[18px] py-[7px] text-[11px] font-bold tracking-[2px] uppercase mb-7"
          style={{ background: "var(--nb-turquoise)", border: "2px solid var(--nb-ink)", borderRadius: 999, color: "var(--nb-sand)", fontFamily: "var(--font-geo)" }}
        >
          Sobre
        </span>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(32px, 4.4vw, 56px)",
            fontWeight: 700,
            lineHeight: 1.14,
            letterSpacing: "-1px",
            color: "var(--nb-heading)",
            marginBottom: 20,
          }}
        >
          A comunidade que{" "}
          <span style={{ color: "var(--nb-turquoise)", fontStyle: "italic" }}>constrói</span>{" "}
          o Cariri
        </h1>

        <p
          className="mx-auto"
          style={{
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.7,
            color: "var(--nb-body)",
            maxWidth: 620,
          }}
        >
          A Kariri Valley reúne fundadores, desenvolvedores, investidores, pesquisadores,
          professores, empresas, instituições e entusiastas de Juazeiro do Norte, Crato,
          Barbalha e toda a região do Cariri — para que o ecossistema de inovação local
          possa se encontrar, colaborar e crescer junto.
        </p>
      </section>

      {/* História */}
      <section className="relative max-w-[820px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, paddingBottom: 110 }}>
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div style={{ width: 32, height: 2, background: "var(--nb-turquoise)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--nb-turquoise)", fontFamily: "var(--font-geo)" }}>
            Nossa história
          </span>
          <div style={{ width: 32, height: 2, background: "var(--nb-turquoise)" }} />
        </div>

        <div>
          {HISTORIA.map((item, i) => (
            <div
              key={item.year}
              className="flex gap-6"
              style={{
                paddingBottom: i < HISTORIA.length - 1 ? 36 : 0,
                position: "relative",
              }}
            >
              <div className="flex flex-col items-center shrink-0" style={{ width: 72 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 72, height: 40, borderRadius: 10,
                    background: "var(--nb-card-bg)", border: "var(--nb-card-border)",
                    fontSize: 13, fontWeight: 700, color: "var(--nb-turquoise)", letterSpacing: "-0.2px",
                  }}
                >
                  {item.year}
                </div>
                {i < HISTORIA.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 24, background: "var(--nb-card-divider)", marginTop: 8 }} />
                )}
              </div>
              <div style={{ paddingTop: 2 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--nb-heading)", margin: "0 0 8px" }}>{item.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--nb-body)", margin: 0, maxWidth: 620 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pilares */}
      <section className="relative max-w-[1100px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, paddingBottom: 110 }}>
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div style={{ width: 32, height: 2, background: "var(--nb-mustard)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--nb-label-accent)", fontFamily: "var(--font-geo)" }}>
            Nossos pilares
          </span>
          <div style={{ width: 32, height: 2, background: "var(--nb-mustard)" }} />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {PILARES.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-8"
                style={{ background: "var(--nb-card-bg)", backdropFilter: "var(--nb-card-blur)", WebkitBackdropFilter: "var(--nb-card-blur)", border: "var(--nb-card-border)", borderRadius: 14, boxShadow: "var(--nb-card-shadow)" }}
              >
                <div
                  className="flex items-center justify-center mb-5"
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: p.color, border: "2px solid var(--nb-ink)",
                  }}
                >
                  <Icon size={20} strokeWidth={2} color={p.color === "#E9B23C" ? "var(--nb-ink)" : "var(--nb-sand)"} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--nb-heading)", marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--nb-body)", margin: 0 }}>{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Galeria — fotos reais da comunidade entram aqui (ver public/sobre/) */}
      <section className="relative max-w-[1100px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, paddingBottom: 120 }}>
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div style={{ width: 32, height: 2, background: "var(--nb-turquoise)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--nb-turquoise)", fontFamily: "var(--font-geo)" }}>
            Registros da nossa trajetória
          </span>
          <div style={{ width: 32, height: 2, background: "var(--nb-turquoise)" }} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {GALERIA.map((caption) => (
            <div key={caption}>
              <div
                className="flex items-center justify-center mb-3"
                style={{
                  aspectRatio: "4 / 5",
                  background: "var(--nb-card-bg)",
                  border: "3px dashed var(--nb-navbar-border)",
                  borderRadius: 12,
                }}
              >
                <ImageIcon size={26} strokeWidth={1.6} color="var(--nb-body)" />
              </div>
              <p style={{ fontSize: 12.5, color: "var(--nb-body)", margin: 0, textAlign: "center" }}>{caption}</p>
            </div>
          ))}
        </div>
        <p className="text-center" style={{ fontSize: 12, color: "var(--nb-body)", fontStyle: "italic" }}>
          Galeria em atualização — fotos reais dos nossos encontros serão publicadas aqui em breve.
        </p>
      </section>

      {/* CTA final */}
      <section className="relative max-w-[820px] mx-auto px-6 lg:px-16 text-center" style={{ zIndex: 10, paddingBottom: 140 }}>
        <h2
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(24px, 2.8vw, 36px)",
            fontWeight: 700,
            color: "var(--nb-heading)",
            marginBottom: 16,
          }}
        >
          Faça parte dessa história
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--nb-body)", maxWidth: 480, margin: "0 auto 32px" }}>
          A Kariri Valley continua sendo escrita por quem se envolve. Solicite sua entrada
          e ajude a construir o próximo capítulo do ecossistema.
        </p>
        <Link
          href="/como-participar"
          className="kv-press inline-flex items-center gap-2 px-9 py-4 text-base font-bold"
          style={{ background: "var(--nb-btn-primary-bg)", color: "var(--nb-btn-primary-fg)", border: "var(--nb-btn-primary-border)", borderRadius: 10, boxShadow: "var(--shadow-nb)", textDecoration: "none", fontFamily: "var(--font-geo)" }}
        >
          Como participar
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
