"use client"

import { useState } from "react"

import type { VisibilityData } from "@/lib/onboarding/api"
import { cn } from "@/lib/utils"
import { ErrorBanner, Field, StepButtons, TextInput, ToggleRow } from "./fields"

interface StepVisibilityProps {
  initial: Partial<VisibilityData>
  hasWhatsapp: boolean
  onBack: () => void
  onSubmit: (data: VisibilityData) => Promise<void>
}

const DEFAULTS: VisibilityData = {
  isPublic: true,
  showEmail: false,
  showWhatsapp: false,
  showCity: true,
  showCompany: true,
  linkedin: "",
  instagram: "",
}

export function StepVisibility({ initial, hasWhatsapp, onBack, onSubmit }: StepVisibilityProps) {
  const [values, setValues] = useState<VisibilityData>({ ...DEFAULTS, ...initial })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update(patch: Partial<VisibilityData>) {
    setValues((current) => ({ ...current, ...patch }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(values)
    } catch (submitError: unknown) {
      setError(submitError instanceof Error ? submitError.message : "Erro inesperado ao salvar")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            [true, "Perfil público", "Aparece no diretório para qualquer visitante"],
            [false, "Apenas membros", "Visível somente para membros aprovados"],
          ] as [boolean, string, string][]
        ).map(([isPublic, title, description]) => (
          <button
            key={String(isPublic)}
            type="button"
            onClick={() => update({ isPublic })}
            className={cn(
              "rounded-2xl border p-4 text-left transition",
              values.isPublic === isPublic
                ? "border-[#E9B23C] bg-[#E9B23C]/10"
                : "border-white/10 bg-white/[0.03] hover:border-white/25"
            )}
          >
            <p className="text-sm font-semibold text-[#F4EDDF]">{title}</p>
            <p className="mt-1 text-xs text-[#F4EDDF]/50">{description}</p>
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-medium text-[#F4EDDF]/80">O que mostrar no seu perfil</p>
        <ToggleRow
          label="Mostrar e-mail"
          description="Privado por padrão"
          checked={values.showEmail}
          onChange={(showEmail) => update({ showEmail })}
        />
        <ToggleRow
          label="Mostrar WhatsApp"
          description={hasWhatsapp ? "Privado por padrão" : "Informe seu WhatsApp na etapa 2 para liberar"}
          checked={values.showWhatsapp && hasWhatsapp}
          onChange={(showWhatsapp) => update({ showWhatsapp })}
          disabled={!hasWhatsapp}
        />
        <ToggleRow
          label="Mostrar cidade"
          checked={values.showCity}
          onChange={(showCity) => update({ showCity })}
        />
        <ToggleRow
          label="Mostrar empresa/instituição"
          checked={values.showCompany}
          onChange={(showCompany) => update({ showCompany })}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-[#F4EDDF]/80">
          Redes sociais <span className="font-normal text-[#F4EDDF]/40">— deixe em branco para não mostrar</span>
        </p>
        <Field label="LinkedIn" htmlFor="linkedin" optional>
          <TextInput
            id="linkedin"
            type="url"
            placeholder="linkedin.com/in/seu-perfil"
            value={values.linkedin}
            onChange={(event) => update({ linkedin: event.target.value })}
          />
        </Field>
        <Field label="Instagram" htmlFor="instagram" optional>
          <TextInput
            id="instagram"
            placeholder="@seuperfil"
            value={values.instagram}
            onChange={(event) => update({ instagram: event.target.value })}
          />
        </Field>
      </div>

      {error && <ErrorBanner message={error} />}

      <StepButtons onBack={onBack} submitting={submitting} submitLabel="Concluir cadastro" />
    </form>
  )
}
