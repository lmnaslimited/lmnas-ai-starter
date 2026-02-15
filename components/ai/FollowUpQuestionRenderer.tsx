export default function FollowUpQuestionRenderer({
  questions,
}: {
  questions: Array<{ id: string; prompt: string }>
}) {
  if (!questions.length) return null

  return (
    <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
      <p className="text-xs font-semibold uppercase text-amber-700">Follow-up questions</p>
      {questions.map((question) => (
        <p key={question.id} className="text-sm text-amber-900">• {question.prompt}</p>
      ))}
    </div>
  )
}
