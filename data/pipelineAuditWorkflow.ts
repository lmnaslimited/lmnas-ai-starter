import { AIWorkflow } from "@/types/aiEngine"

export const pipelineAuditWorkflow: AIWorkflow = {
  id: "pipeline_audit",
  title: "Pipeline Health Audit",
  northStar: "Reveal revenue leakage and sales bottlenecks",

  start: "sales_cycle_length",

  nodes: {
    sales_cycle_length: {
      id: "sales_cycle_length",
      type: "number",
      question: "Average sales cycle (days)?",
      insight:
        "Long cycles usually indicate engineering dependency or unclear qualification.",
      next: "deal_stage_stuck",
    },

    deal_stage_stuck: {
      id: "deal_stage_stuck",
      type: "options",
      question: "Where do deals usually get stuck?",
      options: [
        {
          id: "qualification",
          label: "Qualification",
          next: "engineering_dependency",
        },
        {
          id: "proposal",
          label: "Proposal / Technical Offer",
          next: "engineering_dependency",
        },
      ],
    },

    engineering_dependency: {
      id: "engineering_dependency",
      type: "options",
      question:
        "Does engineering involvement delay quoting?",
      options: [
        {
          id: "yes",
          label: "Yes",
        },
        {
          id: "no",
          label: "No",
        },
      ],
    },
  },
}
