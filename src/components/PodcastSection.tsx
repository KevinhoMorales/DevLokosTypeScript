'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface PodcastEpisode {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  spotifyUrl: string;
  youtubeUrl: string;
  duration: string;
  guest?: string;
  quote?: string;
  date?: string;
}

// Función para extraer el video ID de una URL de YouTube
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Función para normalizar texto removiendo tildes
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function PodcastSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: searchRef, isVisible: searchVisible } = useScrollAnimation({ threshold: 0.2 });
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 6;

  useEffect(() => {
    // Fetch episodes from API
    const fetchEpisodes = async () => {
      try {
        const response = await fetch('/api/episodes');
        const data = await response.json();
        if (data.episodes) {
          setEpisodes(data.episodes);
        }
      } catch (error) {
        console.error('Error fetching episodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEpisode(null);
      }
    };

    if (selectedEpisode) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedEpisode]);

  // Resetear a la primera página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filtrar episodios según la búsqueda (título e invitado, sin tildes)
  const filteredEpisodes = episodes.filter(episode => {
    const searchNormalized = normalizeText(searchQuery);
    const titleNormalized = normalizeText(episode.title);
    const guestNormalized = episode.guest ? normalizeText(episode.guest) : '';
    const titleMatch = titleNormalized.includes(searchNormalized);
    const guestMatch = guestNormalized.includes(searchNormalized);
    return titleMatch || guestMatch;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const paginatedEpisodes = filteredEpisodes.slice(startIndex, endIndex);

  const handleEpisodeClick = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
  };

  const closeModal = () => {
    setSelectedEpisode(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of section
    const section = document.getElementById('podcast-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const videoId = selectedEpisode ? getYouTubeVideoId(selectedEpisode.youtubeUrl) : null;

  return (
    <section id="podcast-section" ref={sectionRef} className="w-full py-16 sm:py-24 md:py-32 lg:py-40 xl:py-48 2xl:py-56 bg-black flex justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col items-center">
        <div className={`w-full transition-all duration-1000 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Section Header */}
                  <div ref={headerRef} className={`text-center mb-16 sm:mb-20 md:mb-24 lg:mb-28 xl:mb-32 2xl:mb-40 w-full flex flex-col items-center transition-all duration-800 delay-200 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-12 sm:mb-14 md:mb-16 lg:mb-18 xl:mb-20 2xl:mb-24 text-primary transition-all duration-800 delay-300 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                      Conoce los últimos episodios
                    </h1>
                    
                    {/* Search Bar */}
                    <div ref={searchRef} className={`w-full max-w-2xl mb-12 sm:mb-14 md:mb-16 lg:mb-18 xl:mb-20 2xl:mb-24 transition-all duration-800 delay-400 ${searchVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Buscar episodios por título o invitado..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 md:px-8 md:py-5 bg-gray-900/80 backdrop-blur-sm border-2 border-gray-800 rounded-xl md:rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-all duration-300 text-sm md:text-base shadow-lg"
                          />
                          <div className="absolute right-5 md:right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white/40 group-focus-within:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {searchQuery && (
                        <div className="mt-4 sm:mt-5 md:mt-6 flex items-center justify-center gap-2">
                          <div className="h-1 w-1 bg-primary rounded-full animate-pulse"></div>
                          <p className="text-white/70 text-xs sm:text-sm md:text-base font-medium">
                            {filteredEpisodes.length} {filteredEpisodes.length === 1 ? 'episodio encontrado' : 'episodios encontrados'}
                          </p>
                        </div>
                      )}
                    </div>
          </div>

          {/* Episodes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20 mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-32 2xl:mb-40 w-full place-items-center">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 w-full max-w-md mx-auto animate-pulse"
                >
                  {/* Thumbnail Skeleton */}
                  <div className="relative h-48 bg-gray-800 flex items-center justify-center overflow-hidden">
                    <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
                    <div className="absolute top-4 right-4 bg-gray-800 px-3 py-1 rounded text-sm w-16 h-6"></div>
                  </div>

                  {/* Content Skeleton */}
                  <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 2xl:p-20">
                    <div className="h-4 bg-gray-800 rounded w-32 mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8"></div>
                    <div className="h-6 bg-gray-800 rounded w-full mb-3"></div>
                    <div className="h-6 bg-gray-800 rounded w-5/6 mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8"></div>
                    <div className="space-y-2 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                      <div className="h-4 bg-gray-800 rounded w-full"></div>
                      <div className="h-4 bg-gray-800 rounded w-full"></div>
                      <div className="h-4 bg-gray-800 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
                  ) : (
                    <>
                      {paginatedEpisodes.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20 mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28 2xl:mb-32 w-full place-items-center">
                            {paginatedEpisodes.map((episode, index) => {
                              // Componente interno para cada card con su propia animación
                              const EpisodeCard = () => {
                                const { ref: cardRef, isVisible: cardVisible } = useScrollAnimation({ 
                                  threshold: 0.1,
                                  rootMargin: '0px 0px -50px 0px'
                                });
                                
                                return (
                                  <div
                                    ref={cardRef}
                                    onClick={() => handleEpisodeClick(episode)}
                                    className={`group bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all duration-500 hover:transform hover:scale-105 w-full max-w-md mx-auto cursor-pointer ${cardVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                  >
                                    {/* Thumbnail */}
                                    <div className="relative h-48 bg-primary/20 flex items-center justify-center overflow-hidden">
                                      {episode.thumbnail && episode.thumbnail !== "/api/placeholder/300/200" ? (
                                        <>
                                          <Image
                                            src={episode.thumbnail}
                                            alt={episode.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            unoptimized
                                          />
                                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      )}
                                      <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded text-sm text-white font-medium z-10">
                                        {episode.duration}
                                      </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 2xl:p-20">
                                      {episode.guest && (
                                        <div className="text-xs sm:text-sm md:text-base text-primary font-medium mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8">
                                          {episode.guest}
                                        </div>
                                      )}
                                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 text-white group-hover:text-primary transition-colors">
                                        {episode.title}
                                      </h3>
                                      <p className="text-white mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-xs sm:text-sm md:text-base leading-relaxed">
                                        {episode.description}
                                      </p>

                                      {/* Quote Highlight */}
                                      {episode.quote && (
                                        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 p-4 sm:p-5 md:p-6 lg:p-7 bg-primary/10 border-l-4 border-primary rounded-r-lg">
                                          <p className="text-xs sm:text-sm md:text-base text-white italic leading-relaxed">
                                            "{episode.quote}"
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              };
                              
                              return <EpisodeCard key={episode.id} />;
                            })}
                          </div>

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3 mt-12 sm:mt-16 md:mt-20 lg:mt-24">
                              <div className="flex items-center gap-2 flex-wrap justify-center max-w-full overflow-x-auto pb-2 px-4">
                                {/* Previous Button */}
                                <button
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                                    currentPage === 1
                                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                      : 'bg-gray-900/80 border-2 border-gray-800 text-white hover:border-primary hover:text-primary hover:bg-gray-900'
                                  }`}
                                >
                                  Anterior
                                </button>

                                {/* Page Numbers - Horizontal */}
                                <div className="flex items-center gap-1.5">
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    // Mostrar solo algunas páginas alrededor de la actual
                                    if (
                                      page === 1 ||
                                      page === totalPages ||
                                      (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                      return (
                                        <button
                                          key={page}
                                          onClick={() => handlePageChange(page)}
                                          className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                            currentPage === page
                                              ? 'bg-primary text-white shadow-lg shadow-primary/50'
                                              : 'bg-gray-900/80 border-2 border-gray-800 text-white hover:border-primary hover:text-primary hover:bg-gray-900'
                                          }`}
                                        >
                                          {page}
                                        </button>
                                      );
                                    } else if (
                                      page === currentPage - 2 ||
                                      page === currentPage + 2
                                    ) {
                                      return (
                                        <span key={page} className="text-white/50 px-1 text-sm font-medium">
                                          ...
                                        </span>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>

                                {/* Next Button */}
                                <button
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                                    currentPage === totalPages
                                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                      : 'bg-gray-900/80 border-2 border-gray-800 text-white hover:border-primary hover:text-primary hover:bg-gray-900'
                                  }`}
                                >
                                  Siguiente
                                </button>
                              </div>
                              <p className="text-white/60 text-xs font-medium">
                                Página {currentPage} de {totalPages}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-16 md:py-20">
                          <p className="text-white/60 text-lg md:text-xl">
                            No se encontraron episodios con "{searchQuery}"
                          </p>
                        </div>
                      )}
                    </>
                  )}
        </div>
      </div>

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
  );
}
