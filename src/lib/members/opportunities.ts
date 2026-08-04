import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface OpportunityRecord {
  id: string
  title: string
  description: string | null
  opportunity_type: string
  external_url: string | null
  deadline: string | null
}

const OPPORTUNITY_COLUMNS = "id, title, description, opportunity_type, external_url, deadline"

/** Oportunidades ativas, ordenadas por prazo (as sem prazo aparecem por último). */
export async function fetchOpportunities(limit?: number): Promise<OpportunityRecord[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase
    .from("opportunities")
    .select(OPPORTUNITY_COLUMNS)
    .order("deadline", { ascending: true, nullsFirst: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw new Error(`Não foi possível carregar as oportunidades: ${error.message}`)
  return (data ?? []) as OpportunityRecord[]
}
