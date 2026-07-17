"use client"

import { useRouter } from "next/navigation"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-[#F4EDDF]/75 transition hover:bg-white/5 hover:text-[#F4EDDF]"
    >
      Sair
    </button>
  )
}
