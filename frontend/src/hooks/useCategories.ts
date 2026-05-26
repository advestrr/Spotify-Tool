import { useCallback, useEffect, useState } from 'react';
import type { Category } from '../types';

const STORAGE_KEY = 'playlistiq_categories_v1';

export function useCategories(playlistId: string) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, Category[]>;
        setCategories(parsed[playlistId] || []);
      } catch {
        setCategories([]);
      }
    }
  }, [playlistId]);

  const persist = useCallback(
    (nextCategories: Category[]) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as Record<string, Category[]>) : {};
      parsed[playlistId] = nextCategories;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      setCategories(nextCategories);
    },
    [playlistId]
  );

  const addCategory = useCallback(
    (category: Category) => {
      persist([...categories, category]);
    },
    [categories, persist]
  );

  const updateCategory = useCallback(
    (category: Category) => {
      persist(categories.map((item) => (item.id === category.id ? category : item)));
    },
    [categories, persist]
  );

  const removeCategory = useCallback(
    (categoryId: string) => {
      persist(categories.filter((item) => item.id !== categoryId));
    },
    [categories, persist]
  );

  const toggleTrack = useCallback(
    (categoryId: string, trackId: string) => {
      const next = categories.map((category) => {
        if (category.id !== categoryId) return category;
        const exists = category.trackIds.includes(trackId);
        return {
          ...category,
          trackIds: exists
            ? category.trackIds.filter((id) => id !== trackId)
            : [...category.trackIds, trackId]
        };
      });
      persist(next);
    },
    [categories, persist]
  );

  return {
    categories,
    addCategory,
    updateCategory,
    removeCategory,
    toggleTrack,
    setCategories: persist
  };
}
