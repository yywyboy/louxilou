/**
 * R2 存储上传 Composable
 * 在 Vue 组件中使用，用于上传文件到 R2
 */

import { ref } from 'vue'
import { getR2Url } from '@/lib/r2-utils'

export function useR2Upload() {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 上传文件到 R2（通过 Worker 代理）
   * @param file 要上传的文件
   * @param path 上传路径（不含文件名）
   * @returns 文件的公网 URL
   */
  async function uploadFile(file: File | Blob, path: string): Promise<string | null> {
    const uploadUrl = import.meta.env.VITE_R2_UPLOAD_URL

    if (!uploadUrl) {
      error.value = '未配置上传地址'
      return null
    }

    uploading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', path)

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`上传失败: ${response.status}`)
      }

      const result = await response.json()
      return result.url as string
    } catch (e) {
      error.value = e instanceof Error ? e.message : '上传失败'
      return null
    } finally {
      uploading.value = false
    }
  }

  /**
   * 上传书籍封面
   * @param file 图片文件
   * @param bookId 书籍ID
   * @returns 封面URL
   */
  async function uploadBookCover(file: File | Blob, bookId: string): Promise<string | null> {
    const path = `books/covers/${bookId}`
    return uploadFile(file, path)
  }

  /**
   * 上传博客封面
   * @param file 图片文件
   * @param postId 文章ID
   * @returns 封面URL
   */
  async function uploadPostCover(file: File | Blob, postId: string): Promise<string | null> {
    const path = `blog/covers/${postId}`
    return uploadFile(file, path)
  }

  /**
   * 上传图库照片
   * @param file 图片文件
   * @returns 照片URL
   */
  async function uploadGalleryPhoto(file: File | Blob): Promise<string | null> {
    const timestamp = Date.now()
    const path = `gallery/photos/${timestamp}`
    return uploadFile(file, path)
  }

  return {
    uploading,
    error,
    uploadFile,
    uploadBookCover,
    uploadPostCover,
    uploadGalleryPhoto,
    getR2Url,
  }
}
