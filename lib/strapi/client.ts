import { z } from "zod"

const StrapiQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.string(),
})

const StrapiResponseSchema = z.array(StrapiQuestionSchema)

export async function getBenefitQuestions(benefitSlug: string) {
  const base = process.env.STRAPI_API_URL
  if (!base) {
    return []
  }

  const response = await fetch(`${base}/api/benefit-questions?slug=${encodeURIComponent(benefitSlug)}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("strapi_fetch_failed")
  }

  const payload = (await response.json()) as unknown
  return StrapiResponseSchema.parse(payload)
}
