import BenefitLauncher from "@/components/benefits/BenefitLauncher"

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 pb-96">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">LMNAs AI First</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
        Every CTA opens AI. Every interaction moves toward a North Star action.
      </h1>
      <p className="mt-4 max-w-2xl text-base text-slate-600">
        This POC demonstrates contextual chat launch, guided discovery questions, n8n webhook handoff,
        and in-chat outcome rendering for low-friction conversion.
      </p>

      <BenefitLauncher />

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">AI-first UX rules implemented</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Single interaction layer: chat drawer below the fold.</li>
          <li>Context injected from CTA type, page, industry, and intent.</li>
          <li>Guided questions + progress states + persistent session state.</li>
          <li>Workflow execution and results generated in-chat without navigation.</li>
        </ul>
      </section>
    </main>
  )
}
