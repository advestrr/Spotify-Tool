import { useState } from 'react';

type Props = {
  onSearch: (prompt: string) => void;
  loading: boolean;
  status: string;
};

export function AIPromptBox({ onSearch, loading, status }: Props) {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">AI Song Finder</p>
          <h3 className="text-xl font-semibold">Find sange med en prompt</h3>
        </div>
        <p className="text-sm text-white/70">Skriv f.eks. "melankolske danske sange til en regnvejrsdag".</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Find mig sange til..."
          className="rounded-3xl border border-white/10 bg-[#111] px-4 py-4 text-white outline-none transition focus:border-spotify"
        />
        <button
          onClick={() => onSearch(prompt)}
          disabled={loading || !prompt.trim()}
          className="rounded-3xl bg-spotify px-6 py-4 text-sm font-semibold text-black transition hover:bg-[#1ed760] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Henter…' : 'Søg forslag'}
        </button>
      </div>
      <p className="mt-3 text-sm text-white/70">{status}</p>
    </div>
  );
}
