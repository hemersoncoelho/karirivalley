import Link from "next/link";
import type { Metadata } from "next";

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
    <main className="relative overflow-hidden" style={{ background: "#060D08" }}>
      <div
        className="kv-aurora absolute pointer-events-none"
        style={{
          width: "50vw", height: "50vw", maxWidth: 700, maxHeight: 700,
          top: "-16%", right: "-10%",
          background: "radial-gradient(circle, rgba(232,184,75,.14) 0%, rgba(232,184,75,.03) 55%, transparent 72%)",
          animationDuration: "26s", animationDelay: "-8s",
        }}
      />
      <div
        className="kv-aurora absolute pointer-events-none"
        style={{
          width: "38vw", height: "38vw", maxWidth: 520, maxHeight: 520,
          bottom: "0%", left: "-8%",
          background: "radial-gradient(circle, rgba(35,157,140,.14) 0%, rgba(35,157,140,.03) 55%, transparent 72%)",
          animationDuration: "22s", animationDelay: "-14s", animationDirection: "reverse",
        }}
      />
      <div className="absolute inset-0 kv-hero-grid pointer-events-none" style={{ opacity: 0.3 }} />

      {/* Header */}
      <section className="relative max-w-[900px] mx-auto px-6 lg:px-16 text-center" style={{ zIndex: 10, padding: "168px 24px 72px" }}>
        <span
          className="inline-flex items-center gap-2 px-[18px] py-[7px] rounded-full text-[11px] font-semibold tracking-[2px] uppercase mb-7"
          style={{ background: "rgba(232,184,75,.1)", border: "1px solid rgba(232,184,75,.22)", color: "#E9B23C" }}
        >
          Como Participar
        </span>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(32px, 4.4vw, 56px)",
            fontWeight: 700,
            lineHeight: 1.14,
            letterSpacing: "-1px",
            color: "#F4EDDF",
            marginBottom: 20,
          }}
        >
          Como você entra para a{" "}
          <span style={{ color: "#239D8C", fontStyle: "italic" }}>Kariri Valley</span>
        </h1>

        <p
          className="mx-auto"
          style={{
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.7,
            color: "rgba(244,237,223,.55)",
            maxWidth: 560,
            marginBottom: 36,
          }}
        >
          O cadastro é feito em 7 etapas rápidas. Depois de enviado, sua solicitação passa
          por uma análise manual da nossa equipe — assim mantemos a comunidade coesa e
          confiável para todo mundo.
        </p>

        <Link
          href="/cadastro"
          className="kv-btn-primary inline-flex items-center gap-2 px-9 py-4 rounded-full text-base font-semibold"
          style={{ background: "#1E4D3A", color: "#F4EDDF", border: "1px solid rgba(255,255,255,.1)", textDecoration: "none" }}
        >
          Solicitar acesso
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      {/* Processo de aprovação — RN-001 */}
      <section className="relative max-w-[1100px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, paddingBottom: 96 }}>
        <div
          className="grid sm:grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,.08)" }}
        >
          {[
            { n: "01", t: "Você se cadastra", d: "Preenche as 7 etapas com seus dados e preferências." },
            { n: "02", t: "Nossa equipe analisa", d: "Toda solicitação passa por aprovação manual antes de virar acesso." },
            { n: "03", t: "Você recebe a resposta", d: "Um e-mail avisa se foi aprovada — com o link para acessar a plataforma." },
          ].map((item) => (
            <div key={item.n} className="p-8" style={{ background: "#0A140D" }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", color: "#E9B23C" }}>{item.n}</span>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#F4EDDF", margin: "10px 0 8px" }}>{item.t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(244,237,223,.5)", margin: 0 }}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* O que vamos pedir em cada etapa */}
      <section className="relative max-w-[900px] mx-auto px-6 lg:px-16" style={{ zIndex: 10, paddingBottom: 120 }}>
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div style={{ width: 32, height: 1, background: "#239D8C" }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#239D8C" }}>
            O que vamos te pedir
          </span>
          <div style={{ width: 32, height: 1, background: "#239D8C" }} />
        </div>

        <div>
          {STEP_TITLES.map((title, i) => (
            <div
              key={title}
              className="flex gap-5"
              style={{
                padding: "20px 0",
                borderBottom: i < STEP_TITLES.length - 1 ? "1px solid rgba(255,255,255,.06)" : "none",
              }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(232,184,75,.08)", border: "1px solid rgba(232,184,75,.2)",
                  fontSize: 14, fontWeight: 700, color: "#E9B23C",
                }}
              >
                {i + 1}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F4EDDF", margin: "0 0 4px" }}>{title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(244,237,223,.48)", margin: 0 }}>
                  {STEP_DESCRIPTIONS[i]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/cadastro"
            className="kv-btn-primary inline-flex items-center gap-2 px-9 py-4 rounded-full text-base font-semibold"
            style={{ background: "#1E4D3A", color: "#F4EDDF", border: "1px solid rgba(255,255,255,.1)", textDecoration: "none" }}
          >
            Começar meu cadastro
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <p className="mt-5" style={{ fontSize: 13, color: "rgba(244,237,223,.4)" }}>
            Já tem uma conta?{" "}
            <Link href="/login" style={{ color: "#E9B23C", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Entrar
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
