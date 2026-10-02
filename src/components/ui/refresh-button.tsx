"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-busy={pending}
      onClick={() => startTransition(() => router.refresh())}
      className="min-h-11 min-w-[136px] cursor-pointer underline underline-offset-4 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Atualizando…" : "Tentar novamente"}
    </button>
  );
}
