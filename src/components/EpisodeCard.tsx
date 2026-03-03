import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Episode } from '../lib/types'
import { STATUS_LABELS, STATUS_COLORS } from '../lib/types'

interface Props {
  episode: Episode
}

export default function EpisodeCard({ episode }: Props) {
  const navigate = useNavigate()

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/episode/${episode.id}`)}
      className="cursor-pointer rounded-xl overflow-hidden bg-[var(--color-surface-light)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
    >
      {/* Color bar */}
      <div className="h-1.5" style={{ backgroundColor: episode.color || '#64748B' }} />

      <div className="p-4">
        {/* Number + Status */}
        <div className="flex items-start justify-between mb-2">
          <span className="text-2xl font-bold text-[var(--color-text-muted)]">
            {String(episode.number).padStart(2, '0')}
          </span>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: STATUS_COLORS[episode.status] + '20',
              color: STATUS_COLORS[episode.status],
            }}
          >
            {STATUS_LABELS[episode.status]}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold leading-tight mb-2 line-clamp-2">
          {episode.title}
        </h3>

        {/* Skill + Virtue */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[var(--color-text-muted)]">{episode.skill}</span>
          {episode.virtue && (
            <span className="text-[10px] text-[var(--color-accent)]">{episode.virtue}</span>
          )}
        </div>

        {/* Grey Mold indicator */}
        {episode.grey_mold && (
          <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            Серая Плесень
          </div>
        )}
      </div>
    </motion.div>
  )
}
