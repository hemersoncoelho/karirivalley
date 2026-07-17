import Image from "next/image"
import Link from "next/link"
import { UserCircle2 } from "lucide-react"

import type { DirectoryMember } from "@/lib/members/directory"
import { OCCUPATION_LABELS } from "@/components/member/occupation-labels"

interface MemberCardProps {
  member: Pick<DirectoryMember, "slug" | "name" | "photo_url" | "city" | "company" | "position" | "occupation_areas">
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link
      href={`/comunidade/${member.slug}`}
      className="block rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
    >
      {member.photo_url ? (
        <Image
          src={member.photo_url}
          alt={member.name}
          width={52}
          height={52}
          className="mb-4 size-13 rounded-full object-cover"
        />
      ) : (
        <div className="mb-4 flex size-13 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <UserCircle2 size={24} strokeWidth={1.4} className="text-[#F4EDDF]/40" />
        </div>
      )}
      <p className="truncate text-sm font-semibold text-[#F4EDDF]">{member.name}</p>
      {(member.position || member.company) && (
        <p className="mt-0.5 truncate text-xs text-[#F4EDDF]/50">
          {[member.position, member.company].filter(Boolean).join(" · ")}
        </p>
      )}
      {member.city && <p className="mt-0.5 text-xs text-[#F4EDDF]/40">{member.city}</p>}
      {member.occupation_areas.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.occupation_areas.slice(0, 2).map((area) => (
            <span
              key={area}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[#F4EDDF]/55"
            >
              {OCCUPATION_LABELS[area] ?? area}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
