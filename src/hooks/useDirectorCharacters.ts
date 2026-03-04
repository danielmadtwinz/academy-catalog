import { useState, useMemo } from 'react'
import { DIRECTOR_CHARACTERS, type CharacterCategory, type DirectorCharacter } from '../lib/characters'

export type CharacterSort = 'category' | 'season' | 'name'

export function useDirectorCharacters() {
  const [categoryFilter, setCategoryFilter] = useState<CharacterCategory | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<CharacterSort>('category')

  const filtered = useMemo(() => {
    let result: DirectorCharacter[] = DIRECTOR_CHARACTERS
    if (categoryFilter) result = result.filter(c => c.category === categoryFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.fullName.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      )
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'season') {
        const aFirst = a.featuredEpisodes?.[0] ?? 99
        const bFirst = b.featuredEpisodes?.[0] ?? 99
        return aFirst - bFirst
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'ru')
      }
      // default: category order (as defined in array)
      return 0
    })
  }, [categoryFilter, search, sortBy])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of DIRECTOR_CHARACTERS) {
      counts[c.category] = (counts[c.category] || 0) + 1
    }
    return counts
  }, [])

  return {
    characters: filtered,
    allCharacters: DIRECTOR_CHARACTERS,
    categoryFilter,
    setCategoryFilter,
    search,
    setSearch,
    sortBy,
    setSortBy,
    categoryCounts,
  }
}
