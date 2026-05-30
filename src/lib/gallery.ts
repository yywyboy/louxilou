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

export async function getPhotosByCategory(categoryIds: string[]): Promise<Photo[]> {
  if (!supabase) return []
  if (categoryIds.length === 0) return getPhotos()

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .overlaps('categories', categoryIds)
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching photos by category:', error)
    return []
  }

  return data || []
}

export async function updatePhotoCategories(photoId: number, categories: string[]): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('photos')
    .update({ categories })
    .eq('id', photoId)

  if (error) {
    console.error('Error updating photo categories:', error)
    return false
  }

  return true
}

export async function addPhoto(filename: string, categories: string[]): Promise<Photo | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('photos')
    .insert({ filename, categories })
    .select()
    .single()

  if (error) {
    console.error('Error adding photo:', error)
    return null
  }

  return data
}

export async function deletePhoto(photoId: number): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)

  if (error) {
    console.error('Error deleting photo:', error)
    return false
  }

  return true
}

export function getCategoryName(id: string): string {
  return CATEGORIES.find(c => c.id === id)?.name || id
}

export function getCategoryNames(ids: string[]): string[] {
  return ids.map(id => getCategoryName(id)).filter(Boolean)
}
