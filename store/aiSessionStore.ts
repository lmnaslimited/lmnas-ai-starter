"use client"

import { create } from "zustand"
import {
  BenefitResult,
  CTAContext,
  ChatMessage,
  DiscoveryQuestion,
  WorkflowStatus,
} from "@/types/aiEngine"

type AISessionState = {
  isDrawerOpen: boolean
  context?: CTAContext
  messages: ChatMessage[]
  workflowStatus: WorkflowStatus
  currentQuestion?: DiscoveryQuestion
  answers: Record<string, string>
  result?: BenefitResult
  loading: boolean
  openDrawer: () => void
  closeDrawer: () => void
  setContext: (context: CTAContext) => void
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  setQuestion: (question?: DiscoveryQuestion) => void
  saveAnswer: (key: string, value: string) => void
  setWorkflowStatus: (status: WorkflowStatus) => void
  setLoading: (loading: boolean) => void
  setResult: (result?: BenefitResult) => void
  resetSession: () => void
}

export const useAISessionStore = create<AISessionState>((set) => ({
  isDrawerOpen: false,
  messages: [],
  workflowStatus: "idle",
  answers: {},
  loading: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setContext: (context) => set({ context }),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          timestamp: Date.now(),
        },
      ],
    })),
  setQuestion: (question) => set({ currentQuestion: question }),
  saveAnswer: (key, value) =>
    set((state) => ({ answers: { ...state.answers, [key]: value } })),
  setWorkflowStatus: (status) => set({ workflowStatus: status }),
  setLoading: (loading) => set({ loading }),
  setResult: (result) => set({ result }),
  resetSession: () =>
    set({
      messages: [],
      workflowStatus: "idle",
      currentQuestion: undefined,
      answers: {},
      result: undefined,
      loading: false,
    }),
}))
