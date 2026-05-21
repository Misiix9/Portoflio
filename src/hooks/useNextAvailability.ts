import { useState, useEffect } from 'react';

interface Availability {
  nextAvailable: string;
  isAvailableNow: boolean;
  isLoading: boolean;
}

interface AvailabilityOptions {
  locale?: string;
  todayLabel?: string;
  tomorrowLabel?: string;
}

export function useNextAvailability({
  locale = 'en',
  todayLabel = 'Today',
  tomorrowLabel = 'Tomorrow',
}: AvailabilityOptions = {}) {
  const [data, setData] = useState<Availability>({
    nextAvailable: '',
    isAvailableNow: false,
    isLoading: true,
  });

  useEffect(() => {
    const calculateNextAvailable = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
      const currentHour = now.getHours();
      
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const availableHour = isWeekend ? 10 : 14; // 10 AM weekends, 2 PM weekdays
      
      // Check if available now
      const isAvailableNow = currentHour >= availableHour;
      
      let nextAvailable: Date;
      
      if (currentHour < availableHour) {
        // Today, at availableHour
        nextAvailable = new Date(now);
        nextAvailable.setHours(availableHour, 0, 0, 0);
      } else {
        // Tomorrow
        nextAvailable = new Date(now);
        nextAvailable.setDate(now.getDate() + 1);
        const tomorrowDayOfWeek = nextAvailable.getDay();
        const tomorrowIsWeekend = tomorrowDayOfWeek === 0 || tomorrowDayOfWeek === 6;
        const tomorrowAvailableHour = tomorrowIsWeekend ? 10 : 14;
        nextAvailable.setHours(tomorrowAvailableHour, 0, 0, 0);
      }

      // Format the result
      const isToday = nextAvailable.getDate() === now.getDate();
      const isTomorrow = nextAvailable.getDate() === now.getDate() + 1;

      const formatLocale = locale === 'hu' ? 'hu-HU' : 'en-US';
      const timeStr = nextAvailable.toLocaleTimeString(formatLocale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: locale !== 'hu'
      });

      let dayStr: string;
      if (isToday) {
        dayStr = todayLabel;
      } else if (isTomorrow) {
        dayStr = tomorrowLabel;
      } else {
        dayStr = nextAvailable.toLocaleDateString(formatLocale, { weekday: 'short' });
      }

      setData({
        nextAvailable: `${dayStr} ${timeStr}`,
        isAvailableNow,
        isLoading: false,
      });
    };

    const refresh = () => {
      if (document.visibilityState === 'visible') {
        calculateNextAvailable();
      }
    };

    calculateNextAvailable();
    
    // Update every minute
    const interval = window.setInterval(refresh, 60 * 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [locale, todayLabel, tomorrowLabel]);

  return data;
}
