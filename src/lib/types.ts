export interface Episode {
  id: number
  number: number
  title: string
  titles_ab: { A: string; B: string; C: string } | null
  skill: string
  virtue: string | null
  location: string | null
  color: string | null
  color_name: string | null
  act: 1 | 2 | 3
  beat_gem: string | null
  beat_gem_module: string | null
  grey_mold: string | null
  nano_banana_prompt: string | null
  plot_summary: string | null
  beat_check: string | null
  midpoint_jam: string | null
  breadcrumb: string | null
  status: EpisodeStatus
}

export interface Short {
  id: number
  episode_id: number
  type: 'teaser' | 'challenge' | 'lore'
  title: string | null
  hook: string | null
  script: string | null
  duration: number
  status: string
}

export interface Sound {
  id: number
  name_ru: string
  name_en: string
  notation: string | null
  description: string | null
  instrument: string | null
  how_to: string | null
  difficulty: number
  module: string
  episode_number: number | null
  is_beat_gem: boolean
  season: number
}

export type EpisodeStatus = 'plan' | 'draft' | 'script' | 'review' | 'done'

export const STATUS_ORDER: EpisodeStatus[] = ['plan', 'draft', 'script', 'review', 'done']

export const STATUS_LABELS: Record<EpisodeStatus, string> = {
  plan: 'План',
  draft: 'Черновик',
  script: 'Скрипт',
  review: 'Ревью',
  done: 'Готово',
}

export const STATUS_COLORS: Record<EpisodeStatus, string> = {
  plan: '#64748B',
  draft: '#F59E0B',
  script: '#3B82F6',
  review: '#8B5CF6',
  done: '#10B981',
}

export const ACT_LABELS: Record<number, string> = {
  1: 'Act I: Promise',
  2: 'Act II: Progress',
  3: 'Act III: Payoff',
}

export const MODULE_COLORS: Record<string, string> = {
  'Ударные': '#EF4444',
  'Басы': '#3B82F6',
  'Духовые': '#F97316',
  'Эффекты': '#10B981',
  'Вокал': '#EAB308',
}

// --- Location ---

export type LocationEnvironment = 'Дом' | 'Природа' | 'Город' | 'Храм' | 'Корабль'

export interface Location {
  id: number
  name: string
  description: string | null
  color: string | null
  color_name: string | null
  environment: LocationEnvironment | null
  genre_style: string | null
  resonant_link: string | null
  nano_banana_prompt: string | null
  episodes: number[]
}

export const ENVIRONMENT_LABELS: Record<LocationEnvironment, string> = {
  'Дом': 'Дом',
  'Природа': 'Природа',
  'Город': 'Город',
  'Храм': 'Храм',
  'Корабль': 'Корабль',
}

export const ENVIRONMENT_COLORS: Record<LocationEnvironment, string> = {
  'Дом': '#4CAF50',
  'Природа': '#2E7D32',
  'Город': '#FF5722',
  'Храм': '#FF9800',
  'Корабль': '#3B82F6',
}
