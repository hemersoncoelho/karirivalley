"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { accountPasswordSchema } from "@/lib/onboarding/schemas"
import { saveDraft } from "@/lib/onboarding/draft"
import { CheckboxRow, ErrorBanner, Field, StepButtons, TextInput } from "./fields"

type AccountFormValues = z.infer<typeof accountPasswordSchema>

function translateAuthError(message: string): string {
  const normalized = message.toLowerCase()
  if (normalized.includes("already registered")) {
    return "Este e-mail já possui conta. Faça login em vez de solicitar um novo cadastro."
  }
  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Muitas tentativas em sequência. Aguarde alguns minutos e tente de novo."
  }
  if (normalized.includes("password")) {
    return "Senha não aceita. Use pelo menos 8 caracteres."
  }
  return `Não foi possível criar sua conta: ${message}`
}

export function StepAccount() {
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountPasswordSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      acceptTerms: false,
      acceptPrivacy: false,
    },
  })

  async function onSubmit(values: AccountFormValues) {
    setFormError(null)
    saveDraft({ fullName: values.fullName, email: values.email })

    const supabase = getSupabaseBrowserClient()
    const emailRedirectTo = `${window.location.origin}/cadastro`
    const metadata = {
      full_name: values.fullName,
      accepted_terms_at: new Date().toISOString(),
      accepted_privacy_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { emailRedirectTo, data: metadata },
    })

    if (error) {
      setFormError(translateAuthError(error.message))
      return
    }
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      setFormError("Este e-mail já possui conta. Faça login em vez de solicitar um novo cadastro.")
      return
    }
    if (!data.session) {
      setAwaitingConfirmation(true)
    }
    // Com sessão ativa, o wizard avança sozinho ao detectar o login.
  }

  if (awaitingConfirmation) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#239D8C]/20 text-2xl">
          ✉️
        </div>
        <h2 className="text-xl font-semibold text-[#F4EDDF]">Confira seu e-mail</h2>
        <p className="text-sm leading-relaxed text-[#F4EDDF]/60">
          Enviamos um link de confirmação para{" "}
          <strong className="text-[#E9B23C]">{getValues("email")}</strong>. Abra a mensagem e
          clique no link para continuar seu cadastro daqui mesmo.
        </p>
        <button
          type="button"
          onClick={() => setAwaitingConfirmation(false)}
          className="text-sm text-[#F4EDDF]/50 underline underline-offset-4 hover:text-[#F4EDDF]"
        >
          Usar outro e-mail
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field label="Nome completo" htmlFor="fullName" error={errors.fullName?.message}>
        <TextInput
          id="fullName"
          autoComplete="name"
          placeholder="Como você se chama?"
          {...register("fullName")}
        />
      </Field>

      <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
        <TextInput
          id="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          {...register("email")}
        />
      </Field>

      <Field
        label="Senha"
        htmlFor="password"
        error={errors.password?.message}
        hint="Mínimo de 8 caracteres"
      >
        <TextInput
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register("password")}
        />
      </Field>

      <div className="space-y-2 pt-1">
        <CheckboxRow
          id="acceptTerms"
          error={errors.acceptTerms?.message}
          label={
            <>
              Li e aceito os{" "}
              <a href="/termos" target="_blank" className="text-[#E9B23C] underline underline-offset-2">
                termos de uso
              </a>
            </>
          }
          {...register("acceptTerms")}
        />
        <CheckboxRow
          id="acceptPrivacy"
          error={errors.acceptPrivacy?.message}
          label={
            <>
              Li e aceito a{" "}
              <a href="/privacidade" target="_blank" className="text-[#E9B23C] underline underline-offset-2">
                política de privacidade
              </a>
            </>
          }
          {...register("acceptPrivacy")}
        />
      </div>

      {formError && <ErrorBanner message={formError} />}

      <StepButtons submitting={isSubmitting} submitLabel="Criar conta e continuar" />
    </form>
  )
}
