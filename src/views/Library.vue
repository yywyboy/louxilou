<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllBooks, type Book } from '../lib/books'
import { BOOK_TAGS } from '../data/books'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../composables/useGsap'

gsap.registerPlugin(ScrollTrigger)
const reduced = prefersReducedMotion()
const router = useRouter()
const books = ref<Book[]>([])
const loading = ref(true)
const kw = ref('')
const tag = ref('all')
const displayCount = ref(12)
const gridRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)

// 3D Bookshelf drag scroll
const shelfRef = ref<HTMLElement | null>(null)
let isDragging = false
let startX = 0
let scrollLeft = 0

function onShelfMouseDown(e: MouseEvent) {
  if (!shelfRef.value) return
  isDragging = true
  startX = e.pageX - shelfRef.value.offsetLeft
  scrollLeft = shelfRef.value.scrollLeft
  shelfRef.value.style.cursor = 'grabbing'
  e.preventDefault()
}
function onShelfMouseMove(e: MouseEvent) {
  if (!isDragging || !shelfRef.value) return
  e.preventDefault()
  const x = e.pageX - shelfRef.value.offsetLeft
  const walk = (x - startX) * 1.5
  shelfRef.value.scrollLeft = scrollLeft - walk
}
function onShelfMouseUp() {
  isDragging = false
  if (shelfRef.value) shelfRef.value.style.cursor = 'grab'
}

// Touch support
function onShelfTouchStart(e: TouchEvent) {
  if (!shelfRef.value) return
  isDragging = true
  startX = e.touches[0].pageX - shelfRef.value.offsetLeft
  scrollLeft = shelfRef.value.scrollLeft
}
function onShelfTouchMove(e: TouchEvent) {
  if (!isDragging || !shelfRef.value) return
  const x = e.touches[0].pageX - shelfRef.value.offsetLeft
  const walk = (x - startX) * 1.5
  shelfRef.value.scrollLeft = scrollLeft - walk
}
function onShelfTouchEnd() {
  isDragging = false
}

const filtered = computed(() => {
  let r = books.value
  if (kw.value) { const k = kw.value.toLowerCase(); r = r.filter(b => b.title.toLowerCase().includes(k) || b.author.toLowerCase().includes(k)) }
  if (tag.value !== 'all') r = r.filter(b => b.tags?.includes(tag.value))
  return r
})
const displayed = computed(() => filtered.value.slice(0, displayCount.value))
const hasMore = computed(() => displayCount.value < filtered.value.length)

function go(id: string) { router.push(`/library/${id}`) }
function loadMore() { if (hasMore.value) displayCount.value = Math.min(displayCount.value + 12, filtered.value.length) }

function animCards() {
  if (!gridRef.value) return
  const cards = gridRef.value.querySelectorAll('.bk:not(.shown)')
  gsap.fromTo(cards, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.04, ease: 'power3.out', onComplete: () => cards.forEach(c => c.classList.add('shown')) })
}

let observer: IntersectionObserver | null = null
function setupObserver() {
  if (observer) observer.disconnect()
  if (!sentinelRef.value) return
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore.value) { loadMore(); nextTick(animCards) }
  }, { rootMargin: '200px' })
  observer.observe(sentinelRef.value)
}

watch([kw, tag], () => { displayCount.value = 12; nextTick(() => { animCards(); setupObserver() }) })

