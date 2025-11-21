import Image from "next/image"

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
          <div className="relative h-24 w-auto">
            <Image
              src="/logo-transparent.png"
              alt="DevLokos Logo"
              width={200}
              height={80}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </div>
      ) : (
        <div className="relative h-8 w-auto">
          <Image
            src="/logo-transparent.png"
            alt="DevLokos Logo"
            width={120}
            height={32}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      )}
    </div>
  )
}

