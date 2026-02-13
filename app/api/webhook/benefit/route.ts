import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const payload = await request.json()

  return NextResponse.json({
    status: "queued",
    provider: "n8n-mock",
    receivedAt: new Date().toISOString(),
    payload,
  })
}
