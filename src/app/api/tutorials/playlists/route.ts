import { NextResponse } from 'next/server';
import { getYouTubeApiKeyFromRemoteConfig, getRemoteConfigValue } from '@/lib/firebase-admin';
import { getChannelPlaylists, getChannelIdFromPlaylist } from '@/lib/youtube';

/** Defaults en código (igual que en la app mobile setDefaults). Si Remote Config solo tiene youtube_api_key, se usan estos. */
const DEFAULT_YOUTUBE_PLAYLIST_ID = 'PLPXi7Vgl6Ak-Bm8Y2Xxhp1dwrzWT3AbjZ'; // playlist principal (podcast)
const DEFAULT_YOUTUBE_TUTORIALS_PLAYLIST_ID = 'PLPXi7Vgl6Ak9fqyhptJNCjG4HIU_M6MsF'; // Cursos Express

export async function GET() {
  try {
    const apiKey = (await getYouTubeApiKeyFromRemoteConfig('youtube_api_key').catch(() => null))
      || (process.env.YOUTUBE_API_KEY ?? '').trim();
    if (!apiKey) {
      return NextResponse.json(
        { playlists: [], error: 'YouTube API key no configurada. Configura youtube_api_key en Remote Config o YOUTUBE_API_KEY en .env.local' },
        { status: 200 }
      );
    }

    const channelId = (await getRemoteConfigValue('youtube_channel_id').catch(() => null))
      || (process.env.YOUTUBE_CHANNEL_ID ?? '').trim() || null;
    const tutorialsPlaylistId = (await getRemoteConfigValue('youtube_tutorials_playlist_id').catch(() => null))
      || (process.env.YOUTUBE_TUTORIALS_PLAYLIST_ID ?? '').trim()
      || DEFAULT_YOUTUBE_TUTORIALS_PLAYLIST_ID;
    const podcastPlaylistId = (await getRemoteConfigValue('youtube_playlist_id').catch(() => null))
      || (process.env.YOUTUBE_PLAYLIST_ID ?? '').trim()
      || DEFAULT_YOUTUBE_PLAYLIST_ID;
    const excludePlaylistId = podcastPlaylistId || undefined;

    if (channelId) {
      const playlists = await getChannelPlaylists(channelId, apiKey, { excludePlaylistId });
      return NextResponse.json({ playlists });
    }

    const playlistIdToUse = (tutorialsPlaylistId && tutorialsPlaylistId.trim() !== '') ? tutorialsPlaylistId : podcastPlaylistId;
    const resolvedChannelId = await getChannelIdFromPlaylist(playlistIdToUse, apiKey);
    if (resolvedChannelId) {
      const playlists = await getChannelPlaylists(resolvedChannelId, apiKey, { excludePlaylistId });
      if (playlists.length > 0) return NextResponse.json({ playlists });
    }
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistIdToUse}&key=${apiKey}`
    );
    if (!res.ok) {
      const errText = await res.text();
      console.error('YouTube playlists by id', res.status, errText);
      return NextResponse.json({ playlists: [], error: `YouTube API: ${res.statusText}` }, { status: 200 });
    }
    const data = await res.json();
    const item = data.items?.[0];
    const playlists = item
      ? [{ id: item.id, title: item.snippet?.title || 'Tutoriales', thumbnail: item.snippet?.thumbnails?.medium?.url, itemCount: item.contentDetails?.itemCount }]
      : [];
    return NextResponse.json({ playlists });
  } catch (e) {
    console.error('tutorials/playlists', e);
    return NextResponse.json({ playlists: [], error: String(e) }, { status: 500 });
  }
}
