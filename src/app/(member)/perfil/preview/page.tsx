import { getCurrentMember } from "@/lib/members/current-member"
import { fetchMemberBySlug } from "@/lib/members/directory"
import { MemberProfileView } from "@/components/member/MemberProfileView"

export default async function ProfilePreviewPage() {
  const { member } = await getCurrentMember()
  if (!member?.slug) return null // guardado pelo layout

  const publicView = await fetchMemberBySlug(member.slug)
  if (!publicView) return null

  return (
    <div>
      <p className="mb-6 rounded-xl border border-[#E9B23C]/25 bg-[#E9B23C]/10 px-4 py-3 text-center text-sm text-[#E9B23C]">
        Prévia do seu perfil na comunidade.
      </p>
      <MemberProfileView member={publicView} showBackLink={false} />
    </div>
  )
}
