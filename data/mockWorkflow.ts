import { AIQuestionData } from "@/components/AIQuestionBlock"

export const pipelineAuditWorkflow: AIQuestionData[] = [
  {
    id: "sales_stage",
    question: "Where are most deals getting stuck?",
    insight: "This helps identify pipeline friction.",
    options: [
      { id: "qualification", label: "Qualification" },
      { id: "proposal", label: "Proposal" },
    ],
  },
]
