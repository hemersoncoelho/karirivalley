"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Field, TextInput, ErrorBanner, StepButtons } from "@/components/onboarding/fields"

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe sua senha"),
})

type LoginValues = z.infer<typeof loginSchema>

const STATUS_MESSAGES: Record<string, string> = {
  pending: "Seu cadastro está em análise. Você poderá acessar assim que for aprovado.",
  blocked: "Sua conta foi bloqueada. Entre em contato com a organização.",
  rejected: "Sua solicitação de cadastro não foi aprovada.",
}

function translateAuthError(message: string): string {
  const normalized = message.toLowerCase()
  if (normalized.includes("invalid login credentials")) {
    return "E-mail ou senha inválidos."
  }
  if (normalized.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar — verifique sua caixa de entrada."
  }
  return `Não foi possível entrar: ${message}`
}

export default function LoginPage() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginValues) {
    setFormError(null)
    setNotice(null)

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.auth.signInWithPassword(values)

    if (error) {
      setFormError(translateAuthError(error.message))
      return
    }
    if (!data.user) {
      setFormError("Não foi possível entrar. Tente novamente.")
      return
    }

    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("status")
      .eq("profile_id", data.user.id)
      .maybeSingle()

    if (memberError) {
      setFormError(`Não foi possível verificar seu cadastro: ${memberError.message}`)
      return
    }

    if (!member) {
      setNotice(
        "Não encontramos uma solicitação de cadastro para esta conta. Entre em contato com a organização."
      )
      return
    }

    if (member.status !== "approved") {
      setNotice(STATUS_MESSAGES[member.status] ?? "Seu acesso ainda não está liberado.")
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24" style={{ background: "#2C2221" }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[2.5px] text-[#E9B23C] uppercase">Kariri Valley</p>
          <h1 className="mt-3 text-2xl font-semibold text-[#F4EDDF]">Entrar na comunidade</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              {...register("email")}
            />
          </Field>

          <Field label="Senha" htmlFor="password" error={errors.password?.message}>
            <TextInput
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
            />
          </Field>

          {notice && (
            <p className="rounded-xl border border-[#E9B23C]/30 bg-[#E9B23C]/10 px-4 py-3 text-sm text-[#E9B23C]">
              {notice}
            </p>
          )}
          {formError && <ErrorBanner message={formError} />}

          <StepButtons submitting={isSubmitting} submitLabel="Entrar" />
        </form>

        <p className="mt-6 text-center text-sm text-[#F4EDDF]/50">
          Não é membro ainda?{" "}
          <Link href="/como-participar" className="text-[#E9B23C] underline underline-offset-4">
            Solicitar acesso
          </Link>
        </p>
      </div>
    </main>
  )
}
