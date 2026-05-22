<template>
  <div class="book-detail-container" v-if="book">
    <div class="back-button" @click="goBack">
      <span class="back-icon">←</span>
      <span>返回藏书阁</span>
    </div>

    <div class="book-header">
      <div class="cover-section">
        <img :src="book.cover" :alt="book.title" class="main-cover" />
      </div>
      <div class="info-section">
        <h1>{{ book.title }}</h1>
        <h2>{{ book.author }}</h2>
        <p class="description">{{ book.description }}</p>
        <div class="stats">
          <span class="stat-item">📚 {{ book.chapters.length }} 卷</span>
        </div>
      </div>
    </div>

    <div v-if="book.txtZipUrl || book.epubZipUrl" class="download-section">
      <h3>📦 全集下载</h3>
      <div class="download-buttons">
        <a v-if="book.txtZipUrl" :href="book.txtZipUrl" download class="btn btn-primary">
          📄 下载 TXT 全集
        </a>
        <a v-if="book.epubZipUrl" :href="book.epubZipUrl" download class="btn btn-secondary">
          📖 下载 EPUB 全集
        </a>
      </div>
    </div>

    <div class="chapters-section">
      <h3>📑 章节列表</h3>
      <div class="chapters-grid">
        <div 
          v-for="chapter in book.chapters" 
          :key="chapter.id" 
          class="chapter-card"
        >
          <img :src="chapter.cover" :alt="chapter.title" class="chapter-cover" />
          <div class="chapter-info">
            <h4 class="chapter-title">{{ chapter.title }}</h4>
            <span class="chapter-status" :class="getStatusClass(chapter.status)">
              {{ chapter.status }}
            </span>
            <div class="chapter-actions">
              <button class="action-btn read-btn" @click="readChapter(chapter)">
                📖 在线阅读
              </button>
              <a :href="chapter.txtUrl" download class="action-btn download-btn">
                📥 下载 TXT
              </a>
              <a :href="chapter.epubUrl" download class="action-btn epub-btn">
                📱 下载 EPUB
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading-state">
    <div class="loading-icon">🔍</div>
    <p>书籍信息加载中...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBookById, type Book, type BookChapter } from '../data/books'

const router = useRouter()
const route = useRoute()
const book = ref<Book | null>(null)

onMounted(() => {
  const bookId = route.params.id as string
  book.value = getBookById(bookId) || null
})

const goBack = () => {
  router.push('/library')
}

const getStatusClass = (status: string) => {
  return status === '已完结' ? 'status-completed' : 'status-ongoing'
}

const readChapter = (chapter: BookChapter) => {
  const bookId = route.params.id as string
  router.push(`/library/${bookId}/read/${chapter.id}`)
}
</script>

<style scoped>
.book-detail-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--card-bg, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  color: var(--color-text, #333);
  width: fit-content;
}

.back-button:hover {
  background: var(--color-bg, #f3f4f6);
  transform: translateX(-4px);
}

.back-icon {
  font-size: 1.25rem;
}

.book-header {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  background: var(--card-bg, #fff);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.cover-section {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.main-cover {
  width: 100%;
  height: auto;
  display: block;
}

.info-section {
  display: flex;
  flex-direction: column;
}

.info-section h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: var(--color-text, #1a1a1a);
}

.info-section h2 {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 0 1.5rem 0;
  color: var(--color-text-secondary, #666);
}

.description {
  flex: 1;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text, #333);
  margin: 0 0 1.5rem 0;
  text-align: justify;
}

.stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  font-size: 0.95rem;
  color: var(--color-text-secondary, #666);
  padding: 0.5rem 1rem;
  background: var(--color-bg, #f3f4f6);
  border-radius: 8px;
}

.download-section {
  background: var(--card-bg, #fff);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.download-section h3 {
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  color: var(--color-text, #1a1a1a);
}

.download-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: var(--color-bg, #f3f4f6);
  color: var(--color-text, #333);
  border: 1px solid var(--color-border, #e5e7eb);
}

.btn-secondary:hover {
  background: var(--color-border, #e5e7eb);
}

.chapters-section {
  background: var(--card-bg, #fff);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.chapters-section h3 {
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
  color: var(--color-text, #1a1a1a);
}

.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.chapter-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-bg, #f9fafb);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.chapter-card:hover {
  background: var(--color-border, #e5e7eb);
  transform: translateX(4px);
}

.chapter-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.chapter-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chapter-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--color-text, #1a1a1a);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter-status {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  width: fit-content;
}

.status-completed {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-ongoing {
  background: rgba(251, 191, 36, 0.1);
  color: #f59e0b;
}

.chapter-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.read-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.read-btn:hover {
  transform: scale(1.02);
}

.download-btn {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.download-btn:hover {
  background: rgba(59, 130, 246, 0.2);
}

.epub-btn {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.epub-btn:hover {
  background: rgba(168, 85, 247, 0.2);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading-icon {
  font-size: 4rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

[data-theme="dark"] .book-header,
[data-theme="dark"] .download-section,
[data-theme="dark"] .chapters-section {
  background: rgba(30, 30, 40, 0.85);
}

[data-theme="dark"] .chapter-card {
  background: rgba(40, 40, 50, 0.8);
}

[data-theme="dark"] .chapter-card:hover {
  background: rgba(50, 50, 60, 0.8);
}

[data-theme="dark"] .stat-item {
  background: rgba(40, 40, 50, 0.8);
}

@media (max-width: 768px) {
  .book-detail-container {
    padding: 1rem;
  }
  
  .book-header {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .cover-section {
    max-width: 200px;
    margin: 0 auto;
  }
  
  .info-section h1 {
    font-size: 1.5rem;
  }
  
  .stats {
    justify-content: center;
  }
  
  .chapters-grid {
    grid-template-columns: 1fr;
  }
}
</style>