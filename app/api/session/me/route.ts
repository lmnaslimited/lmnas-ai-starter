import { NextResponse } from "next/server"
import { getSession } from "@/lib/session/session"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ ok: true, session: null })
    }

    return NextResponse.json({
      ok: true,
      session: {
        sessionId: session.sessionId,
        anonymousId: session.anonymousId,
        identity: session.identity,
        enrichment: session.enrichment,
        benefitHistory: session.benefitHistory,
      },
    })
  } catch {
    return NextResponse.json({ error: "Unable to read session", code: "SESSION_READ_FAILED" }, { status: 500 })
  }
}
