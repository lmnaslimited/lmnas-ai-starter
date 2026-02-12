export type QuestionOption = {
  id: string
  label: string
  nextStep?: string
}

type Props = {
  options: QuestionOption[]
  onSelect?: (opt: QuestionOption) => void
}

export default function AIOptionsInput({ options, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <button key={opt.id} onClick={() => onSelect?.(opt)} className="rounded border px-3 py-2 text-sm">
          {opt.label}
        </button>
      ))}
    </div>
  )
}
