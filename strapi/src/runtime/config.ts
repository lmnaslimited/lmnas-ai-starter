export type RuntimeConfig = {
  webhookUrl?: string
  webhookAuthToken?: string
}

export const loadRuntimeConfig = (): RuntimeConfig => {
  const webhookUrl = process.env.QUESTION_CREATED_WEBHOOK_URL
  const webhookAuthToken = process.env.QUESTION_CREATED_WEBHOOK_AUTH_TOKEN

  return {
    webhookUrl,
    webhookAuthToken,
  }
}
