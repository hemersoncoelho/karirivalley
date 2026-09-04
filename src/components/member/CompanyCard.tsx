import Image from "next/image"
import Link from "next/link"
import { Rocket } from "lucide-react"

import type { DirectoryMember } from "@/lib/members/directory"
import { STARTUP_STAGE_LABELS, COMPANY_SECTOR_LABELS, COMPANY_TYPE_LABELS } from "@/lib/onboarding/options"
import { formatCurrencyBRL } from "@/lib/utils"

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
    | "company_mrr"
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
            <Rocket size={22} strokeWidth={1.4} className="text-[var(--kv-cream)]/40" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--kv-cream)]">{member.company_name}</p>
          <p className="truncate text-xs text-[var(--kv-cream)]/50">{member.name}</p>
        </div>
      </div>

      {member.company_problem && (
        <p className="mt-3 line-clamp-2 text-xs text-[var(--kv-cream)]/55">{member.company_problem}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {member.company_type && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[var(--kv-cream)]/55">
            {COMPANY_TYPE_LABELS[member.company_type] ?? member.company_type}
          </span>
        )}
        {member.company_sector && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[var(--kv-cream)]/55">
            {COMPANY_SECTOR_LABELS[member.company_sector] ?? member.company_sector}
          </span>
        )}
        {member.company_stage && (
          <span className="rounded-full border border-[var(--kv-gold)]/25 bg-[var(--kv-gold)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--kv-gold)]">
            {STARTUP_STAGE_LABELS[member.company_stage] ?? member.company_stage}
          </span>
        )}
        {member.company_mrr != null && (
          <span className="rounded-full border border-[var(--kv-teal)]/25 bg-[var(--kv-teal)]/10 px-2 py-0.5 text-[11px] font-medium text-[#5FD0C2]">
            MRR {formatCurrencyBRL(member.company_mrr)}
          </span>
        )}
        {member.city && <span className="text-[11px] text-[var(--kv-cream)]/40">{member.city}</span>}
      </div>
    </Link>
  )
}
