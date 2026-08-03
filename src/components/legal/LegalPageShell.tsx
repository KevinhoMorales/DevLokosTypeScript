import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SECTION_CONTAINER, SECTION_PAGE_WRAPPER } from "@/lib/section-layout"

interface LegalPageShellProps {
  title: string
  children: ReactNode
}

/** Página legal con el look & feel del modal (fondo oscuro, títulos primary). */
export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className={SECTION_PAGE_WRAPPER}>
      <div className={`${SECTION_CONTAINER} max-w-4xl`}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <article className="rounded-2xl border border-white/10 bg-[#0D1117] shadow-2xl overflow-hidden">
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
