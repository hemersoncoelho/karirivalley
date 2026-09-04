"use client";

import { useInView } from "@/hooks/useInView";
import type React from "react";
import { SectionIndex } from "@/components/ui/editorial";
import { Search, CalendarDays, Briefcase, Users, ShieldCheck, MapPin, Rocket, Sparkles } from "lucide-react";

/**
 * "O que o vale devolve" — recriação da BenefitsSection.
 * Arquétipo Tana "Built for real work": 3 colunas centradas com ícones
 * definidos + faixa de capacidades em chips.
 */
const BENEFITS = [
  {
    icon: Users,
    title: "Rede verificada",
    desc: "Perfis reais, aprovados um a um, com o que cada membro busca e oferece. Sem ruído, sem portas fechadas.",
  },
  {
    icon: CalendarDays,
    title: "Vale em movimento",
    desc: "Encontros, talks e workshops constantes — a agenda que mantém o ecossistema vivo e visível.",
  },
  {
    icon: Briefcase,
    title: "Oportunidades em primeira mão",
    desc: "Editais, vagas, mentorias e investimento circulam aqui antes de qualquer canal aberto.",
  },
] as const;

const CAPABILITIES = [
  { icon: ShieldCheck, label: "Aprovação manual" },
  { icon: MapPin, label: "12 cidades do Cariri" },
  { icon: Rocket, label: "Perfis de empresa com MRR" },
  { icon: Sparkles, label: "Indicação entre membros" },
  { icon: Search, label: "Busca por interesse" },
] as const;

export default function BenefitsSection() {
  const { ref, inView } = useInView();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
  });

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--nb-page-bg)", padding: "0 0 112px" }}
    >
      <div ref={ref} className="relative mx-auto max-w-[1300px] px-6 text-center lg:px-16">
        <SectionIndex index="03" label="Benefícios" title="o que o vale devolve" />

        <h2
          className="kv-display mt-10"
          style={{ fontSize: "clamp(30px, 3.4vw, 48px)", color: "var(--nb-heading)", margin: "40px auto 14px", maxWidth: 640, ...fadeUp(0) }}
        >
          Feito para o trabalho{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>real</em> de empreender
        </h2>
        <p style={{ fontSize: 16, color: "var(--nb-body)", margin: "0 auto 56px", maxWidth: 480, ...fadeUp(0.05) }}>
          A plataforma cuida da estrutura. Você cuida do que só você pode fazer.
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={b.title} style={{ ...fadeUp(0.1 + i * 0.07), display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span
                  style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: "rgba(30,77,58,.08)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Icon size={24} strokeWidth={1.75} color="var(--nb-forest)" />
                </span>
                <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 21, color: "var(--nb-heading)" }}>
                  {b.title}
                </h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: "var(--nb-body)", maxWidth: 320 }}>
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Faixa de capacidades — chips definidos */}
        <div
          className="mx-auto mt-16 flex flex-wrap items-center justify-center gap-3"
          style={{ ...fadeUp(0.3), maxWidth: 880 }}
        >
          {CAPABILITIES.map(c => {
            const Icon = c.icon;
            return (
              <span
                key={c.label}
                className="kv-kicker"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "9px 16px", borderRadius: 999,
                  background: "var(--nb-cream)",
                  border: "1px solid rgba(22,20,15,.1)",
                  color: "var(--nb-body-strong)",
                  fontSize: 11,
                }}
              >
                <Icon size={13} strokeWidth={2} color="var(--nb-forest)" />
                {c.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
