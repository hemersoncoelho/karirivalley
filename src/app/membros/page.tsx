import Link from "next/link";
import type { Metadata } from "next";
import { Lock, ShieldCheck } from "lucide-react";
import { SectionIndex } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";

export const metadata: Metadata = {
  title: "Membros — Kariri Valley",
  description:
    "O diretório de membros da Kariri Valley é uma área reservada à comunidade. Solicite seu cadastro para ter acesso.",
};

const PASSOS = [
  { n: "01", t: "Você solicita o cadastro", d: "Preenche seus dados e como atua no ecossistema do Cariri." },
  { n: "02", t: "Nossa equipe analisa", d: "Toda solicitação passa por aprovação manual antes de virar acesso." },
  { n: "03", t: "Você acessa o diretório", d: "Com login liberado, você navega pelo diretório completo da comunidade." },
] as const;

export default function MembrosPage() {
  return (
    <main style={{ background: "var(--nb-page-bg)" }}>
      {/* Header editorial */}
      <section className="mx-auto max-w-[1300px] px-6 lg:px-16" style={{ paddingTop: 96 }}>
        <SectionIndex index="—" label="Membros" />
        <h1
          className="kv-display"
          style={{ fontSize: "clamp(42px, 5.6vw, 80px)", color: "var(--nb-heading)", margin: "28px 0 0", maxWidth: 920 }}
        >
          O diretório é{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--nb-terracotta)" }}>exclusivo</em>{" "}
          para membros
        </h1>
        <div
          className="grid grid-cols-1 gap-10 lg:grid-cols-[7fr_4fr]"
          style={{ borderTop: "1px solid var(--nb-line)", marginTop: 32, paddingTop: 24 }}
        >
          <p style={{ fontSize: "clamp(15px, 1.4vw, 17px)", lineHeight: 1.75, color: "var(--nb-body)", maxWidth: 580, margin: 0 }}>
            Para proteger a privacidade de quem faz parte e manter a qualidade das conexões,
            o diretório completo — perfis, áreas de atuação e contatos — só fica visível para
            membros aprovados e autenticados.
          </p>
          <div className="flex flex-wrap items-start gap-3 lg:justify-end">
            <EditorialButton href="/cadastro">Solicitar cadastro</EditorialButton>
            <EditorialButton href="/login" variant="ghost">
              Já sou membro
            </EditorialButton>
          </div>
        </div>
      </section>

      {/* Garantia + passos */}
      <section className="mx-auto max-w-[1300px] px-6 lg:px-16" style={{ paddingTop: 90, paddingBottom: 120 }}>
        <SectionIndex index="01" label="Como ter acesso" />
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {PASSOS.map((item) => (
            <div key={item.n} style={{ borderTop: "1px solid var(--nb-line)", paddingTop: 18 }}>
              <span className="kv-index-num" style={{ fontSize: 13, color: "var(--nb-turquoise)" }}>{item.n}</span>
              <h3 style={{ fontSize: 19, fontFamily: "var(--font-fraunces), Georgia, serif", color: "var(--nb-heading)", margin: "12px 0 8px" }}>{item.t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--nb-body)", margin: 0 }}>{item.d}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-16 flex items-start gap-4"
          style={{ borderTop: "1px solid var(--nb-line)", paddingTop: 28 }}
        >
          <ShieldCheck size={20} strokeWidth={1.8} color="var(--nb-turquoise)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--nb-body)", margin: 0, maxWidth: 640 }}>
            Toda solicitação passa por análise manual antes da aprovação, e cada membro
            escolhe o que fica público no próprio perfil — uma comunidade confiável,
            coesa e segura para todo mundo.
          </p>
        </div>

        <div className="mt-12">
          <Link
            href="/como-participar"
            className="kv-kicker"
            style={{ color: "var(--nb-ink)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ borderBottom: "1px solid var(--nb-ink)", paddingBottom: 2 }}>
              Ver o passo a passo completo do cadastro
            </span>
            <span aria-hidden="true" style={{ fontSize: 9 }}>▸</span>
          </Link>
        </div>

        {/* Acesso restrito, em mono — reforço de marca */}
        <p
          className="kv-meta"
          style={{ marginTop: 70, display: "flex", alignItems: "center", gap: 10, color: "var(--nb-body)" }}
        >
          <Lock size={13} strokeWidth={2} />
          Acesso restrito a membros aprovados
        </p>
      </section>
    </main>
  );
}
