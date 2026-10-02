import Link from "next/link";
import { SectionIndex } from "@/components/ui/editorial";
import Image from "next/image";
import { galleryPhotos } from "@/lib/gallery";
import styles from "./fusion.module.css";

/**
 * "O ecossistema" — orgânica: headline + jornada ilustrada do ecossistema
 * (asset próprio) à esquerda; colagem orgânica de encontros reais à direita.
 * Faixa panorâmica da chapada fecha o capítulo.
 */
export default function AboutSection() {
  const mainPhoto = galleryPhotos.find(photo => photo.id === "20231205-172120-fav")!;
  const secondPhoto = galleryPhotos.find(photo => photo.id === "20231108-150500-fav")!;

  return (
    <section
      id="ecossistema"
      className="relative overflow-hidden"
      style={{ background: "var(--nb-page-bg)" }}
    >
      <div className="relative mx-auto max-w-[1300px] px-6 pt-24 lg:px-16">
        <SectionIndex index="01" label="Ecossistema" accentColor="#C25A2E" />

        <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[11fr_9fr]">
          {/* ── Esquerda: headline + jornada ilustrada ── */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2
              className="kv-display"
              style={{
                fontSize: "clamp(38px, 4.4vw, 64px)",
                color: "var(--nb-heading)",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Um ecossistema
              <br />
              feito por pessoas
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-community-accent)" }}>
                que constroem
              </em>{" "}
              o Cariri
            </h2>

            <p
              className="kv-kicker"
              style={{
                display: "flex", flexWrap: "wrap", gap: "6px 18px", alignItems: "center",
                margin: "26px 0 0", color: "var(--nb-body-strong)",
              }}
            >
              <span>IDEIAS</span>
              <span style={{ color: "#C25A2E" }}>◆</span>
              <span>TALENTOS</span>
              <span style={{ color: "#C25A2E" }}>◆</span>
              <span>INVESTIMENTO</span>
              <span style={{ color: "#C25A2E" }}>◆</span>
              <span>IMPACTO</span>
            </p>

            {/* Jornada ilustrada: as 4 paradas do ecossistema */}
            <div style={{ margin: "10px -20px 0" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/jornada-ecossistema.png"
                alt="Jornada do ecossistema: startups geram ideias, talentos constroem, empresas transformam e universidades impulsionam"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            <div style={{ marginTop: 10 }}>
              <Link
                href="/sobre"
                className="kv-kicker inline-flex items-center gap-3 no-underline"
                style={{ color: "var(--nb-heading)" }}
              >
                <span style={{ borderBottom: "1.5px solid var(--nb-heading)", paddingBottom: 3 }}>
                  EXPLORAR O ECOSSISTEMA
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Colagem de encontros reais junto à jornada ilustrada original. */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/deco-layer-11.png" alt="" aria-hidden="true" className="pointer-events-none absolute -left-8 top-8 w-36 -rotate-12 opacity-90" />
            <div className={styles.collage}>
              <figure className={`${styles.photoFrame} ${styles.collagePhoto}`}>
                <Image src={mainPhoto.src} alt={mainPhoto.alt} width={mainPhoto.width} height={mainPhoto.height} sizes="(max-width: 1023px) 90vw, 520px" />
              </figure>
              <figure className={`${styles.photoFrame} ${styles.collageSecond}`}>
                <Image src={secondPhoto.src} alt={secondPhoto.alt} width={secondPhoto.width} height={secondPhoto.height} sizes="(max-width: 1023px) 50vw, 300px" />
                <figcaption>É sobre construir junto.</figcaption>
              </figure>
            </div>
            <p className="mt-8 text-base leading-[1.8]" style={{ color: "var(--nb-body)" }}>
              Inovação acontece quando a gente se encontra. O Cariri tem talento, conhecimento e vontade de transformar.
              O Kariri Valley aproxima quem empreende, pesquisa, cria e trabalha pelo desenvolvimento da região.
            </p>
            <p className="text-sm leading-[1.8]" style={{ color: "var(--nb-body)" }}>
              Desde as primeiras articulações em 2016, seguimos construindo um movimento coletivo e orgânico.
              Cada encontro abre espaço para uma conversa, uma parceria e uma nova possibilidade.
            </p>
          </div>
        </div>
      </div>

      {/* ── Faixa panorâmica da chapada fechando o capítulo ── */}
      <div className="kv-fusion-panorama" style={{ marginTop: 90, position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/div.png"
          alt="Ilustração da paisagem do Cariri: igreja, chapada, sol e árvores"
          style={{
            width: "100%",
            minWidth: 900,
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
            height: "auto",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}
