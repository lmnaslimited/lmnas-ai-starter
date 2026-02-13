export type BenefitQuestionOption = {
  id: string
  label: string
  next?: string
}

export type BenefitQuestion = {
  questionId: string
  prompt: string
  insight?: string
  order: number
  options: BenefitQuestionOption[]
  nextQuestionId?: string
}

type StrapiEntity<T> = {
  id: number
  attributes: T
}

type StrapiResponse<T> = {
  data: StrapiEntity<T>[]
}

export async function fetchBenefitQuestionsFromStrapi(
  benefitType: string
): Promise<BenefitQuestion[]> {
  const strapiUrl = process.env.STRAPI_URL

  if (!strapiUrl) {
    throw new Error("STRAPI_URL is required")
  }

  const token = process.env.STRAPI_API_TOKEN
  const url = new URL("/api/benefit-questions", strapiUrl)

  url.searchParams.set(
    "filters[benefitType][$eq]",
    benefitType
  )
  url.searchParams.set(
    "filters[active][$eq]",
    "true"
  )
  url.searchParams.set("sort[0]", "order:asc")

  const response = await fetch(url.toString(), {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `Failed to load benefit questions (${response.status})`
    )
  }

  const payload = (await response.json()) as StrapiResponse<BenefitQuestion>

  return payload.data.map((item) => item.attributes)
}
