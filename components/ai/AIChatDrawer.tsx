"use client"

import { useEffect, useMemo, useState } from "react"
import { useCTAContext } from "@/context/CTAContextProvider"
import type { UserSession } from "@/lib/session/types"
import type { BenefitType, CTAContext, DiscoveryQuestion } from "@/types/aiEngine"
import AIInput from "@/components/ai/AIInput"
import GreetingBanner from "@/components/GreetingBanner"
import FollowUpQuestionRenderer from "@/components/ai/FollowUpQuestionRenderer"
import ResultSummaryRenderer from "@/components/ai/ResultSummaryRenderer"

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

  useEffect(() => {
    if (!isChatOpen || !benefitSlug) return

    const run = async () => {
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
      setFollowups([])
      setResult(undefined)
      setLoading(false)
    }

    void run()
  }, [benefitSlug, isChatOpen])

  const fallbackGreeting = useMemo(() => {
    if (session?.identity?.name) return `Welcome back, ${session.identity.name}`
    return `Let's run your ${benefitSlug ?? "benefit"} flow.`
  }, [benefitSlug, session?.identity?.name])

  const runBenefit = async (discoveryAnswers: Record<string, string>) => {
    if (!benefitSlug || !session?.sessionId) return

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
  }

  const submitDiscoveryAnswer = async (answer: string) => {
    if (!currentQuestion || !context || !answer.trim()) return

    const mergedAnswers = { ...answers, [currentQuestion.key]: answer.trim() }
    setAnswers(mergedAnswers)
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
    setLoading(false)
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
            <AIInput
              inputType={currentQuestion.inputType}
              options={currentQuestion.options}
              onSubmit={submitDiscoveryAnswer}
            />
            {loading ? <p className="text-xs text-slate-500">Working...</p> : null}
          </div>
        )}

        {!currentQuestion && !result && !followups.length ? (
          <p className="text-sm text-slate-500">Answer the guided questions to run this benefit.</p>
        ) : null}

        {followups.length ? <FollowUpQuestionRenderer questions={followups} /> : <ResultSummaryRenderer result={result} />}
      </div>
    </aside>
  )
}
