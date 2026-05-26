import type { MouseEventHandler } from 'react';

type Props = {
  onLogin: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
};

export function SpotifyLogin({ onLogin, loading }: Props) {
  return (
    <button
      onClick={onLogin}
      disabled={loading}
      className="rounded-full bg-spotify px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#1ed760] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Logger ind...' : 'Log ind med Spotify'}
    </button>
  );
}
