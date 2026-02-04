'use client';

import { useEffect, useState, useCallback } from 'react';
import { Video } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { EmptyState } from '@/components/ui/EmptyState';
import { TutorialCard } from '@/components/TutorialCard';
import { Button } from '@/components/ui/button';
import { SECTION_CONTAINER } from '@/lib/section-layout';
import { motion } from 'framer-motion';

interface Playlist {
  id: string;
  title: string;
  thumbnail?: string;
}

interface Tutorial {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration?: string;
}

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function ContentSection() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [search, setSearch] = useState('');
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [errorPlaylists, setErrorPlaylists] = useState<string | null>(null);
  const [errorVideos, setErrorVideos] = useState<string | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const fetchPlaylists = useCallback(async () => {
    setLoadingPlaylists(true);
    setErrorPlaylists(null);
    try {
      const res = await fetch('/api/tutorials/playlists');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar playlists');
      const list = data.playlists ?? [];
      setPlaylists(list);
      if (list.length > 0 && !selectedPlaylistId) setSelectedPlaylistId(list[0].id);
    } catch (e) {
      setErrorPlaylists(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoadingPlaylists(false);
    }
  }, [selectedPlaylistId]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    if (!selectedPlaylistId) {
      setTutorials([]);
      return;
    }
    setLoadingVideos(true);
    setErrorVideos(null);
    fetch(`/api/tutorials/videos?playlistId=${encodeURIComponent(selectedPlaylistId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTutorials(data.tutorials ?? []);
      })
      .catch((e) => setErrorVideos(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoadingVideos(false));
  }, [selectedPlaylistId]);

  const filteredTutorials = search.trim()
    ? tutorials.filter((t) => normalize(t.title).includes(normalize(search)))
    : tutorials;

  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTutorial(null);
    };
    if (selectedTutorial) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onEscape);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEscape);
    };
  }, [selectedTutorial]);

  return (
    <section id="tutorials-section" className={`${SECTION_CONTAINER} bg-black`}>
      <SectionIntro>
        Contenido práctico organizado por playlists. Aprende nuevas tecnologías con tutoriales enfocados en ejemplos reales y casos de uso.
      </SectionIntro>
      {loadingPlaylists && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {errorPlaylists && !loadingPlaylists && (
          <EmptyState
            title="Error al cargar playlists"
            subtitle={errorPlaylists}
            action={
              <Button onClick={fetchPlaylists} className="bg-primary hover:bg-primary/90 text-white">
                Reintentar
              </Button>
            }
          />
        )}

        {!loadingPlaylists && !errorPlaylists && playlists.length === 0 && (
          <EmptyState
            icon={<Video className="w-12 h-12 text-primary" />}
            title="Tutoriales próximamente"
            subtitle="Estamos preparando el contenido."
          />
        )}

        {!loadingPlaylists && playlists.length > 0 && (
          <>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Buscar por título..."
              className="mb-6"
            />
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlaylistId(p.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedPlaylistId === p.id
                      ? 'bg-primary text-white border border-primary'
                      : 'bg-white/5 text-zinc-400 border border-white/10 hover:border-primary/50 hover:text-white'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>

            {loadingVideos && (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {errorVideos && !loadingVideos && (
              <EmptyState
                title="Error al cargar vídeos"
                subtitle={errorVideos}
                action={
                  <Button
                    onClick={() => {
                      setLoadingVideos(true);
                      setErrorVideos(null);
                      fetch(`/api/tutorials/videos?playlistId=${encodeURIComponent(selectedPlaylistId!)}`)
                        .then((r) => r.json())
                        .then((d) => (d.error ? Promise.reject(new Error(d.error)) : setTutorials(d.tutorials ?? [])))
                        .catch((e) => setErrorVideos(e.message))
                        .finally(() => setLoadingVideos(false));
                    }}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Reintentar
                  </Button>
                }
              />
            )}

            {!loadingVideos && !errorVideos && tutorials.length === 0 && (
              <EmptyState
                title="Esta playlist no tiene videos"
                subtitle={selectedPlaylist?.title}
              />
            )}

            {!loadingVideos && !errorVideos && tutorials.length > 0 && filteredTutorials.length === 0 && (
              <EmptyState title="No se encontraron tutoriales" subtitle={`Búsqueda: "${search}"`} />
            )}

            {!loadingVideos && !errorVideos && filteredTutorials.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutorials.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <TutorialCard
                      videoId={t.videoId}
                      title={t.title}
                      thumbnailUrl={t.thumbnailUrl}
                      publishedAt={t.publishedAt}
                      playlistTitle={selectedPlaylist?.title}
                      onClick={() => setSelectedTutorial(t)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {selectedTutorial && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedTutorial(null)}
          >
            <div
              className="relative w-full max-w-4xl bg-[#0D0D0D] rounded-2xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedTutorial(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center"
                aria-label="Cerrar"
              >
                <span className="text-xl leading-none">×</span>
              </button>
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-semibold pr-12 line-clamp-2">{selectedTutorial.title}</h3>
                {selectedPlaylist?.title && (
                  <p className="text-zinc-500 text-sm mt-1">{selectedPlaylist.title}</p>
                )}
              </div>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedTutorial.videoId}?autoplay=1&rel=0`}
                  title={selectedTutorial.title}
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
