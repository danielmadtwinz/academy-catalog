import type { LocationEnvironment } from '../../lib/types'
import { ENVIRONMENT_LABELS, ENVIRONMENT_COLORS } from '../../lib/types'

const ENVIRONMENTS: LocationEnvironment[] = ['Дом', 'Природа', 'Город', 'Храм']

interface Props {
  active: LocationEnvironment | null
  onChange: (env: LocationEnvironment | null) => void
  counts: Record<string, number>
  total: number
}

export default function EnvironmentFilter({ active, onChange, counts, total }: Props) {
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
      {ENVIRONMENTS.map(env => {
        const count = counts[env] || 0
        if (count === 0) return null
        return (
          <button
            key={env}
            onClick={() => onChange(active === env ? null : env)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              active === env
                ? 'text-white'
                : 'bg-[var(--color-surface-light)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)]'
            }`}
            style={active === env ? { backgroundColor: ENVIRONMENT_COLORS[env] } : undefined}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ENVIRONMENT_COLORS[env] }} />
            {ENVIRONMENT_LABELS[env]} ({count})
          </button>
        )
      })}
    </div>
  )
}
