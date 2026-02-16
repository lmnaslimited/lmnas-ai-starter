export default function ResultSummaryRenderer({
  result,
}: {
  result?: { summary: string; score?: number; recommendation?: string }
}) {
  if (!result) return null

  return (
    <div className="space-y-1 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
      <p className="font-semibold">Result Summary</p>
      <p>{result.summary}</p>
      {typeof result.score === "number" ? <p>Score: {result.score}</p> : null}
      {result.recommendation ? <p>Recommendation: {result.recommendation}</p> : null}
    </div>
  )
}
