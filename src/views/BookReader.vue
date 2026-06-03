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
        <button class="control-btn" :class="{ active: translateMode }" @click="toggleTranslate" title="翻译">
          译
        </button>
        <button class="control-btn" @click="toggleFontSize(-1)">
          A-
        </button>
        <button class="control-btn" @click="toggleFontSize(1)">
          A+
        </button>
        <div class="quick-nav" @click.stop="toggleQuickNav">
          <span class="nav-icon">☰</span>
        </div>
      </div>
    </div>

    <div class="reader-content" :style="{ fontSize: fontSize + 'px' }" @click="closeQuickNav">
      <div v-if="error" class="error-content">
        <div class="error-icon">❌</div>
        <p>{{ error }}</p>
      </div>
      <div v-else class="content-text">
        <div v-for="(paragraph, index) in visibleParagraphs" :key="index" class="text-paragraph-wrapper">
          <p class="text-paragraph">{{ paragraph }}</p>
          <p v-if="translateMode && translations[index]" class="text-translation">
            {{ translations[index] }}
          </p>
          <p v-if="translateMode && translatingSet.has(index)" class="text-translating">翻译中...</p>
        </div>
        <div v-if="visibleCount < paragraphs.length" ref="loadMoreRef" class="load-more">
          <span>加载中...</span>
        </div>
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
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBookByIdFromDB, type Book, type BookChapter } from '../lib/books'

const router = useRouter()
const route = useRoute()

const book = ref<Book | null>(null)
const bookChapters = ref<BookChapter[]>([])
const currentChapterIndex = ref(0)
const content = ref('')
const error = ref('')
const fontSize = ref(18)
const showQuickNav = ref(false)
const translateMode = ref(false)
const translations = ref<Record<number, string>>({})
const translatingSet = ref(new Set<number>())

const STORAGE_KEY = 'reader-progress'
const FONT_KEY = 'reader-fontsize'

const saveProgress = () => {
  const bookId = route.params.bookId as string
  const chapterId = bookChapters.value[currentChapterIndex.value]?.id
  if (!bookId || !chapterId) return
  const progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  progress[bookId] = { chapterId, title: chapterTitle.value, timestamp: Date.now() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  localStorage.setItem(FONT_KEY, String(fontSize.value))
}

const loadFontSize = () => {
  const saved = localStorage.getItem(FONT_KEY)
  if (saved) fontSize.value = parseInt(saved) || 18
}

const bookTitle = computed(() => book.value?.title || '')
const chapterTitle = computed(() => {
  if (bookChapters.value.length > 0 && currentChapterIndex.value >= 0) {
    return bookChapters.value[currentChapterIndex.value]?.title || ''
  }
  return ''
})

const totalChapters = computed(() => bookChapters.value.length)

const paragraphs = computed(() => {
  if (!content.value) return []
  return content.value
    .split(/[\n\r]+/)
    .filter(p => p.trim())
    .map(p => p.trim())
})

const BATCH_SIZE = 100
const visibleCount = ref(BATCH_SIZE)
const loadMoreRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const visibleParagraphs = computed(() => paragraphs.value.slice(0, visibleCount.value))

watch(paragraphs, () => {
  visibleCount.value = BATCH_SIZE
  nextTick(setupObserver)
})

function setupObserver() {
  if (observer) observer.disconnect()
  if (!loadMoreRef.value) return
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && visibleCount.value < paragraphs.value.length) {
      visibleCount.value = Math.min(visibleCount.value + BATCH_SIZE, paragraphs.value.length)
    }
  }, { rootMargin: '200px' })
  observer.observe(loadMoreRef.value)
}

onUnmounted(() => {
  if (observer) observer.disconnect()
})

onMounted(() => {
  loadFontSize()
  loadChapter()
})

watch(() => route.params, () => {
  loadChapter()
}, { deep: true })

const decodeText = (buffer: Uint8Array): string => {
  const utf8 = new TextDecoder('utf-8').decode(buffer)
  const bad = (utf8.match(/\ufffd/g) || []).length
  if (bad === 0) return utf8

  const fallbacks = ['gb18030', 'gbk', 'gb2312', 'shift_jis', 'big5']
  for (const enc of fallbacks) {
    try {
      const text = new TextDecoder(enc).decode(buffer)
      if ((text.match(/\ufffd/g) || []).length < bad) return text
    } catch {}
  }
  return utf8
}

const loadChapter = async () => {
  error.value = ''
  content.value = ''
  
  const bookId = route.params.bookId as string
  const chapterId = route.params.chapterId as string
  
  book.value = await getBookByIdFromDB(bookId) ?? null
  
  if (!book.value) {
    error.value = '书籍不存在'
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
    
    const arrayBuffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    content.value = decodeText(uint8Array)
    
    saveProgress()
    
  } catch (err) {
    error.value = '无法加载章节内容'
    console.error(err)
  }
}

const goBack = () => {
  const bookId = route.params.bookId as string
  router.push(`/library/${bookId}`)
}

const toggleFontSize = (delta: number) => {
  fontSize.value = Math.max(12, Math.min(24, fontSize.value + delta))
}

