import { supabase } from './supabase'

export interface Photo {
  id: number
  filename: string
  categories: string[]
  created_at: string
}

export interface Friend {
  id: string
  name: string
  avatar: string
  intro: string
  contact?: string
  photos: { filename: string; caption?: string }[]
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

/* Friends — static fallback */
const STATIC_FRIENDS: Friend[] = [
  {
    id: 'xiaomi',
    name: '小米',
    avatar: '小米.jpg',
    intro: '跟着光',
    photos: Array.from({ length: 15 }, (_, i) => ({
      filename: `小米 (${i + 1}).jpg`,
    })),
  },
]

/* 获取所有朋友（含图片） */
export async function getFriends(): Promise<Friend[]> {
  if (!supabase) return STATIC_FRIENDS

  try {
    const { data: friends, error } = await supabase
      .from('friends')
      .select('*')
      .order('created_at', { ascending: true })

    if (error || !friends || friends.length === 0) return STATIC_FRIENDS

    const { data: photos } = await supabase
      .from('friend_photos')
      .select('*')
      .order('id', { ascending: true })

    return friends.map((f: any) => ({
      id: f.id,
      name: f.name,
      avatar: f.avatar,
      intro: f.intro || '',
      contact: f.contact || '',
      photos: (photos || [])
        .filter((p: any) => p.friend_id === f.id)
        .map((p: any) => ({ filename: p.filename, caption: p.caption || '' })),
    }))
  } catch {
    return STATIC_FRIENDS
  }
}

export function getCategoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name || id
}

export function getCategoryNames(ids: string[]): string[] {
  return ids.map((id) => getCategoryName(id)).filter(Boolean)
}
