import type { Category } from '../../types';

type Props = {
  categories: Category[];
  selectedId: string | null;
  onSelect: (categoryId: string | null) => void;
};

export function CategoryBar({ categories, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedId === null ? 'border-spotify bg-spotify/20 text-spotify' : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20'}`}
      >
        Alle
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedId === category.id ? 'border-spotify bg-spotify/20 text-spotify' : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20'}`}
          style={{ boxShadow: selectedId === category.id ? `0 0 20px ${category.color}55` : undefined }}
        >
          {category.emoji} {category.name}
        </button>
      ))}
    </div>
  );
}
