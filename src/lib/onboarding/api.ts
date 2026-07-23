import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { INTEREST_SLUG_ORDER } from "./options"
import type { BasicsData } from "./schemas"

export interface Interest {
  id: string
  name: string
  slug: string
}

export interface MemberRecord {
  id: string
  profile_id: string | null
  full_name: string
  display_name: string | null
  email: string
  phone: string | null
  city: string
  state: string | null
  bio: string | null
  photo_url: string | null
  company: string | null
  position: string | null
  occupation_areas: string[]
  status: string
  is_public: boolean
  startup_name: string | null
  startup_stage: string | null
  startup_cnpj: string | null
  startup_logo_url: string | null
  startup_problem: string | null
  startup_sector: string | null
}

export interface VisibilityData {
  isPublic: boolean
  showEmail: boolean
  showWhatsapp: boolean
  showCity: boolean
  showCompany: boolean
  linkedin: string
  instagram: string
}

const MEMBER_COLUMNS =
  "id, profile_id, full_name, display_name, email, phone, city, state, bio, photo_url, company, position, occupation_areas, status, is_public, startup_name, startup_stage, startup_cnpj, startup_logo_url, startup_problem, startup_sector"

function toError(context: string, error: { message: string } | null): Error {
  return new Error(`${context}: ${error?.message ?? "erro desconhecido"}`)
}

/** Catálogo de interesses, na ordem definida no produto. */
export async function fetchInterests(): Promise<Interest[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.from("interests").select("id, name, slug")

  if (error) throw toError("Não foi possível carregar os interesses", error)

  const order = new Map(INTEREST_SLUG_ORDER.map((slug, index) => [slug, index]))
  return ((data ?? []) as Interest[]).sort(
    (a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99)
  )
}

/** Registro de membro do usuário logado (se existir). */
export async function fetchMyMember(userId: string): Promise<MemberRecord | null> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("members")
    .select(MEMBER_COLUMNS)
    .eq("profile_id", userId)
    .maybeSingle()

  if (error) throw toError("Não foi possível carregar seu cadastro", error)
  return data as MemberRecord | null
}

interface SaveBasicsInput {
  userId: string
  email: string
  fullName: string
  basics: BasicsData
  photoUrl: string | null
  existingMemberId: string | null
}

/** Etapa 2 — cria ou atualiza o registro do membro (status sempre 'pending' na criação). */
export async function saveBasics(input: SaveBasicsInput): Promise<MemberRecord> {
  const supabase = getSupabaseBrowserClient()
  const { basics } = input

  const fields = {
    display_name: basics.displayName,
    city: basics.city,
    state: basics.state,
    bio: basics.bio || null,
    company: basics.company || null,
    position: basics.position || null,
    phone: basics.whatsapp || null,
    photo_url: input.photoUrl,
  }

  const query = input.existingMemberId
    ? supabase.from("members").update(fields).eq("id", input.existingMemberId)
    : supabase.from("members").insert({
        profile_id: input.userId,
        full_name: input.fullName,
        email: input.email,
        status: "pending",
        ...fields,
      })

  const { data, error } = await query.select(MEMBER_COLUMNS).single()

  if (error) {
    if (error.code === "23505") {
      throw new Error("Já existe uma solicitação de cadastro com este e-mail")
    }
    throw toError("Não foi possível salvar seus dados", error)
  }

  return data as MemberRecord
}

/** Etapa 3 — perfis na comunidade (enum occupation_area[]). */
export async function saveCommunityProfiles(memberId: string, values: string[]): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from("members")
    .update({ occupation_areas: values })
    .eq("id", memberId)

  if (error) throw toError("Não foi possível salvar seu perfil na comunidade", error)
}

/** Etapa 4 — sincroniza interesses selecionados. */
export async function syncInterests(memberId: string, interestIds: string[]): Promise<void> {
  const supabase = getSupabaseBrowserClient()

  const { error: deleteError } = await supabase
    .from("member_interests")
    .delete()
    .eq("member_id", memberId)
  if (deleteError) throw toError("Não foi possível salvar seus interesses", deleteError)

  if (interestIds.length === 0) return

  const rows = interestIds.map((interestId) => ({
    member_id: memberId,
    interest_id: interestId,
  }))
  const { error } = await supabase.from("member_interests").insert(rows)
  if (error) throw toError("Não foi possível salvar seus interesses", error)
}

