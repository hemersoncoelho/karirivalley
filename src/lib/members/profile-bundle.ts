import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface ProfileBundle {
  interestIds: string[]
  needs: string[]
  offers: string[]
  socialLinks: { platform: string; url: string }[]
  fieldVisibility: Record<string, "public" | "members" | "private">
}

/**
 * Dados satélite do próprio membro, usados no dashboard (completude) e em
 * /perfil/editar (prefill). Roda em Server Components — usa o cliente
 * server-side para ter acesso à sessão via cookies. Mantido em módulo
 * separado de `profile.ts` para não puxar `next/headers` para o bundle
 * client-side de `ProfileEditForm` (que só usa as mutations).
 */
export async function fetchProfileBundle(memberId: string): Promise<ProfileBundle> {
  const supabase = await getSupabaseServerClient()

  const [interestsRes, needsRes, offersRes, linksRes, visibilityRes] = await Promise.all([
    supabase.from("member_interests").select("interest_id").eq("member_id", memberId),
    supabase.from("member_needs").select("title").eq("member_id", memberId).eq("is_active", true),
    supabase.from("member_offers").select("title").eq("member_id", memberId).eq("is_active", true),
    supabase.from("member_social_links").select("platform, url").eq("member_id", memberId),
    supabase.from("member_visibility_settings").select("field_name, visibility").eq("member_id", memberId),
  ])

  for (const res of [interestsRes, needsRes, offersRes, linksRes, visibilityRes]) {
    if (res.error) throw new Error(`Não foi possível carregar seu perfil: ${res.error.message}`)
  }

  return {
    interestIds: (interestsRes.data ?? []).map((row) => row.interest_id as string),
    needs: (needsRes.data ?? []).map((row) => row.title as string),
    offers: (offersRes.data ?? []).map((row) => row.title as string),
    socialLinks: (linksRes.data ?? []) as { platform: string; url: string }[],
    fieldVisibility: Object.fromEntries(
      (visibilityRes.data ?? []).map((row) => [row.field_name, row.visibility])
    ) as Record<string, "public" | "members" | "private">,
  }
}
