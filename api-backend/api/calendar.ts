import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  htmlLink: string;
}

interface CalendarList {
  items: CalendarEvent[];
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google credentials');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh Google token');
  }

  const data = await response.json();
  return data.access_token;
}

function formatEventTime(event: CalendarEvent): string {
  const startStr = event.start.dateTime || event.start.date;
  if (!startStr) return 'Unknown time';

  const start = new Date(startStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if today
  if (start.toDateString() === now.toDateString()) {
    return `Today ${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  }

  // Check if tomorrow
  if (start.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow ${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  }

  // Within this week
  const daysDiff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff <= 7) {
    return `${start.toLocaleDateString('en-US', { weekday: 'short' })} ${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  }

  // Further out
  return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

    // Fetch upcoming events from primary calendar
    const now = new Date().toISOString();
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        new URLSearchParams({
          timeMin: now,
          maxResults: '5',
          singleEvents: 'true',
          orderBy: 'startTime',
        }),
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google Calendar API returned ${response.status}`);
    }

    const data: CalendarList = await response.json();

    if (data.items && data.items.length > 0) {
      const nextEvent = data.items[0];
      return res.status(200).json({
        hasEvent: true,
        title: nextEvent.summary || 'Busy',
        time: formatEventTime(nextEvent),
        rawStart: nextEvent.start.dateTime || nextEvent.start.date,
        url: nextEvent.htmlLink,
        lastUpdated: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      hasEvent: false,
      title: null,
      time: null,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Google Calendar API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch calendar data',
      hasEvent: false,
    });
  }
}
