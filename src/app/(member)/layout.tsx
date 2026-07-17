import { getCurrentMember } from "@/lib/members/current-member"
import { MemberShell } from "@/components/member/MemberShell"
import { MemberStatusNotice } from "@/components/member/MemberStatusNotice"

export default async function MemberAreaLayout({ children }: { children: React.ReactNode }) {
  const { member } = await getCurrentMember()

  if (!member) {
    return <MemberStatusNotice status="no_record" />
  }

  if (member.status !== "approved") {
    return <MemberStatusNotice status={member.status as "pending" | "blocked" | "rejected"} />
  }

  return (
    <MemberShell
      member={{
        displayName: member.display_name || member.full_name.split(" ")[0],
        photoUrl: member.photo_url,
        slug: member.slug,
      }}
    >
      {children}
    </MemberShell>
  )
}
