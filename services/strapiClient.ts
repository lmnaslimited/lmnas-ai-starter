import { loadFrontendRuntimeConfig } from "./runtimeConfig"

type StrapiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
}

export const strapiClient = {
  async request<TResponse>(path: string, options: StrapiRequestOptions = {}): Promise<TResponse> {
    const { strapiUrl, strapiApiToken } = loadFrontendRuntimeConfig()
    const url = new URL(path, strapiUrl)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (strapiApiToken) {
      headers.Authorization = `Bearer ${strapiApiToken}`
    }

    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Strapi request failed: ${response.status}`)
    }

    return response.json() as Promise<TResponse>
  },
}
