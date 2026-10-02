"use client";

import { useEffect, useRef, useTransition } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { Kicker } from "@/components/ui/editorial";
import { EditorialButton } from "@/components/ui/editorial-button";

export default function ErrorPage({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main
      id="conteudo"
      tabIndex={-1}
      className="flex-1"
      style={{ background: "var(--nb-page-bg)" }}
    >
      <title>Página indisponível — Kariri Valley</title>
      <div className="mx-auto max-w-[1300px] px-5 py-16 sm:px-8 sm:py-24 lg:px-16">
        <div className="max-w-[720px]">
          <Kicker style={{ margin: "0 0 20px" }}>
            Não foi possível carregar esta página
          </Kicker>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="kv-display focus:outline-none"
            style={{
              fontSize: "clamp(40px, 5vw, 68px)",
              color: "var(--nb-heading)",
              margin: 0,
              textWrap: "balance",
            }}
          >
            Esta página está indisponível <em>agora.</em>
          </h1>
          <p
            className="mt-6 max-w-[560px] text-base leading-[1.8] sm:text-lg"
            style={{ color: "var(--nb-body-strong)" }}
          >
            Tente carregar novamente. Se o problema continuar, você pode voltar
            ao início ou visitar os registros dos encontros na nossa galeria.
          </p>
          <div className="mt-8 flex flex-wrap gap-4" aria-busy={pending}>
            <EditorialButton
              size="lg"
              className="kv-press"
              disabled={pending}
              onClick={() => startTransition(unstable_retry)}
            >
              <RefreshCw
                size={18}
                aria-hidden="true"
                className={pending ? "animate-spin motion-reduce:animate-none" : undefined}
              />
              Tentar novamente
            </EditorialButton>
            <EditorialButton href="/" variant="ghost" size="lg">
              Voltar ao início
            </EditorialButton>
            <EditorialButton href="/galeria" variant="ghost" size="lg">
              Conhecer a galeria
              <ArrowUpRight size={18} aria-hidden="true" />
            </EditorialButton>
          </div>
          <p
            role="status"
            className="mt-3 min-h-6 text-sm leading-6"
            style={{ color: "var(--nb-body)" }}
          >
            {pending ? "Nova tentativa em andamento…" : ""}
          </p>
        </div>
      </div>
    </main>
  );
}
