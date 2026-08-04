import Image from "next/image"
import { SearchX } from "lucide-react"

import { fetchOpportunities } from "@/lib/members/opportunities"
import { EmptyState } from "@/components/member/EmptyState"
import { LinkifiedText } from "@/components/ui/linkified-text"
import { ShareButton } from "@/components/ui/share-button"

const CATEGORY_LABELS: Record<string, string> = {
  editais: "Edital",
  vagas: "Vaga",
  aceleracao: "Aceleração",
  mentoria: "Mentoria",
  programas: "Programa",
}

function formatDeadline(value: string | null): string | null {
  if (!value) return null
  return `Prazo: ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value))}`
}

export default async function OportunidadesPage() {
  const opportunities = await fetchOpportunities()

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#F4EDDF]">Oportunidades</h1>
      <p className="mt-1 text-sm text-[#F4EDDF]/50">Editais, vagas, aceleração, mentoria e programas para a comunidade.</p>

      <div className="mt-6">
        {opportunities.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nenhuma oportunidade publicada no momento"
            description="Em breve, editais, vagas, programas e mentorias estarão disponíveis aqui."
          />
        ) : (
          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                id={`oportunidade-${opp.id}`}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-5 scroll-mt-24"
              >
                {opp.banner_url && (
                  <div className="relative mb-3 h-36 w-full overflow-hidden rounded-lg bg-white/[0.04]">
                    <Image src={opp.banner_url} alt={opp.title} fill sizes="(max-width: 640px) 100vw, 600px" className="object-contain" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-[#E9B23C]">{CATEGORY_LABELS[opp.opportunity_type] ?? opp.opportunity_type}</p>
                  <ShareButton
                    title={opp.title}
                    text={opp.description ?? undefined}
                    anchorId={`oportunidade-${opp.id}`}
                    className="shrink-0 text-xs font-medium text-[#F4EDDF]/50 hover:text-[#F4EDDF]"
                  />
                </div>
                <p className="mt-1.5 text-base font-semibold text-[#F4EDDF]">{opp.title}</p>
                {opp.description && (
                  <LinkifiedText text={opp.description} className="mt-1.5 text-sm leading-relaxed text-[#F4EDDF]/55" />
                )}
                {opp.deadline && <p className="mt-2 text-xs text-[#F4EDDF]/40">{formatDeadline(opp.deadline)}</p>}
                {opp.external_url && (
                  <a
                    href={opp.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs font-medium text-[#E9B23C] underline underline-offset-4"
                  >
                    Saiba mais
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
