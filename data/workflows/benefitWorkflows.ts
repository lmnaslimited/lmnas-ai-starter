import { BenefitType, DiscoveryQuestion } from "@/types/aiEngine"

export const benefitQuestions: Record<BenefitType, DiscoveryQuestion[]> = {
  ROI_CALCULATOR: [
    {
      questionid: "annual_revenue",
      key: "annualRevenue",
      question: "What is your current annual revenue influenced by sales operations?",
      inputType: "number",
    },
    {
      questionid: "quote_turnaround",
      key: "quoteTurnaroundDays",
      question: "How many days does it take to send a technical quote?",
      inputType: "number",
    },
    {
      questionid: "win_rate",
      key: "winRate",
      question: "What is your current win rate percentage?",
      inputType: "number",
    },
  ],
  PIPELINE_AUDIT: [
    {
      questionid: "blocked_stage",
      key: "blockedStage",
      question: "Which stage causes most deal delays?",
      inputType: "options",
      options: ["Qualification", "Proposal", "Legal", "Pricing"],
    },
    {
      questionid: "crm_confquestionidence",
      key: "crmConfquestionidence",
      question: "How confquestionident is your team in CRM forecast accuracy?",
      inputType: "options",
      options: ["High", "Medium", "Low"],
    },
  ],
  CPQ_MATURITY_SCAN: [
    {
      questionid: "cpq_tooling",
      key: "cpqTooling",
      question: "Do you currently use a CPQ system?",
      inputType: "options",
      options: ["Yes", "No", "Partially"],
    },
  ],
  SALES_CYCLE_ANALYZER: [
    {
      questionid: "cycle_days",
      key: "cycleDays",
      question: "Average sales cycle in days?",
      inputType: "number",
    },
  ],
  TENDER_COMPLEXITY_SCORE: [
    {
      questionid: "tender_volume",
      key: "tenderVolume",
      question: "How many tenders does your team process monthly?",
      inputType: "number",
    },
  ],
}
