import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Location } from '../lib/types'

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('academy_locations')
      .select('*')
      .order('episode_number')
      .then(({ data }) => {
        if (data) setLocations(data)
        setLoading(false)
      })
  }, [])

  const swapLocations = async (locId1: number, locId2: number) => {
    const loc1 = locations.find(l => l.id === locId1)
    const loc2 = locations.find(l => l.id === locId2)
    if (!loc1 || !loc2) return

    const ep1 = loc1.episode_number
    const ep2 = loc2.episode_number

    await Promise.all([
      supabase.from('academy_locations').update({ episode_number: ep2 }).eq('id', locId1),
      supabase.from('academy_locations').update({ episode_number: ep1 }).eq('id', locId2),
    ])

    setLocations(prev =>
      prev
        .map(l => {
          if (l.id === locId1) return { ...l, episode_number: ep2 }
          if (l.id === locId2) return { ...l, episode_number: ep1 }
          return l
        })
        .sort((a, b) => a.episode_number - b.episode_number),
    )
  }

  return { locations, loading, swapLocations }
}
