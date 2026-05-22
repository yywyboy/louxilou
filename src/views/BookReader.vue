<template>
  <div class="reader-container">
    <div class="reader-header">
      <button class="nav-btn" @click="goBack">
        <span>←</span>
        <span>返回</span>
      </button>
      <div class="header-title">
        <h2>{{ bookTitle }}</h2>
        <p>{{ chapterTitle }}</p>
      </div>
      <div class="reader-controls">
        <button class="control-btn" @click="toggleFontSize(-1)">
          A-
        </button>
        <button class="control-btn" @click="toggleFontSize(1)">
          A+
        </button>
        <button class="control-btn" @click="toggleTheme">
          🌙
        </button>
      </div>
    </div>

    <div class="reader-content" :style="{ fontSize: fontSize + 'px' }">
      <div v-if="loading" class="loading-content">
        <div class="loading-spinner"></div>
        <p>正在加载内容...</p>
      </div>
      <div v-else-if="error" class="error-content">
        <div class="error-icon">❌</div>
        <p>{{ error }}</p>
      </div>
      <div v-else class="content-text">
        <p v-for="(paragraph, index) in paragraphs" :key="index" class="text-paragraph">
          {{ paragraph }}
        </p>
      </div>
    </div>

    <div class="reader-footer">
      <div class="progress-info">
        <span>{{ currentChapterIndex + 1 }} / {{ totalChapters }}</span>
      </div>
      <div class="nav-buttons">
        <button 
          class="nav-btn footer-btn" 
          :disabled="currentChapterIndex === 0"
          @click="prevChapter"
        >
          ← 上一章
        </button>
        <button 
          class="nav-btn footer-btn" 
          :disabled="currentChapterIndex === totalChapters - 1"
          @click="nextChapter"
        >
          下一章 →
        </button>
      </div>
    </div>

    <div class="quick-nav" @click="toggleQuickNav" ref="quickNav">
      <span class="nav-icon">☰</span>
    </div>

    <div v-if="showQuickNav" class="quick-nav-panel">
      <div class="panel-header">
        <h3>章节导航</h3>
        <button class="close-btn" @click="showQuickNav = false">✕</button>
      </div>
      <div class="chapter-list">
        <button 
          v-for="(chapter, index) in bookChapters" 
          :key="chapter.id"
          class="chapter-item"
          :class="{ active: index === currentChapterIndex }"
          @click="goToChapter(index)"
        >
          {{ chapter.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBookById, type BookChapter } from '../data/books'

const router = useRouter()
const route = useRoute()

const book = ref<ReturnType<typeof getBookById>>(null)
const bookChapters = ref<BookChapter[]>([])
const currentChapterIndex = ref(0)
const content = ref('')
const loading = ref(true)
const error = ref('')
const fontSize = ref(16)
const showQuickNav = ref(false)

const bookTitle = computed(() => book.value?.title || '')
const chapterTitle = computed(() => {
  if (bookChapters.value.length > 0 && currentChapterIndex.value >= 0) {
    return bookChapters.value[currentChapterIndex.value]?.title || ''
  }
  return ''
})

const totalChapters = computed(() => bookChapters.value.length)

const paragraphs = computed(() => {
  return content.value
    .split(/[\n\r]+/)
    .filter(p => p.trim())
    .map(p => p.trim())
})

onMounted(() => {
  loadChapter()
})

watch(() => route.params, () => {
  loadChapter()
}, { deep: true })

const loadChapter = async () => {
  loading.value = true
  error.value = ''
  
  const bookId = route.params.bookId as string
  const chapterId = route.params.chapterId as string
  
  book.value = getBookById(bookId)
  
  if (!book.value) {
    error.value = '书籍不存在'
    loading.value = false
    return
  }
  
  bookChapters.value = book.value.chapters
  currentChapterIndex.value = bookChapters.value.findIndex(c => c.id === chapterId)
  
  if (currentChapterIndex.value === -1) {
    currentChapterIndex.value = 0
  }
  
  const currentChapter = bookChapters.value[currentChapterIndex.value]
  
  try {
    const response = await fetch(currentChapter.txtUrl)
    if (!response.ok) {
      throw new Error('加载失败')
    }
    content.value = await response.text()
  } catch (err) {
    error.value = '无法加载章节内容'
    console.error(err)
  }
  
  loading.value = false
}

const goBack = () => {
  const bookId = route.params.bookId as string
  router.push(`/library/${bookId}`)
}

const toggleFontSize = (delta: number) => {
  fontSize.value = Math.max(12, Math.min(24, fontSize.value + delta))
}

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', newTheme)
}

