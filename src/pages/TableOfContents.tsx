import { Link } from 'react-router-dom'
import { useEpisodes } from '../hooks/useEpisodes'
import { STATUS_LABELS, STATUS_COLORS } from '../lib/types'

const ACT_RANGES = [
  { act: 1, label: 'Act I: Promise', episodes: '1-5', theme: 'Знакомство с миром и звуками' },
  { act: 2, label: 'Act II: Progress', episodes: '6-14', theme: 'Рост, испытания, кризис' },
  { act: 3, label: 'Act III: Payoff', episodes: '15-20', theme: 'Мастерство, финальная битва' },
]

export default function TableOfContents() {
  const { episodes, loading } = useEpisodes()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[var(--color-text-muted)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Содержание</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Сезон 1 — 20 серий · Техника битбокса
        </p>
      </div>

      {ACT_RANGES.map(({ act, label, episodes: range, theme }) => {
        const actEpisodes = episodes.filter(ep => ep.act === act)
        return (
          <div key={act} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider">{label}</h2>
              <span className="text-xs text-[var(--color-text-muted)]">Серии {range}</span>
              <span className="text-xs text-[var(--color-text-muted)] hidden sm:inline">· {theme}</span>
            </div>

            <div className="space-y-1">
              {actEpisodes.map(ep => (
                <Link
                  key={ep.id}
                  to={`/episode/${ep.number}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-surface-light)] transition-colors group"
                >
                  {/* Number */}
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: (ep.color || '#64748B') + '20', color: ep.color || '#64748B' }}
                  >
                    {String(ep.number).padStart(2, '0')}
                  </span>

                  {/* Title + skill */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium group-hover:text-[var(--color-primary)] transition-colors truncate">
                      {ep.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                      <span>{ep.skill}</span>
                      {ep.virtue && (
                        <>
                          <span>·</span>
                          <span className="text-[var(--color-accent)]">{ep.virtue}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Grey mold indicator */}
                  {ep.grey_mold && (
                    <span className="text-xs text-[var(--color-text-muted)] hidden md:inline" title={ep.grey_mold}>
                      ☁️
                    </span>
                  )}

                  {/* Status badge */}
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: STATUS_COLORS[ep.status] + '20',
                      color: STATUS_COLORS[ep.status],
                    }}
                  >
                    {STATUS_LABELS[ep.status]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      {/* Season 2 teaser */}
      <div className="border border-dashed border-[var(--color-border)] rounded-xl p-4 text-center">
        <p className="text-xs text-[var(--color-text-muted)]">
          Сезон 2 — Битбокс-бизнес · 20 серий · В разработке
        </p>
      </div>
    </div>
  )
}
