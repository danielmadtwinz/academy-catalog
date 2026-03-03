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
      .order('id')
      .then(({ data }) => {
        if (data) {
          setLocations(
            data.map(d => ({
              ...d,
              episodes: Array.isArray(d.episodes) ? d.episodes : [],
            })),
          )
        }
        setLoading(false)
      })
  }, [])

  return { locations, loading }
}
