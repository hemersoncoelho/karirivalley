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
      <p className="mb-6 rounded-xl border border-[var(--kv-gold)]/25 bg-[var(--kv-gold)]/10 px-4 py-3 text-center text-sm text-[var(--kv-gold)]">
        Prévia do seu perfil na comunidade.
      </p>
      <MemberProfileView member={publicView} showBackLink={false} isOwnProfile />
    </div>
  )
}
