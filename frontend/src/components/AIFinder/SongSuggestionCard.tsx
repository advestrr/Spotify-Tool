import type { SongSuggestion } from '../../api/groq';

type Props = {
  suggestion: SongSuggestion;
  onAdd: () => void;
};

export function SongSuggestionCard({ suggestion, onAdd }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold">{suggestion.title}</p>
          <p className="text-sm text-white/60">{suggestion.artist}</p>
        </div>
        <button onClick={onAdd} className="rounded-full bg-spotify px-4 py-2 text-sm font-semibold text-black hover:bg-[#1ed760]">Tilføj</button>
      </div>
      <p className="text-sm leading-6 text-white/70">{suggestion.reason}</p>
    </div>
  );
}
