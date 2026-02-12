"use client"

import { useAISessionStore } from "@/store/aiSessionStore"
import AIOptionsInput from "./AIOptionsInput"
import AIInsightBlock from "./AIInsightBlock"

export default function AIQuestionRenderer() {
  const { workflow, currentNodeId } =
    useAISessionStore()

  if (!workflow || !currentNodeId) return null

  const node =
    workflow.nodes[currentNodeId]

  return (
    <div>
      <h2 className="text-xl font-semibold">
        {node.question}
      </h2>

      {node.type === "options" &&
        node.options && (
          <AIOptionsInput
            options={node.options}
          />
        )}

      {node.insight && (
        <AIInsightBlock text={node.insight} />
      )}
    </div>
  )
}
