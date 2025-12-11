import { useState, useEffect } from 'react';

interface Availability {
  nextAvailable: string;
  isAvailableNow: boolean;
  isLoading: boolean;
}

export function useNextAvailability() {
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
      
      const timeStr = nextAvailable.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      let dayStr: string;
      if (isToday) {
        dayStr = 'Today';
      } else if (isTomorrow) {
        dayStr = 'Tomorrow';
      } else {
        dayStr = nextAvailable.toLocaleDateString('en-US', { weekday: 'short' });
      }
      
      setData({
        nextAvailable: `${dayStr} ${timeStr}`,
        isAvailableNow,
        isLoading: false,
      });
    };

    calculateNextAvailable();
    
    // Update every minute
    const interval = setInterval(calculateNextAvailable, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
}
