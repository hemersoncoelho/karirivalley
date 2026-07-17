import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard"

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen justify-center px-6 py-24" style={{ background: "#2C2221" }}>
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[2.5px] text-[#E9B23C] uppercase">Kariri Valley</p>
          <h1 className="mt-3 text-2xl font-semibold text-[#F4EDDF]">Solicitar acesso</h1>
        </div>

        <OnboardingWizard />
      </div>
    </main>
  )
}
