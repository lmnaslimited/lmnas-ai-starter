import type { UserSession } from "@/lib/session/types"

export function upsertBenefitHistory(
  session: UserSession,
  benefitSlug: string,
  score?: number,
): UserSession["benefitHistory"] {
  const history = session.benefitHistory ?? []
  const withoutCurrent = history.filter((entry) => entry.benefitSlug !== benefitSlug)
  return [
    ...withoutCurrent,
    {
      benefitSlug,
      lastCalculatedAt: new Date().toISOString(),
      lastScore: score,
    },
  ]
}
