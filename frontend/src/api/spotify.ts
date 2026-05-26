const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

function authHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };
}

export async function refreshSpotifyToken(refreshToken: string, clientId: string) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId
  });

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  if (!response.ok) {
    throw new Error('Spotify token refresh failed');
  }

  return response.json();
}

export async function getCurrentUserPlaylists(accessToken: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}/me/playlists?limit=50`, {
    headers: authHeaders(accessToken)
  });
  if (!response.ok) throw new Error('Could not fetch playlists');
  return response.json();
}

export async function getPlaylistTracks(accessToken: string, playlistId: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks?market=DK&limit=100`, {
    headers: authHeaders(accessToken)
  });
  if (!response.ok) throw new Error('Could not fetch playlist tracks');
  return response.json();
}

export async function searchTrack(accessToken: string, query: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}/search?type=track&limit=1&q=${encodeURIComponent(query)}`, {
    headers: authHeaders(accessToken)
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.tracks?.items?.[0] || null;
}

export async function addTracksToPlaylist(accessToken: string, playlistId: string, uris: string[]) {
  const response = await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify({ uris })
  });
  if (!response.ok) throw new Error('Kunne ikke tilføje tracks til playlisten');
  return response.json();
}

export async function startPlayback(accessToken: string, deviceId: string, uris: string[]) {
  const response = await fetch(`${SPOTIFY_API_BASE}/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
    method: 'PUT',
    headers: authHeaders(accessToken),
    body: JSON.stringify({ uris, offset: { position: 0 } })
  });
  if (!response.ok) throw new Error('Kunne ikke starte playback');
}

export async function setShuffle(accessToken: string, state: boolean, deviceId: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}/me/player/shuffle?state=${state}&device_id=${encodeURIComponent(deviceId)}`, {
    method: 'PUT',
    headers: authHeaders(accessToken)
  });
  if (!response.ok) throw new Error('Could not set shuffle');
}
