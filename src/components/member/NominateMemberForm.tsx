"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { COMMUNITY_PROFILES } from "@/lib/onboarding/options"
import { Field, TextInput, TextArea, SelectInput, ErrorBanner, StepButtons } from "@/components/onboarding/fields"

const nominateSchema = z.object({
  fullName: z.string().trim().min(3, "Informe o nome completo (mínimo 3 letras)").max(120),
  email: z.email("Informe um e-mail válido"),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  occupationArea: z.string().min(1, "Selecione uma área de atuação"),
  motivation: z.string().trim().max(500, "Máximo de 500 caracteres").optional().or(z.literal("")),
})

type NominateValues = z.infer<typeof nominateSchema>

interface NominateMemberFormProps {
  nominatorId: string
}

export function NominateMemberForm({ nominatorId }: NominateMemberFormProps) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NominateValues>({
    resolver: zodResolver(nominateSchema),
    defaultValues: { fullName: "", email: "", city: "", occupationArea: "", motivation: "" },
  })

  async function onSubmit(values: NominateValues) {
    setFormError(null)
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.from("members").insert({
      full_name: values.fullName,
      email: values.email,
      city: values.city,
      occupation_areas: [values.occupationArea],
      motivation: values.motivation || null,
      nominated_by: nominatorId,
      status: "pending",
    })

    if (error) {
      if (error.code === "23505") {
        setFormError("Já existe uma solicitação de cadastro com este e-mail.")
        return
      }
      setFormError(`Não foi possível enviar a indicação: ${error.message}`)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-[#239D8C]/30 bg-[#239D8C]/10 p-6 text-center">
        <p className="text-sm font-semibold text-[#5FD0C2]">Indicação enviada com sucesso!</p>
        <p className="mt-1 text-sm text-[#F4EDDF]/60">Nossa equipe vai analisar e entrar em contato por e-mail.</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-4 rounded-xl border border-white/15 px-5 py-2 text-sm font-medium text-[#F4EDDF]/80 hover:bg-white/5"
        >
          Voltar ao dashboard
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field label="Nome completo" htmlFor="fullName" error={errors.fullName?.message}>
        <TextInput id="fullName" {...register("fullName")} />
      </Field>
      <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
        <TextInput id="email" type="email" {...register("email")} />
      </Field>
      <Field label="Cidade" htmlFor="city" error={errors.city?.message}>
        <TextInput id="city" {...register("city")} />
      </Field>
      <Field label="Área de atuação" htmlFor="occupationArea" error={errors.occupationArea?.message}>
        <SelectInput id="occupationArea" {...register("occupationArea")}>
          <option value="">Selecionar</option>
          {COMMUNITY_PROFILES.map((profile) => (
            <option key={profile.value} value={profile.value}>
              {profile.label}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Por que essa pessoa deveria participar" htmlFor="motivation" optional error={errors.motivation?.message}>
        <TextArea id="motivation" {...register("motivation")} />
      </Field>

      {formError && <ErrorBanner message={formError} />}

      <StepButtons submitting={isSubmitting} submitLabel="Enviar indicação" />
    </form>
  )
}
