import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface EventRecord {
  id: string
  slug: string
  title: string
  description: string | null
  starts_at: string
  location: string | null
  meeting_url: string | null
  banner_url: string | null
  is_public: boolean
}

const EVENT_COLUMNS = "id, slug, title, description, starts_at, location, meeting_url, banner_url, is_public"

/**
 * Próximos eventos publicados (starts_at >= agora), ordenados por data.
 * `limit` opcional para widgets. Uso na área de membros — mostra eventos
 * públicos e restritos a membros (RLS já garante que só quem está
 * autenticado chega aqui).
 */
export async function fetchUpcomingEvents(limit?: number): Promise<EventRecord[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("status", "published")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw new Error(`Não foi possível carregar os eventos: ${error.message}`)
  return (data ?? []) as EventRecord[]
}

/**
 * Próximos eventos publicados e marcados como públicos — para a home e
 * outras páginas visíveis a visitantes não autenticados.
 */
export async function fetchPublicUpcomingEvents(limit?: number): Promise<EventRecord[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("status", "published")
    .eq("is_public", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw new Error(`Não foi possível carregar os eventos: ${error.message}`)
  return (data ?? []) as EventRecord[]
}

/**
 * Um evento público publicado, pelo slug — usado na página de detalhe
 * individual (link compartilhável com preview correto).
 */
export async function fetchPublicEventBySlug(slug: string): Promise<EventRecord | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_public", true)
    .maybeSingle()

  if (error) throw new Error(`Não foi possível carregar o evento: ${error.message}`)
  return data as EventRecord | null
}
