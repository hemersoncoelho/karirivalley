import { fetchDirectory } from "@/lib/members/directory"
import { DirectoryClient } from "@/components/member/DirectoryClient"

export default async function ComunidadePage() {
  const members = await fetchDirectory()

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#F4EDDF]">Comunidade Kariri Valley</h1>
      <p className="mt-1 text-sm text-[#F4EDDF]/50">Conheça as pessoas que fazem o ecossistema.</p>
      <div className="mt-6">
        <DirectoryClient members={members} />
      </div>
    </div>
  )
}
