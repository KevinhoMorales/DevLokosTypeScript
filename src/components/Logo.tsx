import { Mic } from "lucide-react"

interface LogoProps {
  className?: string
  size?: "sm" | "lg"
}

export function Logo({ className = "", size = "sm" }: LogoProps) {
  const isLarge = size === "lg"

  return (
    <div className={`flex items-center gap-2 font-bold ${className}`}>
      {isLarge ? (
        <div className="relative flex items-center justify-center">
          <div className="relative h-24 w-24 bg-orange-500 rounded-lg flex items-center justify-center transform rotate-3">
            <Mic className="h-12 w-12 text-white" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center transform rotate-3">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <span className="text-white tracking-tight">
            Dev<span className="text-orange-500">Lokos</span>
          </span>
        </div>
      )}
    </div>
  )
}

