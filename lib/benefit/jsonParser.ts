import { N8NResultSchema, type N8NResult } from "@/types/benefit"

export function parseBenefitJson(payload: unknown): N8NResult {
  let target = payload
  if (typeof payload === "string") {
    try {
      target = JSON.parse(payload)
    } catch {
      target = null
    }
  }

  const parsed = N8NResultSchema.safeParse(target)
  if (parsed.success) {
    return parsed.data
  }

  if (typeof payload === "string") {
    const retried = N8NResultSchema.safeParse(JSON.parse(payload.trim()))
    if (retried.success) {
      return retried.data
    }
  }

  throw new Error("invalid_benefit_json")
}
