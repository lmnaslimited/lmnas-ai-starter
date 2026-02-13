import { strapiClient } from "./strapiClient"

export type Question = {
  id: number
  documentId?: string
  text: string
  status: "pending" | "processed" | "failed"
}

type StrapiEntity<T> = {
  id: number
  documentId?: string
  attributes?: T
} & T

type StrapiResponse<T> = {
  data: StrapiEntity<T>
}

export const questionService = {
  async createQuestion(text: string): Promise<Question> {
    const response = await strapiClient.request<StrapiResponse<Question>>("/api/questions", {
      method: "POST",
      body: {
        data: {
          text,
          status: "pending",
        },
      },
    })

    return response.data
  },
}
