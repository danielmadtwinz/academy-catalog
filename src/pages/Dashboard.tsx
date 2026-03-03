import { useState, useMemo } from 'react'
import { useEpisodes } from '../hooks/useEpisodes'
import ProgressTracker from '../components/ProgressTracker'
import ActFilter from '../components/ActFilter'
import EpisodeGrid from '../components/EpisodeGrid'
import type { EpisodeStatus } from '../lib/types'

export default function Dashboard() {
  const { episodes, loading } = useEpisodes()
  const [actFilter, setActFilter] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<EpisodeStatus | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return episodes.filter(ep => {
      if (actFilter !== null && ep.act !== actFilter) return false
      if (statusFilter !== null && ep.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          ep.title.toLowerCase().includes(q) ||
          ep.skill.toLowerCase().includes(q) ||
          (ep.virtue?.toLowerCase().includes(q) ?? false)
        )
      }
      return true
    })
  }, [episodes, actFilter, statusFilter, search])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[var(--color-text-muted)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Серии</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Сезон 1 · 20 серий · Техника битбокса</p>
      </div>

      <ProgressTracker episodes={episodes} />
      <ActFilter
        actFilter={actFilter}
        statusFilter={statusFilter}
        search={search}
        onActChange={setActFilter}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearch}
      />
      <EpisodeGrid episodes={filtered} />
    </div>
  )
}
