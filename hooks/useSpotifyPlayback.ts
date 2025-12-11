import { useState, useEffect, useCallback, useRef } from 'react';

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
  isLoading: boolean;
  error: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
    isLoading: true,
    error: null,
  });

  const progressRef = useRef<number | null>(null);
  const lastFetchTimeRef = useRef<number>(Date.now());

  const fetchData = useCallback(async () => {
    // If no API URL is set, use fallback data
    if (!API_URL) {
      const now = Date.now();
      const elapsed = now - lastFetchTimeRef.current;
      lastFetchTimeRef.current = now;
      
      setData(prev => ({
        isPlaying: true,
        track: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        albumArt: null,
        url: null,
        uri: null,
        progressMs: Math.min((prev.progressMs || 0) + elapsed, 200000),
        durationMs: 200000,
        isLoading: false,
        error: null,
      }));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/spotify`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      progressRef.current = result.progressMs;
      lastFetchTimeRef.current = Date.now();
      
      setData({
        isPlaying: result.isPlaying,
        track: result.track,
        artist: result.artist,
        album: result.album,
        albumArt: result.albumArt,
        url: result.url,
        uri: result.uri,
        progressMs: result.progressMs,
        durationMs: result.durationMs,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('Spotify fetch error:', err);
      setData({
        isPlaying: false,
        track: 'Not connected',
        artist: null,
        album: null,
        albumArt: null,
        url: null,
        uri: null,
        progressMs: null,
        durationMs: null,
        isLoading: false,
        error: 'Using cached data',
      });
    }
  }, []);

  // Initial fetch and refresh every 30 seconds
  useEffect(() => {
    fetchData();
    const refreshInterval = setInterval(fetchData, 30 * 1000);
    return () => clearInterval(refreshInterval);
  }, [fetchData]);

  // Live progress update every second when playing
  useEffect(() => {
    if (!data.isPlaying || data.progressMs === null || data.durationMs === null) {
      return;
    }

    const progressInterval = setInterval(() => {
      setData(prev => {
        if (!prev.isPlaying || prev.progressMs === null || prev.durationMs === null) {
          return prev;
        }

        const newProgress = prev.progressMs + 100;

        // Song ended, trigger refresh
        if (newProgress >= prev.durationMs) {
          fetchData();
          return prev;
        }

        return {
          ...prev,
          progressMs: newProgress,
        };
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [data.isPlaying, data.track, fetchData]);

  return data;
}
