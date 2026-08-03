"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Field, TextInput, ErrorBanner, StepButtons } from "@/components/onboarding/fields"

const newPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres").max(72, "Senha muito longa"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type NewPasswordValues = z.infer<typeof newPasswordSchema>

type Status = "loading" | "ready" | "invalid" | "done"

const LINK_WAIT_MS = 4000

export default function ResetPasswordPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("loading")
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus((current) => (current === "loading" ? "ready" : current))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setStatus("ready")
      }
    })

    const timeout = setTimeout(() => {
      setStatus((current) => (current === "loading" ? "invalid" : current))
    }, LINK_WAIT_MS)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  async function onSubmit(values: NewPasswordValues) {
    setFormError(null)

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.updateUser({ password: values.password })

    if (error) {
      setFormError(`Não foi possível salvar a nova senha: ${error.message}`)
      return
    }

    await supabase.auth.signOut()
    setStatus("done")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24" style={{ background: "#2C2221" }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[2.5px] text-[#E9B23C] uppercase">Kariri Valley</p>
          <h1 className="mt-3 text-2xl font-semibold text-[#F4EDDF]">Definir nova senha</h1>
        </div>

        {status === "loading" && (
          <p className="text-center text-sm text-[#F4EDDF]/40">Verificando seu link…</p>
        )}

        {status === "invalid" && (
          <div className="space-y-4 text-center">
            <p className="text-sm leading-relaxed text-[#F4EDDF]/60">
              Este link de recuperação é inválido ou expirou. Solicite um novo link para redefinir sua senha.
            </p>
            <a
              href="/login/esqueci-senha"
              className="text-sm text-[#E9B23C] underline underline-offset-4"
            >
              Pedir novo link
            </a>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-4 text-center">
            <p className="text-sm leading-relaxed text-[#F4EDDF]/60">
              Senha atualizada com sucesso. Entre com sua nova senha para continuar.
            </p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="rounded-xl bg-[#E9B23C] px-7 py-3 text-sm font-semibold text-[#2C2221] transition hover:bg-[#f0c05a]"
            >
              Ir para o login
            </button>
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Field
              label="Nova senha"
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

            <Field label="Confirmar senha" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
              <TextInput
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
            </Field>

            {formError && <ErrorBanner message={formError} />}

            <StepButtons submitting={isSubmitting} submitLabel="Salvar nova senha" />
          </form>
        )}
      </div>
    </main>
  )
}
