"use client"

import { useEffect, useMemo, useState } from "react"
import GreetingBanner from "@/components/GreetingBanner"
import FollowUpQuestionRenderer from "@/components/FollowUpQuestionRenderer"
import ResultSummaryRenderer from "@/components/ResultSummaryRenderer"
import { useCTAContext } from "@/context/CTAContextProvider"
import type { UserSession } from "@/lib/session/types"

export default function AIChatDrawer() {
  const { isChatOpen, closeChat, benefitSlug } = useCTAContext()
  const [session, setSession] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [followups, setFollowups] = useState<Array<{ id: string; prompt: string }>>([])
  const [result, setResult] = useState<{ summary: string; score?: number; recommendation?: string }>()

  useEffect(() => {
    if (!isChatOpen) return

    const run = async () => {
      await fetch("/api/session/bootstrap", { method: "POST" })
      const response = await fetch("/api/session/me")
      const json = (await response.json()) as { session: UserSession | null }
      setSession(json.session)
    }

    void run()
  }, [isChatOpen])

  const greeting = useMemo(() => {
    if (session?.identity?.name) return `Welcome back, ${session.identity.name}`
    return `Let's run your ${benefitSlug ?? "benefit"} flow.`
  }, [benefitSlug, session?.identity?.name])

  const runBenefit = async () => {
    if (!benefitSlug || !session?.sessionId) return
    setLoading(true)
    const response = await fetch("/api/benefit/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        benefitSlug,
        sessionId: session.sessionId,
        stage: followups.length ? "followup" : "standard_completed",
        answers: [{ questionId: "headcount", value: 8 }],
      }),
    })
    const json = await response.json()
    setFollowups(json.followupQuestions ?? [])
    setResult(json.result)
    setLoading(false)
  }

  if (!isChatOpen) return null

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t bg-white p-4 shadow-2xl">
      <div className="mx-auto max-w-4xl space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-900">{greeting}</p>
          <button className="text-sm text-slate-600" onClick={closeChat}>Close</button>
        </div>
        <GreetingBanner session={session} />
        <button
          onClick={runBenefit}
          disabled={loading || !session}
          className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? "Running..." : "Run Benefit"}
        </button>
        <FollowUpQuestionRenderer questions={followups} />
        <ResultSummaryRenderer result={result} />
      </div>
    </aside>
  )
}
