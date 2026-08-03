import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { WELCOME_IMAGE_DATA_URI } from "./welcome-image.ts"

const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET")
const UAZAPI_BASE_URL = Deno.env.get("UAZAPI_BASE_URL")
const UAZAPI_TOKEN = Deno.env.get("UAZAPI_TOKEN")

interface MemberApprovedPayload {
  member_id: string
  full_name: string
  display_name: string | null
  phone: string
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

/** Uazapi espera dígitos com DDI, sem "+" (ex.: 5588999999999). */
function formatBrazilianWhatsappNumber(raw: string): string | null {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return null
  if (digits.startsWith("55")) return digits
  if (digits.length === 10 || digits.length === 11) return `55${digits}`
  return digits
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

function buildWelcomeCaption(name: string): string {
  return `🌱 Bem-vindo(a) à Kariri Valley, ${name}!

Sua participação foi aprovada 🎉

Para acessar sua conta, basta digitar o seu email e senha que configurou inicialmente

Depois de entrar, você já pode:
✅ Completar seu perfil
✅ Aparecer no diretório de membros
✅ Se conectar com empreendedores, devs, investidores e mentores da região

Estamos muito felizes em ter você com a gente. Vamos construir o futuro do Cariri juntos! 🚀

— Equipe Kariri Valley`
}

async function callUazapi(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${UAZAPI_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: UAZAPI_TOKEN as string,
    },
    body: JSON.stringify(body),
  })
  const result = await response.json().catch(() => null)
  return { ok: response.ok, status: response.status, result }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405)
  }

  if (!WEBHOOK_SECRET || req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return jsonResponse({ error: "unauthorized" }, 401)
  }

  if (!UAZAPI_BASE_URL || !UAZAPI_TOKEN) {
    console.error("send-whatsapp-welcome: UAZAPI_BASE_URL/UAZAPI_TOKEN não configurados")
    return jsonResponse({ error: "uazapi_not_configured" }, 500)
  }

  let payload: MemberApprovedPayload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400)
  }

  if (!payload.phone || !payload.full_name) {
    return jsonResponse({ error: "missing_fields" }, 400)
  }

  const number = formatBrazilianWhatsappNumber(payload.phone)
  if (!number) {
    return jsonResponse({ error: "invalid_phone" }, 400)
  }

  const name = payload.display_name?.trim() || firstName(payload.full_name)
  const text = buildWelcomeCaption(name)

  // Uazapi não aplica o campo "caption" em /send/media de forma confiável,
  // então a imagem e o texto são enviados como duas mensagens separadas.
  const mediaResult = await callUazapi("/send/media", {
    number,
    type: "image",
    file: WELCOME_IMAGE_DATA_URI,
  })

  if (!mediaResult.ok) {
    console.error("send-whatsapp-welcome: falha ao enviar imagem", mediaResult.status, mediaResult.result)
    return jsonResponse({ error: "uazapi_media_failed", detail: mediaResult.result }, 502)
  }

  const textResult = await callUazapi("/send/text", { number, text })

  if (!textResult.ok) {
    console.error("send-whatsapp-welcome: falha ao enviar texto", textResult.status, textResult.result)
    return jsonResponse(
      { success: false, member_id: payload.member_id, media: mediaResult.result, error: "uazapi_text_failed", detail: textResult.result },
      502
    )
  }

  return jsonResponse(
    { success: true, member_id: payload.member_id, media: mediaResult.result, text: textResult.result },
    200
  )
})
