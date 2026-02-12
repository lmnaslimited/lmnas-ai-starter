import { BenefitType, DiscoveryQuestion } from "@/types/aiEngine"

export const benefitQuestions: Record<BenefitType, DiscoveryQuestion[]> = {
  ROI_CALCULATOR: [
    {
      id: "annual_revenue",
      key: "annualRevenue",
      question: "What is your current annual revenue influenced by sales operations?",
      inputType: "number",
    },
    {
      id: "quote_turnaround",
      key: "quoteTurnaroundDays",
      question: "How many days does it take to send a technical quote?",
      inputType: "number",
    },
    {
      id: "win_rate",
      key: "winRate",
      question: "What is your current win rate percentage?",
      inputType: "number",
    },
  ],
  PIPELINE_AUDIT: [
    {
      id: "blocked_stage",
      key: "blockedStage",
      question: "Which stage causes most deal delays?",
      inputType: "options",
      options: ["Qualification", "Proposal", "Legal", "Pricing"],
    },
    {
      id: "crm_confidence",
      key: "crmConfidence",
      question: "How confident is your team in CRM forecast accuracy?",
      inputType: "options",
      options: ["High", "Medium", "Low"],
    },
  ],
  CPQ_MATURITY_SCAN: [
    {
      id: "cpq_tooling",
      key: "cpqTooling",
      question: "Do you currently use a CPQ system?",
      inputType: "options",
      options: ["Yes", "No", "Partially"],
    },
  ],
  SALES_CYCLE_ANALYZER: [
    {
      id: "cycle_days",
      key: "cycleDays",
      question: "Average sales cycle in days?",
      inputType: "number",
    },
  ],
  TENDER_COMPLEXITY_SCORE: [
    {
      id: "tender_volume",
      key: "tenderVolume",
      question: "How many tenders does your team process monthly?",
      inputType: "number",
    },
  ],
}
