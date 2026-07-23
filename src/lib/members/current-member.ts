import { cache } from "react"
import { redirect } from "next/navigation"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { MemberRecord } from "@/lib/onboarding/api"

const MEMBER_COLUMNS =
  "id, profile_id, full_name, display_name, slug, email, phone, city, state, bio, photo_url, company, position, occupation_areas, status, is_public, approved_at, company_name, company_type, company_stage, company_cnpj, company_logo_url, company_problem, company_sector, company_review_status"

export interface CurrentMember extends MemberRecord {
  slug: string | null
  state: string | null
  approved_at: string | null
}

export interface CurrentMemberResult {
  userId: string
  member: CurrentMember | null
}

/**
 * DAL da área de membros: garante sessão ativa (redireciona para /login
 * se não houver) e devolve o registro em `members` do usuário logado
 * (ou `null` se ele ainda não tem cadastro). Envolto em `cache()` para
 * dedupar a consulta entre layout e página na mesma renderização.
 */
export const getCurrentMember = cache(async (): Promise<CurrentMemberResult> => {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("members")
    .select(MEMBER_COLUMNS)
    .eq("profile_id", user.id)
    .maybeSingle()

  if (error) {
    throw new Error(`Não foi possível carregar seu cadastro: ${error.message}`)
  }

  return { userId: user.id, member: data as CurrentMember | null }
})
