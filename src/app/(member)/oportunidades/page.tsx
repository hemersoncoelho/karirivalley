import { SearchX } from "lucide-react"

import { fetchOpportunities } from "@/lib/members/opportunities"
import { EmptyState } from "@/components/member/EmptyState"

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
              <div key={opp.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs font-medium text-[#E9B23C]">{CATEGORY_LABELS[opp.category] ?? opp.category}</p>
                <p className="mt-1.5 text-base font-semibold text-[#F4EDDF]">{opp.title}</p>
                {opp.description && <p className="mt-1.5 text-sm text-[#F4EDDF]/55">{opp.description}</p>}
                {opp.deadline && <p className="mt-2 text-xs text-[#F4EDDF]/40">{formatDeadline(opp.deadline)}</p>}
                {opp.url && (
                  <a
                    href={opp.url}
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
