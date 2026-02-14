import type { Metadata } from "next"
import "./globals.css"
import { CTAContextProvider } from "@/context/CTAContextProvider"
import AIChatDrawer from "@/components/AIChatDrawer"

export const metadata: Metadata = {
  title: "LMNAs AI-First Website",
  description: "Conversational AI-first interaction model for benefit creator CTAs.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">
        <CTAContextProvider>
          {children}
          <AIChatDrawer />
        </CTAContextProvider>
      </body>
    </html>
  )
}
