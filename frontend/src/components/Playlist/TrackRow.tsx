import type { Category, TrackItem } from '../../types';

type Props = {
  track: TrackItem;
  categories: Category[];
  selectedCategoryId: string | null;
  onToggleCategory: (categoryId: string, trackId: string) => void;
};

export function TrackRow({ track, categories, selectedCategoryId, onToggleCategory }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#111] p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <img src={track.albumImage} alt={track.album} className="h-14 w-14 rounded-2xl object-cover" />
        <div>
          <p className="font-semibold">{track.name}</p>
          <p className="text-sm text-white/60">{track.artist} · {track.album}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map((category) => {
            const selected = category.trackIds.includes(track.id);
            return (
              <button
                key={category.id}
                onClick={() => onToggleCategory(category.id, track.id)}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition ${selected ? 'bg-white/10 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                style={{ borderColor: category.color, color: selected ? '#fff' : undefined }}
              >
                {category.emoji} {category.name}
              </button>
            );
          })}
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-white/50">{Math.floor(track.duration_ms / 60000)}:{Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}
