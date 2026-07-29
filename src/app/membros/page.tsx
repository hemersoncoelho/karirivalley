import Link from "next/link";
import type { Metadata } from "next";
import { Lock, ShieldCheck, UserPlus, LogIn } from "lucide-react";

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
    <main className="relative overflow-hidden" style={{ background: "var(--nb-page-bg)" }}>
      <div
        className="kv-aurora absolute pointer-events-none"
        style={{
          width: "48vw", height: "48vw", maxWidth: 680, maxHeight: 680,
          top: "-18%", left: "-8%",
          background: "radial-gradient(circle, rgba(232,178,60,.18) 0%, rgba(232,178,60,.04) 55%, transparent 72%)",
          animationDuration: "27s", animationDelay: "-9s",
        }}
      />
      <div
        className="kv-aurora absolute pointer-events-none"
        style={{
          width: "36vw", height: "36vw", maxWidth: 500, maxHeight: 500,
          bottom: "0%", right: "-8%",
          background: "radial-gradient(circle, rgba(35,157,140,.18) 0%, rgba(35,157,140,.04) 55%, transparent 72%)",
          animationDuration: "23s", animationDelay: "-15s", animationDirection: "reverse",
        }}
      />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.5 }} />

      {/* Header */}
      <section className="relative max-w-[820px] mx-auto px-6 lg:px-16 text-center" style={{ zIndex: 10, padding: "168px 24px 56px" }}>
        <span
          className="inline-flex items-center gap-2 px-[18px] py-[7px] text-[11px] font-bold tracking-[2px] uppercase mb-7"
          style={{ background: "var(--nb-mustard)", border: "2px solid var(--nb-ink)", borderRadius: 999, color: "var(--nb-ink)", fontFamily: "var(--font-geo)" }}
        >
          <Lock size={12} strokeWidth={2.2} />
          Área reservada
        </span>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(32px, 4.4vw, 56px)",
            fontWeight: 700,
            lineHeight: 1.14,
            letterSpacing: "-1px",
            color: "var(--nb-heading)",
            marginBottom: 20,
          }}
        >
          O diretório é{" "}
          <span style={{ color: "var(--nb-terracotta)", fontStyle: "italic" }}>exclusivo</span>{" "}
          para membros
        </h1>

        <p
          className="mx-auto"
          style={{
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.7,
            color: "var(--nb-body)",
            maxWidth: 560,
            marginBottom: 36,
          }}
        >
          Para proteger a privacidade de quem faz parte da comunidade e manter a
          qualidade das conexões, o diretório completo — com perfis, áreas de atuação
          e contatos — só fica visível para membros aprovados e autenticados.
          Solicite seu cadastro para ter acesso.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/cadastro"
            className="kv-press inline-flex items-center gap-2 px-9 py-4 text-base font-bold"
            style={{ background: "var(--nb-btn-primary-bg)", color: "var(--nb-btn-primary-fg)", border: "var(--nb-btn-primary-border)", borderRadius: 10, boxShadow: "var(--shadow-nb)", textDecoration: "none", fontFamily: "var(--font-geo)" }}
          >
            <UserPlus size={17} strokeWidth={2} />
            Solicitar cadastro
          </Link>
          <Link
            href="/login"
            className="kv-press inline-flex items-center gap-2 px-7 py-4 text-base font-bold"
            style={{ color: "var(--nb-btn-ghost-fg)", background: "var(--nb-btn-ghost-bg)", border: "var(--nb-btn-ghost-border)", borderRadius: 10, textDecoration: "none", fontFamily: "var(--font-geo)" }}
          >
            <LogIn size={17} strokeWidth={2} />
            Já sou membro
          </Link>
        </div>
      </section>

      {/* Por que é reservado */}
      <section className="relative max-w-[700px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, paddingBottom: 88 }}>
        <div
          className="flex items-start gap-4 p-6"
          style={{ background: "var(--nb-card-bg)", backdropFilter: "var(--nb-card-blur)", WebkitBackdropFilter: "var(--nb-card-blur)", border: "var(--nb-card-border)", borderRadius: 14, boxShadow: "var(--nb-card-shadow)" }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: "var(--nb-turquoise)", border: "2px solid var(--nb-ink)",
            }}
          >
            <ShieldCheck size={18} strokeWidth={2} color="var(--nb-sand)" />
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--nb-body)", margin: 0 }}>
            Toda solicitação passa por análise manual antes da aprovação, e cada membro
            escolhe o que fica público no próprio perfil. Assim garantimos uma comunidade
            confiável, coesa e segura para todo mundo.
          </p>
        </div>
      </section>

      {/* Como entrar */}
      <section className="relative max-w-[1100px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, paddingBottom: 120 }}>
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div style={{ width: 32, height: 2, background: "var(--nb-turquoise)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--nb-turquoise)", fontFamily: "var(--font-geo)" }}>
            Como ter acesso
          </span>
          <div style={{ width: 32, height: 2, background: "var(--nb-turquoise)" }} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {PASSOS.map((item) => (
            <div key={item.n} className="p-8" style={{ background: "var(--nb-card-bg)", backdropFilter: "var(--nb-card-blur)", WebkitBackdropFilter: "var(--nb-card-blur)", border: "var(--nb-card-border)", borderRadius: 14, boxShadow: "var(--nb-card-shadow)" }}>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", color: "var(--nb-turquoise)" }}>{item.n}</span>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--nb-heading)", margin: "10px 0 8px" }}>{item.t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--nb-body)", margin: 0 }}>{item.d}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/como-participar"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 14, fontWeight: 700, color: "var(--nb-label-accent)", textDecoration: "none", fontFamily: "var(--font-geo)",
              borderBottom: "2px solid var(--nb-mustard)", paddingBottom: 3,
            }}
          >
            Ver o passo a passo completo do cadastro
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
