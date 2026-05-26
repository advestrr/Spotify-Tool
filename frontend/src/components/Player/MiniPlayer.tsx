type Props = {
  track: any;
  category: string | null;
  isReady: boolean;
};

export function MiniPlayer({ track, category, isReady }: Props) {
  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/80 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 text-sm text-white/90">
        <div className="flex items-center gap-4">
          <img src={track.album.images?.[0]?.url} alt={track.name} className="h-14 w-14 rounded-2xl object-cover" />
          <div>
            <p className="font-semibold">{track.name}</p>
            <p className="text-white/60">{track.artists?.map((artist: any) => artist.name).join(', ')}</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-white/60">Kategori:</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/80">{category || 'Alle'}</span>
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-white/60">{isReady ? 'Player klar' : 'Streamer ikke'}</div>
      </div>
    </div>
  );
}
