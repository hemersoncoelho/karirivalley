import Image from "next/image"
import Link from "next/link"
import { Rocket } from "lucide-react"

import type { DirectoryMember } from "@/lib/members/directory"
import { STARTUP_STAGE_LABELS, COMPANY_SECTOR_LABELS, COMPANY_TYPE_LABELS } from "@/lib/onboarding/options"

interface CompanyCardProps {
  member: Pick<
    DirectoryMember,
    | "slug"
    | "name"
    | "city"
    | "company_name"
    | "company_type"
    | "company_stage"
    | "company_sector"
    | "company_logo_url"
    | "company_problem"
  >
}

export function CompanyCard({ member }: CompanyCardProps) {
  return (
    <Link
      href={`/comunidade/${member.slug}`}
      className="block rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-center gap-3">
        {member.company_logo_url ? (
          <Image
            src={member.company_logo_url}
            alt={member.company_name ?? ""}
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Rocket size={22} strokeWidth={1.4} className="text-[#F4EDDF]/40" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#F4EDDF]">{member.company_name}</p>
          <p className="truncate text-xs text-[#F4EDDF]/50">{member.name}</p>
        </div>
      </div>

      {member.company_problem && (
        <p className="mt-3 line-clamp-2 text-xs text-[#F4EDDF]/55">{member.company_problem}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {member.company_type && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[#F4EDDF]/55">
            {COMPANY_TYPE_LABELS[member.company_type] ?? member.company_type}
          </span>
        )}
        {member.company_sector && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[#F4EDDF]/55">
            {COMPANY_SECTOR_LABELS[member.company_sector] ?? member.company_sector}
          </span>
        )}
        {member.company_stage && (
          <span className="rounded-full border border-[#E9B23C]/25 bg-[#E9B23C]/10 px-2 py-0.5 text-[11px] font-medium text-[#E9B23C]">
            {STARTUP_STAGE_LABELS[member.company_stage] ?? member.company_stage}
          </span>
        )}
        {member.city && <span className="text-[11px] text-[#F4EDDF]/40">{member.city}</span>}
      </div>
    </Link>
  )
}
