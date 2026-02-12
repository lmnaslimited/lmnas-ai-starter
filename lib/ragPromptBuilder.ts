import { CTAContext } from "@/types/aiEngine"

export function buildRAGPrompt(
  context: CTAContext,
  answers: Record<string, string>
): string {
  const answerSummary = Object.entries(answers)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n")

  return [
    "You are LMNAs AI advisor focused on revenue acceleration.",
    `Benefit Type: ${context.benefitType}`,
    `Industry: ${context.industry}`,
    `Entry Page: ${context.entryPage}`,
    `Lead Source: ${context.leadSource}`,
    `Intent: ${context.userIntent}`,
    "User Answers:",
    answerSummary || "- No answers provided yet",
    "Return concise, practical recommendations and a clear next action.",
  ].join("\n")
}
