"use client"

import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-[15px] text-[#F4EDDF] placeholder:text-[#F4EDDF]/35 outline-none transition focus:border-[#E9B23C]/60 focus:ring-2 focus:ring-[#E9B23C]/20"

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
}

export function Field({ label, htmlFor, error, hint, optional, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="flex items-baseline gap-2 text-sm font-medium text-[#F4EDDF]/90">
        {label}
        {optional && <span className="text-xs font-normal text-[#F4EDDF]/40">opcional</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[#F4EDDF]/40">{hint}</p>}
      {error && <p className="text-xs text-[#E0715A]" role="alert">{error}</p>}
    </div>
  )
}

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClass, className)} {...props} />
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(inputClass, "min-h-24 resize-y", className)} {...props} />
}

export function SelectInput({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(inputClass, "appearance-none bg-[#2C2221]", className)} {...props}>
      {children}
    </select>
  )
}

interface CheckboxRowProps extends ComponentProps<"input"> {
  label: ReactNode
  error?: string
}

export function CheckboxRow({ label, error, id, className, ...props }: CheckboxRowProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-[#F4EDDF]/80">
        <input
          type="checkbox"
          id={id}
          className={cn("mt-0.5 size-4 shrink-0 cursor-pointer accent-[#E9B23C]", className)}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <p className="pl-7 text-xs text-[#E0715A]" role="alert">{error}</p>}
    </div>
  )
}

interface ChipProps {
  selected: boolean
  onClick: () => void
  children: ReactNode
}

export function Chip({ selected, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
        selected
          ? "border-[#239D8C] bg-[#239D8C]/25 text-[#5FD0C2] shadow-[0_0_0_1px_#239D8C]"
          : "border-white/12 bg-white/[0.04] text-[#F4EDDF]/75 hover:border-white/25 hover:bg-white/[0.08]"
      )}
    >
      {children}
    </button>
  )
}

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function ToggleRow({ label, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5",
        disabled && "opacity-50"
      )}
    >
      <div>
        <p className="text-sm font-medium text-[#F4EDDF]/90">{label}</p>
        {description && <p className="text-xs text-[#F4EDDF]/45">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[#239D8C]" : "bg-white/15"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-[#F4EDDF] transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  )
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-[#E0715A]/40 bg-[#E0715A]/10 px-4 py-3 text-sm text-[#F09070]"
    >
      {message}
    </div>
  )
}

interface StepButtonsProps {
  onBack?: () => void
  submitting: boolean
  submitLabel?: string
}

export function StepButtons({ onBack, submitting, submitLabel = "Continuar" }: StepButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-[#F4EDDF]/70 transition hover:bg-white/5 hover:text-[#F4EDDF] disabled:opacity-50"
        >
          Voltar
        </button>
      ) : (
        <span />
      )}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-[#E9B23C] px-7 py-3 text-sm font-semibold text-[#2C2221] transition hover:bg-[#f0c05a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Salvando…" : submitLabel}
      </button>
    </div>
  )
}
