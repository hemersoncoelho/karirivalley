"use client"

import { useCallback, useEffect, useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  fetchInterests,
  fetchMyMember,
  saveBasics,
  saveCommunityProfiles,
  saveVisibility,
  syncInterests,
  syncSelections,
  uploadMemberPhoto,
  type MemberRecord,
  type VisibilityData,
} from "@/lib/onboarding/api"
import { clearDraft, loadDraft, saveDraft, type OnboardingDraft } from "@/lib/onboarding/draft"
import {
  COMMUNITY_PROFILES,
  NEED_OPTIONS,
  OFFER_OPTIONS,
  STEP_TITLES,
  TOTAL_STEPS,
  type ChipOption,
} from "@/lib/onboarding/options"
import type { BasicsData } from "@/lib/onboarding/schemas"
import { StepAccount } from "./StepAccount"
import { StepBasics } from "./StepBasics"
import { StepChips } from "./StepChips"
import { StepSuccess } from "./StepSuccess"
import { StepVisibility } from "./StepVisibility"

function basicsFromMember(member: MemberRecord): Partial<BasicsData> {
  return {
    displayName: member.display_name ?? "",
    city: member.city,
    state: member.state ?? "CE",
    bio: member.bio ?? "",
    company: member.company ?? "",
    position: member.position ?? "",
    whatsapp: member.phone ?? "",
  }
}

