import { z } from "zod"

const LensResponseSchema = z.object({
  leadId: z.string(),
})

export async function upsertLensLead(payload: Record<string, unknown>) {
  const baseUrl = process.env.LENS_CRM_API_URL
  const apiKey = process.env.LENS_CRM_API_KEY
  if (!baseUrl || !apiKey) {
    throw new Error("lens_not_configured")
  }

  const response = await fetch(`${baseUrl}/leads/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error("lens_upsert_failed")
  }

  const json: unknown = await response.json()
  return LensResponseSchema.parse(json)
}
