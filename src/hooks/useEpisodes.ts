import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Episode } from '../lib/types'

export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('academy_episodes')
      .select('*')
      .order('number')
      .then(({ data }) => {
        if (data) setEpisodes(data)
        setLoading(false)
      })
  }, [])

  const updateStatus = async (id: number, status: Episode['status']) => {
    await supabase.from('academy_episodes').update({ status }).eq('id', id)
    setEpisodes(prev => prev.map(ep => (ep.id === id ? { ...ep, status } : ep)))
  }

  return { episodes, loading, updateStatus }
}
