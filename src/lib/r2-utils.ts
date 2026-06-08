/**
 * R2 轻量工具函数（无外部依赖）
 */

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || ''

/**
 * 生成 R2 公共访问 URL
 */
export function getR2Url(key: string): string {
  if (!key) return ''
  if (key.startsWith('http://') || key.startsWith('https://')) return key
  return `${R2_PUBLIC_URL}/${key}`
}

/**
 * R2 路径前缀
 */
export const R2_PATHS = {
  books: {
    covers: 'books/covers/',
    texts: 'books/texts/',
  },
  blog: {
    covers: 'blog/covers/',
    attachments: 'blog/attachments/',
  },
  gallery: {
    photos: 'gallery/photos/',
  },
} as const

/**
 * 生成书籍封面 R2 URL
 */
export function getR2CoverUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (!R2_PUBLIC_URL) return path
  const key = path.replace('/books/covers/', '')
  return `${R2_PUBLIC_URL}/books/covers/${key.split('/').map(encodeURIComponent).join('/')}`
}

/**
 * 书籍文本 R2 URL
 */
export function getR2TxtUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (!R2_PUBLIC_URL) return path
  const key = path.replace('/books/texts/', '')
  return `${R2_PUBLIC_URL}/books/texts/${key.split('/').map(encodeURIComponent).join('/')}`
}
