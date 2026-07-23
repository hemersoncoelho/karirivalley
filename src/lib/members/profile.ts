import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export type SocialPlatform = "linkedin" | "github" | "instagram" | "website"

export interface SocialLinkInput {
  platform: SocialPlatform
  url: string
}

function normalizeSocialUrl(value: string, platform: SocialPlatform): string {
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (platform === "instagram" && /^@?[\w.]+$/.test(trimmed)) {
    return `https://instagram.com/${trimmed.replace(/^@/, "")}`
  }
  if (platform === "github" && /^[\w-]+$/.test(trimmed)) {
    return `https://github.com/${trimmed}`
  }
  if (platform === "linkedin" && /^[\w-]+$/.test(trimmed)) {
    return `https://linkedin.com/in/${trimmed}`
  }
  return `https://${trimmed}`
}

const SOCIAL_PLATFORMS: SocialPlatform[] = ["linkedin", "github", "instagram", "website"]

/** Substitui linkedin/github/instagram/website do membro (deleta e reinsere só os preenchidos). */
export async function saveSocialLinks(memberId: string, links: SocialLinkInput[]): Promise<void> {
  const supabase = getSupabaseBrowserClient()

  const { error: deleteError } = await supabase
    .from("member_social_links")
    .delete()
    .eq("member_id", memberId)
    .in("platform", SOCIAL_PLATFORMS)
  if (deleteError) throw new Error(`Não foi possível salvar suas redes sociais: ${deleteError.message}`)

  const rows = links
    .filter((link) => link.url.trim())
    .map((link) => ({ member_id: memberId, platform: link.platform, url: normalizeSocialUrl(link.url, link.platform) }))

  if (rows.length === 0) return

  const { error } = await supabase.from("member_social_links").insert(rows)
  if (error) throw new Error(`Não foi possível salvar suas redes sociais: ${error.message}`)
}

export type CompanyType = "startup" | "tradicional" | ""

export type StartupStage = "ideacao" | "mvp" | "tracao" | "escala" | ""

export type CompanySector =
  | "agro"
  | "turismo"
  | "saude"
  | "deep_tech"
  | "fintech"
  | "edtech"
  | "varejo_ecommerce"
  | "industria"
  | "impacto_social"
  | "outro"
  | ""

export interface CompanyInfoInput {
  type: CompanyType
  name: string
  stage: StartupStage
  cnpj: string
  logoUrl: string | null
  problem: string
  sector: CompanySector
}

/**
 * Salva os dados de empresa/startup do membro. Estágio só se aplica a
 * startups. CNPJ (14 dígitos) é sempre obrigatório para empresa tradicional,
 * e para startup a partir do estágio MVP — validado aqui e reforçado por
 * constraint no banco. Toda alteração volta para "pending", exigindo nova
 * aprovação do admin antes de reaparecer na vitrine/perfil público — limpar
 * o tipo zera todos os campos.
 */
export async function saveCompanyInfo(memberId: string, input: CompanyInfoInput): Promise<void> {
  const name = input.name.trim()
  const type = input.type

  if (!type) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("members")
      .update({
        company_name: null,
        company_type: null,
        company_stage: null,
        company_cnpj: null,
        company_logo_url: null,
        company_problem: null,
        company_sector: null,
        company_review_status: null,
      })
      .eq("id", memberId)
    if (error) throw new Error(`Não foi possível salvar a empresa: ${error.message}`)
    return
  }

  if (!name) throw new Error("Informe o nome da empresa")

  const stage = type === "startup" ? input.stage : ""
  const cnpjDigits = input.cnpj.replace(/\D/g, "")
  const cnpjRequired = type === "tradicional" || (type === "startup" && stage !== "ideacao")
  if (cnpjRequired && cnpjDigits.length !== 14) {
    throw new Error(
      type === "tradicional"
        ? "Informe um CNPJ válido (14 dígitos) — obrigatório para empresa tradicional"
        : "Informe um CNPJ válido (14 dígitos) — obrigatório a partir do estágio MVP"
    )
  }

  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from("members")
    .update({
      company_name: name,
      company_type: type,
      company_stage: stage || null,
      company_cnpj: cnpjDigits || null,
      company_logo_url: input.logoUrl,
      company_problem: input.problem.trim() || null,
      company_sector: input.sector || null,
      company_review_status: "pending",
    })
    .eq("id", memberId)
  if (error) throw new Error(`Não foi possível salvar a empresa: ${error.message}`)
}

export interface VisibilityFields {
  email: "public" | "private"
  phone: "public" | "private"
  city: "public" | "private"
  company: "public" | "private"
  social_links: "public" | "private"
}

/** Visibilidade geral do perfil (is_public) + visibilidade por campo sensível. */
export async function saveVisibilitySettings(
  memberId: string,
  input: { isPublic: boolean; fields: VisibilityFields }
): Promise<void> {
  const supabase = getSupabaseBrowserClient()

  const { error: memberError } = await supabase
    .from("members")
    .update({ is_public: input.isPublic })
    .eq("id", memberId)
  if (memberError) throw new Error(`Não foi possível salvar a visibilidade: ${memberError.message}`)

  const rows = Object.entries(input.fields).map(([field_name, visibility]) => ({
    member_id: memberId,
    field_name,
    visibility,
  }))

  const { error } = await supabase
    .from("member_visibility_settings")
    .upsert(rows, { onConflict: "member_id,field_name" })
  if (error) throw new Error(`Não foi possível salvar a visibilidade: ${error.message}`)
}
