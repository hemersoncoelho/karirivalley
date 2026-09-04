import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard"

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen justify-center px-6 py-24" style={{ background: "var(--kv-dark)" }}>
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[2.5px] text-[var(--kv-gold)] uppercase">Kariri Valley</p>
        </div>

        <OnboardingWizard />
      </div>
    </main>
  )
}
