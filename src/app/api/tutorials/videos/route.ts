import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeApiKeyFromRemoteConfig } from '@/lib/firebase-admin';
import { getYouTubePlaylistVideos } from '@/lib/youtube';

export interface TutorialVideo {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration?: string;
}

export async function GET(request: NextRequest) {
  const playlistId = request.nextUrl.searchParams.get('playlistId');
  if (!playlistId) {
    return NextResponse.json({ error: 'playlistId requerido', tutorials: [] }, { status: 400 });
  }

  try {
    const apiKey = (await getYouTubeApiKeyFromRemoteConfig('youtube_api_key').catch(() => null))
      || (process.env.YOUTUBE_API_KEY ?? '').trim();
    if (!apiKey) {
      return NextResponse.json(
        { tutorials: [], error: 'YouTube API key no configurada. Configura youtube_api_key en Remote Config o YOUTUBE_API_KEY en .env.local' },
        { status: 200 }
      );
    }
    const videos = await getYouTubePlaylistVideos(playlistId, apiKey);
    const tutorials: TutorialVideo[] = videos.map((v) => ({
      id: v.videoId,
      videoId: v.videoId,
      title: v.title,
      description: v.description || '',
      thumbnailUrl: v.thumbnail,
      publishedAt: v.publishedAt,
      duration: v.duration,
    }));
    return NextResponse.json({ tutorials });
  } catch (e) {
    console.error('tutorials/videos', e);
    return NextResponse.json({ tutorials: [], error: String(e) }, { status: 500 });
  }
}
