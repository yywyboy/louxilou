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
