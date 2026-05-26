import create from 'zustand';
import type { SongSuggestion } from '../api/groq';

type PlayerStore = {
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  suggestions: SongSuggestion[];
  setSuggestions: (next: SongSuggestion[]) => void;
};

export const useStore = create<PlayerStore>((set) => ({
  selectedCategoryId: null,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  suggestions: [],
  setSuggestions: (next) => set({ suggestions: next })
}));
