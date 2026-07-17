import type { Metadata } from "next"
import { AdminProvider } from "@/lib/admin/store"
import { AdminShell } from "@/components/admin/AdminShell"

export const metadata: Metadata = {
  title: "Painel Admin — Kariri Valley",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  )
}