const closeQuickNav = () => {
  showQuickNav.value = false
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

const toggleTranslate = () => {
  translateMode.value = !translateMode.value
  if (translateMode.value) {
    translateVisibleParagraphs()
  }
}

async function translateText(text: string): Promise<string> {
  const truncated = text.slice(0, 300)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(truncated)}`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      if (data[0]) {
        return data[0].map((s: string[]) => s[0]).join('')
      }
    }
  } catch {}
  try {
    const params = new URLSearchParams({ q: truncated, langpair: 'en|zh-CN' })
    const res = await fetch(`https://api.mymemory.translated.net/get?${params}`)
    if (res.ok) {
      const data = await res.json()
      if (data.responseData?.translatedText && !data.responseData.translatedText.includes('MYMEMORY')) {
        return data.responseData.translatedText
      }
    }
  } catch {}
  return '翻译失败'
}

function isEnglish(text: string): boolean {
  const englishChars = text.match(/[a-zA-Z]/g)
  if (!englishChars) return false
  return englishChars.length / text.length > 0.3
}

async function translateVisibleParagraphs() {
  const paras = paragraphs.value
  const batchSize = 3
  for (let i = 0; i < paras.length && translateMode.value; i += batchSize) {
    const batch = []
    for (let j = i; j < Math.min(i + batchSize, paras.length); j++) {
      if (!translations.value[j] && !translatingSet.value.has(j) && isEnglish(paras[j])) {
        batch.push(j)
      }
    }
    if (batch.length === 0) continue
    for (const idx of batch) {
      translatingSet.value.add(idx)
    }
    translatingSet.value = new Set(translatingSet.value)
    const results = await Promise.all(batch.map(idx => translateText(paras[idx])))
    for (let k = 0; k < batch.length; k++) {
      translations.value[batch[k]] = results[k]
      translatingSet.value.delete(batch[k])
    }
    translations.value = { ...translations.value }
    translatingSet.value = new Set(translatingSet.value)
  }
}
</script>

<style scoped>
.reader-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #BDC0BA;
}

.reader-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: #fff;
  border-bottom: 3px solid #000;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #fff;
  border: 3px solid #000;
  cursor: pointer;
  color: #333;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  border-color: #9F353A;
  color: #9F353A;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.header-title {
  text-align: center;
  flex: 1;
  padding: 0 1rem;
}

.header-title h2 {
  font-size: 1rem;
  margin: 0;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-title p {
  font-size: 0.8rem;
  margin: 0;
  color: #666;
}

.reader-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.control-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 3px solid #000;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  transition: all 0.2s ease;
}

.control-btn:hover {
  border-color: #9F353A;
  color: #9F353A;
}

.control-btn.active {
  background: #9F353A;
  border-color: #9F353A;
  color: #fff;
}

.quick-nav {
  width: 36px;
  height: 36px;
  background: #9F353A;
  border: 3px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-nav:hover {
  background: #7a2a2e;
}

.nav-icon {
  font-size: 1rem;
  color: white;
}

.reader-content {
  flex: 1;
  padding: 2rem;
  padding-top: calc(2rem + 56px);
  padding-bottom: 80px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  font-size: 18px;
  line-height: 2;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.content-text {
  line-height: 2;
  color: #333;
}

.text-paragraph {
  margin: 0 0 1.5rem 0;
  text-indent: 2em;
}

.text-paragraph-wrapper {
  margin-bottom: 1.5rem;
}

.text-paragraph-wrapper .text-paragraph {
  margin-bottom: 0.5rem;
}

.text-translation {
  margin: 0;
  text-indent: 2em;
  color: #9F353A;
  font-size: 0.9em;
  opacity: 0.85;
  border-left: 3px solid #9F353A;
  padding-left: 0.75rem;
  margin-left: 2em;
  line-height: 1.8;
}

.text-translating {
  margin: 0;
  text-indent: 2em;
  color: #999;
  font-size: 0.85em;
  font-style: italic;
  margin-left: 2em;
}

.load-more {
  text-align: center;
  padding: 1rem;
  color: #999;
  font-size: 0.9rem;
}

.reader-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #fff;
  border-top: 3px solid #000;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.progress-info {
  font-size: 0.875rem;
  color: #666;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
}

.footer-btn {
  padding: 0.5rem 1.25rem;
}

.quick-nav-panel {
  position: fixed;
  right: 1rem;
  top: 126px;
  width: 280px;
  background: #fff;
  border: 3px solid #000;
  overflow: hidden;
  z-index: 60;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 3px solid #000;
}

.panel-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.close-btn {
  background: none;
  border: 2px solid #000;
  cursor: pointer;
  color: #333;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  border-color: #9F353A;
  color: #9F353A;
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
  border-bottom: 1px solid #000;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
  transition: all 0.2s ease;
}

.chapter-item:last-child {
  border-bottom: none;
}

.chapter-item:hover {
  background: #f3f4f6;
}

.chapter-item.active {
  background: #9F353A;
  color: #fff;
  font-weight: 500;
}

@media (max-width: 768px) {
  .reader-header {
    padding: 0.5rem 1rem;
    top: 50px;
  }

  .header-title h2 {
    font-size: 0.85rem;
  }

  .header-title p {
    display: none;
  }

  .reader-content {
    padding: 1rem;
    padding-top: calc(1rem + 48px);
    padding-bottom: 70px;
  }

  .reader-footer {
    padding: 0.75rem 1rem;
  }

  .footer-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .quick-nav-panel {
    right: 0.5rem;
    top: 108px;
    width: 240px;
  }

  .chapter-list {
    max-height: 300px;
  }
}
</style>
