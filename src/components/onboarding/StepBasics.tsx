"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  basicsSchema,
  validatePhotoFile,
  type BasicsData,
} from "@/lib/onboarding/schemas"
import { BRAZIL_STATES } from "@/lib/onboarding/options"
import {
  ErrorBanner,
  Field,
  SelectInput,
  StepButtons,
  TextArea,
  TextInput,
} from "./fields"

interface StepBasicsProps {
  defaultValues: Partial<BasicsData>
  initialPhotoUrl: string | null
  onSubmit: (data: BasicsData, photoFile: File | null) => Promise<void>
  onBack?: () => void
}

export function StepBasics({ defaultValues, initialPhotoUrl, onSubmit, onBack }: StepBasicsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhotoUrl)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BasicsData>({
    resolver: zodResolver(basicsSchema),
    defaultValues: {
      displayName: "",
      city: "",
      state: "CE",
      bio: "",
      company: "",
      position: "",
      whatsapp: "",
      ...defaultValues,
    },
  })

  const bioLength = (watch("bio") ?? "").length

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validatePhotoFile(file)
    if (validationError) {
      setPhotoError(validationError)
      event.target.value = ""
      return
    }

    setPhotoError(null)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function submit(data: BasicsData) {
    setFormError(null)
    try {
      await onSubmit(data, photoFile)
    } catch (error: unknown) {
      setFormError(error instanceof Error ? error.message : "Erro inesperado ao salvar")
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-white/20 bg-white/[0.04] transition hover:border-[#E9B23C]/60"
          aria-label="Enviar foto de perfil"
        >
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoPreview} alt="Prévia da foto" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-2xl text-[#F4EDDF]/40">
              📷
            </span>
          )}
        </button>
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#F4EDDF]/90">Foto de perfil</p>
          <p className="text-xs text-[#F4EDDF]/45">JPG, PNG ou WebP · máx. 2MB · opcional</p>
          {photoError && <p className="text-xs text-[#E0715A]" role="alert">{photoError}</p>}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      <Field label="Nome público" htmlFor="displayName" error={errors.displayName?.message} hint="Como você quer aparecer no diretório">
        <TextInput id="displayName" placeholder="Ex.: Maria Silva" {...register("displayName")} />
      </Field>

      <div className="grid grid-cols-[1fr_110px] gap-3">
        <Field label="Cidade" htmlFor="city" error={errors.city?.message}>
          <TextInput id="city" autoComplete="address-level2" placeholder="Ex.: Juazeiro do Norte" {...register("city")} />
        </Field>
        <Field label="Estado" htmlFor="state" error={errors.state?.message}>
          <SelectInput id="state" {...register("state")}>
            {BRAZIL_STATES.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field
        label="Mini bio"
        htmlFor="bio"
        error={errors.bio?.message}
        hint={`${bioLength}/300 caracteres`}
        optional
      >
        <TextArea
          id="bio"
          maxLength={300}
          placeholder="Conte em poucas linhas quem você é e o que faz"
          {...register("bio")}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Empresa ou instituição" htmlFor="company" error={errors.company?.message} optional>
          <TextInput id="company" autoComplete="organization" placeholder="Onde você atua" {...register("company")} />
        </Field>
        <Field label="Cargo/ocupação" htmlFor="position" error={errors.position?.message} optional>
          <TextInput id="position" autoComplete="organization-title" placeholder="O que você faz" {...register("position")} />
        </Field>
      </div>

      <Field
        label="WhatsApp"
        htmlFor="whatsapp"
        error={errors.whatsapp?.message}
        hint="Privado por padrão — você decide se mostra na última etapa"
        optional
      >
        <TextInput id="whatsapp" type="tel" autoComplete="tel" placeholder="(88) 9 9999-9999" {...register("whatsapp")} />
      </Field>

      {formError && <ErrorBanner message={formError} />}

      <StepButtons onBack={onBack} submitting={isSubmitting} />
    </form>
  )
}
