"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { Calendar, Clock, SearchX, Share2, X } from "lucide-react"
import { analyticsEvents } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { SectionIntro } from "@/components/ui/SectionIntro"
import { SearchBar } from "@/components/ui/SearchBar"
import { SeasonFilter } from "@/components/ui/SeasonFilter"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { AutoCarousel } from "@/components/ui/AutoCarousel"
import { EmptyState } from "@/components/ui/EmptyState"
import { ErrorState } from "@/components/ui/ErrorState"
import { EpisodeCard } from "@/components/EpisodeCard"
import { EpisodeListTile } from "@/components/EpisodeListTile"
import { SECTION_CONTAINER } from "@/lib/section-layout"
import {
  DEFAULT_SEASON_LABEL,
  emptySeasonMessage,
  seasonLabel,
  type SeasonNumber,
} from "@/lib/podcast-seasons"
import { motion } from "framer-motion"

interface PodcastEpisode {
  id: number
  title: string
  rawTitle?: string
  description: string
  thumbnail: string
  spotifyUrl: string
  youtubeUrl: string
  duration: string
  guest?: string
  quote?: string
  date?: string
  season?: SeasonNumber
}

function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

/** Shuffle estable por día (como seed diario de la app). */
function pickDiscoverEpisodes(all: PodcastEpisode[], count = 10): PodcastEpisode[] {
  const valid = all.filter(
    (ep) => ep.title.trim().length > 0 && ep.title !== "Sin título"
  )
  const pool = valid.length > 0 ? valid : all
  const daySeed = new Date().toISOString().slice(0, 10)
  let hash = 0
  for (let i = 0; i < daySeed.length; i++) {
    hash = (hash * 31 + daySeed.charCodeAt(i)) >>> 0
  }
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) >>> 0
    const j = hash % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

