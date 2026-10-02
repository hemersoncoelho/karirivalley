import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { DiamondMark, Kicker } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";
import { favoritePhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Nossa história — Kariri Valley",
  description:
    "Das primeiras articulações em 2016 à comunidade de hoje: conheça as pessoas, os encontros e os movimentos que fortalecem a inovação no Cariri.",
};

const HISTORIA = [
  {
    year: "2016",
    title: "Os caminhos começam a se cruzar",
    paragraphs: [
      "Já existiam movimentos e diversas iniciativas de inovação no território, mas ainda não de forma organizada.",
      "Começam as primeiras articulações, instigadas pela Secretaria de Desenvolvimento Econômico e Inovação e pelo SEBRAE, reunindo diferentes atores da quádrupla hélice: setor público, setor privado, academia e sociedade.",
    ],
  },
  {
    year: "2017",
    title: "O movimento ganha um nome",
    paragraphs: [
      "O movimento vai ganhando força e inicia o que foi chamado de Ecossistema de Inovação do Cariri: o Kariri Valley.",
    ],
  },
  {
    year: "2018",
    title: "A inovação ocupa o território",
    paragraphs: [
      "Diversos eventos acontecem no território para sensibilizar, desmistificar e engajar mais pessoas com a inovação, entre eles a E-Week e a Campus Party Day.",
      "Juazeiro do Norte aprova a Lei Municipal de Inovação e Cidades Inteligentes, tornando-se o primeiro município no Brasil a sancionar essa lei.",
    ],
  },
  {
    year: "2019",
    title: "Problemas locais, soluções coletivas",
    paragraphs: [
      "Acontece o Startup Juá. Ao longo do ano, o SEBRAE, em parceria com a Prefeitura de Juazeiro do Norte, reúne diversas pessoas para resolver problemas locais por meio de tecnologia e startups.",
    ],
  },
  {
    year: "2020",
    title: "Um período de distância",
    paragraphs: [
      "A pandemia e o período eleitoral enfraquecem o movimento. As iniciativas continuam, mas de maneira mais desconectada.",
    ],
  },
  {
    year: "2022",
    title: "O reencontro e o reconhecimento",
    paragraphs: [
      "Recomeçam os encontros do ecossistema, agora regulares e trazendo novos atores. Aqui começa a se falar em comunidade de inovação.",
      "O Kariri Valley recebe o prêmio Ceará Awards como Comunidade Destaque.",
    ],
  },
  {
    year: "2023",
    period: "até o momento",
    title: "Uma comunidade em movimento",
    paragraphs: [
      "O Ecossistema de Inovação ganha novos ambientes, nossas universidades estão comprometidas com a inovação e startups nascem. Surgem novas comunidades, como Hack In Cariri e Arcade Games.",
      "Nosso movimento é orgânico e ganha força, transformando o Cariri em um território de oportunidades.",
    ],
  },
] as const;

const PILARES = [
  {
    title: "Comunidade",
    description:
      "Pessoas que se reconhecem, compartilham o que sabem e abrem espaço para quem está chegando.",
  },
  {
    title: "Colaboração",
    description:
      "Conexões entre pessoas e instituições que viram encontros, projetos e novas possibilidades.",
  },
  {
    title: "Impacto no território",
    description:
      "Inovação conectada aos desafios locais e à vontade de construir um Cariri com mais oportunidades.",
  },
] as const;

const heroPhoto = favoritePhotos.find(
  (photo) => photo.id === "20231108-150500-fav",
)!;
const memoryPhotos = [
  "img-20221105-wa0002-fav",
  "20231205-172120-fav",
].map((id) => favoritePhotos.find((photo) => photo.id === id)!);

const container = "mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-16";

