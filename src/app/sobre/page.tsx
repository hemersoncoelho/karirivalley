import Link from "next/link";
import type { Metadata } from "next";
import { SectionIndex, PhotoFrame, DiamondMark } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";

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
      "Com a realização do TEDx Giradouro Park, um coletivo de pessoas de Juazeiro do Norte, Crato e Barbalha passa a se organizar de forma contínua: nasce a Kariri Valley, com encontros presenciais mensais.",
  },
  {
    year: "2017–19",
    title: "A comunidade ganha ritmo",
    desc:
      "Fuck-up Nights, Elevator Pitch, Startup Jua, Campus Party Day, E-week e o Kariri Valley Day, com rodadas de pitch para startups locais, consolidam o ecossistema.",
  },
  {
    year: "2018",
    title: "Conquista institucional",
    desc:
      "A articulação da comunidade contribui para a Lei Complementar Nº 117/2018, que reduziu impostos para empresas de base tecnológica na região.",
  },
  {
    year: "Hoje",
    title: "Um novo lar, agora digital",
    desc:
      "Depois de anos construindo esse ecossistema presencialmente, a Kariri Valley ganha uma casa digital: uma plataforma para reconhecer, conectar e dar visibilidade a quem faz parte dessa história.",
  },
] as const;

const PILARES = [
  { n: "01", title: "Espírito de Comunidade", desc: "Ações desenhadas de forma coletiva e descentralizada, por quem faz parte do ecossistema." },
  { n: "02", title: "Colaboração Extra-Institucional", desc: "Profissionais de empresas, universidades e instituições diferentes trabalhando lado a lado, sem fronteiras." },
  { n: "03", title: "Geração de Impacto Positivo", desc: "Disseminar a cultura empreendedora como motor de transformação social para o Cariri." },
] as const;

const GALERIA = [
  { src: "/media/comunidade-2.jpg", caption: "Encontro da comunidade — Cariri" },
  { src: "/media/comunidade-1.jpg", caption: "Talk no estúdio Lumiere" },
  { src: "/media/comunidade-3.jpg", caption: "Turma Kariri Valley" },
  { src: "/media/comunidade-5.webp", caption: "Registros dos encontros" },
] as const;

export default function SobrePage() {
  return (
    <main style={{ background: "var(--nb-page-bg)" }}>
      {/* Header editorial */}
      <section className="mx-auto max-w-[1300px] px-6 lg:px-16" style={{ paddingTop: 96 }}>
        <SectionIndex index="— " label="Sobre o Kariri Valley" />
        <h1
          className="kv-display"
          style={{ fontSize: "clamp(42px, 6vw, 88px)", color: "var(--nb-heading)", margin: "28px 0 0", maxWidth: 900 }}
        >
          A comunidade que <em style={{ fontStyle: "italic", fontWeight: 400 }}>constrói</em> o Cariri
        </h1>
        <div
          className="grid grid-cols-1 gap-10 lg:grid-cols-[7fr_4fr]"
          style={{ borderTop: "1px solid var(--nb-line)", marginTop: 36, paddingTop: 28 }}
        >
          <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", lineHeight: 1.75, color: "var(--nb-body)", maxWidth: 620, margin: 0 }}>
            A Kariri Valley reúne fundadores, desenvolvedores, investidores, pesquisadores,
            professores, empresas e instituições de Juazeiro do Norte, Crato, Barbalha e região —
            para que o ecossistema de inovação local possa se encontrar, colaborar e crescer junto.
          </p>
          <p className="kv-meta" style={{ color: "var(--nb-body)", margin: 0, alignSelf: "end" }}>
            ◆ Cariri — Ceará — Brasil
            <br />
            ◆ Desde 2016
            <br />
            ◆ Edição contínua
          </p>
        </div>
      </section>

      {/* Timeline editorial: ano mono gigante + hairline */}
      <section className="mx-auto max-w-[1300px] px-6 lg:px-16" style={{ paddingTop: 110, paddingBottom: 40 }}>
        <SectionIndex index="01" label="Nossa história" />
        <div style={{ marginTop: 40 }}>
          {HISTORIA.map((item) => (
            <div
              key={item.year}
              className="grid grid-cols-1 gap-4 lg:grid-cols-[160px_1fr] lg:gap-10"
              style={{ borderTop: "1px solid var(--nb-line)", padding: "30px 0" }}
            >
              <p
                className="kv-index-num"
                style={{ margin: 0, fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: "var(--nb-turquoise)", lineHeight: 1 }}
              >
                {item.year}
              </p>
              <div>
                <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 22, color: "var(--nb-heading)" }}>
                  {item.title}
                </h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--nb-body)", maxWidth: 640 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pilares: índice em banda escura */}
      <section style={{ background: "var(--nb-forest)", padding: "88px 0" }}>
        <div className="mx-auto max-w-[1300px] px-6 lg:px-16">
          <SectionIndex index="02" label="Nossos pilares" accentColor="var(--nb-mustard)" style={{ borderTopColor: "rgba(244,238,225,.35)" }} />
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {PILARES.map((p) => (
              <div key={p.n} style={{ borderTop: "1px solid rgba(244,238,225,.35)", paddingTop: 18 }}>
                <p className="kv-index-num" style={{ margin: 0, fontSize: 13, color: "var(--nb-mustard)" }}>{p.n}</p>
                <h3 style={{ margin: "14px 0 8px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 22, color: "var(--nb-sand)" }}>
                  {p.title}
                </h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "rgba(244,238,225,.72)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria com fotos reais */}
      <section className="mx-auto max-w-[1300px] px-6 lg:px-16" style={{ paddingTop: 100, paddingBottom: 60 }}>
        <SectionIndex index="03" label="Registros da trajetória" />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {GALERIA.map((g, i) => (
            <PhotoFrame
              key={g.src}
              src={g.src}
              alt={g.caption}
              caption={g.caption}
              style={{ animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-[1300px] px-6 lg:px-16" style={{ paddingBottom: 130 }}>
        <div
          style={{ borderTop: "1px solid var(--nb-line)", paddingTop: 44, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 28 }}
        >
          <div style={{ flex: "1 1 320px" }}>
            <h2 className="kv-display" style={{ fontSize: "clamp(28px, 3.4vw, 46px)", color: "var(--nb-heading)", margin: 0 }}>
              Faça parte dessa <em style={{ fontStyle: "italic", fontWeight: 400 }}>história</em>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--nb-body)", maxWidth: 480, marginTop: 14, marginBottom: 0 }}>
              O próximo capítulo do ecossistema é escrito por quem se envolve.
            </p>
          </div>
          <EditorialButton href="/como-participar" size="lg">
            Como participar
          </EditorialButton>
        </div>
      </section>
    </main>
  );
}
