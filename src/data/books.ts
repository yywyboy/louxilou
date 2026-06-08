import { getR2CoverUrl as cover, getR2TxtUrl as txt } from '../lib/r2-utils'
import booksData from './books.json'

export interface BookChapter {
  id: string
  title: string
  cover: string
  status: string
  txtUrl: string
}

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  description: string
  tags: string[]
  chapters: BookChapter[]
  featured?: boolean
}

export const BOOK_TAGS = [
  { id: 'light-novel', name: '轻小说' },
  { id: 'classic', name: '经典文学' },
  { id: 'novel', name: '长篇小说' },
  { id: 'short-story', name: '短篇集' },
  { id: 'drama', name: '戏剧' },
  { id: 'poetry', name: '诗歌' },
  { id: 'fairy-tale', name: '童话' },
  { id: 'detective', name: '推理' },
  { id: 'adventure', name: '冒险' },
  { id: 'romance', name: '爱情' },
  { id: 'philosophy', name: '哲学' },
  { id: 'dystopia', name: '反乌托邦' },
  { id: 'russian', name: '俄国文学' },
  { id: 'french', name: '法国文学' },
  { id: 'english', name: '英国文学' },
  { id: 'american', name: '美国文学' },
  { id: 'japanese', name: '日本文学' },
  { id: 'german', name: '德国文学' },
  { id: 'italian', name: '意大利文学' },
  { id: 'spanish', name: '西班牙文学' },
  { id: 'latin-american', name: '拉美文学' }
]

export const books: Book[] = booksData.map(b => ({
  ...b,
  cover: cover(b.cover),
  chapters: b.chapters.map(ch => ({
    ...ch,
    cover: cover(ch.cover),
    txtUrl: txt(ch.txtUrl),
  })),
}))