onMounted(async () => {
  document.title = '藏书阁 — LOUXILOU'
  try { books.value = await getAllBooks() } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()

  gsap.fromTo('.pg-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.1 })

  // 3D Bookshelf entrance animation
  if (!reduced && shelfRef.value) {
    const shelfBooks = shelfRef.value.querySelectorAll('.shelf-book')
    gsap.fromTo(shelfBooks, { opacity: 0, y: 40, rotateY: -20 }, { opacity: 1, y: 0, rotateY: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out', delay: 0.3 })
  }

  gsap.fromTo('.flt', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.5 })
  animCards()
  setupObserver()
})

onUnmounted(() => { if (observer) observer.disconnect() })
</script>

<template>
  <div class="lib">
    <div class="ctr">
      <!-- Header -->
      <header class="pg-head">
        <span class="eyebrow">Library</span>
        <h1 class="pg-title">藏书阁</h1>
        <p class="pg-desc">探索经典文学与现代作品的数字图书馆</p>
      </header>

      <!-- 3D Bookshelf Banner -->
      <div class="shelf-wrap" v-if="!loading && books.length">
        <div class="shelf-label">
          <span class="shelf-num">精选</span>
          <span class="shelf-hint">← 拖拽浏览 →</span>
        </div>
        <div
          ref="shelfRef"
          class="shelf"
          @mousedown="onShelfMouseDown"
          @mousemove="onShelfMouseMove"
          @mouseup="onShelfMouseUp"
          @mouseleave="onShelfMouseUp"
            @touchstart="onShelfTouchStart"
            @touchmove="onShelfTouchMove"
            @touchend="onShelfTouchEnd"
        >
          <div v-for="b in books" :key="b.id" class="shelf-book interactive" @click="go(b.id)">
            <div class="shelf-cover">
              <img :src="b.cover" :alt="b.title" loading="lazy" decoding="async" />
              <div class="shelf-spine"></div>
              <div class="shelf-edge"></div>
            </div>
            <p class="shelf-title">{{ b.title }}</p>
          </div>
        </div>
        <div class="shelf-shadow"></div>
      </div>

      <!-- Filter -->
      <div class="flt">
        <div class="search">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="kw" type="text" placeholder="搜索书籍或作者…" class="search-in" />
          <button v-if="kw" class="search-x interactive" @click="kw = ''">×</button>
        </div>
        <div class="tags">
          <button class="tag-btn interactive" :class="{ on: tag === 'all' }" @click="tag = 'all'">全部</button>
          <button v-for="t in BOOK_TAGS" :key="t.id" class="tag-btn interactive" :class="{ on: tag === t.id }" @click="tag = t.id">{{ t.name }}</button>
        </div>
      </div>

      <!-- Grid -->
      <div v-if="loading" style="display:flex;justify-content:center;padding:4rem"><div class="loader"></div></div>
      <div v-else-if="filtered.length === 0" class="empty">没有找到匹配的书籍</div>

      <div v-else ref="gridRef" class="grid">
        <div v-for="b in displayed" :key="b.id" class="bk interactive" @click="go(b.id)">
          <div class="bk-cover">
            <img :src="b.cover" :alt="b.title" loading="lazy" decoding="async" />
            <div class="bk-shine"></div>
          </div>
          <div class="bk-info">
            <h3 class="bk-title">{{ b.title }}</h3>
            <p class="bk-author">{{ b.author }}</p>
          </div>
        </div>
      </div>

      <div ref="sentinelRef" class="sentinel" v-if="hasMore"><div class="loader"></div></div>
    </div>
  </div>
</template>

<style scoped>
.lib { position: relative; z-index: 1; padding: 2rem 0 6rem; }

.pg-head { text-align: center; margin-bottom: 3rem; opacity: 0; }
.eyebrow { font-family: var(--font-sans); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.3em; text-transform: uppercase; display: block; margin-bottom: 1rem; }
.pg-title { font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; letter-spacing: 0.06em; margin-bottom: 0.75rem; }
.pg-desc { font-size: 0.88rem; color: var(--ink-ghost); letter-spacing: 0.05em; }

/* ===== 3D BOOKSHELF ===== */
.shelf-wrap {
  margin-bottom: 3rem;
  position: relative;
}
.shelf-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}
.shelf-num {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink-dim);
  letter-spacing: 0.05em;
}
.shelf-hint {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--ink-vanish);
  letter-spacing: 0.1em;
}
.shelf {
  display: flex;
  gap: 1.5rem;
  padding: 2rem 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  perspective: 800px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
}
.shelf::-webkit-scrollbar { display: none; }
.shelf-shadow {
  height: 40px;
  background: linear-gradient(to bottom, rgba(var(--bg-rgb), 0) 0%, var(--bg) 100%);
  margin-top: -40px;
  pointer-events: none;
  position: relative;
  z-index: 1;
}
.shelf-book {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: transform 0.4s var(--ease);
  transform-style: preserve-3d;
}
.shelf-book:hover {
  transform: translateY(-8px) scale(1.02);
}
.shelf-cover {
  position: relative;
  width: 120px;
  aspect-ratio: 3 / 4;
  border-radius: 2px;
  overflow: visible;
  transform-style: preserve-3d;
  transition: transform 0.4s var(--ease);
}
.shelf-book:hover .shelf-cover {
  transform: rotateY(-8deg) rotateX(3deg);
}
.shelf-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 2px;
  border: 1px solid var(--border);
}
/* Book spine — right edge */
.shelf-spine {
  position: absolute;
  right: -6px;
  top: 0;
  width: 6px;
  height: 100%;
  background: linear-gradient(to right, rgba(80,70,55,0.9), rgba(50,45,35,0.95));
  transform: rotateY(90deg);
  transform-origin: left center;
  border-radius: 0 2px 2px 0;
}
/* Book edge — bottom */
.shelf-edge {
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to bottom, rgba(60,55,45,0.8), rgba(40,38,30,0.9));
  transform: rotateX(-90deg);
  transform-origin: top center;
  border-radius: 0 0 2px 2px;
}
.shelf-title {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--ink-dim);
  text-align: center;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s;
}
.shelf-book:hover .shelf-title {
  color: var(--gold);
}

