export default function AIStreaming({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
      <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
      AI is thinking...
    </div>
  )
}
