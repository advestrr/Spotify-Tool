import type { PlaylistItem } from '../../types';

type Props = {
  playlists: PlaylistItem[];
  selectedId?: string;
  onSelect: (playlist: PlaylistItem) => void;
  loading: boolean;
};

export function PlaylistGrid({ playlists, selectedId, onSelect, loading }: Props) {
  if (loading) {
    return <p className="text-sm text-white/70">Henter playlister…</p>;
  }

  if (!playlists.length) {
    return <p className="text-sm text-white/70">Ingen playlister fundet.</p>;
  }

  return (
    <div className="grid gap-4">
      {playlists.map((playlist) => (
        <button
          key={playlist.id}
          onClick={() => onSelect(playlist)}
          className={`group flex items-center gap-4 rounded-3xl border p-4 text-left transition ${selectedId === playlist.id ? 'border-spotify bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}`}
        >
          <img src={playlist.images?.[0]?.url || ''} alt={playlist.name} className="h-16 w-16 rounded-2xl object-cover" />
          <div className="flex-1">
            <h3 className="text-base font-semibold">{playlist.name}</h3>
            <p className="mt-1 text-sm text-white/60">{playlist.trackCount} sange</p>
          </div>
        </button>
      ))}
    </div>
  );
}
