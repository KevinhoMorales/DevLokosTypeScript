"use client"

import { useEffect, useState } from 'react'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EpisodeCard } from "@/components/EpisodeCard"
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
}

// Función para extraer el video ID de una URL de YouTube
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

// Función para normalizar texto removiendo tildes
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export default function PodcastSection() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const episodesPerPage = 6

  useEffect(() => {
    // Fetch episodes from API
    const fetchEpisodes = async () => {
      try {
        setError(null)
        setLoading(true)
        const response = await fetch('/api/episodes')
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
          const errorMessage = errorData.error || errorData.details || `Error ${response.status}: ${response.statusText}`
          throw new Error(errorMessage)
        }
        
        const data = await response.json()
        if (data.episodes && Array.isArray(data.episodes)) {
          setEpisodes(data.episodes)
          setError(null)
        } else {
          throw new Error('Formato de datos inválido')
        }
      } catch (error) {
        console.error('Error fetching episodes:', error)
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar los episodios. Por favor, intenta más tarde.'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
  }, [])

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEpisode(null)
      }
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

  // Resetear a la primera página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Filtrar episodios según la búsqueda (título e invitado, sin tildes)
  const filteredEpisodes = episodes.filter(episode => {
    const searchNormalized = normalizeText(searchQuery)
    const titleNormalized = normalizeText(episode.title)
    const guestNormalized = episode.guest ? normalizeText(episode.guest) : ''
    const titleMatch = titleNormalized.includes(searchNormalized)
    const guestMatch = guestNormalized.includes(searchNormalized)
    return titleMatch || guestMatch
  })

  // Calcular paginación
  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage)
  const startIndex = (currentPage - 1) * episodesPerPage
  const endIndex = startIndex + episodesPerPage
  const paginatedEpisodes = filteredEpisodes.slice(startIndex, endIndex)

  const handleEpisodeClick = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode)
  }

  const closeModal = () => {
    setSelectedEpisode(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of section
    const section = document.getElementById('podcast-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const videoId = selectedEpisode ? getYouTubeVideoId(selectedEpisode.youtubeUrl) : null

  return (
    <section id="podcast-section" className="w-full max-w-7xl mx-auto px-4 pb-20 space-y-12">
      <div className="space-y-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white text-center"
        >
          Conoce los últimos episodios
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative max-w-2xl mx-auto group"
        >
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Input
            type="text"
            placeholder="Buscar episodios por título o invitado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full bg-[#0A0A0A] border-white/10 text-white placeholder:text-zinc-600 h-14 pl-6 pr-14 rounded-2xl focus-visible:ring-orange-500 focus-visible:border-orange-500/50 transition-all shadow-2xl"
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 h-6 w-6" />
        </motion.div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/5 animate-pulse"
            >
              <div className="h-48 bg-[#F97316]/20" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-zinc-800 rounded w-32" />
                <div className="h-6 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-16">
          <div className="bg-red-900/20 border border-red-800 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              Error al cargar episodios
            </h3>
            <p className="text-white/70 text-sm md:text-base mb-6 break-words">
              {error}
            </p>
            <Button
              onClick={() => {
                setLoading(true)
                setError(null)
                fetch('/api/episodes')
                  .then(res => {
                    if (!res.ok) {
                      return res.json().then(err => Promise.reject(new Error(err.error || err.details || 'Error desconocido')))
                    }
                    return res.json()
                  })
                  .then(data => {
                    if (data.episodes && Array.isArray(data.episodes)) {
                      setEpisodes(data.episodes)
                      setError(null)
                    } else {
                      throw new Error('Formato de datos inválido')
                    }
                  })
                  .catch(err => {
                    setError(err.message || 'Error al cargar los episodios')
                  })
                  .finally(() => setLoading(false))
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Intentar de nuevo
            </Button>
          </div>
        </div>
      )}

      {/* Episodes Grid */}
      {!loading && !error && (
        <>
          {paginatedEpisodes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedEpisodes.map((episode, index) => (
                  <motion.div
                    key={episode.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EpisodeCard
                      title={episode.title}
                      guest={episode.guest}
                      duration={episode.duration}
                      image={episode.thumbnail || "/placeholder.svg"}
                      description={episode.description}
                      episodeNumber={episode.id}
                      onClick={() => handleEpisodeClick(episode)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-[#0A0A0A] border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className={currentPage === page 
                              ? "h-10 w-10 p-0 text-white font-bold bg-white/10" 
                              : "h-10 w-10 p-0 text-zinc-500 hover:text-white hover:bg-white/5"
                            }
                          >
                            {page}
                          </Button>
                        )
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
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
                    className="bg-[#0A0A0A] border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-white/60 text-lg md:text-xl">
                No se encontraron episodios con "{searchQuery}"
              </p>
            </div>
          )}
        </>
      )}

      {/* YouTube Modal */}
      {selectedEpisode && videoId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Info */}
            <div className="p-6 md:p-8 bg-gray-900/50 border-b border-gray-800">
              {selectedEpisode.guest && (
                <div className="text-sm md:text-base text-orange-500 font-medium mb-2">
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

            {/* YouTube Player */}
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
