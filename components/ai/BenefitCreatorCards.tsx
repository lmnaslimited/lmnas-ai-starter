"use client"
import { useAISessionStore } from "@/store/aiSessionStore"

export default function BenefitCreatorCards() {
  const startSession = useAISessionStore(
    (s) => s.startSession
  )

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="p-6 border rounded-xl">
        <h3 className="font-semibold">
          Pipeline Audit
        </h3>
        <button
          className="mt-4 bg-black text-white px-4 py-2 rounded"
          onClick={() =>
            startSession("pipeline_audit")
          }
        >
          Run Audit
        </button>
      </div>
    </div>
  )
}
