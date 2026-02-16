export interface UserSession {
  sessionId: string
  anonymousId: string
  identity?: {
    name: string
    email: string
    lensLeadId?: string
  }
  enrichment?: {
    ip?: string
    city?: string
    region?: string
    country?: string
    org?: string
    enrichedAt?: string
  }
  benefitHistory?: {
    benefitSlug: string
    lastCalculatedAt: string
    lastScore?: number
  }[]
}