export function OnboardingWizard() {
  const [ready, setReady] = useState(false)
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [memberId, setMemberId] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [basics, setBasics] = useState<Partial<BasicsData>>({})
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [needs, setNeeds] = useState<string[]>([])
  const [offers, setOffers] = useState<string[]>([])
  const [visibility, setVisibility] = useState<Partial<VisibilityData>>({})
  const [interestOptions, setInterestOptions] = useState<ChipOption[]>([])

  const advanceFromSession = useCallback(
    async (sessionUserId: string, sessionEmail: string | null, sessionFullName: string | null) => {
      setUserId(sessionUserId)
      const member = await fetchMyMember(sessionUserId)
      const draft = loadDraft()

      let minimumStep = 2
      setFullName((current) => current || draft.fullName || sessionFullName || "")
      if (member) {
        minimumStep = 3
        setMemberId(member.id)
        setFullName(member.full_name)
        setEmail(member.email)
        setBasics((current) => ({ ...basicsFromMember(member), ...current }))
        setPhotoUrl((current) => current ?? member.photo_url)
        setProfiles((current) => (current.length > 0 ? current : member.occupation_areas ?? []))
      } else {
        setEmail((current) => current || sessionEmail || "")
      }

      setStep((current) => Math.max(current, minimumStep, draft.step ?? 1))
    },
    []
  )

  useEffect(() => {
    const draft = loadDraft()
    setStep(draft.step ?? 1)
    setFullName(draft.fullName ?? "")
    setEmail(draft.email ?? "")
    setBasics(draft.basics ?? {})
    setPhotoUrl(draft.photoUrl ?? null)
    setProfiles(draft.profiles ?? [])
    setInterests(draft.interests ?? [])
    setNeeds(draft.needs ?? [])
    setOffers(draft.offers ?? [])
    setVisibility(draft.visibility ?? {})

    const supabase = getSupabaseBrowserClient()

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        const user = data.session.user
        await advanceFromSession(
          user.id,
          user.email ?? null,
          (user.user_metadata?.full_name as string | undefined) ?? null
        )
      }
      setReady(true)
    }
    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user
        void advanceFromSession(
          user.id,
          user.email ?? null,
          (user.user_metadata?.full_name as string | undefined) ?? null
        )
      }
    })

    return () => subscription.unsubscribe()
  }, [advanceFromSession])

  useEffect(() => {
    if (step !== 4 || interestOptions.length > 0) return
    fetchInterests()
      .then((items) => setInterestOptions(items.map((item) => ({ value: item.id, label: item.name }))))
      .catch(() => setInterestOptions([]))
  }, [step, interestOptions.length])

  function goTo(next: number, patch?: Partial<OnboardingDraft>) {
    saveDraft({ ...patch, step: next })
    setStep(next)
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    clearDraft()
    window.location.reload()
  }

  if (!ready) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-[#F4EDDF]/40">Carregando…</p>
      </div>
    )
  }

  if (step > TOTAL_STEPS) {
    return (
      <StepSuccess
        title="Sua solicitação está em análise"
        message="Recebemos seu cadastro. Nossa equipe analisa cada solicitação manualmente — você recebe um e-mail assim que ela for aprovada."
      />
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-center text-2xl font-semibold text-[#F4EDDF]">
        {STEP_TITLES[step - 1]}
      </h1>

      {userId && (
        <p className="text-center text-xs text-[#F4EDDF]/40">
          Continuando como <strong className="text-[#F4EDDF]/70">{email}</strong> —{" "}
          <button
            type="button"
            onClick={handleSignOut}
            className="underline underline-offset-2 hover:text-[#F4EDDF]"
          >
            não é você? Sair
          </button>
        </p>
      )}

      <div>
        <div className="mb-3 text-xs text-[#F4EDDF]/45">
          Passo {step} de {TOTAL_STEPS}
        </div>
        <div className="flex gap-1.5">
          {STEP_TITLES.map((title, i) => (
            <div
              key={title}
              className="h-1 flex-1 rounded-full"
              style={{ background: i < step ? "#E9B23C" : "rgba(255,255,255,.1)" }}
            />
          ))}
        </div>
      </div>

      {step === 1 && <StepAccount />}

      {step === 2 && (
        <StepBasics
          defaultValues={basics}
          initialPhotoUrl={photoUrl}
          onSubmit={async (data, photoFile) => {
            if (!userId) throw new Error("Sessão expirada — recarregue a página e entre novamente")

            const uploadedPhotoUrl = photoFile ? await uploadMemberPhoto(userId, photoFile) : photoUrl
            const member = await saveBasics({
              userId,
              email,
              fullName,
              basics: data,
              photoUrl: uploadedPhotoUrl,
              existingMemberId: memberId,
            })

            setMemberId(member.id)
            setBasics(data)
            setPhotoUrl(uploadedPhotoUrl)
            goTo(3, { basics: data, photoUrl: uploadedPhotoUrl ?? undefined })
          }}
        />
      )}

      {step === 3 && (
        <StepChips
          options={COMMUNITY_PROFILES}
          initial={profiles}
          minRequired={1}
          onBack={() => goTo(2)}
          onSubmit={async (selected) => {
            if (!memberId) throw new Error("Sessão expirada — recarregue a página e entre novamente")
            await saveCommunityProfiles(memberId, selected)
            setProfiles(selected)
            goTo(4, { profiles: selected })
          }}
        />
      )}

      {step === 4 && (
        <StepChips
          options={interestOptions}
          initial={interests}
          onBack={() => goTo(3)}
          onSubmit={async (selected) => {
            if (!memberId) throw new Error("Sessão expirada — recarregue a página e entre novamente")
            await syncInterests(memberId, selected)
            setInterests(selected)
            goTo(5, { interests: selected })
          }}
        />
      )}

      {step === 5 && (
        <StepChips
          options={NEED_OPTIONS.map((value) => ({ value, label: value }))}
          initial={needs}
          onBack={() => goTo(4)}
          onSubmit={async (selected) => {
            if (!memberId) throw new Error("Sessão expirada — recarregue a página e entre novamente")
            await syncSelections("member_needs", memberId, selected)
            setNeeds(selected)
            goTo(6, { needs: selected })
          }}
        />
      )}

      {step === 6 && (
        <StepChips
          options={OFFER_OPTIONS.map((value) => ({ value, label: value }))}
          initial={offers}
          onBack={() => goTo(5)}
          onSubmit={async (selected) => {
            if (!memberId) throw new Error("Sessão expirada — recarregue a página e entre novamente")
            await syncSelections("member_offers", memberId, selected)
            setOffers(selected)
            goTo(7, { offers: selected })
          }}
        />
      )}

      {step === 7 && (
        <StepVisibility
          initial={visibility}
          hasWhatsapp={Boolean(basics.whatsapp)}
          onBack={() => goTo(6)}
          onSubmit={async (data) => {
            if (!memberId) throw new Error("Sessão expirada — recarregue a página e entre novamente")
            await saveVisibility(memberId, data)
            setVisibility(data)
            clearDraft()
            setStep(TOTAL_STEPS + 1)
          }}
        />
      )}
    </div>
  )
}
