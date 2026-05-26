import { useState } from 'react';
import type { Category } from '../../types';
import { CategoryBadge } from './CategoryBadge';

type Props = {
  categories: Category[];
  onCreate: (category: Category) => void;
  onUpdate: (categories: Category[]) => void;
};

const defaultColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#22c55e'];
const defaultEmojis = ['🌙', '💪', '😢', '🎉', '🔥'];

export function CategoryManager({ categories, onCreate, onUpdate }: Props) {
  const [emoji, setEmoji] = useState('🎵');
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');

  const createCategory = () => {
    if (!name.trim()) return;
    onCreate({ id: `${Date.now()}`, name: name.trim(), emoji, color, trackIds: [] });
    setName('');
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Kategorier</h2>
          <p className="text-sm text-white/70">Opret og vedligehold dine playliste-kategorier.</p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Kategori-navn"
          className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition focus:border-spotify"
        />
        <select value={emoji} onChange={(event) => setEmoji(event.target.value)} className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none">
          {defaultEmojis.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-12 w-12 cursor-pointer rounded-xl border border-white/10 bg-transparent p-0" />
          <button onClick={createCategory} className="rounded-full bg-spotify px-5 py-3 text-sm font-semibold text-black hover:bg-[#1ed760]">Opret</button>
        </div>
      </div>

      <div className="grid gap-3">
        {categories.length ? (
          categories.map((category) => <CategoryBadge key={category.id} category={category} />)
        ) : (
          <p className="text-sm text-white/70">Ingen kategorier endnu. Opret en for at komme i gang.</p>
        )}
      </div>
    </div>
  );
}
