import { LogoutButton } from "@/components/member/LogoutButton"

const COPY: Record<string, { title: string; body: string }> = {
  no_record: {
    title: "Não encontramos seu cadastro",
    body: "Sua conta existe, mas não localizamos uma solicitação de cadastro vinculada a ela. Entre em contato com a organização da Kariri Valley.",
  },
  pending: {
    title: "Seu cadastro está em análise",
    body: "Recebemos sua solicitação e nossa equipe vai avaliar em breve. Você recebe um e-mail assim que houver uma resposta.",
  },
  blocked: {
    title: "Sua conta foi bloqueada",
    body: "O acesso à área de membros foi revogado. Se você acredita que isso é um engano, entre em contato com a organização.",
  },
  rejected: {
    title: "Sua solicitação não foi aprovada",
    body: "Sua solicitação de cadastro não foi aprovada desta vez. Você pode enviar uma nova solicitação após 30 dias.",
  },
}

interface MemberStatusNoticeProps {
  status: "no_record" | "pending" | "blocked" | "rejected"
}

export function MemberStatusNotice({ status }: MemberStatusNoticeProps) {
  const copy = COPY[status]

  return (
    <div className="flex min-h-screen items-center justify-center px-6" style={{ background: "#2C2221" }}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <h1 className="text-xl font-semibold text-[#F4EDDF]">{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#F4EDDF]/60">{copy.body}</p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
