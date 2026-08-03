"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import { motion } from "framer-motion"

interface EpisodeCardProps {
  title: string
  guest?: string
  image: string
  duration: string
  description: string
  episodeNumber?: number
  className?: string
  onClick?: () => void
  priority?: boolean
  /** Compact rail card (Descubre) — shorter thumb, less body text */
  compact?: boolean
}

export function EpisodeCard({
  title,
  guest,
  image,
  duration,
  description,
  episodeNumber,
  className,
  onClick,
  priority = false,
  compact = false,
}: EpisodeCardProps) {
  return (
    <motion.div
      whileHover={{ y: compact ? -2 : -4 }}
      onClick={onClick}
      className={`flex flex-col rounded-xl overflow-hidden bg-[#0D0D0D] border border-primary/15 group cursor-pointer ${className ?? ""}`}
    >
      <div
        className={`relative bg-zinc-900 overflow-hidden group/thumbnail ${
          compact ? "h-36" : "h-44"
        }`}
      >
        {image && image !== "/placeholder.svg" ? (
          <>
            <Image
              src={image}
              alt={guest || title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover group-hover/thumbnail:scale-105 transition-transform duration-500"
              priority={priority}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </>
        ) : (
          <div className="absolute inset-0 bg-zinc-800" />
        )}

        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="bg-black/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            {duration}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div
            className={`rounded-full bg-primary/90 flex items-center justify-center ${
              compact ? "w-9 h-9" : "w-11 h-11"
            }`}
          >
            <Play
              className={`text-white fill-white ml-0.5 ${
                compact ? "w-4 h-4" : "w-5 h-5"
              }`}
            />
          </div>
        </div>
      </div>

      <div className={`flex flex-col flex-grow ${compact ? "p-3 space-y-1.5" : "p-4 space-y-2"}`}>
        {guest && (
          <p className="text-zinc-500 text-[11px] font-medium truncate">{guest}</p>
        )}
        <h3
          className={`text-white font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors ${
            compact ? "text-sm" : "text-base"
          }`}
        >
          {title}
        </h3>

        {!compact && (
          <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{description}</p>
        )}

        {episodeNumber != null && (
          <span className="text-[10px] text-zinc-600 font-mono pt-0.5">
            EPISODIO #{episodeNumber}
          </span>
        )}
      </div>
    </motion.div>
  )
}
