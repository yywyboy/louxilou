<template>
  <div class="library-container">
    <div class="search-box">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="搜索书籍或作者..."
        class="search-input"
        @keyup.enter="searchKeyword = searchKeyword"
      />
      <button class="search-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
      <button v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''">✕</button>
    </div>

    <div class="tag-filter">
      <button
        class="tag-btn"
        :class="{ active: activeTag === 'all' }"
        @click="activeTag = 'all'"
      >全部</button>
      <button
        v-for="tag in BOOK_TAGS"
        :key="tag.id"
        class="tag-btn"
        :class="{ active: activeTag === tag.id }"
        @click="activeTag = tag.id"
      >{{ tag.name }}</button>
    </div>

    <div class="book-grid">
      <div
        v-for="book in paginatedBooks"
        :key="book.id"
        class="book-card"
        @click="navigateToBook(book.id)"
      >
        <div class="book-cover-wrapper">
          <img :src="book.cover" :alt="book.title" class="book-cover" loading="lazy" />
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

    <div v-if="totalPages > 1" class="pagination">
      <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">&lt;</button>
      <button
        v-for="p in visiblePages"
        :key="p"
        class="page-btn"
        :class="{ active: p === currentPage }"
        @click="currentPage = p"
      >{{ p }}</button>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">&gt;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllBooks, type Book } from '../lib/books'
import { BOOK_TAGS } from '../data/books'

const router = useRouter()
const searchKeyword = ref('')
const activeTag = ref('all')
const currentPage = ref(1)
const pageSize = 12
const allBooks = ref<Book[]>([])

onMounted(async () => {
  allBooks.value = await getAllBooks()
})

const filteredBooks = computed(() => {
  let result = allBooks.value
  if (activeTag.value !== 'all') {
    result = result.filter(book => book.tags?.includes(activeTag.value))
  }
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(book =>
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword)
    )
  }
  return result
})

watch(searchKeyword, () => { currentPage.value = 1 })
watch(activeTag, () => { currentPage.value = 1 })

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / pageSize))
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredBooks.value.slice(start, start + pageSize)
})
const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const cur = currentPage.value
  let start = Math.max(1, cur - 2)
  let end = Math.min(total, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
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
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0;
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tag-btn {
  padding: 0.4rem 1rem;
  border: 2px solid #000;
  background: #fff;
  color: #333;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  border-color: #9F353A;
  color: #9F353A;
}

.tag-btn.active {
  background: #9F353A;
  border-color: #9F353A;
  color: #fff;
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

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border: 3px solid #000;
  background: #fff;
  color: #333;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled):not(.active) {
  background: #f5f5f5;
}

.page-btn.active {
  background: #9F353A;
  border-color: #9F353A;
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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
