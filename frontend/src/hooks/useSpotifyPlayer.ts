import { useEffect, useState } from 'react';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

export function useSpotifyPlayer(accessToken: string | null) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'PlaylistIQ Web Player',
        getOAuthToken: (cb: (token: string) => void) => {
          if (accessToken) cb(accessToken);
        }
      });

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
      });

      player.addListener('initialization_error', (error: any) => {
        console.error('Spotify SDK initialization failed', error);
      });

      player.addListener('authentication_error', (error: any) => {
        console.error('Spotify SDK auth error', error);
      });

      player.addListener('playback_error', (error: any) => {
        console.error('Spotify SDK playback error', error);
      });

      player.connect();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [accessToken]);

  return { deviceId, isReady, currentTrack };
}
