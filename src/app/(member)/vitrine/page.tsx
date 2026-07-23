import { fetchDirectory } from "@/lib/members/directory"
import { CompaniesClient } from "@/components/member/CompaniesClient"

export default async function VitrinePage() {
  const members = await fetchDirectory()
  const companies = members.filter((m) => Boolean(m.company_name) && m.company_review_status === "approved")

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#F4EDDF]">Vitrine de Empresas</h1>
      <p className="mt-1 text-sm text-[#F4EDDF]/50">Conheça as startups e empresas do ecossistema Kariri Valley.</p>
      <div className="mt-6">
        <CompaniesClient companies={companies} />
      </div>
    </div>
  )
}
