import { NextResponse } from "next/server"
import { buildRAGPrompt } from "@/lib/ragPromptBuilder"
import { BenefitResult, CTAContext } from "@/types/aiEngine"

function scoreFromAnswers(answers: Record<string, string>) {
  const numericValues = Object.values(answers)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))

  if (!numericValues.length) return 72
  const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
  return Math.max(55, Math.min(96, Math.round(100 - avg / 2)))
}

export async function POST(request: Request) {
  const { context, answers } = (await request.json()) as {
    context: CTAContext
    answers: Record<string, string>
  }

  await fetch(`${new URL(request.url).origin}/api/webhook/benefit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userData: { industry: context.industry, leadSource: context.leadSource },
      benefitType: context.benefitType,
      answers,
    }),
  })

  const prompt = buildRAGPrompt(context, answers)
  const score = scoreFromAnswers(answers)

  const result: BenefitResult = {
    analysis: `Analysis complete. Based on your inputs, LMNAs AI suggests immediate automation opportunities and improved conversion confidence.`,
    score,
    recommendation:
      score < 75
        ? "Run a 2-week pipeline remediation sprint with AI-led qualification rules."
        : "Scale with AI quote copilots and forecast coaching across the team.",
    northStarAction:
      context.benefitType === "ROI_CALCULATOR" ? "Generate ROI Report" : "Book Demo",
  }

  return NextResponse.json({ ...result, promptUsed: prompt })
}
