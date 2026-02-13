import { webhookService } from "../../../../services/webhook-service"

type AfterCreateEvent = {
  result?: {
    id?: number
    documentId?: string
  }
}

const questionLifecycles = {
  async afterCreate(event: AfterCreateEvent): Promise<void> {
    const createdQuestionId = event.result?.documentId ?? event.result?.id?.toString()

    if (!createdQuestionId) {
      strapi.log.warn("Question created without an id; webhook payload not sent")
      return
    }

    await webhookService.sendQuestionCreated({ questionId: createdQuestionId })
  },
}

export default questionLifecycles
