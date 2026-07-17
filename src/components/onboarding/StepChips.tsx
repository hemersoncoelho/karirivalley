"use client"

import { useState } from "react"

import type { ChipOption } from "@/lib/onboarding/options"
import { Chip, ErrorBanner, StepButtons } from "./fields"

interface StepChipsProps {
  options: ChipOption[]
  initial: string[]
  minRequired?: number
  requiredMessage?: string
  submitLabel?: string
  onBack: () => void
  onSubmit: (selected: string[]) => Promise<void>
}

/** Etapas de múltipla escolha (perfil, interesses, o que busca, o que oferece). */
export function StepChips({
  options,
  initial,
  minRequired = 0,
  requiredMessage = "Selecione pelo menos uma opção",
  submitLabel,
  onBack,
  onSubmit,
}: StepChipsProps) {
  const [selected, setSelected] = useState<string[]>(initial)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function toggle(value: string) {
    setError(null)
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (selected.length < minRequired) {
      setError(requiredMessage)
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(selected)
    } catch (submitError: unknown) {
      setError(submitError instanceof Error ? submitError.message : "Erro inesperado ao salvar")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => (
          <Chip
            key={option.value}
            selected={selected.includes(option.value)}
            onClick={() => toggle(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-[#F4EDDF]/45">
          {selected.length} {selected.length === 1 ? "opção selecionada" : "opções selecionadas"}
        </p>
      )}

      {error && <ErrorBanner message={error} />}

      <StepButtons
        onBack={onBack}
        submitting={submitting}
        submitLabel={submitLabel ?? (minRequired === 0 && selected.length === 0 ? "Pular" : "Continuar")}
      />
    </form>
  )
}
