import { NextResponse } from "next/server"
import { benefitQuestions } from "@/data/workflows/benefitWorkflows"
import { CTAContext } from "@/types/aiEngine"

export async function POST(request: Request) {
  const { context } = (await request.json()) as { context: CTAContext }
  const firstQuestion = benefitQuestions[context.benefitType][0]

  return NextResponse.json({
    greeting: `Great choice. I will run a ${context.benefitType.replaceAll("_", " ")} with you and keep this under 2 clicks from insight to action.`,
    question: firstQuestion,
  })
}
