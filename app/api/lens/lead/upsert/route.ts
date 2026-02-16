import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession, saveSession } from "@/lib/session/session"
import { upsertLensLead } from "@/lib/lens/client"

const UpsertSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  benefitSlug: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const input = UpsertSchema.parse(await request.json())
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Session required", code: "SESSION_REQUIRED" }, { status: 401 })
    }

    const payload = {
      email: input.email,
      name: input.name,
      anonymousId: session.anonymousId,
      geo: session.enrichment,
      source: "Benefit Creator",
      campaign: input.benefitSlug,
    }

    let leadId: string | null = null
    let attempts = 0
    while (attempts < 2 && !leadId) {
      attempts += 1
      try {
        const response = await upsertLensLead(payload)
        leadId = response.leadId
      } catch (error) {
        console.error(JSON.stringify({ msg: "lens_upsert_attempt_failed", attempts, err: String(error) }))
      }
    }

    if (!leadId) {
      return NextResponse.json({ error: "LENS upsert failed", code: "LENS_UPSERT_FAILED" }, { status: 502 })
    }

    session.identity = {
      name: input.name ?? session.identity?.name ?? "",
      email: input.email,
      lensLeadId: leadId,
    }
    await saveSession(session)

    return NextResponse.json({ ok: true, leadId })
  } catch {
    return NextResponse.json({ error: "Invalid request", code: "LENS_UPSERT_INVALID" }, { status: 400 })
  }
}
