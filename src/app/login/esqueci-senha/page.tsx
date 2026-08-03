"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Field, TextInput, ErrorBanner, StepButtons } from "@/components/onboarding/fields"

const forgotPasswordSchema = z.object({
  email: z.email("Informe um e-mail válido"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    setFormError(null)

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/login/redefinir-senha`,
    })

    if (error) {
      setFormError(`Não foi possível enviar o e-mail de recuperação: ${error.message}`)
      return
    }

    setSentTo(values.email)
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24" style={{ background: "#2C2221" }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[2.5px] text-[#E9B23C] uppercase">Kariri Valley</p>
          <h1 className="mt-3 text-2xl font-semibold text-[#F4EDDF]">Recuperar senha</h1>
        </div>

        {sentTo ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#239D8C]/20 text-2xl">
              ✉️
            </div>
            <p className="text-sm leading-relaxed text-[#F4EDDF]/60">
              Se existir uma conta para <strong className="text-[#E9B23C]">{sentTo}</strong>, enviamos um link para
              redefinir a senha. Confira sua caixa de entrada.
            </p>
            <Link
              href="/login"
              className="text-sm text-[#F4EDDF]/50 underline underline-offset-4 hover:text-[#F4EDDF]"
            >
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <p className="text-sm text-[#F4EDDF]/60">
              Informe o e-mail usado no cadastro. Vamos enviar um link para você criar uma nova senha.
            </p>

            <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
              <TextInput
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                {...register("email")}
              />
            </Field>

            {formError && <ErrorBanner message={formError} />}

            <StepButtons submitting={isSubmitting} submitLabel="Enviar link de recuperação" />

            <p className="text-center text-sm text-[#F4EDDF]/50">
              <Link href="/login" className="text-[#E9B23C] underline underline-offset-4">
                Voltar para o login
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
