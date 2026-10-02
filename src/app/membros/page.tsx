import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, LockKeyhole, UsersRound } from "lucide-react";
import { SectionIndex } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";

export const metadata: Metadata = {
  title: "Pessoas da comunidade — Kariri Valley",
  description:
    "Conheça o movimento que conecta pessoas no Cariri e saiba como acessar o diretório reservado aos membros aprovados do Kariri Valley.",
};

const STEPS = [
  { title: "Apresente-se", description: "Conte quem você é, como atua e quais interesses e trocas quer trazer para a comunidade." },
  { title: "Envie seu cadastro", description: "Nossa equipe analisa cada solicitação manualmente. Você recebe um e-mail quando o acesso é aprovado." },
  { title: "Encontre suas conexões", description: "Entre na plataforma para explorar os perfis, conhecer áreas de atuação e encontrar pessoas com interesses em comum." },
] as const;

export default function MembrosPage() {
  return (
    <main id="conteudo" tabIndex={-1} style={{ background: "var(--nb-page-bg)" }}>
      <section className="mx-auto max-w-[1300px] px-6 pb-14 pt-12 md:px-12 md:pb-20 md:pt-20">
        <SectionIndex index="—" label="Pessoas da comunidade" />
        <div className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <h1 className="kv-display m-0" style={{ fontSize: "clamp(42px, 5vw, 70px)", lineHeight: 1.06, color: "var(--nb-heading)" }}>
              Por trás de cada ideia,<br className="hidden sm:block" /> tem <em style={{ color: "var(--nb-label-accent)" }}>gente.</em>
            </h1>
            <p className="mb-0 mt-6 max-w-[520px] text-base leading-8" style={{ color: "var(--nb-body-strong)" }}>
              Quem empreende, pesquisa, estuda, desenvolve ou quer aprender. Experiências diferentes que se encontram para criar novas possibilidades no Cariri.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <EditorialButton href="/cadastro" size="lg">Fazer meu cadastro <ArrowUpRight size={17} aria-hidden="true" /></EditorialButton>
              <EditorialButton href="/login" variant="ghost" size="lg">Já sou membro</EditorialButton>
            </div>
            <p className="mb-0 mt-6 flex items-start gap-2 text-xs leading-6" style={{ color: "var(--nb-body)" }}>
              <LockKeyhole size={15} aria-hidden="true" className="mt-1 shrink-0" />
              <span>O diretório completo fica disponível na plataforma para membros aprovados e autenticados.</span>
            </p>
          </div>
          <figure className="m-0">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[18px]">
              <Image src="/media/gallery/20260801-195702-fav.webp" alt="Grupo da comunidade reunido, com participantes usando a camiseta do Kariri Valley" fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-xs leading-6" style={{ color: "var(--nb-body)" }}>Muitas trajetórias. Um território em comum.</figcaption>
            <Link href="/galeria" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4" style={{ color: "var(--nb-heading)" }}>Veja os encontros da comunidade <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </figure>
        </div>
      </section>

      <section className="border-y" style={{ background: "var(--nb-card-bg)", borderColor: "var(--nb-line-soft)" }}>
        <div className="mx-auto flex max-w-[1300px] flex-col items-start gap-5 px-6 py-9 md:flex-row md:gap-7 md:px-12 md:py-12">
          <UsersRound size={28} aria-hidden="true" className="shrink-0" style={{ color: "var(--nb-label-accent)" }} />
          <div className="max-w-[820px]">
            <h2 className="m-0 text-2xl font-medium leading-tight" style={{ color: "var(--nb-heading)" }}>Um diretório para se conhecer e fazer junto.</h2>
            <p className="mb-0 mt-4 text-base leading-8" style={{ color: "var(--nb-body)" }}>Na área de membros, você encontra perfis, interesses e o que cada pessoa busca ou oferece à comunidade. Um ponto de partida para uma conversa, uma parceria ou um novo projeto.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-6 py-14 md:px-12 md:py-20">
        <SectionIndex index="01" label="Como acessar o diretório" />
        <ol className="m-0 mt-9 grid list-none gap-8 p-0 md:mt-12 md:grid-cols-3 md:gap-10">
          {STEPS.map((step, index) => (
            <li key={step.title} className="border-t pt-5" style={{ borderColor: "var(--nb-line-soft)" }}>
              <span className="kv-index-num text-sm" style={{ color: "var(--nb-label-accent)" }}>{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mb-3 mt-4 text-xl font-semibold" style={{ color: "var(--nb-heading)" }}>{step.title}</h3>
              <p className="m-0 text-sm leading-7" style={{ color: "var(--nb-body)" }}>{step.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col items-start gap-6 border-t pt-7 sm:flex-row sm:items-center sm:justify-between md:mt-14" style={{ borderColor: "var(--nb-line-soft)" }}>
          <p className="m-0 max-w-[550px] text-sm leading-7" style={{ color: "var(--nb-body)" }}>No cadastro, você escolhe quais informações mostrar no seu perfil. O acesso ao diretório continua reservado à comunidade.</p>
          <Link href="/como-participar" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium underline underline-offset-4" style={{ color: "var(--nb-heading)" }}>Entenda como participar <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
