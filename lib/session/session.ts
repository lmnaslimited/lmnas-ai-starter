import { cookies } from "next/headers"
import { createHmac } from "node:crypto"
import type { UserSession } from "@/lib/session/types"

const COOKIE_NAME = "lmnas_session"
const DEFAULT_SECRET = "dev-session-secret-change-me"

function getSecret() {
  return process.env.SESSION_SECRET ?? DEFAULT_SECRET
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex")
}

function encodeSession(data: UserSession) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url")
  const signature = sign(payload)
  return `${payload}.${signature}`
}

function decodeSession(raw: string): UserSession | null {
  const [payload, signature] = raw.split(".")
  if (!payload || !signature || sign(payload) !== signature) {
    return null
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as UserSession
  } catch {
    return null
  }
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(COOKIE_NAME)?.value
  if (!raw) {
    return null
  }
  return decodeSession(raw)
}

export async function saveSession(session: UserSession): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}
