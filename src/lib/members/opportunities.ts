import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface OpportunityRecord {
  id: string
  title: string
  description: string | null
  opportunity_type: string
  external_url: string | null
  deadline: string | null
  banner_url: string | null
  is_public: boolean
}

const OPPORTUNITY_COLUMNS =
  "id, title, description, opportunity_type, external_url, deadline, banner_url, is_public"

/**
 * Oportunidades publicadas, ordenadas por prazo (as sem prazo aparecem por
 * último). Uso na área de membros — mostra públicas e restritas a membros.
 */
export async function fetchOpportunities(limit?: number): Promise<OpportunityRecord[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase
    .from("opportunities")
    .select(OPPORTUNITY_COLUMNS)
    .eq("status", "published")
    .order("deadline", { ascending: true, nullsFirst: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw new Error(`Não foi possível carregar as oportunidades: ${error.message}`)
  return (data ?? []) as OpportunityRecord[]
}

/**
 * Oportunidades publicadas e marcadas como públicas — para páginas
 * visíveis a visitantes não autenticados.
 */
export async function fetchPublicOpportunities(limit?: number): Promise<OpportunityRecord[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase
    .from("opportunities")
    .select(OPPORTUNITY_COLUMNS)
    .eq("status", "published")
    .eq("is_public", true)
    .order("deadline", { ascending: true, nullsFirst: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw new Error(`Não foi possível carregar as oportunidades: ${error.message}`)
  return (data ?? []) as OpportunityRecord[]
}
