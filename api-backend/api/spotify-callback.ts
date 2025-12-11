import type { VercelRequest, VercelResponse } from '@vercel/node';

const REDIRECT_URI = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/spotify-callback`
  : 'http://localhost:3000/api/spotify-callback';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({ error: `Spotify auth error: ${error}` });
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing Spotify credentials' });
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(400).json({ error: 'Token exchange failed', details: errorData });
    }

    const data = await response.json();

    // Return the refresh token - user needs to copy this to Vercel env vars
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Auth Success</title>
          <style>
            body { font-family: system-ui; background: #111; color: #fff; padding: 40px; }
            .token { background: #1DB954; padding: 20px; border-radius: 8px; word-break: break-all; margin: 20px 0; }
            code { font-size: 14px; }
            h1 { color: #1DB954; }
          </style>
        </head>
        <body>
          <h1>✅ Spotify Authorization Successful!</h1>
          <p>Copy this refresh token and add it to your Vercel environment variables as <strong>SPOTIFY_REFRESH_TOKEN</strong>:</p>
          <div class="token">
            <code>${data.refresh_token}</code>
          </div>
          <p>After adding the variable, redeploy your backend:</p>
          <pre>vercel --prod</pre>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Spotify callback error:', err);
    return res.status(500).json({ error: 'Failed to exchange code for token' });
  }
}
