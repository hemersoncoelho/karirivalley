import { SectionIndex } from "@/components/ui/editorial";

const STATS = [
  { n: "2016", label: "primeiras articulações", note: "o começo da nossa construção coletiva" },
  { n: "4", label: "hélices conectadas", note: "público, privado, academia e sociedade" },
  { n: "2022", label: "Ceará Awards", note: "reconhecimento como Comunidade Destaque" },
  { n: "45", label: "registros da comunidade", note: "encontros guardados na nossa galeria" },
] as const;

export default function StatsSection() {

  return (
    <section
      aria-label="Marcos da comunidade"
      className="relative overflow-hidden"
      style={{ background: "var(--nb-forest)", padding: "48px 0 80px" }}
    >
      {/* Halftone como textura da banda — a trama de pontos conecta sertão × tecnologia */}
      <div
        aria-hidden="true"
        className="kv-photo"
        style={{ opacity: 0.18, pointerEvents: "none", position: "absolute", inset: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/gallery/20260801-195702-fav.webp"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1300px] px-6 lg:px-16">
        <SectionIndex
          index=""
          label=""
          accentColor="var(--nb-mustard)"
          style={{ borderTopColor: "rgba(244,238,225,.0)" }}
        />

        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {STATS.map((s) => (
            <div key={s.label} style={{ paddingTop: 20 }}>
              <p
                className="kv-index-num"
                style={{ margin: 0, fontSize: "clamp(56px, 6vw, 84px)", fontWeight: 700, lineHeight: 1, color: "var(--nb-sand)" }}
              >
                {s.n}
              </p>
              <p className="kv-kicker" style={{ margin: "12px 0 6px", color: "var(--nb-mustard)" }}>
                {s.label}
              </p>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(244,238,225,.65)" }}>
                {s.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