/** Etapas 5 e 6 — sincroniza o que o membro busca/oferece. */
export async function syncSelections(
  table: "member_needs" | "member_offers",
  memberId: string,
  titles: string[]
): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const label = table === "member_needs" ? "o que você busca" : "o que você oferece"

  const { error: deleteError } = await supabase.from(table).delete().eq("member_id", memberId)
  if (deleteError) throw toError(`Não foi possível salvar ${label}`, deleteError)

  if (titles.length === 0) return

  const rows = titles.map((title) => ({ member_id: memberId, title }))
  const { error } = await supabase.from(table).insert(rows)
  if (error) throw toError(`Não foi possível salvar ${label}`, error)
}

function normalizeUrl(value: string, platform: "linkedin" | "instagram"): string {
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (platform === "instagram" && /^@?[\w.]+$/.test(trimmed)) {
    return `https://instagram.com/${trimmed.replace(/^@/, "")}`
  }
  return `https://${trimmed}`
}

/** Etapa 7 — visibilidade do perfil, campos sensíveis e links sociais. */
export async function saveVisibility(memberId: string, vis: VisibilityData): Promise<void> {
  const supabase = getSupabaseBrowserClient()

  const { error: memberError } = await supabase
    .from("members")
    .update({ is_public: vis.isPublic })
    .eq("id", memberId)
  if (memberError) throw toError("Não foi possível salvar a visibilidade", memberError)

  const hasSocial = Boolean(vis.linkedin.trim() || vis.instagram.trim())
  const settings = [
    { field_name: "email", visibility: vis.showEmail ? "public" : "private" },
    { field_name: "phone", visibility: vis.showWhatsapp ? "public" : "private" },
    { field_name: "city", visibility: vis.showCity ? "public" : "private" },
    { field_name: "company", visibility: vis.showCompany ? "public" : "private" },
    { field_name: "social_links", visibility: hasSocial ? "public" : "private" },
  ].map((row) => ({ ...row, member_id: memberId }))

  const { error: settingsError } = await supabase
    .from("member_visibility_settings")
    .upsert(settings, { onConflict: "member_id,field_name" })
  if (settingsError) throw toError("Não foi possível salvar a visibilidade", settingsError)

  const { error: deleteError } = await supabase
    .from("member_social_links")
    .delete()
    .eq("member_id", memberId)
    .in("platform", ["linkedin", "instagram"])
  if (deleteError) throw toError("Não foi possível salvar seus links", deleteError)

  const links = [
    vis.linkedin.trim() && {
      member_id: memberId,
      platform: "linkedin",
      url: normalizeUrl(vis.linkedin, "linkedin"),
    },
    vis.instagram.trim() && {
      member_id: memberId,
      platform: "instagram",
      url: normalizeUrl(vis.instagram, "instagram"),
    },
  ].filter(Boolean)

  if (links.length > 0) {
    const { error } = await supabase.from("member_social_links").insert(links)
    if (error) throw toError("Não foi possível salvar seus links", error)
  }
}

const PHOTO_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

/** Upload da foto de perfil (bucket member-photos, pasta do próprio usuário). */
export async function uploadMemberPhoto(userId: string, file: File): Promise<string> {
  const supabase = getSupabaseBrowserClient()
  const extension = PHOTO_EXTENSIONS[file.type] ?? "jpg"
  const path = `${userId}/avatar-${Date.now()}.${extension}`

  const { error } = await supabase.storage
    .from("member-photos")
    .upload(path, file, { cacheControl: "3600", upsert: false })
  if (error) throw toError("Não foi possível enviar a foto", error)

  const { data } = supabase.storage.from("member-photos").getPublicUrl(path)
  return data.publicUrl
}

/** Upload da logo da startup (bucket startup-logos, pasta do próprio usuário). */
export async function uploadStartupLogo(userId: string, file: File): Promise<string> {
  const supabase = getSupabaseBrowserClient()
  const extension = PHOTO_EXTENSIONS[file.type] ?? "jpg"
  const path = `${userId}/logo-${Date.now()}.${extension}`

  const { error } = await supabase.storage
    .from("startup-logos")
    .upload(path, file, { cacheControl: "3600", upsert: false })
  if (error) throw toError("Não foi possível enviar a logo da startup", error)

  const { data } = supabase.storage.from("startup-logos").getPublicUrl(path)
  return data.publicUrl
}
