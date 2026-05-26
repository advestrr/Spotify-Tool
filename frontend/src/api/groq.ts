export type SongSuggestion = {
  title: string;
  artist: string;
  reason: string;
};

export async function getSongSuggestions(prompt: string): Promise<SongSuggestion[]> {
  const response = await fetch('/api/suggest-songs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error('Kunne ikke hente forslag fra backend');
  }

  return response.json();
}
