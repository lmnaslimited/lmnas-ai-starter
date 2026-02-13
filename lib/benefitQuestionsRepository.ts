import { benefitQuestions } from "@/data/workflows/benefitWorkflows"
import { BenefitType, DiscoveryQuestion } from "@/types/aiEngine"

type StrapiQuestion = {
  id?: string | number
  documentId?: string
  questionId?: string
  key?: string
  question?: string
  inputType?: DiscoveryQuestion["inputType"]
  options?: string[] | string | null
  order?: number
}

type StrapiResponse = {
  data?: Array<{
    id?: number
    documentId?: string
    questionId?: string
    key?: string
    question?: string
    inputType?: DiscoveryQuestion["inputType"]
    options?: string[] | string | null
    order?: number
    attributes?: StrapiQuestion
  }>
}

const STRAPI_URL = process.env.STRAPI_URL
const STRAPI_TOKEN = process.env.STRAPI_TOKEN

function normalizeOptions(options: StrapiQuestion["options"]): string[] | undefined {
  if (!options) return undefined
  if (Array.isArray(options)) {
    return options.filter((item): item is string => typeof item === "string")
  }

  return options
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

function toDiscoveryQuestion(entry: StrapiQuestion): DiscoveryQuestion | null {
  if (!entry.key || !entry.question || !entry.inputType) {
    return null
  }

  return {
    id: String(entry.questionId ?? entry.documentId ?? entry.id ?? entry.key),
    key: entry.key,
    question: entry.question,
    inputType: entry.inputType,
    options: normalizeOptions(entry.options),
  }
}

async function fetchFromStrapi(benefitType: BenefitType): Promise<DiscoveryQuestion[] | null> {
  if (!STRAPI_URL) {
    return null
  }

  const endpoint = new URL("/api/benefit-questions", STRAPI_URL)
  endpoint.searchParams.set("filters[benefitType][$eq]", benefitType)
  endpoint.searchParams.set("sort[0]", "order:asc")
  endpoint.searchParams.set("pagination[pageSize]", "100")

  const response = await fetch(endpoint.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Unable to fetch questions from Strapi: ${response.status}`)
  }

  const payload = (await response.json()) as StrapiResponse
  const questions = (payload.data ?? [])
    .map((item) => ({ ...item.attributes, ...item }))
    .map(toDiscoveryQuestion)
    .filter((question): question is DiscoveryQuestion => Boolean(question))

  return questions.length > 0 ? questions : null
}

export async function getBenefitQuestions(benefitType: BenefitType): Promise<DiscoveryQuestion[]> {
  try {
    const strapiQuestions = await fetchFromStrapi(benefitType)
    if (strapiQuestions) {
      return strapiQuestions
    }
  } catch (error) {
    console.warn("Falling back to local benefit questions:", error)
  }

  return benefitQuestions[benefitType]
}
