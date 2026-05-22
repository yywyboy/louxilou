export interface Post {
  id: string
  title: string
  summary: string
  content: string
  cover: string | null
  tags: string[]
  category: string
  author_name: string
  view_count: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_name: string
  user_avatar: string | null
  content: string
  created_at: string
}

export interface Like {
  id: string
  post_id: string
  user_id: string
}