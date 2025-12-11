import type { VercelRequest, VercelResponse } from '@vercel/node';

const REDIRECT_URI = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/spotify-callback`
  : 'http://localhost:3000/api/spotify-callback';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  
  if (!clientId) {
    return res.status(500).json({ error: 'SPOTIFY_CLIENT_ID not set' });
  }

  const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
  ].join(' ');

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', scopes);

  return res.redirect(authUrl.toString());
}
