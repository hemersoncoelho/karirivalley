import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface DirectoryMember {
  id: string
  slug: string
  name: string
  photo_url: string | null
  city: string | null
  company: string | null
  position: string | null
  bio: string | null
  email: string | null
  phone: string | null
  occupation_areas: string[]
  member_since: string | null
  interest_slugs: string[]
  need_titles: string[]
  offer_titles: string[]
  social_links: { platform: string; url: string }[]
}

const DIRECTORY_COLUMNS =
  "id, slug, name, photo_url, city, company, position, bio, email, phone, occupation_areas, member_since, interest_slugs, need_titles, offer_titles, social_links"

/** Diretório interno da área de membros (member_directory_full — só authenticated). */
export async function fetchDirectory(): Promise<DirectoryMember[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from("member_directory_full")
    .select(DIRECTORY_COLUMNS)
    .order("member_since", { ascending: false })

  if (error) throw new Error(`Não foi possível carregar o diretório: ${error.message}`)
  return (data ?? []) as DirectoryMember[]
}

export async function fetchMemberBySlug(slug: string): Promise<DirectoryMember | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from("member_directory_full")
    .select(DIRECTORY_COLUMNS)
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw new Error(`Não foi possível carregar o perfil: ${error.message}`)
  return data as DirectoryMember | null
}

/**
 * Membros recomendados para o dashboard: prioriza quem compartilha área de
 * atuação ou interesse com o membro logado; sem correspondência, cai para os
 * aprovados mais recentes. Sempre exclui o próprio membro. Reaproveita
 * `fetchDirectory()` (que já inclui a própria linha do membro logado) para
 * descobrir os interesses dele sem uma query extra.
 */
export async function fetchRecommendedMembers(currentMemberId: string, limit = 4): Promise<DirectoryMember[]> {
  const all = await fetchDirectory()
  const self = all.find((m) => m.id === currentMemberId)
  const others = all.filter((m) => m.id !== currentMemberId)

  const matches = self
    ? others.filter(
        (m) =>
          m.occupation_areas.some((area) => self.occupation_areas.includes(area)) ||
          m.interest_slugs.some((slug) => self.interest_slugs.includes(slug))
      )
    : []

  const pool = matches.length > 0 ? matches : others
  return pool.slice(0, limit)
}