function formatEpisodeDate(date?: string): string | undefined {
  if (!date) return undefined
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function listTitle(episode: PodcastEpisode): string {
  return episode.rawTitle?.trim() || episode.title
}

export default function PodcastSection() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [discoverEpisodes, setDiscoverEpisodes] = useState<PodcastEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeason, setSelectedSeason] = useState<string>(DEFAULT_SEASON_LABEL)
  const [currentPage, setCurrentPage] = useState(1)
  const episodesPerPage = 20
  const discoverImpressedRef = useRef(false)

  const fetchEpisodes = async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await fetch("/api/episodes")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }))
        const errorMessage = errorData.error || errorData.details || `Error ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      if (data.episodes && Array.isArray(data.episodes)) {
        setEpisodes(data.episodes)
        setDiscoverEpisodes(pickDiscoverEpisodes(data.episodes, 10))
        setError(null)
      } else {
        throw new Error("Formato de datos inválido")
      }
    } catch (err) {
      console.error("Error fetching episodes:", err)
      setError(err instanceof Error ? err.message : "Error al cargar los episodios.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEpisodes()
  }, [])

  useEffect(() => {
    setDescriptionExpanded(false)
  }, [selectedEpisode?.id])

  const seasonNum = useMemo((): SeasonNumber => {
    if (selectedSeason.includes("3")) return 3
    if (selectedSeason.includes("1")) return 1
    return 2
  }, [selectedSeason])

  const searchFiltered = episodes.filter((episode) => {
    const searchNormalized = normalizeText(searchQuery)
    const titleNormalized = normalizeText(listTitle(episode))
    const guestNormalized = episode.guest ? normalizeText(episode.guest) : ""
    const descNormalized = normalizeText(episode.description || "")
    return (
      titleNormalized.includes(searchNormalized) ||
      guestNormalized.includes(searchNormalized) ||
      descNormalized.includes(searchNormalized)
    )
  })

  const bySeason = episodes.filter((ep) => (ep.season ?? 2) === seasonNum)
  const filteredEpisodes = searchQuery.trim() ? searchFiltered : bySeason

  const podcastViewedRef = useRef(false)
  useEffect(() => {
    if (loading || error) return
    if (!podcastViewedRef.current) {
      podcastViewedRef.current = true
      analyticsEvents.podcast_home_viewed()
    }
  }, [loading, error])

  useEffect(() => {
    if (loading || error || discoverEpisodes.length === 0 || discoverImpressedRef.current) return
    discoverImpressedRef.current = true
    discoverEpisodes.forEach((ep) => {
      analyticsEvents.podcast_discover_impression(
        String(ep.id),
        ep.title,
        seasonLabel(ep.season ?? 2)
      )
    })
  }, [loading, error, discoverEpisodes])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedEpisode(null)
    }
    if (selectedEpisode) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [selectedEpisode])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedSeason])

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!searchQuery.trim()) return
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      analyticsEvents.search_performed(searchQuery, "podcast", filteredEpisodes.length)
      searchDebounceRef.current = null
    }, 600)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [searchQuery, filteredEpisodes.length])

  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage)
  const startIndex = (currentPage - 1) * episodesPerPage
  const paginatedEpisodes = filteredEpisodes.slice(startIndex, startIndex + episodesPerPage)

  const handleEpisodeClick = (episode: PodcastEpisode, source: "discover" | "list" = "list") => {
    setSelectedEpisode(episode)
    analyticsEvents.podcast_episode_viewed({
      episode_id: String(episode.id),
      episode_title: episode.title,
      season: seasonLabel(episode.season ?? 2),
      source,
    })
    analyticsEvents.podcast_episode_played(String(episode.id), episode.title)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document.getElementById("podcast-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const shareEpisode = async (episode: PodcastEpisode) => {
    const guest = episode.guest?.trim()
    const lines = [
      `Descubre el episodio "${episode.title}"${guest ? ` con ${guest}` : ""}`,
      "",
      "Ver en YouTube:",
      episode.youtubeUrl,
    ]
    const text = lines.join("\n")
    try {
      if (navigator.share) {
        await navigator.share({ title: episode.title, text, url: episode.youtubeUrl })
      } else {
        await navigator.clipboard.writeText(text)
      }
    } catch {
      // Usuario canceló share; ignorar.
    }
  }

  const videoId = selectedEpisode ? getYouTubeVideoId(selectedEpisode.youtubeUrl) : null
  const description = selectedEpisode?.description?.trim() || "Sin descripción disponible."
  const canExpandDescription = description.length > 220

  return (
    <section id="podcast-section" className={`${SECTION_CONTAINER} space-y-10 md:space-y-12`}>
      <SectionIntro>
        Episodios en audio y video. Búsqueda por título o invitado, filtros por temporada, sección
        Descubre y reproductor en pantalla completa.
      </SectionIntro>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar episodios, invitado o tema..."
        className="max-w-3xl"
      />

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#0D0D0D] border border-primary/15 animate-pulse"
            >
              <div className="w-28 h-[72px] shrink-0 rounded-[10px] bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-zinc-800 rounded w-4/5" />
                <div className="h-3 bg-zinc-800 rounded w-2/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <ErrorState
          title="Error al cargar episodios"
          message={error}
          onRetry={fetchEpisodes}
        />
      )}

      {!loading && !error && (
        <>
          {!searchQuery.trim() && discoverEpisodes.length > 0 && (
            <div className="space-y-4">
              <SectionHeader title="Descubre" align="start" />
              {/* Mobile: carrusel */}
              <div className="md:hidden">
                <AutoCarousel
                  label="Episodios para descubrir"
                  intervalMs={5000}
                  itemClassName="min-w-[240px] max-w-[260px] snap-start shrink-0"
                >
                  {discoverEpisodes.slice(0, 4).map((episode) => (
                    <EpisodeCard
                      key={`discover-m-${episode.id}`}
                      compact
                      title={episode.title}
                      guest={episode.guest}
                      duration={episode.duration}
                      image={episode.thumbnail || "/placeholder.svg"}
                      description={episode.description}
                      onClick={() => handleEpisodeClick(episode, "discover")}
                    />
                  ))}
                </AutoCarousel>
              </div>
              {/* Tablet/Desktop: grid como layout ancho de la app */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {discoverEpisodes.map((episode) => (
                  <EpisodeCard
                    key={`discover-d-${episode.id}`}
                    compact
                    title={episode.title}
                    guest={episode.guest}
                    duration={episode.duration}
                    image={episode.thumbnail || "/placeholder.svg"}
                    description={episode.description}
                    onClick={() => handleEpisodeClick(episode, "discover")}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <SectionHeader
              title={
                searchQuery.trim()
                  ? `Resultados (${filteredEpisodes.length})`
                  : "Episodios"
              }
              align="start"
              trailing={
                !searchQuery.trim() ? (
                  <SeasonFilter value={selectedSeason} onChange={setSelectedSeason} />
                ) : undefined
              }
            />

            {paginatedEpisodes.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {paginatedEpisodes.map((episode, index) => (
                    <motion.div
                      key={episode.id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.02, 0.3) }}
                      className="h-full"
                    >
                      <EpisodeListTile
                        title={listTitle(episode)}
                        guest={episode.guest}
                        duration={episode.duration}
                        date={formatEpisodeDate(episode.date)}
                        image={episode.thumbnail || "/placeholder.svg"}
                        onClick={() => handleEpisodeClick(episode, "list")}
                      />
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-start items-center gap-2 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="bg-[#0A0A0A] border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "ghost"}
                              onClick={() => handlePageChange(page)}
                              className={
                                currentPage === page
                                  ? "h-10 w-10 p-0 text-white font-bold bg-white/10"
                                  : "h-10 w-10 p-0 text-zinc-500 hover:text-white hover:bg-white/5"
                              }
                            >
                              {page}
                            </Button>
                          )
                        }
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="text-zinc-600 px-2">
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="bg-[#0A0A0A] border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={<SearchX className="h-14 w-14" />}
                title={
                  searchQuery.trim()
                    ? `No se encontraron episodios con "${searchQuery}"`
                    : selectedSeason
                }
                subtitle={
                  searchQuery.trim()
                    ? "Prueba con otro título o invitado."
                    : emptySeasonMessage(selectedSeason)
                }
              />
            )}
          </div>
        </>
      )}

      {selectedEpisode && videoId && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedEpisode(null)}
        >
          <div
            className="relative min-h-full w-full max-w-3xl mx-auto px-4 py-6 md:py-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-semibold text-sm md:text-base truncate pr-3">
                {selectedEpisode.rawTitle?.split("||")[0]?.trim() || selectedEpisode.title}
              </p>
              <button
                onClick={() => setSelectedEpisode(null)}
                className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-[#1A1A1A] text-white hover:bg-white/10 transition-colors shrink-0"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-900 aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedEpisode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-white font-bold text-xl leading-snug tracking-tight">
                {selectedEpisode.title}
              </h3>
              {selectedEpisode.guest && (
                <p className="text-primary font-semibold text-sm">{selectedEpisode.guest}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {selectedEpisode.date && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D0D0D] px-2.5 py-1.5 text-xs text-zinc-400">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {formatEpisodeDate(selectedEpisode.date)}
                  </span>
                )}
                {selectedEpisode.duration && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D0D0D] px-2.5 py-1.5 text-xs text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {selectedEpisode.duration}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-white font-bold text-[15px] tracking-tight mb-2">Descripción</h4>
              <p
                className={`text-[14px] leading-relaxed text-zinc-300/90 whitespace-pre-wrap ${
                  descriptionExpanded || !canExpandDescription ? "" : "line-clamp-5"
                }`}
              >
                {description}
              </p>
              {canExpandDescription && (
                <button
                  type="button"
                  onClick={() => setDescriptionExpanded((v) => !v)}
                  className="mt-1.5 text-primary text-[13px] font-semibold"
                >
                  {descriptionExpanded ? "Ver menos" : "Ver más"}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => shareEpisode(selectedEpisode)}
              className="mt-6 w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/45 bg-primary/10 text-primary text-[15px] font-semibold hover:bg-primary/15 transition-colors"
            >
              <Share2 className="w-[18px] h-[18px]" />
              Compartir episodio
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
