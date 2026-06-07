import { supabase } from './supabase'
import { books as staticBooks, type Book, type BookChapter } from '../data/books'

export type { Book, BookChapter }

export async function getAllBooks(): Promise<Book[]> {
  const staticResult = [...staticBooks]

  if (!supabase) return staticResult

  const { data: dbBooks, error } = await supabase
    .from('books')
    .select('*')

  if (error || !dbBooks || dbBooks.length === 0) return staticResult

  const { data: chapters } = await supabase
    .from('book_chapters')
    .select('*')
    .order('sort_order')

  const chapterMap = new Map<string, any[]>()
  if (chapters) {
    for (const ch of chapters) {
      if (!chapterMap.has(ch.book_id)) chapterMap.set(ch.book_id, [])
      chapterMap.get(ch.book_id)!.push(ch)
    }
  }

  const dbResult: Book[] = dbBooks.map(b => ({
    id: b.id,
    title: b.title,
    author: b.author,
    cover: b.cover || '',
    description: b.description || '',
    tags: b.tags || [],
    featured: b.featured || false,
    chapters: (chapterMap.get(b.id) || []).map(ch => ({
      id: ch.id,
      title: ch.title,
      cover: ch.cover || b.cover || '',
      status: ch.status || '已完结',
      txtUrl: ch.txt_url || ''
    }))
  }))

  const dbIds = new Set(dbResult.map(b => b.id))
  // Merge: static books first (always preferred), then DB-only books
  const merged: Book[] = [...staticResult]
  // Add DB books that aren't in static data
  dbResult.forEach(dbBook => {
    if (!staticBooks.find(s => s.id === dbBook.id)) {
      merged.push(dbBook)
    } else {
      // Book exists in both: merge chapters from DB if static has none
      const staticBook = merged.find(b => b.id === dbBook.id)
      if (staticBook && staticBook.chapters.length <= 1 && dbBook.chapters.length > 1) {
        staticBook.chapters = dbBook.chapters
      }
      // Merge featured from static
      if (staticBook && dbBook.featured) staticBook.featured = true
    }
  })
  return merged
}

export async function getBookByIdFromDB(id: string): Promise<Book | undefined> {
  const staticBook = staticBooks.find(b => b.id === id)

  if (!supabase) return staticBook

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()

  if (!book) return staticBook

  const { data: chapters } = await supabase
    .from('book_chapters')
    .select('*')
    .eq('book_id', id)
    .order('sort_order')

  // 数据库章节
  const dbChapters = (chapters || []).map(ch => ({
    id: ch.id,
    title: ch.title,
    cover: ch.cover || book.cover || '',
    status: ch.status || '已完结',
    txtUrl: ch.txt_url || ''
  }))

  // 如果数据库章节有 txt_url，用数据库的；否则用静态数据
  const hasTxtUrls = dbChapters.some(ch => ch.txtUrl)
  const finalChapters = hasTxtUrls ? dbChapters : (staticBook?.chapters || dbChapters)

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover || staticBook?.cover || '',
    description: book.description || staticBook?.description || '',
    chapters: finalChapters
  }
}

export async function searchBooks(keyword: string): Promise<Book[]> {
  const allBooks = await getAllBooks()
  const kw = keyword.toLowerCase()
  return allBooks.filter(b =>
    b.title.toLowerCase().includes(kw) ||
    b.author.toLowerCase().includes(kw)
  )
}
