import { NextResponse } from 'next/server';
import { getYouTubeApiKeyFromRemoteConfig, getRemoteConfigValue } from '@/lib/firebase-admin';
import { getChannelPlaylists } from '@/lib/youtube';

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY ?? (await getYouTubeApiKeyFromRemoteConfig('youtube_api_key').catch(() => null));
    if (!apiKey) {
      return NextResponse.json({ playlists: [], error: 'YouTube API key no configurada' }, { status: 200 });
    }

    const channelId = process.env.YOUTUBE_CHANNEL_ID ?? (await getRemoteConfigValue('youtube_channel_id'));
    if (channelId) {
      const playlists = await getChannelPlaylists(channelId, apiKey);
      return NextResponse.json({ playlists });
    }

    const singlePlaylistId = process.env.YOUTUBE_TUTORIALS_PLAYLIST_ID ?? (await getRemoteConfigValue('youtube_tutorials_playlist_id'));
    if (singlePlaylistId) {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${singlePlaylistId}&key=${apiKey}`
      );
      if (!res.ok) return NextResponse.json({ playlists: [] });
      const data = await res.json();
      const item = data.items?.[0];
      const playlists = item ? [{ id: item.id, title: item.snippet?.title || 'Tutoriales', thumbnail: item.snippet?.thumbnails?.medium?.url }] : [];
      return NextResponse.json({ playlists });
    }

    return NextResponse.json({ playlists: [] });
  } catch (e) {
    console.error('tutorials/playlists', e);
    return NextResponse.json({ playlists: [], error: String(e) }, { status: 500 });
  }
}
