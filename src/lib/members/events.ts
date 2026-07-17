import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface EventRecord {
  id: string
  title: string
  description: string | null
  event_date: string
  location: string | null
  external_url: string | null
}

const EVENT_COLUMNS = "id, title, description, event_date, location, external_url"

/** Próximos eventos (event_date >= agora), ordenados por data. `limit` opcional para widgets. */
export async function fetchUpcomingEvents(limit?: number): Promise<EventRecord[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw new Error(`Não foi possível carregar os eventos: ${error.message}`)
  return (data ?? []) as EventRecord[]
}
