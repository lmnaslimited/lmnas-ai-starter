import { z } from "zod"

export const BenefitAnswerSchema = z.object({
  questionId: z.string().min(1),
  value: z.union([z.string(), z.number()]),
})

export const BenefitRunRequestSchema = z.object({
  benefitSlug: z.string().min(1),
  sessionId: z.string().min(1),
  answers: z.array(BenefitAnswerSchema).min(1),
  stage: z.enum(["standard_completed", "followup"]),
})

export const N8NResultSchema = z.object({
  followup_required: z.boolean(),
  followupQuestions: z.array(z.object({ id: z.string(), prompt: z.string() })).optional(),
  result: z
    .object({
      score: z.number().optional(),
      summary: z.string(),
      recommendation: z.string().optional(),
    })
    .optional(),
})

export type BenefitRunRequest = z.infer<typeof BenefitRunRequestSchema>
export type N8NResult = z.infer<typeof N8NResultSchema>
