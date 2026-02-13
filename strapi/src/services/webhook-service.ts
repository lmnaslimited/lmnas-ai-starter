import { loadRuntimeConfig } from "../runtime/config"

type QuestionCreatedPayload = {
  questionId: string
}

export const webhookService = {
  async sendQuestionCreated(payload: QuestionCreatedPayload): Promise<void> {
    const { webhookUrl, webhookAuthToken } = loadRuntimeConfig()

    if (!webhookUrl) {
      strapi.log.warn("QUESTION_CREATED_WEBHOOK_URL is not configured; skipping webhook call")
      return
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (webhookAuthToken) {
      headers.Authorization = `Bearer ${webhookAuthToken}`
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
  },
}
