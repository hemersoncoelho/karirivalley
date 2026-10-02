import Link from "next/link";
import { SectionIndex } from "@/components/ui/editorial";
import { galleryPhotos } from "@/lib/gallery";
import styles from "./fusion.module.css";

/**
 * "Para quem é o vale" — três audiências com identidade própria:
 * cada card tem pastel, cor de acento e micro-lista distintos
 * (irmãos pela anatomia, únicos pela cor e conteúdo).
 */
const CARDS = [
  {
    num: "01",
    chip: "QUEM EMPREENDE",
    title: "Fundadores e startups",
    desc: "Gente que tira ideias do papel, constrói negócios e cria novas oportunidades no Cariri.",
    img: "/media/gallery/img-20250405-wa0128-fav.webp",
    alt: "Fundadores reunidos em encontro da comunidade",
    bodyBg: "#F7E7DF",
    accent: "#C25A2E",
    photoPosition: "50% 78%",
    finds: ["Sócios e primeiros clientes", "Editais, aceleração e mentoria"],
  },
  {
    num: "02",
    chip: "QUEM CONSTRÓI",
    title: "Talentos e conhecimento",
    desc: "Estudantes, profissionais, pesquisadores e criativos que compartilham conhecimento e experimentam caminhos.",
    img: "/media/gallery/img-20251010-wa0134-fav.webp",
    alt: "Talentos da comunidade em talk técnica",
    bodyBg: "#E4EBDD",
    accent: "#5F8753",
    photoPosition: "50% 50%",
    finds: ["Projetos remotos e locais", "Talks e comunidade técnica"],
  },
  {
    num: "03",
    chip: "QUEM FOMENTA",
    title: "Quem fortalece o território",
    desc: "Instituições, universidades e setor público que somam forças pelo desenvolvimento do território.",
    img: "/media/gallery/20231107-213939-fav.webp",
    alt: "Parceiros institucionais em apresentação",
    bodyBg: "#F3E9CF",
    accent: "#C99A2E",
    photoPosition: "50% 65%",
    finds: ["Projetos e ideias do território", "Pessoas para construir junto"],
  },
] as const;

export default function AudienceSection() {

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--nb-page-bg)", padding: "0 0 112px" }}>
      <div className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="02" label="Para quem é" title="quem se encontra no vale" />

        <h2
          className="kv-display mt-10"
          style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--nb-heading)", margin: "40px 0 36px", maxWidth: 720 }}
        >
          Muitas vozes. Um Cariri de{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-opportunity-accent)" }}>possibilidades.</em>
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((c) => (
            <article
              key={c.num}
              className={styles.framedCard}
              style={{
                overflow: "hidden",
                border: "1px solid rgba(22,20,15,.08)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className={styles.photoFrame}>
                <div style={{ position: "relative", aspectRatio: "2 / 1", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={galleryPhotos.find(photo => photo.src === c.img)?.alt ?? c.alt}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.photoPosition, display: "block" }}
                />
                </div>
              </div>

              <div style={{ padding: "20px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                <span
                  className="kv-kicker"
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 10, padding: "4px 11px", borderRadius: 999,
                    background: "var(--nb-card-bg)", color: "var(--nb-opportunity-accent)",
                    border: `1px solid ${c.accent}33`,
                    marginBottom: 12,
                  }}
                >
                  {c.num} · {c.chip}
                </span>

                <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 21, color: "var(--nb-heading)" }}>
                  {c.title}
                </h3>
                <p style={{ margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.6, color: "var(--nb-body)" }}>
                  {c.desc}
                </p>

                {/* micro-lista: o que encontra no vale */}
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 7 }}>
                  {c.finds.map(f => (
                    <p key={f} style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 8, fontSize: 13, color: "var(--nb-body-strong)" }}>
                      <span aria-hidden="true" style={{ color: c.accent, fontSize: 8 }}>◆</span>
                      {f}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-[700px] text-base leading-[1.8]" style={{ color: "var(--nb-body)" }}>A força da comunidade está em juntar perspectivas diferentes. Você pode chegar com um projeto, uma experiência ou uma pergunta. Sua vontade de participar também move o ecossistema.</p>
        <Link href="/como-participar" className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold underline underline-offset-4" style={{ color: "var(--nb-community-accent)" }}>Encontre seu lugar <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
