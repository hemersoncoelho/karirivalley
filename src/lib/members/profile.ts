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

export type StartupStage = "ideacao" | "mvp" | "tracao" | "escala" | ""

export type StartupSector =
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

export interface StartupInfoInput {
  name: string
  stage: StartupStage
  cnpj: string
  logoUrl: string | null
  problem: string
  sector: StartupSector
}

/**
 * Salva os dados da startup do membro. Ideação não exige CNPJ; a partir de
 * MVP/tração/escala o CNPJ (14 dígitos) é obrigatório — validado aqui e
 * reforçado por constraint no banco. Limpar o estágio zera todos os campos.
 */
export async function saveStartupInfo(memberId: string, input: StartupInfoInput): Promise<void> {
  const name = input.name.trim()
  const stage = input.stage

  if (!stage) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("members")
      .update({
        startup_name: null,
        startup_stage: null,
        startup_cnpj: null,
        startup_logo_url: null,
        startup_problem: null,
        startup_sector: null,
      })
      .eq("id", memberId)
    if (error) throw new Error(`Não foi possível salvar a startup: ${error.message}`)
    return
  }

  if (!name) throw new Error("Informe o nome da startup")

  const cnpjDigits = input.cnpj.replace(/\D/g, "")
  if (stage !== "ideacao" && cnpjDigits.length !== 14) {
    throw new Error("Informe um CNPJ válido (14 dígitos) — obrigatório a partir do estágio MVP")
  }

  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from("members")
    .update({
      startup_name: name,
      startup_stage: stage,
      startup_cnpj: cnpjDigits || null,
      startup_logo_url: input.logoUrl,
      startup_problem: input.problem.trim() || null,
      startup_sector: input.sector || null,
    })
    .eq("id", memberId)
  if (error) throw new Error(`Não foi possível salvar a startup: ${error.message}`)
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
