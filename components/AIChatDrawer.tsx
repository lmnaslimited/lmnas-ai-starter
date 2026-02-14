"use client"

import { useEffect, useMemo, useState } from "react"
import GreetingBanner from "@/components/GreetingBanner"
import FollowUpQuestionRenderer from "@/components/FollowUpQuestionRenderer"
import ResultSummaryRenderer from "@/components/ResultSummaryRenderer"
import { useCTAContext } from "@/context/CTAContextProvider"
import type { UserSession } from "@/lib/session/types"
import type { BenefitType, CTAContext, DiscoveryQuestion } from "@/types/aiEngine"

const slugToBenefitType: Record<string, BenefitType> = {
  "roi-calculator": "ROI_CALCULATOR",
  "pipeline-audit": "PIPELINE_AUDIT",
  "cpq-maturity": "CPQ_MATURITY_SCAN",
}

export default function AIChatDrawer() {
  const { isChatOpen, closeChat, benefitSlug } = useCTAContext()
  const [session, setSession] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [followups, setFollowups] = useState<Array<{ id: string; prompt: string }>>([])
  const [result, setResult] = useState<{ summary: string; score?: number; recommendation?: string }>()
  const [context, setContext] = useState<CTAContext | null>(null)
  const [greeting, setGreeting] = useState<string>("")
  const [currentQuestion, setCurrentQuestion] = useState<DiscoveryQuestion | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [answerInput, setAnswerInput] = useState("")

  useEffect(() => {
    if (!isChatOpen) return

    const run = async () => {
      if (!benefitSlug) return

      const benefitType = slugToBenefitType[benefitSlug]
      if (!benefitType) return

      await fetch("/api/session/bootstrap", { method: "POST" })
      const response = await fetch("/api/session/me")
      const json = (await response.json()) as { session: UserSession | null }
      setSession(json.session)

      const initialContext: CTAContext = {
        benefitType,
        industry: "Transformer Manufacturing",
        entryPage: "/",
        leadSource: "Website CTA",
        userIntent: `Run ${benefitType.replaceAll("_", " ")}`,
      }
      setContext(initialContext)

      const chatStartResponse = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: initialContext }),
      })
      const chatStart = await chatStartResponse.json()
      setGreeting(chatStart.greeting)
      setCurrentQuestion(chatStart.question ?? null)
      setAnswers({})
      setAnswerInput("")
      setFollowups([])
      setResult(undefined)
    }

    void run()
  }, [benefitSlug, isChatOpen])

  const fallbackGreeting = useMemo(() => {
    if (session?.identity?.name) return `Welcome back, ${session.identity.name}`
    return `Let's run your ${benefitSlug ?? "benefit"} flow.`
  }, [benefitSlug, session?.identity?.name])

  const runBenefit = async (discoveryAnswers: Record<string, string>) => {
    if (!benefitSlug || !session?.sessionId) return
    setLoading(true)
    const response = await fetch("/api/benefit/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        benefitSlug,
        sessionId: session.sessionId,
        stage: followups.length ? "followup" : "standard_completed",
        answers: Object.entries(discoveryAnswers).map(([questionId, value]) => ({ questionId, value })),
      }),
    })
    const json = await response.json()
    setFollowups(json.followupQuestions ?? [])
    setResult(json.result)
    setLoading(false)
  }

  const submitDiscoveryAnswer = async () => {
    if (!currentQuestion || !context || !answerInput.trim()) return

    const mergedAnswers = { ...answers, [currentQuestion.key]: answerInput.trim() }
    setAnswers(mergedAnswers)
    setAnswerInput("")
    setLoading(true)

    const response = await fetch("/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context, answers: mergedAnswers }),
    })

    const json = await response.json()
    if (json.nextQuestion) {
      setCurrentQuestion(json.nextQuestion)
      setLoading(false)
      return
    }

    setCurrentQuestion(null)
    await runBenefit(mergedAnswers)
  }

  if (!isChatOpen) return null

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t bg-white p-4 shadow-2xl">
      <div className="mx-auto max-w-4xl space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-900">{greeting || fallbackGreeting}</p>
          <button className="text-sm text-slate-600" onClick={closeChat}>Close</button>
        </div>
        <GreetingBanner session={session} />

        {currentQuestion && (
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-900">{currentQuestion.question}</p>
            <div className="flex gap-2">
              <input
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                value={answerInput}
                onChange={(event) => setAnswerInput(event.target.value)}
                placeholder="Type your answer"
              />
              <button
                onClick={submitDiscoveryAnswer}
                disabled={loading || !answerInput.trim()}
                className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                {loading ? "Working..." : "Submit"}
              </button>
            </div>
          </div>
        )}

        {!currentQuestion && !result && (
          <p className="text-sm text-slate-500">Answer the guided questions to run this benefit.</p>
        )}
        <FollowUpQuestionRenderer questions={followups} />
        <ResultSummaryRenderer result={result} />
      </div>
    </aside>
  )
}
