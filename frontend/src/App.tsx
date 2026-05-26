import { useEffect, useMemo, useState } from 'react';
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { useSpotifyPlayer } from './hooks/useSpotifyPlayer';
import { useCategories } from './hooks/useCategories';
import { getCurrentUserPlaylists, getPlaylistTracks, searchTrack, addTracksToPlaylist, startPlayback, setShuffle } from './api/spotify';
import { getSongSuggestions, type SongSuggestion } from './api/groq';
import { useStore } from './store/useStore';
import { SpotifyLogin } from './components/Auth/SpotifyLogin';
import { PlaylistGrid } from './components/Playlist/PlaylistGrid';
import { PlaylistDetail } from './components/Playlist/PlaylistDetail';
import { CategoryManager } from './components/Category/CategoryManager';
import { MiniPlayer } from './components/Player/MiniPlayer';
import type { PlaylistItem, TrackItem, Category } from './types';

function mapTrack(item: any): TrackItem {
  const track = item.track || item;
  return {
    id: track.id,
    name: track.name,
    artist: track.artists?.map((artist: any) => artist.name).join(', ') || 'Unknown artist',
    album: track.album?.name || 'Unknown album',
    duration_ms: track.duration_ms || 0,
    uri: track.uri,
    albumImage: track.album?.images?.[0]?.url || ''
  };
}

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function App() {
  const { accessToken, login, logout, isAuthenticated, ready } = useSpotifyAuth();
  const { deviceId, isReady, currentTrack } = useSpotifyPlayer(accessToken);
  const { selectedCategoryId, setSelectedCategoryId, suggestions, setSuggestions } = useStore();
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistItem | null>(null);
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('');
  const [shuffleActive, setShuffleActive] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const playlistId = selectedPlaylist?.id || '';
  const { categories, addCategory, toggleTrack, setCategories } = useCategories(playlistId);

  useEffect(() => {
    if (!ready || !accessToken || !isAuthenticated) return;

    setLoading(true);
    getCurrentUserPlaylists(accessToken)
      .then((data) => {
        const items = (data.items || []).map((playlist: any) => ({
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          images: playlist.images,
          trackCount: playlist.tracks?.total || 0
        }));
        setPlaylists(items);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setMessage('Kunne ikke hente playlister.');
        setLoading(false);
      });
  }, [accessToken, isAuthenticated, ready]);

  useEffect(() => {
    if (!selectedPlaylist || !accessToken) return;
    setSelectedCategoryId(null);
    setLoading(true);
    getPlaylistTracks(accessToken, selectedPlaylist.id)
      .then((data) => {
        const items = (data.items || []).map((item: any) => mapTrack(item)).filter((item: TrackItem) => item.id);
        setTracks(items);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setMessage('Kunne ikke hente tracks for playlisten.');
        setLoading(false);
      });
  }, [selectedPlaylist, accessToken, setSelectedCategoryId]);

  const filteredTracks = useMemo(() => {
    if (!selectedCategoryId) return tracks;
    const category = categories.find((item) => item.id === selectedCategoryId);
    if (!category) return tracks;
    return tracks.filter((track) => category.trackIds.includes(track.id));
  }, [tracks, selectedCategoryId, categories]);

  const totalDuration = filteredTracks.reduce((acc, track) => acc + track.duration_ms, 0);

  const onSearchPrompt = async (prompt: string) => {
    if (!prompt || !accessToken) return;
    setAiStatus('Henter forslag...');
    setAiLoading(true);
    setMessage(null);
    try {
      const response = await getSongSuggestions(prompt.trim());
      setSuggestions(response);
      setAiStatus('Forslag klar');
    } catch (error) {
      console.error(error);
      setAiStatus('Fejl ved hentning af forslag. Prøv igen.');
    } finally {
      setAiLoading(false);
    }
  };

  const addSuggestionToPlaylist = async (suggestion: SongSuggestion) => {
    if (!accessToken || !selectedPlaylist) {
      setMessage('Vælg en playlist og log ind på Spotify først.');
      return;
    }
    setAiStatus('Søger sang på Spotify...');
    try {
      const found = await searchTrack(accessToken, `${suggestion.title} ${suggestion.artist}`);
      if (!found) {
        setMessage(`Sang ikke fundet: ${suggestion.title} – ${suggestion.artist}`);
        return;
      }
      await addTracksToPlaylist(accessToken, selectedPlaylist.id, [found.uri]);
      setTracks((prev) => [...prev, mapTrack({ track: found })]);
      setMessage(`Tilføjet ${found.name} til ${selectedPlaylist.name}`);
    } catch (error) {
      console.error(error);
      setMessage('Fejl ved tilføjelse af sang til playlisten.');
    } finally {
      setAiStatus('');
    }
  };

  const playCategory = async (category: Category) => {
    if (!accessToken || !deviceId) {
      setMessage('Åben Spotify på en enhed og prøv igen.');
      return;
    }
    const uris = tracks.filter((track) => category.trackIds.includes(track.id)).map((track) => track.uri);
    if (!uris.length) {
      setMessage('Denne kategori har ingen sange.');
      return;
    }
    try {
      await startPlayback(accessToken, deviceId, uris);
      setMessage(`Spiller kategori: ${category.name}`);
    } catch (error) {
      console.error(error);
      setMessage('Kunne ikke starte kategori-afspilning.');
    }
  };

  const toggleShuffle = async () => {
    if (!accessToken || !deviceId) {
      setMessage('Ingen Spotify-enhed klar til shuffle.');
      return;
    }
    try {
      await setShuffle(accessToken, !shuffleActive, deviceId);
      setShuffleActive((prev) => !prev);
    } catch (error) {
      console.error(error);
      setMessage('Kunne ikke ændre shuffle-status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-white/10 px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-green-400">PlaylistIQ</p>
          <h1 className="text-3xl font-semibold mt-2">Spotify playlist manager</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">Kategoriser sange, afspil kategori-shuffle og hent AI-suggests via Groq.</p>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button onClick={logout} className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/15">Log ud</button>
          ) : (
            <button onClick={login} className="rounded-full bg-spotify px-4 py-2 text-sm font-semibold text-black hover:bg-[#1ed760]">Log ind med Spotify</button>
          )}
        </div>
      </header>

      <main className="px-6 py-8 space-y-8">
        {!isAuthenticated ? (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-xl shadow-black/20">
            <h2 className="text-2xl font-semibold">Kom godt i gang</h2>
            <p className="mt-3 text-white/70">Log ind for at hente dine Spotify-playlister og begynde at oprette kategorier.</p>
            <div className="mt-6 flex justify-center">
              <button onClick={login} className="rounded-full bg-spotify px-6 py-3 text-sm font-semibold text-black hover:bg-[#1ed760]">Log ind med Spotify</button>
            </div>
          </section>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white/5 p-6 shadow-xl shadow-black/20">
                <h2 className="mb-4 text-xl font-semibold">Dine playlister</h2>
                <PlaylistGrid playlists={playlists} selectedId={selectedPlaylist?.id} onSelect={setSelectedPlaylist} loading={loading} />
              </div>
              {selectedPlaylist ? (
                <CategoryManager categories={categories} onCreate={addCategory} onUpdate={setCategories} />
              ) : null}
            </div>
            {selectedPlaylist ? (
              <PlaylistDetail
                playlist={selectedPlaylist}
                tracks={filteredTracks}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={(id) => {
                  setSelectedCategoryId(id);
                  const category = categories.find((item) => item.id === id);
                  if (category) playCategory(category);
                }}
                onToggleTrackCategory={toggleTrack}
                totalDuration={formatDuration(totalDuration)}
                suggestions={suggestions}
                onSearchPrompt={onSearchPrompt}
                addSuggestion={addSuggestionToPlaylist}
                aiLoading={aiLoading}
                aiStatus={aiStatus}
                deviceReady={!!deviceId}
                shuffleActive={shuffleActive}
                onToggleShuffle={toggleShuffle}
              />
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-xl shadow-black/20">
                <p className="text-lg font-medium">Vælg en playliste for at se detaljer.</p>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="border-t border-white/10 px-6 py-5 text-sm text-white/60">
        <p>Backend proxy: Groq + Express | Frontend: React, Vite, Tailwind, Spotify Web Playback SDK</p>
      </footer>
      <MiniPlayer track={currentTrack} category={categories.find((item) => item.id === selectedCategoryId)?.name || null} isReady={isReady} />
      {message ? (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white shadow-xl shadow-black/30">
          {message}
          <button onClick={() => setMessage(null)} className="ml-4 font-semibold text-green-300">Luk</button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
