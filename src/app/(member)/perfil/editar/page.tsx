import { getCurrentMember } from "@/lib/members/current-member"
import { fetchProfileBundle } from "@/lib/members/profile-bundle"
import { ProfileEditForm } from "@/components/member/ProfileEditForm"

export default async function ProfileEditPage() {
  const { member } = await getCurrentMember()
  if (!member) return null // guardado pelo layout

  const bundle = await fetchProfileBundle(member.id)

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-[#F4EDDF]">Meu perfil</h1>
      <ProfileEditForm member={member} bundle={bundle} />
    </div>
  )
}
