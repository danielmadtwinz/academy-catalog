import { ACT_LABELS, STATUS_ORDER, STATUS_LABELS } from '../lib/types'
import type { EpisodeStatus } from '../lib/types'

interface Props {
  actFilter: number | null
  statusFilter: EpisodeStatus | null
  search: string
  onActChange: (act: number | null) => void
  onStatusChange: (status: EpisodeStatus | null) => void
  onSearchChange: (q: string) => void
}

export default function ActFilter({ actFilter, statusFilter, search, onActChange, onStatusChange, onSearchChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Act buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => onActChange(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            actFilter === null
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-surface-light)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)]'
          }`}
        >
          All
        </button>
        {[1, 2, 3].map(act => (
          <button
            key={act}
            onClick={() => onActChange(actFilter === act ? null : act)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              actFilter === act
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface-light)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)]'
            }`}
          >
            {ACT_LABELS[act]}
          </button>
        ))}
      </div>

      {/* Status dropdown */}
      <select
        value={statusFilter ?? ''}
        onChange={e => onStatusChange((e.target.value || null) as EpisodeStatus | null)}
        className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text)] outline-none"
      >
        <option value="">Все статусы</option>
        {STATUS_ORDER.map(s => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>

      {/* Search */}
      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text)] outline-none flex-1 min-w-[150px] placeholder:text-[var(--color-text-muted)]"
      />
    </div>
  )
}
