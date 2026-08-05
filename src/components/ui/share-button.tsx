"use client"

import { useState } from "react"
import { Check, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareButtonProps {
  title: string
  text?: string
  /** id do elemento âncora na página, usado para linkar direto ao item compartilhado. */
  anchorId?: string
  /** Caminho dedicado do item (ex. `/agenda/meu-evento`), com preview de link correto. Tem prioridade sobre `anchorId`. */
  path?: string
  className?: string
  style?: React.CSSProperties
}

export function ShareButton({ title, text, anchorId, path, className, style }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = path
      ? `${window.location.origin}${path}`
      : `${window.location.origin}${window.location.pathname}${anchorId ? `#${anchorId}` : ""}`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // usuário cancelou o compartilhamento nativo — não é um erro a reportar
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // navegador sem permissão/suporte a clipboard — botão simplesmente não reage
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Compartilhar"
      className={cn("inline-flex items-center gap-1.5", className)}
      style={style}
    >
      {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
      {copied ? "Copiado!" : "Compartilhar"}
    </button>
  )
}
