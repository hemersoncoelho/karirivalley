import Link from "next/link";
import Image from "next/image";
import { SectionIndex, MetaDot } from "@/components/ui/editorial";
import styles from "./fusion.module.css";

/** Os quatro atores da comunidade, com ilustrações próprias do Cariri. */
const COMPANIES = [
  { name: "Setor público", sector: "Instituições que apoiam a inovação e o desenvolvimento do Cariri.", stage: "Território", image: "/media/quadrupla-helice/setor-publico.png" },
  { name: "Setor privado", sector: "Empresas e startups que tiram ideias do papel e criam oportunidades.", stage: "Empreendedorismo", image: "/media/quadrupla-helice/setor-privado.png" },
  { name: "Academia", sector: "Universidades, estudantes e pesquisadores que compartilham conhecimento.", stage: "Conhecimento", image: "/media/quadrupla-helice/academia.png" },
  { name: "Sociedade", sector: "Pessoas e comunidades que se encontram e constroem o movimento.", stage: "Comunidade", image: "/media/quadrupla-helice/sociedade.png" },
] as const;

export default function CompaniesShowcaseSection() {

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--nb-page-bg)", padding: "0 0 112px" }}
    >
      <div className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex index="07" label="Construção coletiva" title="as quatro hélices" />

        <h2
          className="kv-display mt-10"
          style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--nb-heading)", margin: "40px 0 36px" }}
        >
          Diferentes caminhos. {" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "#777" }}>Uma vontade em comum.</em>
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COMPANIES.map((c) => (
            <div
              key={c.name}
              className={styles.framedCard}
              style={{
                border: "1px solid rgba(22,20,15,.08)",
                overflow: "hidden",
              }}
            >
              <div className={styles.photoFrame}>
                <div
                  style={{
                    aspectRatio: "3 / 2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={c.image}
                    width={1536} height={1024}
                    alt="" aria-hidden="true" loading="lazy"
                    sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 280px"
                    style={{ width: "100%", height: "auto", objectFit: "contain" }}
                  />
                </div>
              </div>
              <div style={{ padding: "20px 22px 24px" }}>
                <p style={{ margin: "0 0 3px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 19, color: "var(--nb-heading)" }}>
                  {c.name}
                </p>
                <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--nb-body)" }}>
                  {c.sector}
                </p>
                <span
                  className="kv-kicker"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    fontSize: 10, padding: "4px 11px", borderRadius: 999,
                    background: "rgba(194,90,46,.09)", color: "var(--nb-opportunity-accent)",
                  }}
                >
                  <MetaDot role="opportunity" style={{ width: 5, height: 5 }} />
                  {c.stage}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/como-participar"
            className="kv-kicker"
            style={{ color: "var(--nb-heading)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ borderBottom: "1px solid var(--nb-heading)", paddingBottom: 2 }}>Encontre seu lugar na comunidade</span>
            <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
