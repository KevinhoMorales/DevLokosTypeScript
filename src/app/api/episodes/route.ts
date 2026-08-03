import { NextResponse } from 'next/server';
import { getYouTubeApiKeyFromRemoteConfig } from '@/lib/firebase-admin';
import { getYouTubePlaylistVideos } from '@/lib/youtube';
import { detectSeasonFromTitle, type SeasonNumber } from '@/lib/podcast-seasons';

interface PodcastEpisode {
  id: number;
  title: string;
  /** Título original de YouTube (con ||). */
  rawTitle: string;
  description: string;
  thumbnail: string;
  spotifyUrl: string;
  youtubeUrl: string;
  duration: string;
  guest?: string;
  quote?: string;
  date?: string;
  /** 1 | 2 | 3 según S1/S2/S3 en el título (por defecto 2). */
  season: SeasonNumber;
}

const YOUTUBE_PLAYLIST_ID = 'PLPXi7Vgl6Ak-Bm8Y2Xxhp1dwrzWT3AbjZ';
const SPOTIFY_SHOW_URL = 'https://open.spotify.com/show/3u6neVhqqDc693wTS16v1r?si=7FteYjGURHSzSxLtIHM6qg';

export async function GET() {
  try {
    // Obtener el API key de YouTube desde Firebase Remote Config
    // Prioridad: Firebase Remote Config > Variable de entorno (fallback)
    let youtubeApiKey: string;
    
    try {
      youtubeApiKey = await getYouTubeApiKeyFromRemoteConfig('youtube_api_key');
    } catch (firebaseError) {
      console.error('Error obteniendo API key desde Firebase Remote Config:', firebaseError);
      // Fallback: usar variable de entorno si está disponible
      youtubeApiKey = process.env.YOUTUBE_API_KEY || '';
      if (!youtubeApiKey) {
        throw new Error('No se pudo obtener YouTube API Key. Verifica que Firebase Admin SDK esté configurado o configura YOUTUBE_API_KEY en .env.local');
      }
    }
    
    // Obtener TODOS los videos de la playlist de YouTube (carga de 50 en 50)
    const youtubeVideos = await getYouTubePlaylistVideos(
      YOUTUBE_PLAYLIST_ID,
      youtubeApiKey
    );

    const episodes: PodcastEpisode[] = youtubeVideos.map((video, index) => {
      // Formato típico: "DevLokos S2 Ep078 || Título || Invitado"
      const titleParts = video.title.split('||').map((part) => part.trim());
      let episodeTitle = video.title;
      let guest: string | undefined;
      if (titleParts.length >= 3) {
        episodeTitle = titleParts[1] || video.title;
        guest = titleParts[2] || undefined;
      } else if (titleParts.length === 2) {
        episodeTitle = titleParts[0] || video.title;
        guest = titleParts[1] || undefined;
      }

      return {
        id: index + 1,
        title: episodeTitle,
        // Título completo de YouTube (como en la app / lista).
        rawTitle: video.title,
        description: video.description || 'Sin descripción disponible.',
        thumbnail: video.thumbnail,
        spotifyUrl: SPOTIFY_SHOW_URL,
        youtubeUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
        duration: video.duration,
        guest: guest,
        date: video.publishedAt.split('T')[0],
        season: detectSeasonFromTitle(video.title),
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

