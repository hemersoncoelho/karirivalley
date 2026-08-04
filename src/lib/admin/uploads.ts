import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { ACCEPTED_PHOTO_TYPES, validatePhotoFile } from "@/lib/onboarding/schemas"

export { validatePhotoFile, ACCEPTED_PHOTO_TYPES }

const PHOTO_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

/** Upload da imagem de capa do evento (bucket event-banners, escrita restrita a admin). */
export async function uploadEventBanner(eventId: string, file: File): Promise<string> {
  const supabase = getSupabaseBrowserClient()
  const extension = PHOTO_EXTENSIONS[file.type] ?? "jpg"
  const path = `${eventId}/banner-${Date.now()}.${extension}`

  const { error } = await supabase.storage
    .from("event-banners")
    .upload(path, file, { cacheControl: "3600", upsert: false })
  if (error) throw new Error(`Não foi possível enviar a imagem do evento: ${error.message}`)

  const { data } = supabase.storage.from("event-banners").getPublicUrl(path)
  return data.publicUrl
}
