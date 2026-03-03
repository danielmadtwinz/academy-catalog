import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLocations } from '../../hooks/useLocations'
import type { LocationEnvironment } from '../../lib/types'
import { ENVIRONMENT_COLORS } from '../../lib/types'
import EnvironmentFilter from './EnvironmentFilter'

export default function LocationsTable() {
  const { locations, loading, swapLocations } = useLocations()
  const [envFilter, setEnvFilter] = useState<LocationEnvironment | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'episode' | 'name' | 'environment'>('episode')

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
    return [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'ru')
      if (sortBy === 'environment') return (a.environment || '').localeCompare(b.environment || '', 'ru')
      return a.episode_number - b.episode_number
    })
  }, [locations, envFilter, search, sortBy])

  const envCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const l of locations) {
      if (l.environment) counts[l.environment] = (counts[l.environment] || 0) + 1
    }
    return counts
  }, [locations])

  const handleSwap = (currentLocId: number, targetEpisode: number) => {
    const targetLoc = locations.find(l => l.episode_number === targetEpisode)
    if (targetLoc) {
      swapLocations(currentLocId, targetLoc.id)
    }
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

      {/* Search + Sort */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Поиск локации..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text)] outline-none flex-1 placeholder:text-[var(--color-text-muted)]"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text)] outline-none"
        >
          <option value="episode">По серии</option>
          <option value="name">По алфавиту</option>
          <option value="environment">По среде</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface-light)] text-left text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3">Локация</th>
              <th className="px-4 py-3 hidden lg:table-cell">Описание</th>
              <th className="px-4 py-3">Среда</th>
              <th className="px-4 py-3">Цвет</th>
              <th className="px-4 py-3 hidden md:table-cell">Жанр</th>
              <th className="px-4 py-3 text-center">Серия</th>
              <th className="px-4 py-3 text-center">Swap</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr
                key={l.id}
                className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-light)] transition-colors"
              >
                <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">{l.episode_number}</td>
                <td className="px-4 py-3">
                  <span className="font-medium text-xs">{l.name}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 max-w-xs">{l.description || '—'}</p>
                </td>
                <td className="px-4 py-3">
                  {l.environment && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: (ENVIRONMENT_COLORS[l.environment as LocationEnvironment] || '#64748B') + '20',
                        color: ENVIRONMENT_COLORS[l.environment as LocationEnvironment] || '#64748B',
                      }}
                    >
                      {l.environment}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-[var(--color-border)]"
                      style={{ backgroundColor: l.color || '#64748B' }}
                    />
                    <span className="text-xs text-[var(--color-text-muted)]">{l.color_name || '—'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-[var(--color-text-muted)]">{l.genre_style || '—'}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Link
                    to={`/episode/${l.episode_number}`}
                    className="text-xs font-medium text-[var(--color-primary)] hover:underline"
                  >
                    {l.episode_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={l.episode_number}
                    onChange={e => {
                      const targetEp = parseInt(e.target.value)
                      if (targetEp !== l.episode_number) {
                        handleSwap(l.id, targetEp)
                      }
                    }}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-1 py-0.5 text-[10px] text-[var(--color-text)] outline-none w-12"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-4 text-center">
        {filtered.length} / {locations.length} локаций
      </p>
    </div>
  )
}
