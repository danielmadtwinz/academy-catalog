import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORY_LABELS, CATEGORY_COLORS, type DirectorCharacter } from '../../lib/characters'
import { Link } from 'react-router-dom'

interface Props {
  character: DirectorCharacter
}

export default function DirectorCharacterCard({ character: c }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyPrompt = () => {
    if (c.higgsFieldPrompt) {
      navigator.clipboard.writeText(c.higgsFieldPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className="rounded-xl border border-[var(--color-border)] overflow-hidden transition-colors"
      style={{ borderLeftWidth: 4, borderLeftColor: c.colorHex }}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--color-surface-light)] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: c.colorHex }}
          >
            {c.name[0]}
          </div>
          <div>
            <span className="font-medium text-sm">{c.name}</span>
            <span className="text-xs text-[var(--color-text-muted)] ml-2">{c.role}</span>
          </div>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: CATEGORY_COLORS[c.category] + '20',
              color: CATEGORY_COLORS[c.category],
            }}
          >
            {CATEGORY_LABELS[c.category]}
          </span>
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
              <p className="text-sm text-[var(--color-text-muted)] pt-3">{c.description}</p>

              {/* Want / Need / Flaw */}
              {(c.want || c.need || c.flaw) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {c.want && (
                    <div className="bg-[var(--color-surface-light)] rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Хочет</p>
                      <p className="text-xs">{c.want}</p>
                    </div>
                  )}
                  {c.need && (
                    <div className="bg-[var(--color-surface-light)] rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Нуждается</p>
                      <p className="text-xs">{c.need}</p>
                    </div>
                  )}
                  {c.flaw && (
                    <div className="bg-[var(--color-surface-light)] rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Слабость</p>
                      <p className="text-xs">{c.flaw}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Arc */}
              {c.arc && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Арка персонажа</p>
                  <div className="space-y-1.5">
                    <div className="flex gap-2 text-xs">
                      <span className="text-[var(--color-primary)] font-medium shrink-0">I:</span>
                      <span className="text-[var(--color-text-muted)]">{c.arc.act1}</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-[var(--color-accent)] font-medium shrink-0">II:</span>
                      <span className="text-[var(--color-text-muted)]">{c.arc.act2}</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-green-400 font-medium shrink-0">III:</span>
                      <span className="text-[var(--color-text-muted)]">{c.arc.act3}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Voice */}
              {c.voiceStyle && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Голос</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{c.voiceStyle}</p>
                  {c.voiceExamples && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {c.voiceExamples.map((ex, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-[var(--color-surface-lighter)] px-2 py-0.5 rounded italic text-[var(--color-text-muted)]"
                        >
                          &laquo;{ex}&raquo;
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Roles */}
              {(c.rolesShip || c.rolesColora) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {c.rolesShip && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">На корабле</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{c.rolesShip}</p>
                    </div>
                  )}
                  {c.rolesColora && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">На Колоре</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{c.rolesColora}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Rhythmling-specific */}
              {c.region && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Регион</p>
                    <p className="text-xs">{c.region}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Звук</p>
                    <p className="text-xs">{c.soundType}</p>
                  </div>
                </div>
              )}

              {/* Resonant-specific */}
              {c.prototype && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Прототип</p>
                    <p className="text-xs">{c.prototype}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Модуль</p>
                    <p className="text-xs">{c.module}</p>
                  </div>
                  {c.visual && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Визуал</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{c.visual}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Visual markers */}
              {c.visualMarkers && c.visualMarkers.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">Визуальные маркеры</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.visualMarkers.map((m, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Higgsfield prompt */}
              {c.higgsFieldPrompt && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Higgsfield Prompt</p>
                    <button
                      onClick={copyPrompt}
                      className="flex items-center gap-1 text-[10px] text-[var(--color-primary)] hover:text-white transition-colors"
                    >
                      {copied ? <Check size={10} /> : <Copy size={10} />}
                      {copied ? 'Скопировано' : 'Копировать'}
                    </button>
                  </div>
                  <pre className="text-[10px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 text-[var(--color-text-muted)] whitespace-pre-wrap font-mono">
                    {c.higgsFieldPrompt}
                  </pre>
                </div>
              )}

              {/* Featured episodes */}
              {c.featuredEpisodes && c.featuredEpisodes.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">Серии</p>
                  <div className="flex flex-wrap gap-1">
                    {c.featuredEpisodes.map(ep => (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
