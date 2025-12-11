import type { VercelRequest, VercelResponse } from '@vercel/node';

const REDIRECT_URI = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/google-callback`
  : 'http://localhost:3000/api/google-callback';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({ error: `Google auth error: ${error}` });
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing Google credentials' });
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(400).json({ error: 'Token exchange failed', details: errorData });
    }

    const data = await response.json();

    if (!data.refresh_token) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Missing Refresh Token</title>
          <style>body { font-family: system-ui; background: #111; color: #fff; padding: 40px; }</style></head>
          <body>
            <h1>⚠️ No Refresh Token Received</h1>
            <p>This can happen if you've already authorized this app before. Go to 
            <a href="https://myaccount.google.com/permissions" style="color: #4285f4;">Google Account Permissions</a>, 
            remove the app, and try again.</p>
          </body>
        </html>
      `);
    }

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Auth Success</title>
          <style>
            body { font-family: system-ui; background: #111; color: #fff; padding: 40px; }
            .token { background: #4285f4; padding: 20px; border-radius: 8px; word-break: break-all; margin: 20px 0; }
            code { font-size: 14px; }
            h1 { color: #4285f4; }
          </style>
        </head>
        <body>
          <h1>✅ Google Calendar Authorization Successful!</h1>
          <p>Copy this refresh token and add it to your Vercel environment variables as <strong>GOOGLE_REFRESH_TOKEN</strong>:</p>
          <div class="token">
            <code>${data.refresh_token}</code>
          </div>
          <p>After adding the variable, redeploy your backend:</p>
          <pre>vercel --prod</pre>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Google callback error:', err);
    return res.status(500).json({ error: 'Failed to exchange code for token' });
  }
}
