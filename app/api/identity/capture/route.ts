import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession, saveSession } from "@/lib/session/session"
import { identify, track } from "@/lib/analytics/rudder"

const IdentitySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  source: z.enum(["benefit_result", "booking", "report_download"]),
  benefitSlug: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const input = IdentitySchema.parse(await request.json())
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Session required", code: "SESSION_REQUIRED" }, { status: 401 })
    }

    session.identity = { ...session.identity, name: input.name, email: input.email }
    await saveSession(session)

    await identify({
      anonymousId: session.anonymousId,
      userId: input.email,
      traits: { name: input.name, source: input.source },
    })

    const upsertResponse = await fetch(new URL("/api/lens/lead/upsert", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email, name: input.name, benefitSlug: input.benefitSlug }),
    })

    if (!upsertResponse.ok) {
      return NextResponse.json({ error: "Lead upsert failed", code: "LEAD_UPSERT_FAILED" }, { status: 502 })
    }

    await track({
      anonymousId: session.anonymousId,
      userId: input.email,
      event: "benefit_identity_captured",
      properties: { source: input.source },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Identity capture failed", code: "IDENTITY_CAPTURE_FAILED" }, { status: 400 })
  }
}
