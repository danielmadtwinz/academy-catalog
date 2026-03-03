import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Sound } from '../lib/types'

export function useSounds() {
  const [sounds, setSounds] = useState<Sound[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('academy_sounds')
      .select('*')
      .order('module')
      .order('difficulty')
      .then(({ data }) => {
        if (data) setSounds(data)
        setLoading(false)
      })
  }, [])

  return { sounds, loading }
}
