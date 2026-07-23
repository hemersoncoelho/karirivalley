import { z } from "zod"

const acceptRequired = (message: string) =>
  z.boolean().refine((value) => value === true, message)

/** Etapa 1 — Conta */
export const accountBaseSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo (mínimo 3 letras)")
    .max(120, "Nome muito longo (máximo 120 caracteres)"),
  email: z.email("Informe um e-mail válido"),
  acceptTerms: acceptRequired("É preciso aceitar os termos de uso"),
  acceptPrivacy: acceptRequired("É preciso aceitar a política de privacidade"),
})

export const accountPasswordSchema = accountBaseSchema.extend({
  password: z
    .string()
    .min(8, "A senha precisa ter pelo menos 8 caracteres")
    .max(72, "Senha muito longa"),
})

export type AccountData = z.infer<typeof accountPasswordSchema>

/** Etapa 2 — Dados básicos */
export const basicsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Informe o nome que aparecerá no seu perfil")
    .max(80, "Máximo de 80 caracteres"),
  city: z
    .string()
    .trim()
    .min(2, "Informe sua cidade")
    .max(80, "Máximo de 80 caracteres"),
  state: z.string().length(2, "Selecione o estado"),
  bio: z.string().trim().max(300, "A mini bio tem limite de 300 caracteres").optional().or(z.literal("")),
  company: z.string().trim().max(120, "Máximo de 120 caracteres").optional().or(z.literal("")),
  position: z.string().trim().max(120, "Máximo de 120 caracteres").optional().or(z.literal("")),
  whatsapp: z
    .string()
    .trim()
    .max(20, "Máximo de 20 caracteres")
    .refine((value) => value === "" || /^[\d\s()+-]{8,20}$/.test(value), "Informe um número válido")
    .optional()
    .or(z.literal("")),
})

export type BasicsData = z.infer<typeof basicsSchema>

/** RN-011 — foto: máx. 2MB, JPG/PNG/WebP */
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function validatePhotoFile(file: File): string | null {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return "Formato inválido — use JPG, PNG ou WebP"
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return "A foto precisa ter no máximo 2MB"
  }
  return null
}
