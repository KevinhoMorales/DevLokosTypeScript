"use client"

import { useEffect, useState, useRef, useMemo } from 'react'
import { SearchX } from "lucide-react"
import { analyticsEvents } from '@/lib/analytics'
import { Button } from "@/components/ui/button"
import { SectionIntro } from "@/components/ui/SectionIntro"
import { SearchBar } from "@/components/ui/SearchBar"
import { SeasonFilter } from "@/components/ui/SeasonFilter"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { AutoCarousel } from "@/components/ui/AutoCarousel"
import { EmptyState } from "@/components/ui/EmptyState"
import { ErrorState } from "@/components/ui/ErrorState"
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton"
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
  return (match && match[2].length === 11) ? match[2] : null
}

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function pickDiscoverEpisodes(all: PodcastEpisode[], count = 4): PodcastEpisode[] {
  const valid = all.filter(
    (ep) => ep.title.trim().length > 0 && ep.title !== 'Sin título'
  )
  const pool = valid.length > 0 ? valid : all
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default function PodcastSection() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [discoverEpisodes, setDiscoverEpisodes] = useState<PodcastEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeason, setSelectedSeason] = useState<string>(DEFAULT_SEASON_LABEL)
  const [currentPage, setCurrentPage] = useState(1)
  const episodesPerPage = 20
  const discoverImpressedRef = useRef(false)

  const fetchEpisodes = async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await fetch('/api/episodes')

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
        const errorMessage = errorData.error || errorData.details || `Error ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      if (data.episodes && Array.isArray(data.episodes)) {
        setEpisodes(data.episodes)
        setDiscoverEpisodes(pickDiscoverEpisodes(data.episodes))
        setError(null)
      } else {
        throw new Error('Formato de datos inválido')
      }
    } catch (err) {
      console.error('Error fetching episodes:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar los episodios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEpisodes()
  }, [])

  const seasonNum = useMemo((): SeasonNumber => {
    if (selectedSeason.includes('3')) return 3
    if (selectedSeason.includes('1')) return 1
    return 2
  }, [selectedSeason])

  const searchFiltered = episodes.filter((episode) => {
    const searchNormalized = normalizeText(searchQuery)
    const titleNormalized = normalizeText(episode.title)
    const guestNormalized = episode.guest ? normalizeText(episode.guest) : ''
    return titleNormalized.includes(searchNormalized) || guestNormalized.includes(searchNormalized)
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
      if (e.key === 'Escape') setSelectedEpisode(null)
    }
    if (selectedEpisode) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
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
      analyticsEvents.search_performed(searchQuery, 'podcast', filteredEpisodes.length)
      searchDebounceRef.current = null
    }, 600)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [searchQuery, filteredEpisodes.length])

  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage)
  const startIndex = (currentPage - 1) * episodesPerPage
  const paginatedEpisodes = filteredEpisodes.slice(startIndex, startIndex + episodesPerPage)

  const handleEpisodeClick = (episode: PodcastEpisode, source: 'discover' | 'list' = 'list') => {
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
    document.getElementById('podcast-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const videoId = selectedEpisode ? getYouTubeVideoId(selectedEpisode.youtubeUrl) : null

  return (
    <section id="podcast-section" className={`${SECTION_CONTAINER} space-y-12`}>
      <SectionIntro>
        Episodios en audio y video. Búsqueda por título o invitado, filtros por temporada, sección Descubre y reproductor en pantalla completa.
      </SectionIntro>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar episodios por título o invitado..."
        className="max-w-2xl"
      />

      {loading && <LoadingSkeleton count={6} variant="card" />}

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
              <AutoCarousel
                label="Episodios para descubrir"
                intervalMs={5000}
                itemClassName="min-w-[240px] max-w-[260px] snap-start shrink-0"
              >
                {discoverEpisodes.map((episode) => (
                  <EpisodeCard
                    key={`discover-${episode.id}`}
                    compact
                    title={episode.title}
                    guest={episode.guest}
                    duration={episode.duration}
                    image={episode.thumbnail || "/placeholder.svg"}
                    description={episode.description}
                    episodeNumber={episode.id}
                    onClick={() => handleEpisodeClick(episode, 'discover')}
                  />
                ))}
              </AutoCarousel>
            </div>
          )}

          <div className="space-y-4">
            <SectionHeader
              title="Episodios"
              align="start"
              trailing={
                !searchQuery.trim() ? (
                  <SeasonFilter value={selectedSeason} onChange={setSelectedSeason} />
                ) : undefined
              }
            />

            {paginatedEpisodes.length > 0 ? (
              <>
                <div className="flex flex-col gap-2.5 max-w-3xl">
                  {paginatedEpisodes.map((episode, index) => (
                    <motion.div
                      key={episode.id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.02, 0.3) }}
                    >
                      <EpisodeListTile
                        title={episode.title}
                        guest={episode.guest}
                        duration={episode.duration}
                        image={episode.thumbnail || "/placeholder.svg"}
                        episodeNumber={episode.id}
                        onClick={() => handleEpisodeClick(episode, 'list')}
                      />
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-start items-center gap-2 pt-6 max-w-3xl">
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
                    ? 'Prueba con otro título o invitado.'
                    : emptySeasonMessage(selectedSeason)
                }
              />
            )}
          </div>
        </>
      )}

      {selectedEpisode && videoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedEpisode(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEpisode(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 md:p-8 bg-zinc-900/50 border-b border-zinc-800">
              {selectedEpisode.guest && (
                <div className="text-sm md:text-base text-primary font-medium mb-2">
                  {selectedEpisode.guest}
                </div>
              )}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {selectedEpisode.title}
              </h3>
              {selectedEpisode.duration && (
                <p className="text-white/70 text-sm md:text-base">
                  Duración: {selectedEpisode.duration}
                </p>
              )}
            </div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedEpisode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
