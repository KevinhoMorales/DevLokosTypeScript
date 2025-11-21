import { Mic } from "lucide-react"

interface LogoProps {
  className?: string
  size?: "sm" | "lg"
}

export function Logo({ className = "", size = "sm" }: LogoProps) {
  const isLarge = size === "lg"

  return (
    <div className={`flex items-center gap-2 font-bold ${className}`}>
      <div className="relative flex items-center justify-center">
        <div
          className={`${isLarge ? "h-24 w-24" : "h-8 w-8"} bg-orange-500 rounded-lg flex items-center justify-center transform rotate-3`}
        >
          <Mic className={`text-white ${isLarge ? "h-12 w-12" : "h-5 w-5"}`} />
        </div>
      </div>
      {isLarge ? (
        <div className="hidden" />
      ) : (
        <span className="text-white tracking-tight">
          Dev<span className="text-orange-500">Lokos</span>
        </span>
      )}
    </div>
  )
}
