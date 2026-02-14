const DATA_PLANE_URL = "https://hosted.rudderlabs.com/v1"

type EventPayload = {
  anonymousId?: string
  userId?: string
  event: string
  properties?: Record<string, unknown>
}

async function postRudder(endpoint: "track" | "identify", body: Record<string, unknown>) {
  const writeKey = process.env.RUDDERSTACK_WRITE_KEY
  if (!writeKey) return

  try {
    await fetch(`${DATA_PLANE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${writeKey}:`).toString("base64")}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })
  } catch {
    // swallow analytics errors intentionally
  }
}

export async function track(payload: EventPayload) {
  await postRudder("track", payload)
}

export async function identify(payload: {
  anonymousId: string
  userId: string
  traits: Record<string, unknown>
}) {
  await postRudder("identify", payload)
}
