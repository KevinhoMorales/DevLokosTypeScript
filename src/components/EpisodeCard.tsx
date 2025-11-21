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
      {/* Top Half - Orange Background with Image */}
      <div className="relative h-48 bg-[#F97316] overflow-hidden">
        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' fill='%23000000' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black/90 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1">
            {duration}
          </span>
        </div>

        {/* Centered Guest Image & Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border-4 border-black/10 shadow-xl">
              <Image 
                src={image || "/placeholder.svg"} 
                alt={guest || title} 
                fill 
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-white rounded-full p-3 shadow-lg cursor-pointer z-20"
              >
                <Play className="w-6 h-6 text-[#F97316] fill-[#F97316] ml-1" />
              </motion.div>
            </div>
          </div>
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

