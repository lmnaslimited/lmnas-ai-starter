"use client"

import { FormEvent, useState } from "react"

type Props = {
  onSubmit: (value: string) => void
  options?: string[]
  inputType: "text" | "number" | "options"
}

export default function AIInput({ onSubmit, options, inputType }: Props) {
  const [value, setValue] = useState("")

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!value.trim()) return
    onSubmit(value)
    setValue("")
  }

  if (inputType === "options" && options?.length) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSubmit(option)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
          >
            {option}
          </button>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <input
        type={inputType === "number" ? "number" : "text"}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type your answer"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-700"
      />
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Send
      </button>
    </form>
  )
}
