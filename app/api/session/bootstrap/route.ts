import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { cacheGet, cacheSet } from "@/lib/redis/client"
import { track } from "@/lib/analytics/rudder"
import { getSession, saveSession } from "@/lib/session/session"
import type { UserSession } from "@/lib/session/types"

const WhoisSchema = z.object({
  ip: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  connection: z.object({ org: z.string().optional() }).optional(),
})

async function fetchWhois(ip: string) {
  const key = process.env.WHOIS_IP_API_KEY
  if (!key || !ip) {
    return undefined
  }

  const res = await fetch(`https://ipwho.is/${ip}?apiKey=${key}`)
  if (!res.ok) return undefined
  const json: unknown = await res.json()
  const parsed = WhoisSchema.safeParse(json)
  if (!parsed.success) return undefined

  return {
    ip,
    city: parsed.data.city,
    region: parsed.data.region,
    country: parsed.data.country,
    org: parsed.data.connection?.org,
    enrichedAt: new Date().toISOString(),
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? ""
    const existing = (await getSession()) ?? {
      sessionId: crypto.randomUUID(),
      anonymousId: crypto.randomUUID(),
    }

    if (existing.enrichment?.ip !== currentIp) {
      const emailKey = existing.identity?.email ? `geo:email:${existing.identity.email}` : null
      const ipKey = currentIp ? `geo:ip:${currentIp}` : null
      const cached =
        (emailKey ? await cacheGet(emailKey) : null) ?? (ipKey ? await cacheGet(ipKey) : null)

      if (cached) {
        existing.enrichment = JSON.parse(cached)
      } else if (currentIp) {
        const whois = await fetchWhois(currentIp)
        if (whois) {
          existing.enrichment = whois
          if (ipKey) await cacheSet(ipKey, JSON.stringify(whois), 60 * 60 * 24 * 30)
          if (emailKey) await cacheSet(emailKey, JSON.stringify(whois), 60 * 60 * 24 * 30)
        }
      }
    }

    await saveSession(existing as UserSession)
    await track({
      anonymousId: existing.anonymousId,
      event: "benefit_session_started",
      properties: { sessionId: existing.sessionId },
    })

    return NextResponse.json({ ok: true, session: existing })
  } catch {
    return NextResponse.json({ error: "Unable to bootstrap session", code: "SESSION_BOOTSTRAP_FAILED" }, { status: 500 })
  }
}
