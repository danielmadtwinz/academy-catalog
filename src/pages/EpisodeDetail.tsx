import { useParams, Link } from 'react-router-dom'
import { useEpisode } from '../hooks/useEpisode'
import { STATUS_LABELS, STATUS_COLORS, STATUS_ORDER, ACT_LABELS } from '../lib/types'
import type { EpisodeStatus } from '../lib/types'
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function EpisodeDetail() {
  const { id } = useParams<{ id: string }>()
  const epNumber = Number(id)
  const { episode, shorts, loading, updateStatus } = useEpisode(epNumber)
  const [copied, setCopied] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[var(--color-text-muted)]">Loading...</div>
      </div>
    )
  }

  if (!episode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Серия не найдена</p>
      </div>
    )
  }

  const copyPrompt = () => {
    if (episode.nano_banana_prompt) {
      navigator.clipboard.writeText(episode.nano_banana_prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shortTypes = {
    teaser: { label: 'Тизер', icon: '🎬' },
    challenge: { label: 'Челлендж', icon: '🏆' },
    lore: { label: 'Лор', icon: '🌍' },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Prev/Next navigation */}
      <div className="flex items-center justify-between mb-4">
        {epNumber > 1 ? (
          <Link
            to={`/episode/${epNumber - 1}`}
            className="text-[var(--color-primary)] flex items-center gap-1 text-xs hover:underline"
          >
            <ChevronLeft size={14} /> Серия {epNumber - 1}
          </Link>
        ) : <span />}
        {epNumber < 20 ? (
          <Link
            to={`/episode/${epNumber + 1}`}
            className="text-[var(--color-primary)] flex items-center gap-1 text-xs hover:underline"
          >
            Серия {epNumber + 1} <ChevronRight size={14} />
          </Link>
        ) : <span />}
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
          style={{ backgroundColor: (episode.color || '#64748B') + '30', color: episode.color || '#64748B' }}
        >
          {String(episode.number).padStart(2, '0')}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-1">{episode.title}</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-[var(--color-text-muted)]">{episode.skill}</span>
            {episode.virtue && (
              <>
                <span className="text-[var(--color-text-muted)]">·</span>
                <span className="text-sm text-[var(--color-accent)]">{episode.virtue}</span>
              </>
            )}
            <span className="text-[var(--color-text-muted)]">·</span>
            <span className="text-xs text-[var(--color-text-muted)]">{ACT_LABELS[episode.act]}</span>
          </div>
        </div>

        {/* Status selector */}
        <select
          value={episode.status}
          onChange={e => updateStatus(e.target.value as EpisodeStatus)}
          className="bg-[var(--color-surface-light)] border rounded-lg px-3 py-1.5 text-xs outline-none"
          style={{
            borderColor: STATUS_COLORS[episode.status],
            color: STATUS_COLORS[episode.status],
          }}
        >
          {STATUS_ORDER.map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {/* Plot */}
        {episode.plot_summary && (
          <Section title="Сюжет">
            <p className="text-sm leading-relaxed">{episode.plot_summary}</p>
          </Section>
        )}

        {/* Metadata grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {episode.location && (
            <Section title="Локация">
              <p className="text-sm">{episode.location}</p>
            </Section>
          )}
          {episode.color_name && (
            <Section title="Цвет">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: episode.color || '#64748B' }} />
                <span className="text-sm">{episode.color_name}</span>
              </div>
            </Section>
          )}
        </div>

        {/* Beat Check */}
        {episode.beat_check && (
          <Section title="Beat Check">
            <code className="block text-sm font-mono bg-[var(--color-surface)] rounded-lg p-3 whitespace-pre-wrap">
              {episode.beat_check}
            </code>
          </Section>
        )}

        {/* Midpoint Jam */}
        {episode.midpoint_jam && (
          <Section title="Midpoint Jam">
            <p className="text-sm leading-relaxed">{episode.midpoint_jam}</p>
          </Section>
        )}

        {/* Beat Gem */}
        {episode.beat_gem && (
          <Section title="Beat Gem">
            <div className="flex items-start gap-3">
              <span
                className="w-8 h-8 rounded-lg shrink-0 mt-0.5"
                style={{ backgroundColor: (episode.color || '#64748B') + '40' }}
              />
              <div>
                <p className="text-sm">{episode.beat_gem}</p>
                {episode.beat_gem_module && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Модуль: {episode.beat_gem_module}</p>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* Grey Mold */}
        {episode.grey_mold && (
          <Section title="Серая Плесень">
            <p className="text-sm">{episode.grey_mold}</p>
          </Section>
        )}

        {/* Titles A/B/C */}
        {episode.titles_ab && (
          <Section title="Заголовки A/B/C">
            <div className="space-y-2">
              {(['A', 'B', 'C'] as const).map(k => (
                <div key={k} className="flex gap-2">
                  <span className="text-xs font-bold text-[var(--color-text-muted)] w-4 shrink-0">{k}:</span>
                  <span className="text-sm">{episode.titles_ab![k]}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Shorts */}
        {shorts.length > 0 && (
          <Section title={`Шорты (${shorts.length})`}>
            <div className="space-y-3">
              {shorts.map(s => {
                const info = shortTypes[s.type]
                return (
                  <div key={s.id} className="flex items-start gap-3 bg-[var(--color-surface)] rounded-lg p-3">
                    <span className="text-lg">{info.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{info.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-surface-light)] text-[var(--color-text-muted)]">
                          {s.status}
                        </span>
                      </div>
                      {s.hook && <p className="text-xs text-[var(--color-text-muted)] italic">"{s.hook}"</p>}
                      {s.script && <p className="text-xs mt-1">{s.script}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Section>
        )}

        {/* Breadcrumb */}
        {episode.breadcrumb && (
          <Section title="Хлебная крошка">
            <p className="text-sm italic text-[var(--color-text-muted)]">{episode.breadcrumb}</p>
          </Section>
        )}

        {/* Nano Banana */}
        {episode.nano_banana_prompt && (
          <Section title="Nano Banana промпт">
            <div className="relative">
              <code className="block text-xs font-mono bg-[var(--color-surface)] rounded-lg p-3 pr-10 whitespace-pre-wrap break-all">
                {episode.nano_banana_prompt}
              </code>
              <button
                onClick={copyPrompt}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-lighter)] transition-colors"
                title="Копировать"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border)] p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">{title}</h2>
      {children}
    </div>
  )
}
