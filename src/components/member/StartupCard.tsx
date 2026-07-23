import Image from "next/image"
import Link from "next/link"
import { Rocket } from "lucide-react"

import type { DirectoryMember } from "@/lib/members/directory"
import { STARTUP_STAGE_LABELS, STARTUP_SECTOR_LABELS } from "@/lib/onboarding/options"

interface StartupCardProps {
  member: Pick<
    DirectoryMember,
    "slug" | "name" | "city" | "startup_name" | "startup_stage" | "startup_sector" | "startup_logo_url" | "startup_problem"
  >
}

export function StartupCard({ member }: StartupCardProps) {
  return (
    <Link
      href={`/comunidade/${member.slug}`}
      className="block rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-center gap-3">
        {member.startup_logo_url ? (
          <Image
            src={member.startup_logo_url}
            alt={member.startup_name ?? ""}
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
          <p className="truncate text-sm font-semibold text-[#F4EDDF]">{member.startup_name}</p>
          <p className="truncate text-xs text-[#F4EDDF]/50">{member.name}</p>
        </div>
      </div>

      {member.startup_problem && (
        <p className="mt-3 line-clamp-2 text-xs text-[#F4EDDF]/55">{member.startup_problem}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {member.startup_sector && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[#F4EDDF]/55">
            {STARTUP_SECTOR_LABELS[member.startup_sector] ?? member.startup_sector}
          </span>
        )}
        {member.startup_stage && (
          <span className="rounded-full border border-[#E9B23C]/25 bg-[#E9B23C]/10 px-2 py-0.5 text-[11px] font-medium text-[#E9B23C]">
            {STARTUP_STAGE_LABELS[member.startup_stage] ?? member.startup_stage}
          </span>
        )}
        {member.city && <span className="text-[11px] text-[#F4EDDF]/40">{member.city}</span>}
      </div>
    </Link>
  )
}
