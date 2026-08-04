import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface EventRecord {
  id: string
  title: string
  description: string | null
  starts_at: string
  location: string | null
  meeting_url: string | null
}

const EVENT_COLUMNS = "id, title, description, starts_at, location, meeting_url"

/** Próximos eventos (starts_at >= agora), ordenados por data. `limit` opcional para widgets. */
export async function fetchUpcomingEvents(limit?: number): Promise<EventRecord[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw new Error(`Não foi possível carregar os eventos: ${error.message}`)
  return (data ?? []) as EventRecord[]
}
