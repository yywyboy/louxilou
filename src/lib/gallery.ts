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
  { id: 'architecture', name: '建筑' },
]

/* Static fallback — local photos from public/assets/photos/ */
const STATIC_PHOTOS: Photo[] = Array.from({ length: 125 }, (_, i) => ({
  id: i + 1,
  filename: `photo-${String(i + 1).padStart(3, '0')}.jpg`,
  categories: ['landscape', 'nature'],
  created_at: '2024-01-01T00:00:00Z',
}))

export async function getPhotos(): Promise<Photo[]> {
  // Always use static photos (local files)
  if (!supabase) return STATIC_PHOTOS

  try {
    const { data, error } = await supabase.from('photos').select('*').order('id', { ascending: true })
    if (error || !data || data.length === 0) return STATIC_PHOTOS

    // Merge: use static filenames, but keep DB categories if available
    return STATIC_PHOTOS.map(sp => {
      const dbPhoto = data.find((d: any) => d.id === sp.id)
      return {
        ...sp,
        categories: dbPhoto?.categories || sp.categories,
      }
    })
  } catch {
    return STATIC_PHOTOS
  }
}

export function getCategoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name || id
}

export function getCategoryNames(ids: string[]): string[] {
  return ids.map((id) => getCategoryName(id)).filter(Boolean)
}
