"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { UserCircle2, Rocket } from "lucide-react"

import {
  fetchInterests,
  saveBasics,
  syncInterests,
  syncSelections,
  uploadMemberPhoto,
  uploadCompanyLogo,
  type Interest,
} from "@/lib/onboarding/api"
import { validatePhotoFile } from "@/lib/onboarding/schemas"
import { NEED_OPTIONS, OFFER_OPTIONS, BRAZIL_STATES } from "@/lib/onboarding/options"
import {
  saveSocialLinks,
  saveVisibilitySettings,
  saveCompanyInfo,
  type SocialPlatform,
  type CompanyType,
  type StartupStage,
  type CompanySector,
} from "@/lib/members/profile"
import type { ProfileBundle } from "@/lib/members/profile-bundle"
import type { CurrentMember } from "@/lib/members/current-member"
import { COMPANY_TYPES, STARTUP_STAGES, COMPANY_SECTORS } from "@/lib/onboarding/options"
import { Field, TextInput, TextArea, SelectInput, Chip, ToggleRow, ErrorBanner } from "@/components/onboarding/fields"

interface ProfileEditFormProps {
  member: CurrentMember
  bundle: ProfileBundle
}

const SOCIAL_FIELDS: { platform: SocialPlatform; label: string; placeholder: string }[] = [
  { platform: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/voce" },
  { platform: "github", label: "GitHub", placeholder: "github.com/voce" },
  { platform: "instagram", label: "Instagram", placeholder: "@voce" },
  { platform: "website", label: "Website", placeholder: "seusite.com" },
]

export function ProfileEditForm({ member, bundle }: ProfileEditFormProps) {
  const router = useRouter()

  const [displayName, setDisplayName] = useState(member.display_name ?? member.full_name)
  const [city, setCity] = useState(member.city)
  const [state, setState] = useState(member.state ?? "")
  const [bio, setBio] = useState(member.bio ?? "")
  const [company, setCompany] = useState(member.company ?? "")
  const [position, setPosition] = useState(member.position ?? "")

  const [companyType, setCompanyType] = useState<CompanyType>((member.company_type as CompanyType) ?? "")
  const [startupStage, setStartupStage] = useState<StartupStage>((member.company_stage as StartupStage) ?? "")
  const [companyName, setCompanyName] = useState(member.company_name ?? "")
  const [companyCnpj, setCompanyCnpj] = useState(member.company_cnpj ?? "")
  const [companySector, setCompanySector] = useState<CompanySector>((member.company_sector as CompanySector) ?? "")
  const [companyProblem, setCompanyProblem] = useState(member.company_problem ?? "")
  const [companyReviewStatus, setCompanyReviewStatus] = useState(member.company_review_status)
  const [logoUrl, setLogoUrl] = useState(member.company_logo_url)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [photoUrl, setPhotoUrl] = useState(member.photo_url)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [interests, setInterests] = useState<Interest[]>([])
  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>(bundle.interestIds)
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(bundle.needs)
  const [selectedOffers, setSelectedOffers] = useState<string[]>(bundle.offers)

  const socialByPlatform = Object.fromEntries(bundle.socialLinks.map((link) => [link.platform, link.url]))
  const [socialValues, setSocialValues] = useState<Record<SocialPlatform, string>>({
    linkedin: socialByPlatform.linkedin ?? "",
    github: socialByPlatform.github ?? "",
    instagram: socialByPlatform.instagram ?? "",
    website: socialByPlatform.website ?? "",
  })

  const [isPublic, setIsPublic] = useState(member.is_public)
  const [showEmail, setShowEmail] = useState(bundle.fieldVisibility.email === "public")
  const [showPhone, setShowPhone] = useState(bundle.fieldVisibility.phone === "public")
  const [showCity, setShowCity] = useState((bundle.fieldVisibility.city ?? "public") !== "private")
  const [showCompany, setShowCompany] = useState((bundle.fieldVisibility.company ?? "public") !== "private")

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchInterests()
      .then(setInterests)
      .catch((err: Error) => setError(err.message))
  }, [])

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const validationError = validatePhotoFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const validationError = validatePhotoFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  function toggleInterest(id: string) {
    setSelectedInterestIds((current) => (current.includes(id) ? current.filter((v) => v !== id) : [...current, id]))
  }

  function toggleChip(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      let finalPhotoUrl = photoUrl
      if (photoFile && member.profile_id) {
        finalPhotoUrl = await uploadMemberPhoto(member.profile_id, photoFile)
        setPhotoUrl(finalPhotoUrl)
        setPhotoFile(null)
      }

      await saveBasics({
        userId: member.profile_id ?? "",
        email: member.email,
        fullName: member.full_name,
        basics: {
          displayName,
          city,
          state,
          bio,
          company,
          position,
          whatsapp: member.phone ?? "",
        },
        photoUrl: finalPhotoUrl,
        existingMemberId: member.id,
      })

      let finalLogoUrl = logoUrl
      if (logoFile && member.profile_id) {
        finalLogoUrl = await uploadCompanyLogo(member.profile_id, logoFile)
        setLogoUrl(finalLogoUrl)
        setLogoFile(null)
      }

      await saveCompanyInfo(member.id, {
        type: companyType,
        name: companyName,
        stage: startupStage,
        cnpj: companyCnpj,
        logoUrl: finalLogoUrl,
        problem: companyProblem,
        sector: companySector,
      })
      setCompanyReviewStatus(companyType ? "pending" : null)
      await syncInterests(member.id, selectedInterestIds)
      await syncSelections("member_needs", member.id, selectedNeeds)
      await syncSelections("member_offers", member.id, selectedOffers)
      await saveSocialLinks(
        member.id,
        SOCIAL_FIELDS.map((field) => ({ platform: field.platform, url: socialValues[field.platform] }))
      )
      await saveVisibilitySettings(member.id, {
        isPublic,
        fields: {
          email: showEmail ? "public" : "private",
          phone: showPhone ? "public" : "private",
          city: showCity ? "public" : "private",
          company: showCompany ? "public" : "private",
          social_links: "public",
        },
      })

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar as alterações")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <section className="flex items-center gap-5">
        {photoPreview || photoUrl ? (
          <Image
            src={photoPreview ?? photoUrl ?? ""}
            alt={displayName}
            width={80}
            height={80}
            className="size-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <UserCircle2 size={36} strokeWidth={1.4} className="text-[#F4EDDF]/40" />
          </div>
        )}
        <label className="cursor-pointer rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-[#F4EDDF]/80 hover:bg-white/5">
          Alterar foto
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#F4EDDF]/85">Informações básicas</h2>
        <Field label="Nome de exibição" htmlFor="displayName">
          <TextInput id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </Field>
        <div className="grid grid-cols-[1fr_110px] gap-3">
          <Field label="Cidade" htmlFor="city">
            <TextInput id="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
          <Field label="Estado" htmlFor="state">
            <SelectInput id="state" value={state} onChange={(e) => setState(e.target.value)}>
              {BRAZIL_STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
        <Field label="Bio" htmlFor="bio" hint={`${bio.length}/300 caracteres`}>
          <TextArea id="bio" maxLength={300} value={bio} onChange={(e) => setBio(e.target.value)} />
        </Field>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Field label="Empresa/Instituição" htmlFor="company" optional>
          <TextInput id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </Field>
        <Field label="Cargo" htmlFor="position" optional>
          <TextInput id="position" value={position} onChange={(e) => setPosition(e.target.value)} />
        </Field>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-[#F4EDDF]/85">Empresa</h2>
          {companyReviewStatus === "pending" && (
            <span className="rounded-full border border-[#E9B23C]/25 bg-[#E9B23C]/10 px-2.5 py-0.5 text-xs font-medium text-[#E9B23C]">
              Em análise pelo admin
            </span>
          )}
          {companyReviewStatus === "rejected" && (
            <span className="rounded-full border border-[#E0715A]/30 bg-[#E0715A]/10 px-2.5 py-0.5 text-xs font-medium text-[#E0715A]">
              Não aprovada — revise os dados e salve novamente
            </span>
          )}
        </div>
        <Field label="Tipo" htmlFor="companyType" optional>
          <SelectInput
            id="companyType"
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value as CompanyType)}
          >
            <option value="">Não tenho empresa / não quero informar</option>
            {COMPANY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </SelectInput>
        </Field>
        {companyType && (
          <>
            <div className="flex items-center gap-4">
              {logoPreview || logoUrl ? (
                <Image
                  src={logoPreview ?? logoUrl ?? ""}
                  alt={companyName || "Logo da empresa"}
                  width={64}
                  height={64}
                  className="size-16 rounded-xl object-cover"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Rocket size={26} strokeWidth={1.4} className="text-[#F4EDDF]/40" />
                </div>
              )}
              <label className="cursor-pointer rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-[#F4EDDF]/80 hover:bg-white/5">
                Logo da empresa
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleLogoChange} />
              </label>
            </div>
            <Field label="Nome da empresa" htmlFor="companyName">
              <TextInput id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </Field>
            {companyType === "startup" && (
              <Field label="Estágio" htmlFor="startupStage" hint="Ideação não exige CNPJ. A partir de MVP, o CNPJ passa a ser obrigatório.">
                <SelectInput
                  id="startupStage"
                  value={startupStage}
                  onChange={(e) => setStartupStage(e.target.value as StartupStage)}
                >
                  <option value="">Selecione um estágio</option>
                  {STARTUP_STAGES.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            )}
            <Field label="Área de atuação" htmlFor="companySector" optional>
              <SelectInput
                id="companySector"
                value={companySector}
                onChange={(e) => setCompanySector(e.target.value as CompanySector)}
              >
                <option value="">Selecione um setor</option>
                {COMPANY_SECTORS.map((sector) => (
                  <option key={sector.value} value={sector.value}>
                    {sector.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field
              label="Qual problema a empresa resolve?"
              htmlFor="companyProblem"
              optional
              hint={`${companyProblem.length}/300 caracteres`}
            >
              <TextArea
                id="companyProblem"
                maxLength={300}
                value={companyProblem}
                onChange={(e) => setCompanyProblem(e.target.value)}
              />
            </Field>
            {(companyType === "tradicional" || (companyType === "startup" && startupStage !== "ideacao")) && (
              <Field label="CNPJ" htmlFor="companyCnpj" hint="Somente números (14 dígitos)">
                <TextInput
                  id="companyCnpj"
                  inputMode="numeric"
                  placeholder="00000000000000"
                  value={companyCnpj}
                  onChange={(e) => setCompanyCnpj(e.target.value)}
                />
              </Field>
            )}
          </>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#F4EDDF]/85">Redes sociais</h2>
        {SOCIAL_FIELDS.map((field) => (
          <Field key={field.platform} label={field.label} htmlFor={field.platform} optional>
            <TextInput
              id={field.platform}
              placeholder={field.placeholder}
              value={socialValues[field.platform]}
              onChange={(e) => setSocialValues((v) => ({ ...v, [field.platform]: e.target.value }))}
            />
          </Field>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#F4EDDF]/85">Interesses</h2>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <Chip
              key={interest.id}
              selected={selectedInterestIds.includes(interest.id)}
              onClick={() => toggleInterest(interest.id)}
            >
              {interest.name}
            </Chip>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#F4EDDF]/85">O que você busca</h2>
        <div className="flex flex-wrap gap-2">
          {NEED_OPTIONS.map((option) => (
            <Chip
              key={option}
              selected={selectedNeeds.includes(option)}
              onClick={() => toggleChip(selectedNeeds, setSelectedNeeds, option)}
            >
              {option}
            </Chip>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#F4EDDF]/85">O que você oferece</h2>
        <div className="flex flex-wrap gap-2">
          {OFFER_OPTIONS.map((option) => (
            <Chip
              key={option}
              selected={selectedOffers.includes(option)}
              onClick={() => toggleChip(selectedOffers, setSelectedOffers, option)}
            >
              {option}
            </Chip>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#F4EDDF]/85">Contato e visibilidade</h2>
        <ToggleRow
          label="Perfil público no diretório"
          description="Se desativado, só membros aprovados veem seu perfil"
          checked={isPublic}
          onChange={setIsPublic}
        />
        <ToggleRow label={`E-mail público (${member.email})`} checked={showEmail} onChange={setShowEmail} />
        {member.phone && (
          <ToggleRow label={`WhatsApp público (${member.phone})`} checked={showPhone} onChange={setShowPhone} />
        )}
        <ToggleRow label="Cidade pública" checked={showCity} onChange={setShowCity} />
        <ToggleRow label="Empresa/cargo públicos" checked={showCompany} onChange={setShowCompany} />
      </section>

      {success && (
        <p className="rounded-xl border border-[#239D8C]/30 bg-[#239D8C]/10 px-4 py-3 text-sm text-[#5FD0C2]">
          Perfil atualizado com sucesso ✓
        </p>
      )}
      {error && <ErrorBanner message={error} />}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-[#E9B23C] px-6 py-3 text-sm font-semibold text-[#2C2221] transition hover:bg-[#f0c05a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Salvando…" : "Salvar alterações"}
      </button>
    </form>
  )
}
