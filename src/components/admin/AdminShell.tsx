"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldAlert } from "lucide-react"
import { AdminSidebar } from "./AdminSidebar"
import { AdminTopbar } from "./AdminTopbar"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin/store"
import { itemForPath, canAccess } from "@/lib/admin/nav"

function AccessDenied() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <ShieldAlert className="size-8" />
      </span>
      <h2 className="text-xl font-semibold text-neutral-900">Acesso restrito</h2>
      <p className="mt-2 max-w-md text-sm text-neutral-500">
        Esta área do painel administrativo é exclusiva para administradores.
      </p>
      <div className="mt-6 flex gap-2">
        <Button render={<Link href="/admin" />}>Ir para o Dashboard</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Voltar ao site
        </Button>
      </div>
    </div>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { currentUser, loading, error, clearError } = useAdmin()

  const currentItem = itemForPath(pathname)
  const allowed = currentUser.role === "admin" && (!currentItem || canAccess(currentItem, currentUser.role))

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-neutral-900">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>
              <button onClick={clearError} className="shrink-0 text-xs font-medium underline">
                Fechar
              </button>
            </div>
          )}
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center text-sm text-neutral-400">
              Carregando dados do painel...
            </div>
          ) : allowed ? (
            children
          ) : (
            <AccessDenied />
          )}
        </main>
      </div>
    </div>
  )
}
