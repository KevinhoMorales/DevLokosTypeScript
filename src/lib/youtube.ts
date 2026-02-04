export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  videoId: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  thumbnail?: string;
  itemCount?: number;
}

const BLOQUES_PODCAST_TITLE = 'Bloques Podcast';

/**
 * Lista las playlists de un canal de YouTube (para Tutoriales).
 * Excluye la playlist cuyo título sea "Bloques Podcast".
 */
export async function getChannelPlaylists(
  channelId: string,
  apiKey: string
): Promise<YouTubePlaylist[]> {
  const all: YouTubePlaylist[] = [];
  let nextPageToken: string | undefined;
  do {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&maxResults=50&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube playlists: ${res.statusText}`);
    const data = await res.json();
    const items = data.items || [];
    for (const item of items) {
      const title = item.snippet?.title || '';
      if (title && title !== BLOQUES_PODCAST_TITLE) {
        all.push({
          id: item.id,
          title,
          thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
          itemCount: item.contentDetails?.itemCount,
        });
      }
    }
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);
  return all;
}

/**
 * Obtiene TODOS los videos de una playlist de YouTube
 * @param playlistId ID de la playlist de YouTube
 * @param apiKey API Key de YouTube
 * @returns Promise<YouTubeVideo[]>
 */
export async function getYouTubePlaylistVideos(
  playlistId: string,
  apiKey: string
): Promise<YouTubeVideo[]> {
  try {
    const allVideos: YouTubeVideo[] = [];
    let nextPageToken: string | undefined = undefined;
    const maxResultsPerPage = 50; // Máximo permitido por request

    // Hacer múltiples requests hasta obtener todos los videos
    do {
      // Construir URL con paginación
      let playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResultsPerPage}&key=${apiKey}`;
      if (nextPageToken) {
        playlistUrl += `&pageToken=${nextPageToken}`;
      }

      // Obtener los video IDs de la playlist
      const playlistResponse = await fetch(playlistUrl);

      if (!playlistResponse.ok) {
        throw new Error(`Error al obtener la playlist: ${playlistResponse.statusText}`);
      }

      const playlistData = await playlistResponse.json();

      if (!playlistData.items || playlistData.items.length === 0) {
        break;
      }

      // Extraer los video IDs
      const videoIds = playlistData.items
        .map((item: any) => item.snippet.resourceId.videoId)
        .filter((id: string) => id);

      if (videoIds.length === 0) {
        break;
      }

      // Obtener detalles de los videos (incluyendo duración y fecha de publicación)
      // YouTube API permite hasta 50 IDs por request
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds.join(',')}&key=${apiKey}`
      );

      if (!videosResponse.ok) {
        throw new Error(`Error al obtener los videos: ${videosResponse.statusText}`);
      }

      const videosData = await videosResponse.json();

      // Formatear los videos
      const videos: YouTubeVideo[] = videosData.items.map((item: any) => {
        // Convertir duración ISO 8601 a formato legible
        const duration = formatDuration(item.contentDetails.duration);

        return {
          id: item.id,
          videoId: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.maxres?.url || 
                     item.snippet.thumbnails.high?.url || 
                     item.snippet.thumbnails.medium?.url || 
                     item.snippet.thumbnails.default?.url,
          publishedAt: item.snippet.publishedAt,
          duration: duration,
        };
      });

      allVideos.push(...videos);

      // Obtener el token para la siguiente página
      nextPageToken = playlistData.nextPageToken;
    } while (nextPageToken);

    // Ordenar por fecha de publicación descendente (más recientes primero)
    allVideos.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA; // Orden descendente: fecha más reciente primero
    });

    // Retornar todos los videos ordenados
    return allVideos;
  } catch (error) {
    console.error('Error obteniendo videos de YouTube:', error);
    throw error;
  }
}

/**
 * Convierte una duración ISO 8601 a formato legible (ej: PT1H9M30S -> "1 h 9 min")
 */
function formatDuration(isoDuration: string | undefined | null): string {
  if (!isoDuration) {
    return '0 min';
  }

  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);

  if (!matches) {
    return '0 min';
  }

  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);

  let result = '';
  if (hours > 0) {
    result += `${hours} h `;
  }
  if (minutes > 0) {
    result += `${minutes} min`;
  } else if (hours === 0 && seconds > 0) {
    result += `${seconds} seg`;
  }

  return result.trim() || '0 min';
}

