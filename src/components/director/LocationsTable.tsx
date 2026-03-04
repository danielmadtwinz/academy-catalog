import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Copy, Check, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocations } from '../../hooks/useLocations'
import type { Location, LocationEnvironment } from '../../lib/types'
import { ENVIRONMENT_COLORS, ENVIRONMENT_LABELS } from '../../lib/types'
import EnvironmentFilter from './EnvironmentFilter'

function LocationCard({ location: l }: { location: Location }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyPrompt = () => {
    if (l.nano_banana_prompt) {
      navigator.clipboard.writeText(l.nano_banana_prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const envColor = l.environment ? ENVIRONMENT_COLORS[l.environment] : '#64748B'

  return (
    <div
      className="rounded-xl border border-[var(--color-border)] overflow-hidden transition-colors"
      style={{ borderLeftWidth: 4, borderLeftColor: l.color || envColor }}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--color-surface-light)] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: l.color || envColor }}
          >
            <MapPin size={14} />
          </div>
          <div>
            <span className="font-medium text-sm">{l.name}</span>
            <span className="text-xs text-[var(--color-text-muted)] ml-2">
              {l.episodes.length} {l.episodes.length === 1 ? 'серия' : l.episodes.length < 5 ? 'серии' : 'серий'}
            </span>
          </div>
          {l.environment && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: envColor + '20',
                color: envColor,
              }}
            >
              {ENVIRONMENT_LABELS[l.environment]}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-[var(--color-border)]">
              {/* Description */}
              {l.description && (
                <p className="text-sm text-[var(--color-text-muted)] pt-3">{l.description}</p>
              )}

              {/* Color + Environment + Genre */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {l.color_name && (
                  <div className="bg-[var(--color-surface-light)] rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Цвет</p>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-[var(--color-border)]"
                        style={{ backgroundColor: l.color || '#64748B' }}
                      />
                      <span className="text-xs">{l.color_name}</span>
                    </div>
                  </div>
                )}
                {l.environment && (
                  <div className="bg-[var(--color-surface-light)] rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Среда</p>
                    <p className="text-xs">{ENVIRONMENT_LABELS[l.environment]}</p>
                  </div>
                )}
                {l.genre_style && (
                  <div className="bg-[var(--color-surface-light)] rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Жанр / Стиль</p>
                    <p className="text-xs">{l.genre_style}</p>
                  </div>
                )}
              </div>

              {/* Atmosphere */}
              {l.atmosphere && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Атмосфера и эмоции</p>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{l.atmosphere}</p>
                </div>
              )}

              {/* Characters */}
              {l.characters && l.characters.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Персонажи локации</p>
                  <div className="space-y-2">
                    {l.characters.map((ch, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: ch.color }}
                        >
                          {ch.name[0]}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-medium">{ch.name}</span>
                          <p className="text-[11px] text-[var(--color-text-muted)] leading-snug">{ch.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Director notes */}
              {l.director_notes && (
                <div className="bg-[var(--color-surface-light)] rounded-lg p-3 border-l-2 border-[var(--color-primary)]">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-primary)] mb-1">Рекомендации режиссёру</p>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{l.director_notes}</p>
                </div>
              )}

              {/* Resonant link */}
              {l.resonant_link && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Связь с Резонантом</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{l.resonant_link}</p>
                </div>
              )}

              {/* Episodes */}
              {l.episodes.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">Серии</p>
                  <div className="flex flex-wrap gap-1">
                    {l.episodes.map(ep => (
                      <Link
                        key={ep}
                        to={`/episode/${ep}`}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-[10px] font-medium bg-[var(--color-surface-light)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                      >
                        {ep}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Nano Banana prompt */}
              {l.nano_banana_prompt && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Nano Banana Prompt</p>
                    <button
                      onClick={copyPrompt}
                      className="flex items-center gap-1 text-[10px] text-[var(--color-primary)] hover:text-white transition-colors"
                    >
                      {copied ? <Check size={10} /> : <Copy size={10} />}
                      {copied ? 'Скопировано' : 'Копировать'}
                    </button>
                  </div>
                  <pre className="text-[10px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 text-[var(--color-text-muted)] whitespace-pre-wrap font-mono">
                    {l.nano_banana_prompt}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function LocationsTable() {
  const { locations, loading } = useLocations()
  const [envFilter, setEnvFilter] = useState<LocationEnvironment | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = locations
    if (envFilter) result = result.filter(l => l.environment === envFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          (l.description?.toLowerCase().includes(q) ?? false) ||
          (l.genre_style?.toLowerCase().includes(q) ?? false) ||
          l.characters.some(ch => ch.name.toLowerCase().includes(q)),
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
          placeholder="Поиск локации или персонажа..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text)] outline-none flex-1 placeholder:text-[var(--color-text-muted)]"
        />
      </div>

      <div className="space-y-2">
        {filtered.map(l => (
          <LocationCard key={l.id} location={l} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
            Нет локаций по выбранным фильтрам
          </p>
        )}
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-4 text-center">
        {filtered.length} / {locations.length} локаций • {locations.reduce((sum, l) => sum + l.episodes.length, 0)} серий
      </p>
    </div>
  )
}
