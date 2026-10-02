import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, ChevronDown, UsersRound } from "lucide-react";
import { SectionIndex } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";
import { STEP_TITLES } from "@/lib/onboarding/options";

export const metadata: Metadata = {
  title: "Como participar — Kariri Valley",
  description:
    "Encontre pessoas, acompanhe os encontros e faça parte da comunidade de inovação do Cariri. Conheça o cadastro e como funciona a entrada na plataforma.",
};

const STEP_DESCRIPTIONS = [
  "Seu nome, e-mail e uma senha. Se for necessário confirmar o e-mail, o cadastro mostra como continuar.",
  "Sua cidade, uma breve apresentação e, se quiser, uma foto para as pessoas reconhecerem você.",
  "Como você participa: empreendendo, estudando, pesquisando, desenvolvendo ou se aproximando da inovação.",
  "Os assuntos que você quer explorar e as conversas das quais gostaria de participar.",
  "O que você está procurando: conhecer pessoas, encontrar parceiros, aprender ou descobrir oportunidades.",
  "O que você pode compartilhar com a comunidade: conhecimento, mentoria, serviços, conexões ou parcerias.",
  "Você escolhe quais informações compartilhar no seu perfil, como contatos, cidade e redes sociais.",
];

const PROCESS = [
  { title: "Conte um pouco sobre você", description: "Preencha as sete etapas do cadastro com seu perfil, interesses e o que busca na comunidade." },
  { title: "A equipe recebe seu cadastro", description: "Cada solicitação é analisada manualmente antes da liberação do acesso à plataforma." },
  { title: "Chegue junto", description: "Quando sua solicitação for aprovada, você recebe um e-mail para acessar a plataforma e se conectar." },
];

