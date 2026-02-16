import type { UserSession } from "@/lib/session/types"
import type { BenefitRunRequest } from "@/types/benefit"

export function buildBenefitPrompt(input: BenefitRunRequest, session: UserSession) {
  const previous = session.benefitHistory?.find((item) => item.benefitSlug === input.benefitSlug)

  return {
    system: [
      "You are LMNAs benefit intelligence assistant.",
      `Geo country: ${session.enrichment?.country ?? "unknown"}`,
      previous?.lastScore ? `Previous score: ${previous.lastScore}` : "No previous score found.",
    ].join("\n"),
    user: JSON.stringify({ benefitSlug: input.benefitSlug, stage: input.stage, answers: input.answers }),
  }
}
