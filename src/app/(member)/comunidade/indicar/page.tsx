import { getCurrentMember } from "@/lib/members/current-member"
import { NominateMemberForm } from "@/components/member/NominateMemberForm"

export default async function IndicarMembroPage() {
  const { member } = await getCurrentMember()
  if (!member) return null // guardado pelo layout

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold text-[#F4EDDF]">Indicar novo membro</h1>
      <p className="mt-1 text-sm text-[#F4EDDF]/50">
        Conte um pouco sobre quem você quer indicar. Nossa equipe vai analisar a solicitação.
      </p>
      <div className="mt-6">
        <NominateMemberForm nominatorId={member.id} />
      </div>
    </div>
  )
}
