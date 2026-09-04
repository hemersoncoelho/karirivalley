import { DiamondMark } from "@/components/ui/editorial";

/**
 * Interstício editorial — banda de marca entre capítulos da home.
 * Carrega a ideia por elemento (faixa de diamantes + lema), não por parágrafo.
 */
export default function InterstitialBand({ lema = "Conectar quem faz" }: { lema?: string }) {
  return (
    <section aria-hidden="true" style={{ background: "var(--nb-forest-dark)", padding: "34px 0" }}>
      <div
        className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6"
        style={{ display: "flex", alignItems: "center" }}
      >
        <DiamondMark size={9} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-element.png"
          alt=""
          style={{ height: 30, width: "auto", opacity: 0.95 }}
        />
        <p className="kv-kicker" style={{ color: "var(--nb-mustard)", margin: 0 }}>
          {lema}
        </p>
        <DiamondMark size={9} />
      </div>
    </section>
  );
}
