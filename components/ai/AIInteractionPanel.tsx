"use client"

import { useAISessionStore } from "@/store/aiSessionStore"
import { pipelineAuditWorkflow } from "@/data/mockWorkflow"
import AIQuestionBlock, { AIQuestionData } from "./AIQuestionBlock"
import AIResultDashboard from "./AIResultDashboard"

export default function AIInteractionPanel() {
  const { visible, step } = useAISessionStore()

  if (!visible) return null

  // Explicitly type current step data
  const currentStep: AIQuestionData | undefined =
    pipelineAuditWorkflow[step]

  if (!currentStep) {
    return <AIResultDashboard />
  }

  return (
    <div className="max-w-3xl mx-auto mt-16">
      <AIQuestionBlock data={currentStep} />
    </div>
  )
}

