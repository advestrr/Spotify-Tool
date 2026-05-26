import { CategoryBar } from './CategoryBar';
import { TrackRow } from './TrackRow';
import { AIPromptBox } from '../AIFinder/AIPromptBox';
import { SongSuggestionCard } from '../AIFinder/SongSuggestionCard';
import type { PlaylistItem, TrackItem, Category } from '../../types';
import type { SongSuggestion } from '../../api/groq';

type Props = {
  playlist: PlaylistItem;
  tracks: TrackItem[];
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onToggleTrackCategory: (categoryId: string, trackId: string) => void;
  totalDuration: string;
  suggestions: SongSuggestion[];
  onSearchPrompt: (prompt: string) => void;
  addSuggestion: (suggestion: SongSuggestion) => void;
  aiLoading: boolean;
  aiStatus: string;
  deviceReady: boolean;
  shuffleActive: boolean;
  onToggleShuffle: () => void;
};

export function PlaylistDetail({
  playlist,
  tracks,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onToggleTrackCategory,
  totalDuration,
  suggestions,
  onSearchPrompt,
  addSuggestion,
  aiLoading,
  aiStatus,
  deviceReady,
  shuffleActive,
  onToggleShuffle
}: Props) {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-green-400">Detaljer</p>
            <h2 className="mt-2 text-3xl font-semibold">{playlist.name}</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70">{playlist.description || 'Ingen beskrivelse'}</p>
          </div>
          <div className="rounded-3xl bg-[#111] px-5 py-4 text-sm text-white/70">
            <p>{tracks.length} sange</p>
            <p className="mt-1">Total varighed: {totalDuration}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Kategori playback</p>
            <h3 className="text-xl font-semibold">Vælg kategori</h3>
          </div>
          <button
            onClick={onToggleShuffle}
            className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 transition hover:bg-white/15"
          >
            {shuffleActive ? 'Shuffle: ON' : 'Shuffle: OFF'}
          </button>
        </div>

        <CategoryBar categories={categories} selectedId={selectedCategoryId} onSelect={onSelectCategory} />
        {!deviceReady ? <p className="mt-4 text-sm text-orange-300">Spotify Player er ikke klar. Åben Spotify på din enhed.</p> : null}
      </div>

      <AIPromptBox onSearch={onSearchPrompt} loading={aiLoading} status={aiStatus} />

      {suggestions.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <SongSuggestionCard key={`${suggestion.title}-${index}`} suggestion={suggestion} onAdd={() => addSuggestion(suggestion)} />
          ))}
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
        <h3 className="mb-4 text-xl font-semibold">Sange</h3>
        <div className="space-y-3">
          {tracks.length ? (
            tracks.map((track) => (
              <TrackRow key={track.id} track={track} categories={categories} selectedCategoryId={selectedCategoryId} onToggleCategory={onToggleTrackCategory} />
            ))
          ) : (
            <p className="text-sm text-white/70">Denne kategori er tom eller playlisten indeholder ingen sange.</p>
          )}
        </div>
      </div>
    </section>
  );
}
