import type { Category } from '../../types';

type Props = {
  category: Category;
};

export function CategoryBadge({ category }: Props) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 shadow-inner shadow-black/10">
      <div className="flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">{category.emoji}</span>
        <div>
          <p className="font-semibold">{category.name}</p>
          <p className="text-xs text-white/60">{category.trackIds.length} sange</p>
        </div>
      </div>
      <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: category.color }}></span>
    </div>
  );
}
