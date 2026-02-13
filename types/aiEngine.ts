export type BenefitType =
  | "ROI_CALCULATOR"
  | "PIPELINE_AUDIT"
  | "CPQ_MATURITY_SCAN"
  | "SALES_CYCLE_ANALYZER"
  | "TENDER_COMPLEXITY_SCORE"

export type WorkflowStatus = "idle" | "discovering" | "running" | "completed"

export type CTAContext = {
  benefitType: BenefitType
  industry: string
  entryPage: string
  leadSource: string
  userIntent: string
}

export type ChatRole = "assistant" | "user" | "system"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  timestamp: number
}

export type DiscoveryQuestion = {
  questionid: string
  question: string
  options?: string[]
  inputType: "text" | "number" | "options"
  key: string
}

export type BenefitResult = {
  analysis: string
  score: number
  recommendation: string
  northStarAction: string
}
