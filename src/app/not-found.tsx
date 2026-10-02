import type { Metadata } from "next";
import { ArrowUpRight, House } from "lucide-react";
import { Kicker } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";

export const metadata: Metadata = {
  title: "Página não encontrada — Kariri Valley",
  description:
    "Este endereço não foi encontrado. Volte ao início ou conheça os registros da comunidade Kariri Valley.",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <main
      id="conteudo"
      tabIndex={-1}
      className="flex-1"
      style={{ background: "var(--nb-page-bg)" }}
    >
      <div className="mx-auto grid max-w-[1300px] gap-8 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 lg:px-16">
        <span
          aria-hidden="true"
          className="kv-index-num"
          style={{
            fontSize: "clamp(64px, 9vw, 120px)",
            lineHeight: 1,
            color: "var(--nb-community-accent)",
          }}
        >
          404
        </span>
        <div className="max-w-[720px]">
          <Kicker style={{ margin: "0 0 20px" }}>
            Página não encontrada
          </Kicker>
          <h1
            className="kv-display"
            style={{
              fontSize: "clamp(40px, 5vw, 68px)",
              color: "var(--nb-heading)",
              margin: 0,
              textWrap: "balance",
            }}
          >
            Não encontramos <em>essa página.</em>
          </h1>
          <p
            className="mt-6 max-w-[540px] text-base leading-[1.8] sm:text-lg"
            style={{ color: "var(--nb-body-strong)" }}
          >
            Este endereço pode ter mudado ou a página pode não existir. Você pode
            voltar ao início ou conhecer os encontros da comunidade na galeria.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <EditorialButton href="/" size="lg" className="kv-press">
              <House size={18} aria-hidden="true" />
              Voltar ao início
            </EditorialButton>
            <EditorialButton href="/galeria" variant="ghost" size="lg">
              Conhecer a galeria
              <ArrowUpRight size={18} aria-hidden="true" />
            </EditorialButton>
          </div>
        </div>
      </div>
    </main>
  );
}
