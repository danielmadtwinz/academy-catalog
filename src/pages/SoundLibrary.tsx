import { useState, useMemo } from 'react'
import { useSounds } from '../hooks/useSounds'
import { MODULE_COLORS } from '../lib/types'

const MODULES = ['Ударные', 'Басы', 'Духовые', 'Эффекты', 'Вокал']

export default function SoundLibrary() {
  const { sounds, loading } = useSounds()
  const [moduleFilter, setModuleFilter] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'module' | 'difficulty' | 'name_ru'>('module')

  const filtered = useMemo(() => {
    let result = sounds
    if (moduleFilter) result = result.filter(s => s.module === moduleFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        s =>
          s.name_ru.toLowerCase().includes(q) ||
          s.name_en.toLowerCase().includes(q) ||
          (s.notation?.toLowerCase().includes(q) ?? false),
      )
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'difficulty') return a.difficulty - b.difficulty
      if (sortBy === 'name_ru') return a.name_ru.localeCompare(b.name_ru, 'ru')
      return MODULES.indexOf(a.module) - MODULES.indexOf(b.module)
    })
  }, [sounds, moduleFilter, search, sortBy])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[var(--color-text-muted)]">Loading...</div>
      </div>
    )
  }

  const moduleCounts = MODULES.reduce(
    (acc, m) => ({ ...acc, [m]: sounds.filter(s => s.module === m).length }),
    {} as Record<string, number>,
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sound Library</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{sounds.length} звуков · 5 модулей</p>
        </div>
      </div>

      {/* Module filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setModuleFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !moduleFilter
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-surface-light)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)]'
          }`}
        >
          Все ({sounds.length})
        </button>
        {MODULES.map(m => (
          <button
            key={m}
            onClick={() => setModuleFilter(moduleFilter === m ? null : m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              moduleFilter === m
                ? 'text-white'
                : 'bg-[var(--color-surface-light)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)]'
            }`}
            style={moduleFilter === m ? { backgroundColor: MODULE_COLORS[m] } : undefined}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: MODULE_COLORS[m] }} />
            {m} ({moduleCounts[m]})
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Поиск звука..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text)] outline-none flex-1 placeholder:text-[var(--color-text-muted)]"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text)] outline-none"
        >
          <option value="module">По модулю</option>
          <option value="difficulty">По сложности</option>
          <option value="name_ru">По алфавиту</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface-light)] text-left text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              <th className="px-4 py-3">Звук</th>
              <th className="px-4 py-3">Нотация</th>
              <th className="px-4 py-3 hidden md:table-cell">Инструмент</th>
              <th className="px-4 py-3 hidden lg:table-cell">Как сделать</th>
              <th className="px-4 py-3 text-center">Сложность</th>
              <th className="px-4 py-3">Модуль</th>
              <th className="px-4 py-3 text-center">Серия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr
                key={s.id}
                className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-light)] transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium">{s.name_ru}</span>
                    <span className="text-xs text-[var(--color-text-muted)] ml-1.5">({s.name_en})</span>
                  </div>
                  {s.description && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{s.notation || '—'}</td>
                <td className="px-4 py-3 text-xs hidden md:table-cell text-[var(--color-text-muted)]">
                  {s.instrument || '—'}
                </td>
                <td className="px-4 py-3 text-xs hidden lg:table-cell text-[var(--color-text-muted)]">
                  {s.how_to || '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <DifficultyStars level={s.difficulty} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: (MODULE_COLORS[s.module] || '#64748B') + '20',
                      color: MODULE_COLORS[s.module] || '#64748B',
                    }}
                  >
                    {s.module}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {s.episode_number ? (
                    <span className="flex items-center justify-center gap-1">
                      <span className="text-xs">{s.episode_number}</span>
                      {s.is_beat_gem && <span className="text-[10px]" title="Beat Gem">💎</span>}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)]">S{s.season}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-4 text-center">
        {filtered.length} / {sounds.length} звуков
      </p>
    </div>
  )
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="text-xs tracking-wider" title={`${level}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < level ? 'text-yellow-400' : 'text-[var(--color-surface-lighter)]'}>
          ★
        </span>
      ))}
    </span>
  )
}
