import { supabase } from './supabase'

export interface Photo {
  id: number
  filename: string
  categories: string[]
  created_at: string
}

export const CATEGORIES = [
  { id: 'landscape', name: '风景' },
  { id: 'city', name: '城市' },
  { id: 'people', name: '人物' },
  { id: 'animal', name: '动物' },
  { id: 'food', name: '美食' },
  { id: 'art', name: '艺术' },
  { id: 'nature', name: '自然' },
  { id: 'architecture', name: '建筑' }
]

export async function getPhotos(): Promise<Photo[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching photos:', error)
    return []
  }

  return data || []
}

export function getCategoryName(id: string): string {
  return CATEGORIES.find(c => c.id === id)?.name || id
}

export function getCategoryNames(ids: string[]): string[] {
  return ids.map(id => getCategoryName(id)).filter(Boolean)
}
