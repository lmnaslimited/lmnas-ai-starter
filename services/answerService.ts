import { strapiClient } from "./strapiClient"

type AnswerLog = {
  id: number
  documentId?: string
  questionId: string
  answer: string
  provider?: string
  metadata?: Record<string, unknown>
}

type StrapiResponse<T> = {
  data: T
}

export const answerService = {
  async createAnswerLog(input: Omit<AnswerLog, "id" | "documentId">): Promise<AnswerLog> {
    const response = await strapiClient.request<StrapiResponse<AnswerLog>>("/api/answer-logs", {
      method: "POST",
      body: {
        data: input,
      },
    })

    return response.data
  },
}
