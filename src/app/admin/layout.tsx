import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AdminProvider, type CurrentUser } from "@/lib/admin/store"
import { AdminShell } from "@/components/admin/AdminShell"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Painel Admin — Kariri Valley",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  const currentUser: CurrentUser = {
    id: profile.id,
    name: profile.full_name ?? "Administrador",
    role: "admin",
  }

  return (
    <AdminProvider currentUser={currentUser}>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  )
}
