import { useState, useEffect } from 'react';

interface CalendarEvent {
  hasEvent: boolean;
  title: string | null;
  time: string | null;
  rawStart: string | null;
  url: string | null;
  isLoading: boolean;
  error: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CACHE_KEY = 'portfolio.calendarEvent.v1';

function readCachedCalendarEvent() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) as CalendarEvent : null;
  } catch {
    return null;
  }
}

function cacheCalendarEvent(data: CalendarEvent) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage is best-effort only.
  }
}

export function useCalendarEvents() {
  const [data, setData] = useState<CalendarEvent>({
    hasEvent: false,
    title: null,
    time: null,
    rawStart: null,
    url: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async (signal?: AbortSignal) => {
      // If no API URL is set, use fallback data
      if (!API_URL) {
        setData(readCachedCalendarEvent() ?? {
          hasEvent: true,
          title: 'Available',
          time: 'Tomorrow 10:00 AM',
          rawStart: null,
          url: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/calendar`, { signal });
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result = await response.json();
        const nextData: CalendarEvent = {
          hasEvent: result.hasEvent,
          title: result.title,
          time: result.time,
          rawStart: result.rawStart,
          url: result.url,
          isLoading: false,
          error: null,
        };

        cacheCalendarEvent(nextData);
        setData(nextData);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        if (process.env.NODE_ENV === 'development') {
          console.warn('Calendar fetch failed:', err);
        }
        // Use fallback data on error
        setData(readCachedCalendarEvent() ?? {
          hasEvent: true,
          title: 'Available',
          time: 'Check availability',
          rawStart: null,
          url: null,
          isLoading: false,
          error: 'API request failed',
        });
      }
    };

    const controller = new AbortController();
    const refresh = () => {
      if (document.visibilityState === 'visible') {
        void fetchData(controller.signal);
      }
    };

    refresh();

    // Refresh every 10 minutes
    const interval = window.setInterval(refresh, 10 * 60 * 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return data;
}
