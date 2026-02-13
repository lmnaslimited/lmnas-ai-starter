import { create } from "zustand"
import { AIWorkflow } from "@/types/aiEngine"

type State = {
  workflow?: AIWorkflow
  currentNodeId?: string
  answers: Record<string, unknown>

  startWorkflow: (wf: AIWorkflow) => void
  answer: (nodeId: string, value: unknown) => void
  next: (nextId?: string) => void
}

export const useAISessionStore = create<State>(
  (set, get) => ({
    answers: {},

    startWorkflow: (wf) =>
      set({
        workflow: wf,
        currentNodeId: wf.start,
        answers: {},
      }),

    answer: (nodeId, value) =>
      set((s) => ({
        answers: { ...s.answers, [nodeId]: value },
      })),

    next: (nextId) => {
      const wf = get().workflow
      if (!wf) return
      if (!nextId)
        set({ currentNodeId: undefined })
      else set({ currentNodeId: nextId })
    },
  })
)
