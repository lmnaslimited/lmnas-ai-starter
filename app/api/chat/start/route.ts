import { NextResponse } from "next/server"
import { getBenefitQuestions } from "@/lib/benefitQuestionsRepository"
import { CTAContext } from "@/types/aiEngine"

export async function POST(request: Request) {
  const { context } = (await request.json()) as { context: CTAContext }
  const questions = await getBenefitQuestions(context.benefitType)
  const firstQuestion = questions[0]

  return NextResponse.json({
    greeting: `Great choice. I will run a ${context.benefitType.replaceAll("_", " ")} with you and keep this under 2 clicks from insight to action.`,
    question: firstQuestion,
  })
}
