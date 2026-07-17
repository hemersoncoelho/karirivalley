import type { BasicsData } from "./schemas"
import type { VisibilityData } from "./api"

/** Rascunho local do onboarding — o usuário não perde dados ao navegar/voltar. */
export interface OnboardingDraft {
  step?: number
  fullName?: string
  email?: string
  basics?: Partial<BasicsData>
  photoUrl?: string
  profiles?: string[]
  interests?: string[]
  needs?: string[]
  offers?: string[]
  visibility?: Partial<VisibilityData>
}

const DRAFT_KEY = "kv-onboarding-draft-v1"

export function loadDraft(): OnboardingDraft {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as OnboardingDraft) : {}
  } catch {
    return {}
  }
}

export function saveDraft(patch: Partial<OnboardingDraft>): OnboardingDraft {
  const merged = { ...loadDraft(), ...patch }
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(merged))
  } catch {
    // armazenamento indisponível (modo privado etc.) — segue sem persistir
  }
  return merged
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_KEY)
  } catch {
    // sem acesso ao storage — nada a limpar
  }
}
