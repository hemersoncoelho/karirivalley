import Link from "next/link";
import type { Metadata } from "next";
import { SectionIndex } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";

import { STEP_TITLES } from "@/lib/onboarding/options";

export const metadata: Metadata = {
  title: "Como Participar — Kariri Valley",
  description:
    "Entenda como funciona o processo de entrada na Kariri Valley: o que pedimos em cada etapa do cadastro e como sua solicitação é analisada.",
};

const STEP_DESCRIPTIONS: string[] = [
  "Crie sua conta com e-mail e senha, ou receba um link de acesso sem senha.",
  "Nome, cidade, mini bio e (se quiser) uma foto de perfil.",
  "Como você atua no ecossistema: founder, dev, investidor, estudante e outros.",
  "Os temas que mais te interessam dentro da comunidade.",
  "O que você está buscando: sócio, mentoria, investimento, oportunidades.",
  "O que você pode oferecer para quem já está na comunidade.",
  "Você decide o que fica público no seu perfil e o que continua privado.",
];

export default function ComoParticiparPage() {
  return (
    <main style={{ background: "var(--nb-page-bg)" }}>
      {/* Header editorial */}
      <section className="mx-auto max-w-[1300px] px-6 lg:px-16" style={{ paddingTop: 150 }}>
        <SectionIndex index="—" label="Como participar" />
        <h1
          className="kv-display"
          style={{ fontSize: "clamp(42px, 5.6vw, 80px)", color: "var(--nb-heading)", margin: "28px 0 0", maxWidth: 920 }}
        >
          Sete etapas até o seu{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-turquoise)" }}>lugar</em> no vale
        </h1>
        <div
          className="grid grid-cols-1 gap-10 lg:grid-cols-[7fr_4fr]"
          style={{ borderTop: "1px solid var(--nb-line)", marginTop: 32, paddingTop: 24 }}
        >
          <p style={{ fontSize: "clamp(15px, 1.4vw, 17px)", lineHeight: 1.75, color: "var(--nb-body)", maxWidth: 580, margin: 0 }}>
            O cadastro é rápido. Depois de enviado, sua solicitação passa por análise
            manual da equipe — assim a comunidade segue coesa e confiável.
          </p>
          <div className="flex flex-wrap items-start gap-3 lg:justify-end">
            <EditorialButton href="/cadastro">Solicitar acesso</EditorialButton>
          </div>
        </div>
      </section>

      {/* Processo de aprovação */}
      <section className="mx-auto max-w-[1300px] px-6 lg:px-16" style={{ paddingTop: 90 }}>
        <SectionIndex index="01" label="O processo" />
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {[
            { n: "01", t: "Você se cadastra", d: "Preenche as 7 etapas com seus dados e preferências." },
            { n: "02", t: "Nossa equipe analisa", d: "Toda solicitação passa por aprovação manual antes de virar acesso." },
            { n: "03", t: "Você recebe a resposta", d: "Um e-mail avisa se foi aprovada — com o link para acessar a plataforma." },
          ].map((item) => (
            <div key={item.n} style={{ borderTop: "1px solid var(--nb-line)", paddingTop: 18 }}>
              <span className="kv-index-num" style={{ fontSize: 13, color: "var(--nb-turquoise)" }}>{item.n}</span>
              <h3 style={{ fontSize: 19, fontFamily: "var(--font-fraunces), Georgia, serif", color: "var(--nb-heading)", margin: "12px 0 8px" }}>{item.t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--nb-body)", margin: 0 }}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* O que pedimos em cada etapa — lista-índice */}
      <section className="mx-auto max-w-[900px] px-6 lg:px-16" style={{ paddingTop: 96, paddingBottom: 120 }}>
        <SectionIndex index="02" label="O que vamos te pedir" />
        <div style={{ marginTop: 36 }}>
          {STEP_TITLES.map((title, i) => (
            <div
              key={title}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: 18,
                alignItems: "baseline",
                padding: "22px 0",
                borderTop: "1px solid var(--nb-line)",
                borderBottom: i === STEP_TITLES.length - 1 ? "1px solid var(--nb-line)" : "none",
              }}
            >
              <span className="kv-index-num" style={{ fontSize: 20, fontWeight: 700, color: "var(--nb-mustard-dark, var(--nb-label-accent))" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--nb-heading)", margin: "0 0 4px" }}>{title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--nb-body)", margin: 0 }}>
                  {STEP_DESCRIPTIONS[i]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6">
          <EditorialButton href="/cadastro" size="lg">
            Começar meu cadastro
          </EditorialButton>
          <p className="kv-meta" style={{ color: "var(--nb-body)" }}>
            Já tem uma conta?{" "}
            <Link href="/login" style={{ color: "var(--nb-ink)", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Entrar
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
