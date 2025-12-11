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
    const fetchData = async () => {
      // If no API URL is set, use fallback data
      if (!API_URL) {
        setData({
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
        const response = await fetch(`${API_URL}/api/calendar`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result = await response.json();
        setData({
          hasEvent: result.hasEvent,
          title: result.title,
          time: result.time,
          rawStart: result.rawStart,
          url: result.url,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error('Calendar fetch error:', err);
        // Use fallback data on error
        setData({
          hasEvent: true,
          title: 'Available',
          time: 'Check availability',
          rawStart: null,
          url: null,
          isLoading: false,
          error: 'Using cached data',
        });
      }
    };

    fetchData();

    // Refresh every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
}
