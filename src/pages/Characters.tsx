import { useState } from 'react'
import { MAIN_CHARACTERS, SECONDARY_CHARACTERS } from '../lib/characters'
import type { Character } from '../lib/characters'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function Characters() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Персонажи</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {MAIN_CHARACTERS.length} главных · {SECONDARY_CHARACTERS.length} второстепенных
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {MAIN_CHARACTERS.map(c => (
          <CharacterCard key={c.id} character={c} />
        ))}
      </div>

      <h2 className="text-lg font-bold mb-4">Второстепенные</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECONDARY_CHARACTERS.map(sc => (
          <div
            key={sc.id}
            className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border)] p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sc.colorHex }} />
              <span className="font-medium text-sm">{sc.name}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] ml-auto">{sc.role}</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">{sc.description}</p>
            <ul className="space-y-1">
              {sc.details.map((d, i) => (
                <li key={i} className="text-xs text-[var(--color-text-muted)] flex gap-1.5">
                  <span className="shrink-0 mt-0.5">·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function CharacterCard({ character: c }: { character: Character }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border)] overflow-hidden">
      {/* Color bar */}
      <div className="h-1" style={{ backgroundColor: c.colorHex }} />

      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-4 p-4 text-left"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
          style={{ backgroundColor: c.colorHex + '25', color: c.colorHex }}
        >
          {c.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{c.name}</h3>
            <span className="text-xs text-[var(--color-text-muted)]">{c.fullName}</span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: c.colorHex }}>{c.role}</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{c.description}</p>
        </div>
        <span className="text-[var(--color-text-muted)] shrink-0 mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[var(--color-border)] pt-4">
          {/* Arc */}
          <div className="grid sm:grid-cols-3 gap-3">
            <ArcItem label="Хочет" value={c.want} color="#3B82F6" />
            <ArcItem label="Нуждается" value={c.need} color="#10B981" />
            <ArcItem label="Слабость" value={c.flaw} color="#EF4444" />
          </div>

          {/* Character arc by acts */}
          <Section title="Арка персонажа">
            <div className="space-y-2">
              {(['act1', 'act2', 'act3'] as const).map(act => (
                <div key={act} className="flex gap-2">
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] w-6 shrink-0 pt-0.5">
                    {act === 'act1' ? 'I' : act === 'act2' ? 'II' : 'III'}
                  </span>
                  <span className="text-xs">{c.arc[act]}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Voice */}
          <Section title="Голос и стиль">
            <p className="text-xs mb-2">{c.voiceStyle}</p>
            <div className="space-y-1">
              {c.voiceExamples.map((ex, i) => (
                <p key={i} className="text-xs italic text-[var(--color-text-muted)]">"{ex}"</p>
              ))}
            </div>
          </Section>

          {/* Roles */}
          <div className="grid sm:grid-cols-2 gap-3">
            <Section title="На корабле">
              <p className="text-xs">{c.rolesShip}</p>
            </Section>
            <Section title="На Колоре">
              <p className="text-xs">{c.rolesColora}</p>
            </Section>
          </div>

          {/* Visual */}
          <Section title="Визуальные маркеры">
            <div className="flex flex-wrap gap-1.5">
              {c.visualMarkers.map((m, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]"
                >
                  {m}
                </span>
              ))}
            </div>
          </Section>

          {/* Episodes */}
          <Section title="Ключевые серии">
            <div className="flex flex-wrap gap-1.5">
              {c.featuredEpisodes.map(ep => (
                <a
                  key={ep}
                  href={`/episode/${ep}`}
                  className="text-xs w-7 h-7 rounded-lg flex items-center justify-center font-medium hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: c.colorHex + '20',
                    color: c.colorHex,
                  }}
                >
                  {ep}
                </a>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  )
}

function ArcItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-lg p-3 border border-[var(--color-border)]">
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</span>
      <p className="text-xs mt-1">{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">{title}</h4>
      {children}
    </div>
  )
}
