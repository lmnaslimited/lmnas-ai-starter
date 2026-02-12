"use client"

import { useAISessionStore } from "@/store/aiSessionStore"
import AIMessage from "@/components/ai/AIMessage"
import AIInput from "@/components/ai/AIInput"
import AIStreaming from "@/components/ai/AIStreaming"

const progressMap = {
  idle: "Idle",
  discovering: "Discovery in progress",
  running: "Running workflow",
  completed: "Completed",
}

export default function AIChatDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    context,
    messages,
    currentQuestion,
    addMessage,
    saveAnswer,
    setQuestion,
    answers,
    setWorkflowStatus,
    setLoading,
    loading,
    result,
    setResult,
    workflowStatus,
  } = useAISessionStore()

  const progressLabel = progressMap[workflowStatus]

  if (!isDrawerOpen) return null

  const submitAnswer = async (value: string) => {
    if (!currentQuestion || !context) return

    addMessage({ role: "user", content: value })
    saveAnswer(currentQuestion.key, value)
    setLoading(true)

    const mergedAnswers = { ...answers, [currentQuestion.key]: value }

    const streamResponse = await fetch("/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context, answers: mergedAnswers }),
    }).then((res) => res.json())

    if (streamResponse.nextQuestion) {
      addMessage({ role: "assistant", content: streamResponse.message })
      setQuestion(streamResponse.nextQuestion)
      setWorkflowStatus("discovering")
      setLoading(false)
      return
    }

    setWorkflowStatus("running")

    const resultResponse = await fetch("/api/benefit/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context, answers: mergedAnswers }),
    }).then((res) => res.json())

    addMessage({ role: "assistant", content: resultResponse.analysis })
    setResult(resultResponse)
    setQuestion(undefined)
    setWorkflowStatus("completed")
    setLoading(false)
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white shadow-2xl">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">AI Interaction Layer</p>
            <p className="text-sm font-medium text-slate-900">
              {context?.benefitType.replaceAll("_", " ")} · {progressLabel}
            </p>
          </div>
          <button onClick={closeDrawer} className="text-sm text-slate-600">Close</button>
        </div>

        <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
          {messages.map((message) => (
            <AIMessage key={message.id} message={message} />
          ))}
          <AIStreaming active={loading} />
        </div>

        {currentQuestion && (
          <div className="mt-3 rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-medium text-slate-900">{currentQuestion.question}</p>
            <AIInput
              inputType={currentQuestion.inputType}
              options={currentQuestion.options}
              onSubmit={submitAnswer}
            />
          </div>
        )}

        {result && (
          <div className="mt-3 grid gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase">Score</p>
              <p className="text-lg font-semibold">{result.score}/100</p>
            </div>
            <div>
              <p className="text-xs uppercase">Recommendation</p>
              <p>{result.recommendation}</p>
            </div>
            <div>
              <p className="text-xs uppercase">North Star</p>
              <p>{result.northStarAction}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
