# Portfolio API Backend

This is a Vercel serverless backend that provides live data APIs for the portfolio.

## Endpoints

- `GET /api/github` - Fetches recent GitHub contribution/activity data for Misiix9
- `GET /api/spotify` - Fetches currently/recently playing Spotify track
- `GET /api/calendar` - Fetches next Google Calendar event
- `GET /api/spotify-login` - Starts the Spotify OAuth helper flow
- `GET /api/spotify-callback` - Receives Spotify OAuth callback and prints the refresh token
- `GET /api/google-login` - Starts the Google Calendar OAuth helper flow
- `GET /api/google-callback` - Receives Google OAuth callback and prints the refresh token

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
   | `SPOTIFY_REDIRECT_URI` | Stable callback URL, for example `https://<backend-domain>/api/spotify-callback` |
   | `GOOGLE_CLIENT_ID` | From Google Cloud Console |
   | `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
   | `GOOGLE_REFRESH_TOKEN` | Obtained via OAuth flow (see below) |
   | `GOOGLE_REDIRECT_URI` | Stable callback URL, for example `https://<backend-domain>/api/google-callback` |

5. **Deploy**:
   ```bash
   vercel --prod
   ```

## Getting OAuth Tokens

### Spotify Refresh Token

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app (or use existing)
3. Set `SPOTIFY_REDIRECT_URI=https://<backend-domain>/api/spotify-callback` in Vercel
4. Add that exact URL to Redirect URIs in the Spotify app
5. Run the auth helper: Visit `https://<backend-domain>/api/spotify-login`
6. Copy the shown refresh token into `SPOTIFY_REFRESH_TOKEN`
7. Redeploy the backend

### Google Calendar Refresh Token

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project and enable Calendar API
3. Create OAuth 2.0 credentials (Web application)
4. Set `GOOGLE_REDIRECT_URI=https://<backend-domain>/api/google-callback` in Vercel
5. Add that exact URL to Authorized redirect URIs
6. Run the auth helper: Visit `https://<backend-domain>/api/google-login`
7. Copy the shown refresh token into `GOOGLE_REFRESH_TOKEN`
8. Redeploy the backend
