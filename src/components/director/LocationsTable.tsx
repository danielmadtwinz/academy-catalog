import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import { useLocations } from '../../hooks/useLocations'
import type { LocationEnvironment } from '../../lib/types'
import { ENVIRONMENT_COLORS } from '../../lib/types'
import EnvironmentFilter from './EnvironmentFilter'

export default function LocationsTable() {
  const { locations, loading } = useLocations()
  const [envFilter, setEnvFilter] = useState<LocationEnvironment | null>(null)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    let result = locations
    if (envFilter) result = result.filter(l => l.environment === envFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          (l.description?.toLowerCase().includes(q) ?? false) ||
          (l.genre_style?.toLowerCase().includes(q) ?? false),
      )
    }
    return result
  }, [locations, envFilter, search])

  const envCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const l of locations) {
      if (l.environment) counts[l.environment] = (counts[l.environment] || 0) + 1
    }
    return counts
  }, [locations])

  const copyPrompt = (id: number, prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-[var(--color-text-muted)]">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <EnvironmentFilter
        active={envFilter}
        onChange={setEnvFilter}
        counts={envCounts}
        total={locations.length}
      />

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Поиск локации..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text)] outline-none flex-1 placeholder:text-[var(--color-text-muted)]"
        />
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map(l => (
          <div
            key={l.id}
            className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]"
          >
            <div className="flex items-start gap-4 p-4">
              {/* Color bar */}
              <div
                className="w-1.5 self-stretch rounded-full flex-shrink-0"
                style={{ backgroundColor: l.color || '#64748B' }}
              />

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">{l.name}</h3>
                  {l.environment && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: (ENVIRONMENT_COLORS[l.environment as LocationEnvironment] || '#64748B') + '20',
                        color: ENVIRONMENT_COLORS[l.environment as LocationEnvironment] || '#64748B',
                      }}
                    >
                      {l.environment}
                    </span>
                  )}
                  {l.color_name && (
                    <div className="flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-[var(--color-border)]"
                        style={{ backgroundColor: l.color || '#64748B' }}
                      />
                      <span className="text-[10px] text-[var(--color-text-muted)]">{l.color_name}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--color-text-muted)] mb-2">{l.description || '—'}</p>

                {/* Genre */}
                {l.genre_style && (
                  <p className="text-[10px] text-[var(--color-text-muted)] mb-2">
                    <span className="opacity-60">Жанр:</span> {l.genre_style}
                  </p>
                )}

                {/* Episodes */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-[var(--color-text-muted)] opacity-60">Серии:</span>
                  {l.episodes.map(ep => (
                    <Link
                      key={ep}
                      to={`/episode/${ep}`}
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-surface-light)] text-[var(--color-primary)] hover:bg-[var(--color-surface-lighter)] transition-colors"
                    >
                      {ep}
                    </Link>
                  ))}
                </div>

                {/* Nano Banana prompt */}
                {l.nano_banana_prompt && (
                  <div className="mt-2 flex items-start gap-2">
                    <p className="text-[10px] text-[var(--color-text-muted)] opacity-60 italic flex-1 line-clamp-1">
                      {l.nano_banana_prompt}
                    </p>
                    <button
                      onClick={() => copyPrompt(l.id, l.nano_banana_prompt!)}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors flex-shrink-0"
                      title="Копировать промпт"
                    >
                      {copiedId === l.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-4 text-center">
        {filtered.length} / {locations.length} локаций • {locations.reduce((sum, l) => sum + l.episodes.length, 0)} серий
      </p>
    </div>
  )
}
