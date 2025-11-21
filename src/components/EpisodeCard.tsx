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
}: EpisodeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`flex flex-col rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/5 group cursor-pointer ${className}`}
    >
      {/* Top Half - Episode Thumbnail/Portada - Full Size */}
      <div className="relative h-64 bg-[#F97316] overflow-hidden group/thumbnail">
        {/* Episode Thumbnail as Full Background */}
        {image && image !== "/placeholder.svg" ? (
          <>
            <Image 
              src={image} 
              alt={guest || title} 
              fill 
              className="object-cover group-hover/thumbnail:scale-105 transition-transform duration-500"
              unoptimized
              priority
            />
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
            {/* Orange tint overlay - subtle */}
            <div className="absolute inset-0 bg-[#F97316]/15 group-hover/thumbnail:bg-[#F97316]/5 transition-colors duration-300" />
          </>
        ) : (
          /* Fallback orange background with pattern */
          <>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' fill='%23000000' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: "30px 30px",
              }}
            />
          </>
        )}

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black/90 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1">
            {duration}
          </span>
        </div>

        {/* Play Button Overlay - Centered and Larger */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            whileHover={{ scale: 1.15 }}
            className="bg-white/95 rounded-full p-5 shadow-2xl cursor-pointer backdrop-blur-sm border-2 border-white/30"
          >
            <Play className="w-10 h-10 text-[#F97316] fill-[#F97316] ml-1" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Half - Content */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <div>
          {guest && (
            <p className="text-zinc-400 text-xs font-medium mb-1">{guest}</p>
          )}
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#F97316] transition-colors">
            {title}
          </h3>
        </div>

        <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed">{description}</p>

        {episodeNumber && (
          <div className="mt-auto pt-2">
            <span className="text-[10px] text-zinc-600 font-mono">EPISODIO #{episodeNumber}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

