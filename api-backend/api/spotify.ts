import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  progress_ms: number;
  item: SpotifyTrack;
}

interface SpotifyRecentlyPlayed {
  items: Array<{
    track: SpotifyTrack;
    played_at: string;
  }>;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Spotify credentials');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh Spotify token');
  }

  const data = await response.json();
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const accessToken = await getAccessToken();

    // Try to get currently playing
    const currentResponse = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    // If playing, return current track
    if (currentResponse.status === 200) {
      const data: SpotifyCurrentlyPlaying = await currentResponse.json();
      if (data.item) {
        return res.status(200).json({
          isPlaying: data.is_playing,
          track: data.item.name,
          artist: data.item.artists.map((a) => a.name).join(', '),
          album: data.item.album.name,
          albumArt: data.item.album.images[0]?.url,
          url: data.item.external_urls.spotify,
          uri: data.item.uri,
          progressMs: data.progress_ms,
          durationMs: data.item.duration_ms,
          lastUpdated: new Date().toISOString(),
        });
      }
    }

    // Not playing - get recently played
    const recentResponse = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (recentResponse.ok) {
      const data: SpotifyRecentlyPlayed = await recentResponse.json();
      if (data.items && data.items.length > 0) {
        const track = data.items[0].track;
        return res.status(200).json({
          isPlaying: false,
          track: track.name,
          artist: track.artists.map((a) => a.name).join(', '),
          album: track.album.name,
          albumArt: track.album.images[0]?.url,
          url: track.external_urls.spotify,
          uri: track.uri,
          progressMs: 0,
          durationMs: track.duration_ms,
          playedAt: data.items[0].played_at,
          lastUpdated: new Date().toISOString(),
        });
      }
    }

    // No data available
    return res.status(200).json({
      isPlaying: false,
      track: null,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Spotify API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch Spotify data',
      isPlaying: false,
      track: null,
    });
  }
}
