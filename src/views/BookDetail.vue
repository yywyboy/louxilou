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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="error-state">
    <div class="error-icon">📚</div>
    <p>书籍不存在</p>
    <button class="back-btn" @click="goBack">返回藏书阁</button>
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
  padding: 0.5rem 1rem;
  background: #fff;
  border: 3px solid #000;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  color: #333;
  width: fit-content;
}

.back-button:hover {
  border-color: #9F353A;
  color: #9F353A;
}

.back-icon {
  font-size: 1.25rem;
}

.book-header {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  background: #fff;
  padding: 2rem;
  border: 3px solid #000;
  margin-bottom: 2rem;
}

.cover-section {
  position: relative;
  overflow: hidden;
  border: 3px solid #000;
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
  color: #333;
}

.info-section h2 {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 0 1.5rem 0;
  color: #666;
}

.description {
  flex: 1;
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
  margin: 0 0 1.5rem 0;
}

.stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  font-size: 0.95rem;
  color: #666;
  padding: 0.5rem 1rem;
  border: 3px solid #000;
}

.chapters-section {
  background: #fff;
  padding: 1.5rem 2rem;
  border: 3px solid #000;
}

.chapters-section h3 {
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
  color: #333;
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
  background: #f9fafb;
  border: 3px solid #000;
  transition: all 0.3s ease;
}

.chapter-card:hover {
  border-color: #9F353A;
}

.chapter-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border: 2px solid #000;
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
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter-status {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  margin-bottom: 0.75rem;
  width: fit-content;
  font-weight: 500;
}

.status-completed {
  color: #22c55e;
}

.status-ongoing {
  color: #f59e0b;
}

.chapter-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 2px solid #000;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.read-btn {
  background: #9F353A;
  color: white;
}

.read-btn:hover {
  background: #7a2a2e;
}

.download-btn {
  background: #fff;
  color: #333;
}

.download-btn:hover {
  border-color: #9F353A;
  color: #9F353A;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
}

.error-icon {
  font-size: 4rem;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  background: #9F353A;
  color: white;
  border: 3px solid #000;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #7a2a2e;
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
