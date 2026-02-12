"use client"

export type QuestionOption = {
  id: string
  label: string
  nextStep?: string
}

type Props = {
  options: QuestionOption[]
  onSelect: (opt: QuestionOption) => void
}

export default function AIOptionsInput({
  options,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt)}
          className="border p-4 rounded-lg hover:bg-gray-50 transition"
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
