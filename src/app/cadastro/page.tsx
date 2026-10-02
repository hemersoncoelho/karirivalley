import type { Metadata } from "next"
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard"

export const metadata: Metadata = {
  title: "Faça seu cadastro — Kariri Valley",
  description: "Apresente seu perfil, interesses e as trocas que quer construir na comunidade de inovação do Cariri.",
}

export default function CadastroPage() {
  return (
    <main id="conteudo" tabIndex={-1} className="flex min-h-screen justify-center px-6 py-24" style={{ background: "var(--kv-dark)" }}>
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[2.5px] text-[var(--kv-gold)] uppercase">Kariri Valley</p>
        </div>

        <OnboardingWizard />
      </div>
    </main>
  )
}
