"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"

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
  // Draft data stays behind the loading view until the session is ready, so the
  // browser can initialize it without changing the server's hydration markup.
  const [initialDraft] = useState(loadDraft)
  const resolvedAccountRef = useRef<string | null>(null)
  const [ready, setReady] = useState(false)
  const [initializationError, setInitializationError] = useState(false)
  const [initializationAttempt, setInitializationAttempt] = useState(0)
  const [retryingInitialization, setRetryingInitialization] = useState(false)
  const [draftResetForAccount, setDraftResetForAccount] = useState(false)
  const [step, setStep] = useState(initialDraft.step ?? 1)
  const [userId, setUserId] = useState<string | null>(null)
  const [memberId, setMemberId] = useState<string | null>(null)
  const [fullName, setFullName] = useState(initialDraft.fullName ?? "")
  const [email, setEmail] = useState(initialDraft.email ?? "")
  const [basics, setBasics] = useState<Partial<BasicsData>>(initialDraft.basics ?? {})
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialDraft.photoUrl ?? null)
  const [profiles, setProfiles] = useState<string[]>(initialDraft.profiles ?? [])
  const [interests, setInterests] = useState<string[]>(initialDraft.interests ?? [])
  const [needs, setNeeds] = useState<string[]>(initialDraft.needs ?? [])
  const [offers, setOffers] = useState<string[]>(initialDraft.offers ?? [])
  const [visibility, setVisibility] = useState<Partial<VisibilityData>>(initialDraft.visibility ?? {})
  const [interestOptions, setInterestOptions] = useState<ChipOption[]>([])

  const advanceFromSession = useCallback(
    async (sessionUserId: string, sessionEmail: string | null, sessionFullName: string | null, isCurrent: () => boolean) => {
      const member = await fetchMyMember(sessionUserId)
      if (!isCurrent()) return
      const draft = loadDraft()
      const accountEmail = sessionEmail?.trim() ?? ""
      const draftMatchesAccount = accountEmail !== "" &&
        draft.email?.trim().toLowerCase() === accountEmail.toLowerCase()
      const initialDraftMatchesAccount = accountEmail !== "" &&
        initialDraft.email?.trim().toLowerCase() === accountEmail.toLowerCase()
      const restoringSameAccount = resolvedAccountRef.current === sessionUserId
      const accountDraft: OnboardingDraft = draftMatchesAccount && initialDraftMatchesAccount ? draft : {}
      const accountFullName = member ? member.full_name : sessionFullName?.trim() ||
        (draftMatchesAccount ? draft.fullName?.trim() ?? "" : "")
      const incompatibleDraft = !restoringSameAccount && (
        (Object.keys(initialDraft).length > 0 && !initialDraftMatchesAccount) ||
        (Object.keys(draft).length > 0 && !draftMatchesAccount)
      )

      if (incompatibleDraft) {
        // StepAccount merges identity into the draft; remove previous-account
        // fields only after the new session has been successfully resolved.
        clearDraft()
        saveDraft({ fullName: accountFullName, email: member?.email ?? accountEmail, step: member ? 3 : 2 })
        setDraftResetForAccount(true)
      }

      setUserId(sessionUserId)
      setMemberId(member?.id ?? null)
      if (!restoringSameAccount) {
        setInterests(accountDraft.interests ?? [])
        setNeeds(accountDraft.needs ?? [])
        setOffers(accountDraft.offers ?? [])
        setVisibility(accountDraft.visibility ?? {})
      }
      if (member) {
        setFullName(member.full_name)
        setEmail(member.email)
        setBasics((current) => ({ ...basicsFromMember(member), ...(restoringSameAccount ? current : accountDraft.basics ?? {}) }))
        setPhotoUrl((current) => (restoringSameAccount ? current : accountDraft.photoUrl) ?? member.photo_url)
        setProfiles((current) => {
          const accountProfiles = restoringSameAccount ? current : accountDraft.profiles ?? []
          return accountProfiles.length > 0 ? accountProfiles : member.occupation_areas ?? []
        })
        setStep((current) => Math.max(3, restoringSameAccount ? current : 1, accountDraft.step ?? 1))
      } else {
        setEmail(accountEmail)
        setFullName((current) => accountFullName || (restoringSameAccount ? current : ""))
        if (!restoringSameAccount) {
          setBasics(accountDraft.basics ?? {})
          setPhotoUrl(accountDraft.photoUrl ?? null)
          setProfiles(accountDraft.profiles ?? [])
        }
        // Later steps require the member record created by saving step two.
        setStep(2)
      }
      resolvedAccountRef.current = sessionUserId
    },
    [initialDraft]
  )

  useEffect(() => {
    let cancelled = false
    let requestSequence = 0
    let timeout: ReturnType<typeof setTimeout> | undefined
    let unsubscribe = () => {}

    function beginRequest() {
      const request = ++requestSequence
      const isCurrent = () => !cancelled && request === requestSequence
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (!isCurrent()) return
        requestSequence += 1
        setInitializationError(true)
        setRetryingInitialization(false)
        setReady(false)
      }, 15_000)
      return isCurrent
    }

    function finishRequest(isCurrent: () => boolean, unavailable = false) {
      if (!isCurrent()) return
      clearTimeout(timeout)
      setInitializationError(unavailable)
      setRetryingInitialization(false)
      setReady(!unavailable)
    }

    async function init() {
      const isCurrent = beginRequest()
      try {
        const supabase = getSupabaseBrowserClient()
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event !== "SIGNED_IN" || !session?.user || cancelled) return
          const user = session.user
          const isCurrentSession = beginRequest()
          void advanceFromSession(
            user.id,
            user.email ?? null,
            (user.user_metadata?.full_name as string | undefined) ?? null,
            isCurrentSession
          ).then(
            () => finishRequest(isCurrentSession),
            () => finishRequest(isCurrentSession, true)
          )
        })
        unsubscribe = () => subscription.unsubscribe()

        const { data, error } = await supabase.auth.getSession()
        if (!isCurrent()) return
        if (error) throw error
        if (data.session?.user) {
          const user = data.session.user
          await advanceFromSession(
            user.id,
            user.email ?? null,
            (user.user_metadata?.full_name as string | undefined) ?? null,
            isCurrent
          )
        } else {
          resolvedAccountRef.current = null
          setUserId(null)
          setMemberId(null)
          setStep(1)
        }
        finishRequest(isCurrent)
      } catch {
        finishRequest(isCurrent, true)
      }
    }
    void init()

    return () => {
      cancelled = true
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [advanceFromSession, initializationAttempt])

  useEffect(() => {
    if (!ready || step !== 4 || interestOptions.length > 0) return
    let cancelled = false
    fetchInterests()
      .then((items) => {
        if (!cancelled) setInterestOptions(items.map((item) => ({ value: item.id, label: item.name })))
      })
      .catch(() => {
        if (!cancelled) setInterestOptions([])
      })
    return () => { cancelled = true }
  }, [ready, step, interestOptions.length])

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

  if (initializationError) {
    return (
      <div aria-busy={retryingInitialization} className="space-y-6 rounded-2xl border border-white/15 bg-white/[0.03] p-6 sm:p-8">
        <div role="alert">
          <h1 className="m-0 text-2xl font-semibold leading-tight text-[var(--kv-cream)]">Não conseguimos abrir o cadastro agora</h1>
          <p className="mb-0 mt-4 text-sm leading-7 text-[var(--kv-cream)]/75">Tente novamente em instantes. Se você já tinha um rascunho salvo neste navegador, ele será mantido.</p>
        </div>
        <button
          type="button"
          disabled={retryingInitialization}
          aria-busy={retryingInitialization}
          onClick={() => {
            setReady(false)
            setRetryingInitialization(true)
            setInitializationAttempt((attempt) => attempt + 1)
          }}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-[var(--kv-gold)] px-4 text-sm font-semibold text-[var(--kv-dark)] transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-65 sm:w-[190px]"
        >
          {retryingInitialization ? "Tentando novamente…" : "Tentar novamente"}
        </button>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--kv-cream)]/85">
          <Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">Voltar ao início</Link>
          <Link href="/galeria" className="inline-flex min-h-11 items-center underline underline-offset-4">Conhecer a galeria</Link>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div role="status" className="flex justify-center py-16">
        <p className="text-sm text-[var(--kv-cream)]/75">Preparando seu cadastro…</p>
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
      <h1 className="text-center text-2xl font-semibold text-[var(--kv-cream)]">
        {STEP_TITLES[step - 1]}
      </h1>

      {draftResetForAccount && (
        <p role="status" className="rounded-xl border border-white/15 p-4 text-sm leading-6 text-[var(--kv-cream)]/80">
          O rascunho anterior não pôde ser vinculado a esta conta. Continue o cadastro com seus dados.
        </p>
      )}

      {userId && (
        <p className="text-center text-xs text-[var(--kv-cream)]/40">
          Continuando como <strong className="text-[var(--kv-cream)]/70">{email}</strong> —{" "}
          <button
            type="button"
            onClick={handleSignOut}
            className="underline underline-offset-2 hover:text-[var(--kv-cream)]"
          >
            não é você? Sair
          </button>
        </p>
      )}

      <div>
        <div className="mb-3 text-xs text-[var(--kv-cream)]/45">
          Passo {step} de {TOTAL_STEPS}
        </div>
        <div className="flex gap-1.5">
          {STEP_TITLES.map((title, i) => (
            <div
              key={title}
              className="h-1 flex-1 rounded-full"
              style={{ background: i < step ? "var(--kv-gold)" : "rgba(255,255,255,.1)" }}
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
