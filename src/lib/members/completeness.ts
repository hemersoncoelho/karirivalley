import type { MemberRecord } from "@/lib/onboarding/api"
import type { ProfileBundle } from "@/lib/members/profile-bundle"

interface CompletenessInput {
  member: Pick<MemberRecord, "photo_url" | "bio" | "company" | "position">
  bundle: Pick<ProfileBundle, "interestIds" | "needs" | "offers" | "socialLinks">
}

export interface CompletenessResult {
  percent: number
  nextStepLabel: string | null
}

const CHECKS: { weight: number; label: string; test: (input: CompletenessInput) => boolean }[] = [
  { weight: 20, label: "Adicione uma foto de perfil", test: ({ member }) => Boolean(member.photo_url) },
  { weight: 20, label: "Escreva uma bio curta", test: ({ member }) => Boolean(member.bio?.trim()) },
  {
    weight: 15,
    label: "Informe empresa/instituição e cargo",
    test: ({ member }) => Boolean(member.company?.trim() || member.position?.trim()),
  },
  {
    weight: 15,
    label: "Escolha seus temas de interesse",
    test: ({ bundle }) => bundle.interestIds.length > 0,
  },
  {
    weight: 15,
    label: "Conte o que você busca ou oferece",
    test: ({ bundle }) => bundle.needs.length > 0 || bundle.offers.length > 0,
  },
  {
    weight: 15,
    label: "Adicione uma rede social",
    test: ({ bundle }) => bundle.socialLinks.length > 0,
  },
]

/** Percentual de completude do perfil + próximo campo sugerido para o membro preencher. */
export function computeProfileCompleteness(input: CompletenessInput): CompletenessResult {
  let percent = 0
  let nextStepLabel: string | null = null

  for (const check of CHECKS) {
    if (check.test(input)) {
      percent += check.weight
    } else if (!nextStepLabel) {
      nextStepLabel = check.label
    }
  }

  return { percent: Math.min(percent, 100), nextStepLabel }
}
