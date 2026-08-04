import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

const URL_REGEX = /(https?:\/\/[^\s]+)/g

function isUrl(segment: string): boolean {
  return segment.startsWith("http://") || segment.startsWith("https://")
}

/** Renderiza texto livre preservando quebras de linha e transformando URLs em links clicáveis. */
export function LinkifiedText({
  text,
  className,
  style,
}: {
  text: string
  className?: string
  style?: CSSProperties
}) {
  const parts = text.split(URL_REGEX)

  return (
    <p className={cn("whitespace-pre-line", className)} style={style}>
      {parts.map((part, i) =>
        isUrl(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline underline-offset-2 hover:opacity-80"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </p>
  )
}
