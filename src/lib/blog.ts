import { supabase } from './supabase'
import type { Post, Comment } from './types'

export { type Post, type Comment } from './types'

export interface GetPostsOptions {
  category?: string
  limit?: number
}

export async function getPosts(options?: GetPostsOptions): Promise<Post[]> {
  if (!supabase) return []
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (options?.category && options.category !== 'all') {
    query = query.eq('category', options.category)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data || []
}

export async function getPost(id: string): Promise<Post | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  await incrementViewCount(id)

  return data
}

export async function searchPosts(keyword: string, category?: string): Promise<Post[]> {
  if (!supabase) return []
  let query = supabase
    .from('posts')
    .select('*')
    .or(`title.ilike.%${keyword}%,summary.ilike.%${keyword}%,content.ilike.%${keyword}%`)
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error searching posts:', error)
    return []
  }

  return data || []
}

export async function getComments(postId: string): Promise<Comment[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data || []
}

export async function addComment(
  postId: string,
  userName: string,
  content: string,
  userAvatar?: string
): Promise<Comment | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_name: userName,
      user_avatar: userAvatar || null,
      content
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding comment:', error)
    return null
  }

  return data
}

export async function toggleLike(postId: string, userId: string): Promise<boolean> {
  if (!supabase) return false
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error removing like:', error)
      return false
    }
    return false
  } else {
    const { error } = await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId })

    if (error) {
      console.error('Error adding like:', error)
      return true
    }
    return true
  }
}

export async function hasUserLiked(postId: string, userId: string): Promise<boolean> {
  if (!supabase) return false
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  return !!data
}

export async function getLikeCount(postId: string): Promise<number> {
  if (!supabase) return 0
  const { count, error } = await supabase
    .from('likes')
    .select('id', { count: 'exact' })
    .eq('post_id', postId)

  if (error) {
    console.error('Error getting like count:', error)
    return 0
  }

  return count || 0
}

async function incrementViewCount(postId: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.rpc('increment_view_count', { post_id: postId })
  if (error) {
    console.error('Error incrementing view count:', error)
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.replace(/[#*`\n]/g, '').length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export function subscribeToComments(
  postId: string,
  callback: (comment: Comment) => void
): () => void {
  if (!supabase) return () => {}
  const client = supabase
  const channel = client
    .channel(`comments:${postId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`
      },
      (payload) => {
        callback(payload.new as Comment)
      }
    )
    .subscribe()

  return () => {
    client.removeChannel(channel)
  }
}