export default function SobrePage() {
  return (
    <main id="conteudo" tabIndex={-1} style={{ background: "var(--nb-page-bg)" }}>
      <section className={`${container} pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pt-24`}>
        <Kicker style={{ margin: 0 }}>Sobre o Kariri Valley</Kicker>
        <div className="mt-7 grid items-center gap-9 lg:grid-cols-[1.08fr_1fr] lg:gap-14">
          <div>
            <h1
              className="kv-display"
              style={{
                fontSize: "clamp(44px, 6.2vw, 82px)",
                color: "var(--nb-heading)",
                margin: 0,
                maxWidth: 660,
                textWrap: "balance",
              }}
            >
              Uma história feita por <em>muita gente.</em>
            </h1>
            <p
              className="mt-7 max-w-[520px] text-base leading-[1.8] sm:text-lg"
              style={{ color: "var(--nb-body-strong)" }}
            >
              Somos pessoas, comunidades, empresas, universidades e instituições
              que se encontram para fazer a inovação acontecer no Cariri. Cada
              conversa, encontro e colaboração faz parte dessa história.
            </p>
            <Link
              href="#nossa-historia"
              className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold underline decoration-[var(--nb-line-soft)] underline-offset-8 transition-colors hover:decoration-current"
              style={{ color: "var(--nb-heading)" }}
            >
              Conheça nossa trajetória
              <ArrowDown size={16} aria-hidden="true" />
            </Link>
          </div>
          <figure className="min-w-0">
            <div
              className="overflow-hidden rounded-[20px]"
              style={{ background: "var(--nb-sand-2)" }}
            >
              <Image
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                width={heroPhoto.width}
                height={heroPhoto.height}
                sizes="(max-width: 1023px) calc(100vw - 40px), 540px"
                preload
                className="h-auto w-full"
              />
            </div>
            <figcaption
              className="kv-meta mt-4 flex flex-wrap items-center justify-between gap-2"
              style={{ color: "var(--nb-body)" }}
            >
              <span>Gente que faz o Cariri acontecer</span>
              <span>Desde 2016</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        id="nossa-historia"
        aria-labelledby="history-heading"
        className={`${container} scroll-mt-28 pb-16 sm:pb-24`}
      >
        <div
          className="grid gap-10 border-t pt-8 lg:grid-cols-[.8fr_1.8fr] lg:gap-16 lg:pt-12"
          style={{ borderColor: "var(--nb-line-soft)" }}
        >
          <header>
            <Kicker style={{ margin: "0 0 18px" }}>Nossa trajetória</Kicker>
            <h2
              id="history-heading"
              className="kv-display max-w-[360px]"
              style={{
                fontSize: "clamp(36px, 4vw, 54px)",
                color: "var(--nb-heading)",
                margin: 0,
                textWrap: "balance",
              }}
            >
              Encontros que viram <em>movimento.</em>
            </h2>
            <p
              className="mt-5 max-w-[340px] text-base leading-[1.8]"
              style={{ color: "var(--nb-body)" }}
            >
              Nossa história é feita de articulações, pausas e reencontros. É uma
              construção coletiva que continua a cada pessoa que chega.
            </p>
          </header>
          <ol className="m-0 list-none p-0">
            {HISTORIA.map((item, index) => (
              <li
                key={item.year}
                className="grid grid-cols-1 gap-3 pb-10 last:pb-0 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-7"
              >
                <div className="flex items-baseline gap-3 pt-0.5 sm:block">
                  <time
                    dateTime={item.year}
                    className="kv-index-num block text-[23px] sm:text-[29px]"
                    style={{ color: "var(--nb-heading)", lineHeight: 1.2 }}
                  >
                    {item.year}
                  </time>
                  {"period" in item ? (
                    <span
                      className="mt-2 block text-xs leading-relaxed"
                      style={{ color: "var(--nb-body)" }}
                    >
                      {item.period}
                    </span>
                  ) : null}
                </div>
                <div
                  className="relative border-l pl-5 sm:pl-7"
                  style={{ borderColor: "var(--nb-line-soft)" }}
                >
                  <span className="absolute -left-[4px] top-[7px]">
                    <DiamondMark
                      size={7}
                      color={
                        index === HISTORIA.length - 1
                          ? "var(--nb-mustard)"
                          : "var(--nb-label-accent)"
                      }
                    />
                  </span>
                  <h3
                    className="text-lg leading-[1.35] font-semibold sm:text-xl"
                    style={{ color: "var(--nb-heading)", margin: "0 0 12px" }}
                  >
                    {item.title}
                  </h3>
                  <div
                    className="space-y-3 text-[15px] leading-[1.8] sm:text-base"
                    style={{ color: "var(--nb-body-strong)" }}
                  >
                    {item.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="community-heading"
        className="py-14 sm:py-20"
        style={{ background: "var(--nb-forest)", color: "var(--nb-cream)" }}
      >
        <div className={container}>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <header>
              <Kicker color="var(--nb-mustard)" style={{ margin: "0 0 20px" }}>
                O que nos conecta
              </Kicker>
              <h2
                id="community-heading"
                className="kv-display max-w-[620px]"
                style={{
                  fontSize: "clamp(36px, 4.6vw, 62px)",
                  margin: 0,
                  textWrap: "balance",
                }}
              >
                Diferentes caminhos. Uma vontade <em>em comum.</em>
              </h2>
            </header>
            <div className="self-end">
              <p className="max-w-[490px] text-base leading-[1.8] opacity-90 sm:text-lg">
                A inovação acontece quando experiências diferentes se encontram.
                Desde as primeiras articulações, quatro partes do território
                caminham juntas.
              </p>
              <ul className="mt-6 flex list-none flex-wrap gap-x-6 gap-y-3 p-0 text-sm font-medium">
                {["Setor público", "Setor privado", "Academia", "Sociedade"].map(
                  (sector) => (
                    <li key={sector} className="flex items-center gap-2">
                      <DiamondMark size={5} />
                      {sector}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
          <div className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-3 sm:gap-10">
            {PILARES.map((pillar) => (
              <div
                key={pillar.title}
                className="border-t pt-5"
                style={{ borderColor: "rgba(251,248,239,.3)" }}
              >
                <h3 className="mb-3 text-xl font-semibold">{pillar.title}</h3>
                <p className="text-[15px] leading-[1.8] opacity-85">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="memories-heading"
        className={`${container} py-16 sm:py-24`}
      >
        <div className="grid items-center gap-9 lg:grid-cols-[.8fr_1.8fr] lg:gap-16">
          <header>
            <Kicker style={{ margin: "0 0 18px" }}>Nossa memória coletiva</Kicker>
            <h2
              id="memories-heading"
              className="kv-display max-w-[370px]"
              style={{
                fontSize: "clamp(36px, 4vw, 54px)",
                color: "var(--nb-heading)",
                margin: 0,
                textWrap: "balance",
              }}
            >
              Cada foto, um <em>encontro.</em>
            </h2>
            <p
              className="mt-5 max-w-[360px] text-base leading-[1.8]"
              style={{ color: "var(--nb-body)" }}
            >
              Os rostos, as trocas e as celebrações de quem faz parte dessa
              construção. Nosso álbum guarda esses momentos.
            </p>
            <EditorialButton href="/galeria" variant="ghost" className="mt-6">
              Ver a galeria completa
              <ArrowUpRight size={16} aria-hidden="true" />
            </EditorialButton>
          </header>
          <div className="grid items-start gap-6 sm:grid-cols-2">
            {memoryPhotos.map((photo) => (
              <figure key={photo.id} className="min-w-0">
                <div
                  className="overflow-hidden rounded-[14px]"
                  style={{ background: "var(--nb-sand-2)" }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 350px"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "var(--nb-body)" }}
                >
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={`${container} pb-16 sm:pb-24`}>
        <div
          className="flex flex-wrap items-center justify-between gap-7 border-t pt-9 sm:pt-12"
          style={{ borderColor: "var(--nb-line-soft)" }}
        >
          <div className="max-w-[670px]">
            <h2
              className="kv-display"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                color: "var(--nb-heading)",
                margin: 0,
                textWrap: "balance",
              }}
            >
              O próximo encontro pode ter <em>você.</em>
            </h2>
            <p
              className="mt-4 text-base leading-[1.8]"
              style={{ color: "var(--nb-body)" }}
            >
              Chegue com suas ideias, sua experiência e sua vontade de construir
              junto.
            </p>
          </div>
          <EditorialButton href="/como-participar" size="lg">
            Como participar
            <ArrowUpRight size={18} aria-hidden="true" />
          </EditorialButton>
        </div>
      </section>
    </main>
  );
}
