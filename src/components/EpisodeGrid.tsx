import type { Episode } from '../lib/types'
import EpisodeCard from './EpisodeCard'

interface Props {
  episodes: Episode[]
}

export default function EpisodeGrid({ episodes }: Props) {
  if (!episodes.length) {
    return (
      <div className="text-center py-12 text-[var(--color-text-muted)]">
        Нет серий по выбранным фильтрам
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {episodes.map(ep => (
        <EpisodeCard key={ep.id} episode={ep} />
      ))}
    </div>
  )
}
