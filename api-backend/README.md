# Portfolio API Backend

This is a Vercel serverless backend that provides live data APIs for the portfolio.

## Endpoints

- `GET /api/github` - Fetches recent GitHub activity for Misiix9
- `GET /api/spotify` - Fetches currently/recently playing Spotify track
- `GET /api/calendar` - Fetches next Google Calendar event

## Setup

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Link this directory to Vercel**:
   ```bash
   cd api-backend
   vercel link
   ```

4. **Set up environment variables** in Vercel Dashboard:

   | Variable | Description |
   |----------|-------------|
   | `SPOTIFY_CLIENT_ID` | From Spotify Developer Dashboard |
   | `SPOTIFY_CLIENT_SECRET` | From Spotify Developer Dashboard |
   | `SPOTIFY_REFRESH_TOKEN` | Obtained via OAuth flow (see below) |
   | `GOOGLE_CLIENT_ID` | From Google Cloud Console |
   | `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
   | `GOOGLE_REFRESH_TOKEN` | Obtained via OAuth flow (see below) |

5. **Deploy**:
   ```bash
   vercel --prod
   ```

## Getting OAuth Tokens

### Spotify Refresh Token

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app (or use existing)
3. Add `http://localhost:3000/callback` to Redirect URIs
4. Run the auth helper: Visit `/api/spotify/login` then `/api/spotify/callback`

### Google Calendar Refresh Token

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project and enable Calendar API
3. Create OAuth 2.0 credentials (Web application)
4. Add `http://localhost:3000/callback` to Authorized redirect URIs
5. Run the auth helper: Visit `/api/calendar/login` then `/api/calendar/callback`