/* ===== FILTER ===== */
.flt { margin-bottom: 3rem; opacity: 0; }
.search { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1.1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 100px; margin-bottom: 1rem; color: var(--ink-ghost); transition: border-color 0.3s; }
.search:focus-within { border-color: var(--border-hover); }
.search-in { flex: 1; background: none; border: none; outline: none; font-size: 0.88rem; color: var(--ink); font-family: var(--font-body); }
.search-in::placeholder { color: var(--ink-ghost); }
.search-x { font-size: 1.1rem; color: var(--ink-ghost); padding: 0 0.25rem; }
.search-x:hover { color: var(--ink); }
.tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.tag-btn { padding: 0.3rem 0.8rem; font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); background: none; border: 1px solid var(--border); border-radius: 100px; transition: all 0.3s; }
.tag-btn:hover { color: var(--ink-dim); border-color: var(--border-hover); }
.tag-btn.on { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.bk { cursor: pointer; opacity: 0; }
.bk.shown { opacity: 1; }
.bk:hover .bk-cover { transform: translateY(-6px); }
.bk:hover .bk-shine { opacity: 1; }

.bk-cover {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid var(--border);
  margin-bottom: 0.75rem;
  transition: transform 0.4s var(--ease);
}
.bk-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Shine effect on hover */
.bk-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.bk-info { padding: 0 0.1rem; }
.bk-title { font-family: var(--font-display); font-size: 0.92rem; font-weight: 600; line-height: 1.35; margin-bottom: 0.15rem; }
.bk-author { font-family: var(--font-sans); font-size: 0.7rem; color: var(--ink-ghost); }

.sentinel { display: flex; justify-content: center; padding: 2rem; }
.empty { text-align: center; padding: 4rem; color: var(--ink-ghost); }

@media (max-width: 768px) {
  .pg-title { font-size: 2.5rem; }

  /* Shelf — simplified */
  .shelf { gap: 0.75rem; padding: 1rem 0.25rem; }
  .shelf-cover { width: 80px; }
  .shelf-spine, .shelf-edge { display: none; }
  .shelf-hint { display: none; }
  .shelf-title { font-size: 0.65rem; max-width: 75px; }

  /* Search — larger touch target */
  .search { padding: 0.75rem 1rem; }
  .search-in { font-size: 1rem; }

  /* Grid — responsive */
  .grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem; }

  /* Tags — horizontal scroll */
  .tags { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 0.5rem; -webkit-overflow-scrolling: touch; }
  .tag-btn { white-space: nowrap; flex-shrink: 0; padding: 0.35rem 0.75rem; }
}
</style>
