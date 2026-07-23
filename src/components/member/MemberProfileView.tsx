import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Briefcase, Camera, Code2, Globe, Mail, Phone, UserCircle2 } from "lucide-react"

import type { DirectoryMember } from "@/lib/members/directory"
import { OCCUPATION_LABELS } from "@/components/member/occupation-labels"
import { STARTUP_STAGE_LABELS } from "@/lib/onboarding/options"

const SOCIAL_ICONS: Record<string, typeof Globe> = {
  linkedin: Briefcase,
  github: Code2,
  instagram: Camera,
  website: Globe,
}

interface MemberProfileViewProps {
  member: DirectoryMember
  showBackLink?: boolean
}

function formatMemberSince(value: string | null): string | null {
  if (!value) return null
  return new Intl.DateTimeFormat("pt-BR", { year: "numeric" }).format(new Date(value))
}

export function MemberProfileView({ member, showBackLink = true }: MemberProfileViewProps) {
  const memberSince = formatMemberSince(member.member_since)

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-start gap-5">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            width={88}
            height={88}
            className="size-22 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-22 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <UserCircle2 size={40} strokeWidth={1.4} className="text-[#F4EDDF]/40" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold text-[#F4EDDF]">{member.name}</h1>
          {(member.position || member.company) && (
            <p className="mt-1 text-sm text-[#F4EDDF]/60">
              {[member.position, member.company].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="mt-1 text-sm text-[#F4EDDF]/45">
            {[member.city, memberSince && `Membro desde ${memberSince}`].filter(Boolean).join(" · ")}
          </p>
          {member.social_links.length > 0 && (
            <div className="mt-3 flex gap-2">
              {member.social_links.map((link) => {
                const Icon = SOCIAL_ICONS[link.platform] ?? Globe
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-8 items-center justify-center rounded-full border border-white/12 text-[#F4EDDF]/70 transition hover:border-white/25 hover:text-[#F4EDDF]"
                  >
                    <Icon size={14} />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {member.bio && (
        <section>
          <h2 className="text-sm font-semibold text-[#F4EDDF]/85">Sobre</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#F4EDDF]/60">{member.bio}</p>
        </section>
      )}

      {member.occupation_areas.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[#F4EDDF]/85">Áreas de atuação</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {member.occupation_areas.map((area) => (
              <span key={area} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#F4EDDF]/65">
                {OCCUPATION_LABELS[area] ?? area}
              </span>
            ))}
          </div>
        </section>
      )}

      {member.startup_name && (
        <section>
          <h2 className="text-sm font-semibold text-[#F4EDDF]/85">Startup</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-[#F4EDDF]/60">
            {member.startup_name}
            {member.startup_stage && (
              <span className="rounded-full border border-[#E9B23C]/25 bg-[#E9B23C]/10 px-2.5 py-0.5 text-xs font-medium text-[#E9B23C]">
                {STARTUP_STAGE_LABELS[member.startup_stage] ?? member.startup_stage}
              </span>
            )}
          </p>
        </section>
      )}

      {member.interest_slugs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[#F4EDDF]/85">Interesses</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {member.interest_slugs.map((slug) => (
              <span
                key={slug}
                className="rounded-full border border-[#239D8C]/25 bg-[#239D8C]/10 px-3 py-1 text-xs text-[#5FD0C2]"
              >
                {slug.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </section>
      )}

      {(member.need_titles.length > 0 || member.offer_titles.length > 0) && (
        <div className="grid gap-6 sm:grid-cols-2">
          {member.need_titles.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-[#F4EDDF]/85">O que busca</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-[#F4EDDF]/60">
                {member.need_titles.map((title) => (
                  <li key={title}>• {title}</li>
                ))}
              </ul>
            </section>
          )}
          {member.offer_titles.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-[#F4EDDF]/85">O que oferece</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-[#F4EDDF]/60">
                {member.offer_titles.map((title) => (
                  <li key={title}>• {title}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {(member.email || member.phone) && (
        <section>
          <h2 className="text-sm font-semibold text-[#F4EDDF]/85">Contato</h2>
          <div className="mt-2 space-y-1.5 text-sm text-[#F4EDDF]/60">
            {member.email && (
              <p className="flex items-center gap-2">
                <Mail size={14} /> {member.email}
              </p>
            )}
            {member.phone && (
              <p className="flex items-center gap-2">
                <Phone size={14} /> {member.phone}
              </p>
            )}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between border-t border-white/8 pt-6">
        {showBackLink ? (
          <Link href="/comunidade" className="inline-flex items-center gap-2 text-sm text-[#F4EDDF]/50 hover:text-[#F4EDDF]">
            <ArrowLeft size={14} /> Voltar ao diretório
          </Link>
        ) : (
          <span />
        )}
        <button
          type="button"
          disabled
          title="Em breve"
          className="cursor-not-allowed rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-[#F4EDDF]/35"
        >
          Solicitar conexão (em breve)
        </button>
      </div>
    </div>
  )
}