const prevChapter = () => {
  if (currentChapterIndex.value > 0) {
    currentChapterIndex.value--
    navigateToChapter()
  }
}

const nextChapter = () => {
  if (currentChapterIndex.value < bookChapters.value.length - 1) {
    currentChapterIndex.value++
    navigateToChapter()
  }
}

const navigateToChapter = () => {
  const bookId = route.params.bookId as string
  const chapterId = bookChapters.value[currentChapterIndex.value].id
  router.push(`/library/${bookId}/read/${chapterId}`)
}

const goToChapter = (index: number) => {
  currentChapterIndex.value = index
  showQuickNav.value = false
  navigateToChapter()
}

const toggleQuickNav = () => {
  showQuickNav.value = !showQuickNav.value
}
</script>

<style scoped>
.reader-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg, #fafafa);
}

.reader-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--card-bg, #fff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text, #333);
  font-size: 0.95rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-bg, #f3f4f6);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.header-title {
  text-align: center;
}

.header-title h2 {
  font-size: 1rem;
  margin: 0;
  color: var(--color-text, #1a1a1a);
}

.header-title p {
  font-size: 0.8rem;
  margin: 0;
  color: var(--color-text-secondary, #666);
}

.reader-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg, #f3f4f6);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text, #333);
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: var(--color-border, #e5e7eb);
}

.reader-content {
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.loading-content,
.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border, #e5e7eb);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.content-text {
  line-height: 2;
  color: var(--color-text, #333);
}

.text-paragraph {
  margin: 0 0 1.5rem 0;
  text-indent: 2em;
}

.reader-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--card-bg, #fff);
  border-top: 1px solid var(--color-border, #e5e7eb);
}

.progress-info {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #666);
}

.nav-buttons {
  display: flex;
  gap: 1rem;
}

.footer-btn {
  padding: 0.5rem 1.25rem;
}

.quick-nav {
  position: fixed;
  right: 1rem;
  bottom: 100px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 50;
}

.quick-nav:hover {
  transform: scale(1.1);
}

.nav-icon {
  font-size: 1.5rem;
  color: white;
}

.quick-nav-panel {
  position: fixed;
  right: 1rem;
  bottom: 100px;
  width: 280px;
  background: var(--card-bg, #fff);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 60;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.panel-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text, #1a1a1a);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary, #666);
  font-size: 1rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--color-bg, #f3f4f6);
}

.chapter-list {
  max-height: 400px;
  overflow-y: auto;
}

.chapter-item {
  display: block;
  width: 100%;
  padding: 0.875rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-text, #333);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  transition: all 0.2s ease;
}

.chapter-item:last-child {
  border-bottom: none;
}

.chapter-item:hover {
  background: var(--color-bg, #f3f4f6);
}

.chapter-item.active {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-weight: 500;
}

[data-theme="dark"] .reader-container {
  background: #0f0f14;
}

[data-theme="dark"] .reader-header,
[data-theme="dark"] .reader-footer,
[data-theme="dark"] .quick-nav-panel {
  background: rgba(30, 30, 40, 0.95);
}

[data-theme="dark"] .control-btn {
  background: rgba(50, 50, 60, 0.8);
}

[data-theme="dark"] .chapter-item:hover {
  background: rgba(50, 50, 60, 0.8);
}

[data-theme="dark"] .chapter-item.active {
  background: rgba(102, 126, 234, 0.2);
}

@media (max-width: 768px) {
  .reader-content {
    padding: 1rem;
  }
  
  .header-title h2 {
    font-size: 0.875rem;
  }
  
  .nav-btn span:last-child {
    display: none;
  }
  
  .quick-nav-panel {
    width: calc(100vw - 2rem);
    right: 1rem;
    bottom: auto;
    top: 60px;
    max-height: 70vh;
  }
}
</style>