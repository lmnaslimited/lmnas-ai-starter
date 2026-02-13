export type FrontendRuntimeConfig = {
  strapiUrl: string
  strapiApiToken?: string
}

export const loadFrontendRuntimeConfig = (): FrontendRuntimeConfig => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  if (!strapiUrl) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is required")
  }

  return {
    strapiUrl,
    strapiApiToken: process.env.STRAPI_API_TOKEN,
  }
}
