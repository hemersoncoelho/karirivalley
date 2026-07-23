import { fetchDirectory } from "@/lib/members/directory"
import { StartupsClient } from "@/components/member/StartupsClient"

export default async function VitrinePage() {
  const members = await fetchDirectory()
  const startups = members.filter((m) => Boolean(m.startup_stage))

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#F4EDDF]">Vitrine de Startups</h1>
      <p className="mt-1 text-sm text-[#F4EDDF]/50">Conheça as startups do ecossistema Kariri Valley.</p>
      <div className="mt-6">
        <StartupsClient startups={startups} />
      </div>
    </div>
  )
}
