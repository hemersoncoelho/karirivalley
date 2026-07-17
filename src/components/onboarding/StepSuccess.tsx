"use client"

import Link from "next/link"

interface StepSuccessProps {
  title: string
  message: string
}

export function StepSuccess({ title, message }: StepSuccessProps) {
  return (
    <div className="space-y-5 py-4 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#239D8C]/20">
        <svg
          className="size-8 text-[#5FD0C2]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-[#F4EDDF]">{title}</h2>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-[#F4EDDF]/60">{message}</p>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-block rounded-xl bg-[#E9B23C] px-7 py-3 text-sm font-semibold text-[#2C2221] transition hover:bg-[#f0c05a]"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}
