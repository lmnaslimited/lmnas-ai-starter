"use client"

import { useAISessionStore } from "@/store/aiSessionStore"
import AIInsightBlock from "./AIInsightBlock"
import AIOptionsInput, {
  QuestionOption,
} from "./AIOptionsInput"

export type AIQuestionData = {
  id: string
  question: string
  insight?: string
  options: QuestionOption[]
}

type Props = {
  data: AIQuestionData
}

export default function AIQuestionBlock({
  data,
}: Props) {
  const nextStep = useAISessionStore(
    (s) => s.nextStep
  )
  const setAnswer = useAISessionStore(
    (s) => s.setAnswer
  )

  const handleSelect = (opt: QuestionOption) => {
    setAnswer(data.id, opt.id)
    nextStep()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">
        {data.question}
      </h2>

      <AIOptionsInput
        options={data.options}
        onSelect={handleSelect}
      />

      {data.insight && (
        <AIInsightBlock text={data.insight} />
      )}
    </div>
  )
}
