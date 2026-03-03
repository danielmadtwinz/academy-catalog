import type { Episode, EpisodeStatus } from '../lib/types'
import { STATUS_ORDER, STATUS_LABELS, STATUS_COLORS } from '../lib/types'

interface Props {
  episodes: Episode[]
}

export default function ProgressTracker({ episodes }: Props) {
  const total = episodes.length
  if (!total) return null

  const counts = STATUS_ORDER.reduce(
    (acc, s) => ({ ...acc, [s]: episodes.filter(e => e.status === s).length }),
    {} as Record<EpisodeStatus, number>,
  )

  const doneCount = counts.done
  const pct = Math.round((doneCount / total) * 100)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--color-text-muted)]">
          Progress: {doneCount}/{total} ({pct}%)
        </span>
      </div>

      {/* Bar */}
      <div className="h-3 rounded-full bg-[var(--color-surface-light)] overflow-hidden flex">
        {STATUS_ORDER.map(s =>
          counts[s] > 0 ? (
            <div
              key={s}
              style={{
                width: `${(counts[s] / total) * 100}%`,
                backgroundColor: STATUS_COLORS[s],
              }}
              title={`${STATUS_LABELS[s]}: ${counts[s]}`}
            />
          ) : null,
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-2 flex-wrap">
        {STATUS_ORDER.map(s => (
          <span key={s} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: STATUS_COLORS[s] }}
            />
            {STATUS_LABELS[s]}: {counts[s]}
          </span>
        ))}
      </div>
    </div>
  )
}
