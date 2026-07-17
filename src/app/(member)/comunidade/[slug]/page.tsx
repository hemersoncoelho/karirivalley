import { notFound } from "next/navigation"

import { fetchMemberBySlug } from "@/lib/members/directory"
import { MemberProfileView } from "@/components/member/MemberProfileView"

interface MemberProfilePageProps {
  params: Promise<{ slug: string }>
}

export default async function MemberProfilePage({ params }: MemberProfilePageProps) {
  const { slug } = await params
  const member = await fetchMemberBySlug(slug)

  if (!member) notFound()

  return <MemberProfileView member={member} />
}
