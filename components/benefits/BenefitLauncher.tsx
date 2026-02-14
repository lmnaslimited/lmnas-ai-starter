"use client"

import { useCTAContext } from "@/context/CTAContextProvider"

const benefits = [
  { slug: "roi-calculator", title: "ROI Calculator", description: "Estimate revenue impact." },
  { slug: "pipeline-audit", title: "Pipeline Audit", description: "Find conversion bottlenecks." },
  { slug: "cpq-maturity", title: "CPQ Maturity Scan", description: "Assess quote-readiness." },
]

export default function BenefitLauncher() {
  const { openChat } = useCTAContext()

  return (
    <section className="mt-10 grid gap-4 md:grid-cols-3">
      {benefits.map((benefit) => (
        <article key={benefit.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Benefit Creator</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{benefit.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{benefit.description}</p>
          <button
            className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            onClick={() => openChat(benefit.slug)}
          >
            Launch with AI
          </button>
        </article>
      ))}
    </section>
  )
}
