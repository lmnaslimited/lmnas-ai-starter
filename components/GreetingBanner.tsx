import type { UserSession } from "@/lib/session/types"

export default function GreetingBanner({ session }: { session: UserSession | null }) {
  const message = session?.identity?.name
    ? `Welcome back, ${session.identity.name}`
    : "Welcome! Let’s create your benefit outcome."

  return <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>
}
