import { NextResponse } from "next/server"
import { benefitQuestions } from "@/data/workflows/benefitWorkflows"
import { CTAContext } from "@/types/aiEngine"

export async function POST(request: Request) {
  const { context, answers } = (await request.json()) as {
    context: CTAContext
    answers: Record<string, string>
  }

  const flow = benefitQuestions[context.benefitType]
  const answeredCount = Object.keys(answers).length
  const nextQuestion = flow[answeredCount]

  if (!nextQuestion) {
    return NextResponse.json({
      message: "Perfect. I have enough data. Running analysis now.",
      nextQuestion: null,
    })
  }

  return NextResponse.json({
    message: "Thanks. One more input so I can personalize this output.",
    nextQuestion,
  })
}