export default function ComoParticiparPage() {
  return (
    <main id="conteudo" tabIndex={-1} style={{ background: "var(--nb-page-bg)" }}>
      <section className="mx-auto max-w-[1300px] px-6 pb-14 pt-12 md:px-12 md:pb-20 md:pt-20">
        <SectionIndex index="—" label="Como participar" />
        <div className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <h1 className="kv-display m-0" style={{ fontSize: "clamp(42px, 5.1vw, 72px)", lineHeight: 1.04, color: "var(--nb-heading)" }}>
              O Cariri se move.<br />E você <em style={{ color: "var(--nb-label-accent)" }}>faz parte.</em>
            </h1>
            <p className="mb-0 mt-6 max-w-[520px] text-base leading-8 md:text-lg" style={{ color: "var(--nb-body-strong)" }}>
              Tem lugar para quem empreende, estuda, pesquisa, cria e para quem está chegando agora. O que nos reúne é a vontade de trocar, colaborar e fazer a inovação acontecer no nosso território.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <EditorialButton href="/cadastro" size="lg">Fazer meu cadastro <ArrowUpRight size={17} aria-hidden="true" /></EditorialButton>
              <Link href="/agenda" className="inline-flex min-h-12 items-center gap-2 text-sm font-medium underline underline-offset-4" style={{ color: "var(--nb-heading)" }}>Conhecer a agenda <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
          <figure className="m-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
              <Image src="/media/gallery/20231108-150500-fav.webp" alt="Pessoas da comunidade reunidas em um encontro do Kariri Valley" fill sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-xs leading-6" style={{ color: "var(--nb-body)" }}>Uma comunidade se constrói assim: gente que se encontra, compartilha e faz junto.</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y" style={{ borderColor: "var(--nb-line-soft)", background: "var(--nb-card-bg)" }}>
        <div className="mx-auto grid max-w-[1300px] gap-8 px-6 py-10 md:grid-cols-[1.2fr_1fr_1fr] md:gap-10 md:px-12 md:py-14">
          <div>
            <p className="kv-kicker mb-3" style={{ color: "var(--nb-label-accent)" }}>Comece pelo encontro</p>
            <h2 className="m-0 text-2xl font-medium leading-tight md:text-[28px]" style={{ color: "var(--nb-heading)" }}>Você pode se aproximar desde já.</h2>
            <p className="mb-0 mt-3 text-sm leading-7" style={{ color: "var(--nb-body)" }}>Conheça quem faz parte e acompanhe o que está acontecendo no Cariri.</p>
          </div>
          <Link href="/agenda" className="group flex items-start gap-4 no-underline">
            <CalendarDays size={25} className="mt-1 shrink-0" style={{ color: "var(--nb-label-accent)" }} aria-hidden="true" />
            <div>
              <h3 className="m-0 flex items-center gap-2 text-lg font-semibold" style={{ color: "var(--nb-heading)" }}>Veja a agenda <ArrowUpRight size={17} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></h3>
              <p className="mb-0 mt-2 text-sm leading-7" style={{ color: "var(--nb-body)" }}>Encontros, eventos e atividades para aprender e se conectar.</p>
            </div>
          </Link>
          <Link href="/membros" className="group flex items-start gap-4 no-underline">
            <UsersRound size={25} className="mt-1 shrink-0" style={{ color: "var(--nb-label-accent)" }} aria-hidden="true" />
            <div>
              <h3 className="m-0 flex items-center gap-2 text-lg font-semibold" style={{ color: "var(--nb-heading)" }}>Conecte-se com a comunidade <ArrowUpRight size={17} aria-hidden="true" className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></h3>
              <p className="mb-0 mt-2 text-sm leading-7" style={{ color: "var(--nb-body)" }}>Saiba como acessar o diretório de pessoas na área de membros.</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-6 py-14 md:px-12 md:py-20">
        <SectionIndex index="01" label="Seu acesso à plataforma" />
        <div className="mt-8 max-w-[650px]">
          <h2 className="kv-display m-0" style={{ fontSize: "clamp(32px, 3.4vw, 48px)", lineHeight: 1.08, color: "var(--nb-heading)" }}>Um primeiro passo para<br className="hidden sm:block" /> fazer mais <em>conexões.</em></h2>
          <p className="mb-0 mt-5 text-base leading-8" style={{ color: "var(--nb-body)" }}>O cadastro ajuda a comunidade a conhecer você, seus interesses e as trocas que quer construir. Veja como funciona:</p>
        </div>
        <ol className="m-0 mt-10 grid list-none gap-8 p-0 md:grid-cols-3 md:gap-10">
          {PROCESS.map((step, index) => (
            <li key={step.title} className="border-t pt-5" style={{ borderColor: "var(--nb-line-soft)" }}>
              <span className="kv-index-num text-sm" style={{ color: "var(--nb-label-accent)" }}>{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mb-3 mt-4 text-xl font-semibold" style={{ color: "var(--nb-heading)" }}>{step.title}</h3>
              <p className="m-0 text-sm leading-7" style={{ color: "var(--nb-body)" }}>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-[1300px] px-6 pb-16 md:px-12 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionIndex index="02" label="Antes de começar" />
            <h2 className="mt-7 text-[28px] font-medium leading-tight" style={{ color: "var(--nb-heading)" }}>O que vamos te pedir</h2>
            <p className="max-w-[380px] text-sm leading-7" style={{ color: "var(--nb-body)" }}>São sete etapas. Abra cada uma para conhecer as informações do cadastro.</p>
            <p className="mt-6 max-w-[380px] text-sm leading-7" style={{ color: "var(--nb-body-strong)" }}>Seus interesses podem mudar. Esse primeiro perfil é um ponto de partida para encontrar boas conexões.</p>
          </div>
          <div>
            {STEP_TITLES.map((title, index) => (
              <details key={title} className="group border-t last:border-b" style={{ borderColor: "var(--nb-line-soft)" }}>
                <summary className="flex min-h-[68px] cursor-pointer list-none items-center gap-4 py-4 [&::-webkit-details-marker]:hidden" style={{ color: "var(--nb-heading)" }}>
                  <span className="kv-index-num shrink-0 text-xs" style={{ color: "var(--nb-label-accent)" }}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-sm font-semibold sm:text-base">{title}</span>
                  <ChevronDown size={18} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mb-5 ml-9 mt-0 max-w-[540px] pr-6 text-sm leading-7" style={{ color: "var(--nb-body)" }}>{STEP_DESCRIPTIONS[index]}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-5 border-t pt-8 lg:mt-16" style={{ borderColor: "var(--nb-line-soft)" }}>
          <EditorialButton href="/cadastro" size="lg">Começar meu cadastro <ArrowUpRight size={17} aria-hidden="true" /></EditorialButton>
          <p className="m-0 text-sm" style={{ color: "var(--nb-body)" }}>Já tem uma conta? <Link href="/login" className="inline-flex min-h-11 items-center font-medium underline underline-offset-4" style={{ color: "var(--nb-heading)" }}>Entrar</Link></p>
        </div>
      </section>
    </main>
  );
}
