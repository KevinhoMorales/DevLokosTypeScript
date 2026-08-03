import type { ReactNode } from "react"
import { SECTION_CONTAINER, SECTION_PAGE_WRAPPER } from "@/lib/section-layout"

interface LegalPageShellProps {
  title: string
  children: ReactNode
}

/** Página legal alineada al brand: negro / card #1A1A1A / acento naranja. */
export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className={SECTION_PAGE_WRAPPER}>
      <div className={`${SECTION_CONTAINER} max-w-4xl`}>
        <article className="rounded-2xl border border-primary/25 bg-card-bg shadow-[0_12px_40px_rgba(255,145,77,0.06)] overflow-hidden">
          <div
            aria-hidden
            className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent"
          />
          <header className="border-b border-white/10 px-6 md:px-8 py-5 md:py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">{title}</h1>
          </header>
          <div className="px-6 md:px-8 py-6 md:py-8">{children}</div>
        </article>
      </div>
    </div>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl md:text-2xl font-bold text-primary">{title}</h2>
      <div className="space-y-3 text-sm md:text-base text-white/80 leading-relaxed">
        {children}
      </div>
    </section>
  )
}
