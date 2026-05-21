import { useState, useEffect, useCallback } from 'react';

interface SpotifyPlayback {
  isPlaying: boolean;
  track: string | null;
  artist: string | null;
  album: string | null;
  albumArt: string | null;
  url: string | null;
  uri: string | null;
  progressMs: number | null;
  durationMs: number | null;
  progressUpdatedAt: number | null;
  isLoading: boolean;
  error: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CACHE_KEY = 'portfolio.spotifyPlayback.v1';

function emptySpotifyState(error: string | null = null): SpotifyPlayback {
  return {
    isPlaying: false,
    track: null,
    artist: null,
    album: null,
    albumArt: null,
    url: null,
    uri: null,
    progressMs: null,
    durationMs: null,
    progressUpdatedAt: null,
    isLoading: false,
    error,
  };
}

function readCachedSpotify(): SpotifyPlayback | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) as SpotifyPlayback : null;
  } catch {
    return null;
  }
}

function cacheSpotify(data: SpotifyPlayback) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage is best-effort only.
  }
}

export function useSpotifyPlayback() {
  const [data, setData] = useState<SpotifyPlayback>({
    isPlaying: false,
    track: null,
    artist: null,
    album: null,
    albumArt: null,
    url: null,
    uri: null,
    progressMs: null,
    durationMs: null,
    progressUpdatedAt: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    // If no API URL is set, expose a clean empty state instead of fake activity.
    if (!API_URL) {
      setData(readCachedSpotify() ?? emptySpotifyState('API URL not configured'));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/spotify`, { signal });
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();

      const nextData: SpotifyPlayback = {
        isPlaying: result.isPlaying,
        track: result.track,
        artist: result.artist,
        album: result.album,
        albumArt: result.albumArt,
        url: result.url,
        uri: result.uri,
        progressMs: result.progressMs,
        durationMs: result.durationMs,
        progressUpdatedAt: Date.now(),
        isLoading: false,
        error: null,
      };

      cacheSpotify(nextData);
      setData(nextData);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      if (process.env.NODE_ENV === 'development') {
        console.warn('Spotify fetch failed:', err);
      }
      setData(readCachedSpotify() ?? emptySpotifyState('API request failed'));
    }
  }, []);

  // Initial fetch and refresh every 30 seconds
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => {
      if (document.visibilityState === 'visible') {
        void fetchData(controller.signal);
      }
    };

    refresh();
    const refreshInterval = window.setInterval(refresh, 30 * 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      controller.abort();
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [fetchData]);

  return data;
}
