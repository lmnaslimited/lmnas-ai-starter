export async function runBenefitWorkflow(payload: Record<string, unknown>) {
  const webhookUrl = process.env.N8N_BENEFIT_WEBHOOK_URL
  const apiKey = process.env.N8N_API_KEY
  if (!webhookUrl) {
    throw new Error("n8n_not_configured")
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "x-api-key": apiKey } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error("n8n_request_failed")
  }

  return (await response.json()) as unknown
}
