"use client"

import { useCTAContext } from "@/components/context/CTAContextProvider"
import { BenefitType } from "@/types/aiEngine"

const benefits: Array<{ type: BenefitType; title: string; description: string }> = [
  {
    type: "ROI_CALCULATOR",
    title: "ROI Calculator",
    description: "Estimate revenue impact with guided AI discovery.",
  },
  {
    type: "PIPELINE_AUDIT",
    title: "Pipeline Audit",
    description: "Find bottlenecks and conversion leakage in minutes.",
  },
  {
    type: "CPQ_MATURITY_SCAN",
    title: "CPQ Maturity Scan",
    description: "Identify your quote automation readiness level.",
  },
]

export default function BenefitLauncher() {
  const { launchFromCTA } = useCTAContext()

  return (
    <section className="mt-10 grid gap-4 md:grid-cols-3">
      {benefits.map((benefit) => (
        <article
          key={benefit.type}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">Benefit Creator</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{benefit.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{benefit.description}</p>
          <button
            className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            onClick={() => launchFromCTA(benefit.type, `Start ${benefit.title}`)}
          >
            Launch with AI
          </button>
        </article>
      ))}
    </section>
  )
}
