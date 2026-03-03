import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Episode, Short } from '../lib/types'

export function useEpisode(id: number) {
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [shorts, setShorts] = useState<Short[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('academy_episodes').select('*').eq('id', id).single(),
      supabase.from('academy_shorts').select('*').eq('episode_id', id).order('type'),
    ]).then(([epRes, shRes]) => {
      if (epRes.data) setEpisode(epRes.data)
      if (shRes.data) setShorts(shRes.data)
      setLoading(false)
    })
  }, [id])

  const updateStatus = async (status: Episode['status']) => {
    await supabase.from('academy_episodes').update({ status }).eq('id', id)
    setEpisode(prev => (prev ? { ...prev, status } : prev))
  }

  return { episode, shorts, loading, updateStatus }
}
