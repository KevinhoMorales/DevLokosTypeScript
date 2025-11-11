import { NextResponse } from 'next/server';
import { getYouTubeApiKeyFromRemoteConfig } from '@/lib/firebase-admin';
import { getYouTubePlaylistVideos } from '@/lib/youtube';

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

const YOUTUBE_PLAYLIST_ID = 'PLPXi7Vgl6Ak-Bm8Y2Xxhp1dwrzWT3AbjZ';
const SPOTIFY_SHOW_URL = 'https://open.spotify.com/show/3u6neVhqqDc693wTS16v1r?si=7FteYjGURHSzSxLtIHM6qg';

export async function GET() {
  try {
    // Obtener el API key de YouTube desde Firebase Remote Config
    const youtubeApiKey = await getYouTubeApiKeyFromRemoteConfig('youtube_api_key');
    
    // Obtener TODOS los videos de la playlist de YouTube (carga de 50 en 50)
    const youtubeVideos = await getYouTubePlaylistVideos(
      YOUTUBE_PLAYLIST_ID,
      youtubeApiKey
    );

    // Convertir los videos de YouTube al formato de episodios
    const episodes: PodcastEpisode[] = youtubeVideos.map((video, index) => {
      // Extraer información del título (formato: "DevLokos S2 Ep078 || Título || Invitado")
      const titleParts = video.title.split('||').map(part => part.trim());
      const episodeTitle = titleParts.length > 1 ? titleParts[1] : video.title;
      const guest = titleParts.length > 2 ? titleParts[2] : undefined;

      // Extraer descripción (primeros 200 caracteres)
      const description = video.description.length > 200 
        ? video.description.substring(0, 200) + '...'
        : video.description;

      return {
        id: index + 1,
        title: episodeTitle,
        description: description,
        thumbnail: video.thumbnail,
        spotifyUrl: SPOTIFY_SHOW_URL,
        youtubeUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
        duration: video.duration,
        guest: guest,
        date: video.publishedAt.split('T')[0], // Solo la fecha sin la hora
      };
    });

    // Retornar todos los episodios cargados
    return NextResponse.json({ episodes: episodes });
  } catch (error) {
    console.error('Error fetching episodes:', error);
    
    // En caso de error, retornar un mensaje descriptivo
    return NextResponse.json(
      { 
        error: 'Error al obtener los episodios',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

