import type { ReactNode } from "react"
import { SECTION_CONTAINER, SECTION_PAGE_WRAPPER } from "@/lib/section-layout"

interface LegalPageShellProps {
  title: string
  children: ReactNode
}

/** Página legal: texto sobre fondo negro (sin card; título vía metadata / nav). */
export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className={SECTION_PAGE_WRAPPER}>
      <div className={`${SECTION_CONTAINER} max-w-3xl`}>
        <h1 className="sr-only">{title}</h1>
        <div className="space-y-8 text-sm md:text-base text-white/85 leading-relaxed">
          {children}
        </div>
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
      <h2 className="text-lg md:text-xl font-bold text-primary">{title}</h2>
      <div className="space-y-3 text-sm md:text-base text-white/85 leading-relaxed">
        {children}
      </div>
    </section>
  )
}
