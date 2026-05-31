<template>
  <div class="library-container">
    <div class="search-box">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="搜索书籍或作者..."
        class="search-input"
        @keyup.enter="searchKeyword"
      />
      <button class="search-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
      <button v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''">✕</button>
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

.search-box {
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  gap: 0;
}

.search-input {
  flex: 1;
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  border: 3px solid #000;
  border-right: none;
  border-radius: 0;
  font-size: 1rem;
  background: #fff;
  color: #333;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #9F353A;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  background: #fff;
  border: 3px solid #000;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  flex-shrink: 0;
}

.search-btn:hover {
  background: #9F353A;
  color: white;
  border-color: #9F353A;
}

.clear-btn {
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
}

.clear-btn:hover {
  color: #333;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.book-card {
  background: #fff;
  border: 3px solid #000;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.book-card:hover {
  border-color: #9F353A;
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
  background: rgba(159, 53, 58, 0.7);
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
  border: 2px solid #fff;
}

.book-info {
  padding: 1rem;
  border-top: 3px solid #000;
}

.book-card:hover .book-info {
  border-top-color: #9F353A;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.25rem 0;
}

.book-chapters {
  font-size: 0.8rem;
  color: #9F353A;
  margin: 0;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  border: 3px solid #000;
  background: #fff;
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .library-container {
    padding: 1rem;
  }

  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
}
</style>
