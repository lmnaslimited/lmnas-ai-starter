"use client"

import { createContext, ReactNode, useContext } from "react"
import { useAISessionStore } from "@/store/aiSessionStore"
import { BenefitType, CTAContext } from "@/types/aiEngine"

type CTAContextValue = {
  launchFromCTA: (benefitType: BenefitType, intent: string) => Promise<void>
}

const AICTAContext = createContext<CTAContextValue | null>(null)

const intentMap: Record<BenefitType, string> = {
  ROI_CALCULATOR: "Evaluate ROI",
  PIPELINE_AUDIT: "Diagnose pipeline friction",
  CPQ_MATURITY_SCAN: "Assess CPQ readiness",
  SALES_CYCLE_ANALYZER: "Reduce sales cycle length",
  TENDER_COMPLEXITY_SCORE: "Score tender complexity",
}

export function CTAContextProvider({ children }: { children: ReactNode }) {
  const {
    openDrawer,
    resetSession,
    setContext,
    setLoading,
    setQuestion,
    addMessage,
    setWorkflowStatus,
  } = useAISessionStore()

  const launchFromCTA = async (benefitType: BenefitType, intent?: string) => {
    const context: CTAContext = {
      benefitType,
      industry: "Transformer Manufacturing",
      entryPage: "/",
      leadSource: "Website CTA",
      userIntent: intent || intentMap[benefitType],
    }

    resetSession()
    setContext(context)
    openDrawer()
    setLoading(true)

    try {
      const response = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      })

      const data = await response.json()
      addMessage({ role: "assistant", content: data.greeting })
      setQuestion(data.question)
      setWorkflowStatus("discovering")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AICTAContext.Provider value={{ launchFromCTA }}>
      {children}
    </AICTAContext.Provider>
  )
}

export function useCTAContext() {
  const value = useContext(AICTAContext)
  if (!value) {
    throw new Error("useCTAContext must be used within CTAContextProvider")
  }
  return value
}
