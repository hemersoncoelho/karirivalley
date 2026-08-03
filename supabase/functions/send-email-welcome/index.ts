import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { WELCOME_IMAGE_BASE64 } from "./welcome-image.ts"

const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET")
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const FROM_ADDRESS = "Kariri Valley <boasvindas@karirivalley.com.br>"

interface MemberApprovedPayload {
  member_id: string
  full_name: string
  display_name: string | null
  email: string
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

function buildWelcomeHtml(name: string): string {
  return `<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
  <img src="cid:welcome-image" alt="Bem-vindo à Kariri Valley" style="width: 100%; border-radius: 8px; display: block;" />
  <div style="padding: 24px 8px;">
    <p style="font-size: 18px; font-weight: bold; margin: 0 0 16px;">🌱 Bem-vindo(a) à Kariri Valley, ${name}!</p>
    <p style="margin: 0 0 16px;">Sua participação foi aprovada 🎉</p>
    <p style="margin: 0 0 16px;">Para acessar sua conta, basta digitar o seu e-mail e a senha que você configurou inicialmente.</p>
    <p style="margin: 0 0 8px;">Depois de entrar, você já pode:</p>
    <p style="margin: 0 0 4px;">✅ Completar seu perfil</p>
    <p style="margin: 0 0 4px;">✅ Aparecer no diretório de membros</p>
    <p style="margin: 0 0 16px;">✅ Se conectar com empreendedores, devs, investidores e mentores da região</p>
    <p style="margin: 0 0 16px;">Estamos muito felizes em ter você com a gente. Vamos construir o futuro do Cariri juntos! 🚀</p>
    <p style="margin: 0; color: #666;">— Equipe Kariri Valley</p>
  </div>
</div>`
}

function buildWelcomeText(name: string): string {
  return `🌱 Bem-vindo(a) à Kariri Valley, ${name}!

Sua participação foi aprovada 🎉

Para acessar sua conta, basta digitar o seu e-mail e a senha que você configurou inicialmente.

Depois de entrar, você já pode:
✅ Completar seu perfil
✅ Aparecer no diretório de membros
✅ Se conectar com empreendedores, devs, investidores e mentores da região

Estamos muito felizes em ter você com a gente. Vamos construir o futuro do Cariri juntos! 🚀

— Equipe Kariri Valley`
}

async function callResend(body: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
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

  if (!RESEND_API_KEY) {
    console.error("send-email-welcome: RESEND_API_KEY não configurado")
    return jsonResponse({ error: "resend_not_configured" }, 500)
  }

  let payload: MemberApprovedPayload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400)
  }

  if (!payload.email || !payload.full_name) {
    return jsonResponse({ error: "missing_fields" }, 400)
  }

  const name = payload.display_name?.trim() || firstName(payload.full_name)

  const emailResult = await callResend({
    from: FROM_ADDRESS,
    to: [payload.email],
    subject: "Bem-vindo(a) à Kariri Valley! 🌱",
    html: buildWelcomeHtml(name),
    text: buildWelcomeText(name),
    attachments: [
      {
        content: WELCOME_IMAGE_BASE64,
        filename: "boas-vindas-membro.jpg",
        content_id: "welcome-image",
      },
    ],
  })

  if (!emailResult.ok) {
    console.error("send-email-welcome: falha ao enviar e-mail", emailResult.status, emailResult.result)
    return jsonResponse({ error: "resend_failed", detail: emailResult.result }, 502)
  }

  return jsonResponse({ success: true, member_id: payload.member_id, email: emailResult.result }, 200)
})
