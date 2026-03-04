import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDirectorCharacters } from '../hooks/useDirectorCharacters'
import TabBar from '../components/director/TabBar'
import CharacterTypeFilter from '../components/director/CharacterTypeFilter'
import DirectorCharacterCard from '../components/director/DirectorCharacterCard'
import LocationsTable from '../components/director/LocationsTable'

const TABS = [
  { id: 'actors', label: 'Актёры' },
  { id: 'locations', label: 'Локации' },
]

export default function DirectorDashboard() {
  const [activeTab, setActiveTab] = useState('actors')
  const {
    characters,
    allCharacters,
    categoryFilter,
    setCategoryFilter,
    search,
    setSearch,
    sortBy,
    setSortBy,
    categoryCounts,
  } = useDirectorCharacters()

  const tabs = TABS.map(t => ({
    ...t,
    count: t.id === 'actors' ? allCharacters.length : 8,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Director's Dashboard</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {allCharacters.length} персонажей · 8 локаций · Сезон 1
        </p>
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence mode="wait">
        {activeTab === 'actors' && (
          <motion.div
            key="actors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
          >
            <CharacterTypeFilter
              active={categoryFilter}
              onChange={setCategoryFilter}
              counts={categoryCounts}
              total={allCharacters.length}
            />

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Поиск персонажа..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text)] outline-none flex-1 max-w-md placeholder:text-[var(--color-text-muted)]"
              />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text)] outline-none"
              >
                <option value="category">По категории</option>
                <option value="season">По сезонности</option>
                <option value="name">По алфавиту</option>
              </select>
            </div>

            <div className="space-y-2">
              {characters.map(c => (
                <DirectorCharacterCard key={c.id} character={c} />
              ))}
              {characters.length === 0 && (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                  Нет персонажей по выбранным фильтрам
                </p>
              )}
            </div>

            <p className="text-xs text-[var(--color-text-muted)] mt-4 text-center">
              {characters.length} / {allCharacters.length} персонажей
            </p>
          </motion.div>
        )}

        {activeTab === 'locations' && (
          <motion.div
            key="locations"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            <LocationsTable />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
