import type { CharacterCategory } from '../../lib/characters'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../lib/characters'

const CATEGORIES: CharacterCategory[] = ['main', 'secondary', 'rhythmling', 'resonant', 'concept']

interface Props {
  active: CharacterCategory | null
  onChange: (cat: CharacterCategory | null) => void
  counts: Record<string, number>
  total: number
}

export default function CharacterTypeFilter({ active, onChange, counts, total }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          !active
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-surface-light)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)]'
        }`}
      >
        Все ({total})
      </button>
      {CATEGORIES.map(cat => {
        const count = counts[cat] || 0
        if (count === 0) return null
        return (
          <button
            key={cat}
            onClick={() => onChange(active === cat ? null : cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              active === cat
                ? 'text-white'
                : 'bg-[var(--color-surface-light)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)]'
            }`}
            style={active === cat ? { backgroundColor: CATEGORY_COLORS[cat] } : undefined}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
            {CATEGORY_LABELS[cat]} ({count})
          </button>
        )
      })}
    </div>
  )
}
