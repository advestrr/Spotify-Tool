import { useEffect, useMemo, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string;
const SCOPES = [
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'streaming',
  'user-read-email',
  'user-read-private'
].join(' ');

function base64urlencode(str: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function sha256(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64urlencode(hash);
}

function randomString(length: number) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  return Array.from({ length }, () => possible[Math.floor(Math.random() * possible.length)]).join('');
}

export function useSpotifyAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('spotify_access_token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('spotify_refresh_token'));
  const [expiresAt, setExpiresAt] = useState<number>(() => Number(localStorage.getItem('spotify_expires_at') || '0'));
  const [ready, setReady] = useState(false);

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code && CLIENT_ID && REDIRECT_URI) {
      const codeVerifier = localStorage.getItem('spotify_code_verifier') || '';
      window.history.replaceState({}, document.title, '/');
      if (codeVerifier) {
        fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier
          })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.access_token) {
              const expiresAtValue = Date.now() + data.expires_in * 1000;
              setAccessToken(data.access_token);
              setRefreshToken(data.refresh_token);
              setExpiresAt(expiresAtValue);
              localStorage.setItem('spotify_access_token', data.access_token);
              localStorage.setItem('spotify_refresh_token', data.refresh_token);
              localStorage.setItem('spotify_expires_at', String(expiresAtValue));
              setReady(true);
            }
          })
          .catch(console.error);
      }
    } else {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    async function refresh() {
      if (refreshToken && expiresAt && Date.now() > expiresAt - 60000) {
        const body = new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: CLIENT_ID
        });
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString()
        });
        const data = await response.json();
        if (data.access_token) {
          const expiresAtValue = Date.now() + data.expires_in * 1000;
          setAccessToken(data.access_token);
          localStorage.setItem('spotify_access_token', data.access_token);
          localStorage.setItem('spotify_expires_at', String(expiresAtValue));
          setExpiresAt(expiresAtValue);
        } else {
          logout();
        }
      }
    }

    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [refreshToken, expiresAt]);

  const login = async () => {
    const verifier = randomString(128);
    const challenge = await sha256(verifier);
    localStorage.setItem('spotify_code_verifier', verifier);
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: challenge
    });
    window.location.assign(`https://accounts.spotify.com/authorize?${params.toString()}`);
  };

  const logout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_expires_at');
    localStorage.removeItem('spotify_code_verifier');
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(0);
  };

  return {
    accessToken,
    refreshToken,
    expiresAt,
    isAuthenticated,
    ready,
    login,
    logout
  };
}
