<template>
  <div class="library-container">
    <div class="library-header">
      <h1>📚 藏书阁</h1>
      <p>这里收藏着各种珍贵的书籍和文献，等待您来探索</p>
      
      <div class="search-box">
        <div class="search-icon">🔍</div>
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索书籍或作者..."
          class="search-input"
        />
        <button v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''">✕</button>
      </div>
    </div>

    <div class="book-grid">
      <div 
        v-for="book in filteredBooks" 
        :key="book.id" 
        class="book-card"
        @click="navigateToBook(book.id)"
      >
        <div class="book-cover-wrapper">
          <img :src="book.cover" :alt="book.title" class="book-cover" />
          <div class="book-overlay">
            <span class="overlay-text">查看详情</span>
          </div>
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <p class="book-chapters">{{ book.chapters.length }} 卷</p>
        </div>
      </div>
    </div>

    <div v-if="filteredBooks.length === 0" class="empty-state">
      <div class="empty-icon">📖</div>
      <p>没有找到匹配的书籍</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { books } from '../data/books'

const router = useRouter()
const searchKeyword = ref('')

const filteredBooks = computed(() => {
  if (!searchKeyword.value) return books
  const keyword = searchKeyword.value.toLowerCase()
  return books.filter(book => 
    book.title.toLowerCase().includes(keyword) ||
    book.author.toLowerCase().includes(keyword)
  )
})

const navigateToBook = (bookId: string) => {
  router.push(`/library/${bookId}`)
}
</script>

<style scoped>
.library-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.library-header {
  text-align: center;
  margin-bottom: 3rem;
}

.library-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text, #333);
}

.library-header p {
  font-size: 1.1rem;
  color: var(--color-text-secondary, #666);
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--card-bg, #fff);
  color: var(--color-text, #333);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: var(--color-text-secondary, #9ca3af);
}

.clear-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-secondary, #9ca3af);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: var(--color-bg, #f3f4f6);
  color: var(--color-text, #333);
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.book-card {
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--color-border, #e5e7eb);
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.book-cover-wrapper {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.9);
  border-radius: 8px;
}

.book-info {
  padding: 1rem;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--color-text, #1a1a1a);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #666);
  margin: 0 0 0.25rem 0;
}

.book-chapters {
  font-size: 0.8rem;
  color: #667eea;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--color-text-secondary, #666);
  font-size: 1.1rem;
}

[data-theme="dark"] .book-card {
  background: rgba(30, 30, 40, 0.85);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .search-input {
  background: rgba(30, 30, 40, 0.85);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .clear-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .library-container {
    padding: 1rem;
  }
  
  .library-header h1 {
    font-size: 2rem;
  }
  
  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }
}
</style>