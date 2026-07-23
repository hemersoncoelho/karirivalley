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
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile || profile.role !== "admin") {
    redirect("/login")
  }

  const currentUser: CurrentUser = {
    id: user.id,
    name: profile.full_name || user.email || "Administrador",
    role: profile.role,
  }

  return (
    <AdminProvider currentUser={currentUser}>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  )
}
