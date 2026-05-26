export type Category = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  trackIds: string[];
};

export type TrackItem = {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration_ms: number;
  uri: string;
  albumImage: string;
};

export type PlaylistItem = {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  trackCount: number;
};

export type SongSuggestion = {
  title: string;
  artist: string;
  reason: string;
};
