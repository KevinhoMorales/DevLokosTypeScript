"use client"

import Image from "next/image"
import { Play } from "lucide-react"

interface EpisodeListTileProps {
  title: string
  guest?: string
  image: string
  duration: string
  episodeNumber?: number
  onClick?: () => void
}

/** Tile denso estilo app (lista de Episodios). */
export function EpisodeListTile({
  title,
  guest,
  image,
  duration,
  episodeNumber,
  onClick,
}: EpisodeListTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 p-2.5 rounded-2xl bg-[#0D0D0D] border border-primary/15 hover:border-primary/40 transition-colors group"
    >
      <div className="relative w-28 h-[72px] shrink-0 rounded-[10px] overflow-hidden bg-zinc-900">
        {image && image !== "/placeholder.svg" ? (
          <Image
            src={image}
            alt={guest || title}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-800" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <div className="w-7 h-7 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <h3 className="text-white font-semibold text-[13.5px] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-500">
          {guest ? <span className="truncate max-w-[160px]">{guest}</span> : null}
          {guest && duration ? <span aria-hidden>·</span> : null}
          {duration ? <span>{duration}</span> : null}
          {episodeNumber != null ? (
            <>
              <span aria-hidden>·</span>
              <span className="font-mono">#{episodeNumber}</span>
            </>
          ) : null}
        </div>
      </div>
    </button>
  )
}
