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
const selectedTags = ref<string[]>([])
const displayCount = ref(12)

// Search overlay state
const searchOverlay = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

function openSearchOverlay() {
  searchOverlay.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    // 搜索栏从下方移入
    const bar = document.querySelector('.search-overlay-bar') as HTMLElement
    if (bar) gsap.fromTo(bar, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' })
    // 筛选按钮逐个出现
    const tags = document.querySelectorAll('.search-overlay-tags .tag-btn')
    gsap.fromTo(tags, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.15 })
    // 聚焦输入框
    setTimeout(() => searchInputRef.value?.focus(), 300)
  })
}

function closeSearchOverlay() {
  searchOverlay.value = false
  document.body.style.overflow = ''
}

function toggleTag(id: string) {
  const idx = selectedTags.value.indexOf(id)
  if (idx === -1) selectedTags.value.push(id)
  else selectedTags.value.splice(idx, 1)
}

function clearTags() { selectedTags.value = [] }

function removeTag(id: string) {
  const idx = selectedTags.value.indexOf(id)
  if (idx !== -1) selectedTags.value.splice(idx, 1)
}
const gridRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)

// Card popup state
const activeBook = ref<Book | null>(null)
const cardOpen = ref(false)
const flyCover = ref<{ src: string; x: number; y: number; w: number; h: number } | null>(null)

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
function onShelfTouchEnd() { isDragging = false }

const featuredBooks = computed(() => books.value.filter(b => b.featured))

const filtered = computed(() => {
  let r = books.value
  if (kw.value) { const k = kw.value.toLowerCase(); r = r.filter(b => b.title.toLowerCase().includes(k) || b.author.toLowerCase().includes(k)) }
  if (selectedTags.value.length > 0) r = r.filter(b => selectedTags.value.some(t => b.tags?.includes(t)))
  return r
})
const displayed = computed(() => filtered.value.slice(0, displayCount.value))
const hasMore = computed(() => displayCount.value < filtered.value.length)

function loadMore() { if (hasMore.value) displayCount.value = Math.min(displayCount.value + 12, filtered.value.length) }

// Store original cover element for hiding/restoring
let origCoverEl: HTMLElement | null = null
let origCoverRect: DOMRect | null = null

function openBook(book: Book, e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const img = el.querySelector('img') as HTMLImageElement
  if (!img) return
  const rect = img.getBoundingClientRect()

  // Hide original cover, store original rect
  origCoverEl = img
  origCoverRect = rect
  img.style.opacity = '0'

  // Store cover info for flying animation
  flyCover.value = { src: book.cover, x: rect.left, y: rect.top, w: rect.width, h: rect.height }
  activeBook.value = book
  cardOpen.value = true
  document.body.style.overflow = 'hidden'

  nextTick(() => {
    const overlay = document.querySelector('.card-overlay') as HTMLElement
    const card = document.querySelector('.book-card') as HTMLElement
    const cardCoverImg = document.querySelector('.card-cover-img') as HTMLImageElement
    if (!card || !cardCoverImg) return

    // 背景淡入（与图库一致）
    if (overlay) gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })

    // Hide card cover until flying cover arrives
    cardCoverImg.style.opacity = '0'
    cardCoverImg.style.transition = 'none'

    const targetRect = cardCoverImg.getBoundingClientRect()

    // 飞图动画（与图库一致）
    const fly = document.querySelector('.fly-cover') as HTMLElement
    if (fly) {
      gsap.set(fly, { willChange: 'transform' })
      gsap.fromTo(fly, {
        x: 0, y: 0,
        width: rect.width, height: rect.height,
        opacity: 1, borderRadius: 4,
      }, {
        x: targetRect.left - rect.left,
        y: targetRect.top - rect.top,
        width: targetRect.width,
        height: targetRect.height,
        borderRadius: 0,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to(fly, { opacity: 0, duration: 0.15, ease: 'power1.out', onComplete: () => { flyCover.value = null } })
          cardCoverImg.style.opacity = '1'
        }
      })
    }

    // 卡片弹出（与图库一致）
    gsap.set(card, { willChange: 'transform, opacity' })
    gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 })

    // 内容淡入
    gsap.fromTo('.card-info', { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.25 })
    gsap.fromTo('.card-chapters', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.35 })
  })
}

function closeCard() {
  // Kill all running animations
  gsap.killTweensOf('.fly-cover')
  gsap.killTweensOf('.book-card')
  gsap.killTweensOf('.card-info')
  gsap.killTweensOf('.card-chapters')
  gsap.killTweensOf('.card-overlay')

  const overlay = document.querySelector('.card-overlay') as HTMLElement
  const card = document.querySelector('.book-card') as HTMLElement
  if (!card) { finishClose(); return }

  const cardCoverImg = document.querySelector('.card-cover-img') as HTMLImageElement
  const fly = document.querySelector('.fly-cover') as HTMLElement

  if (!origCoverEl || !origCoverRect) { finishClose(); return }

  // Get current fly position (may be mid-animation)
  let startX = 0, startY = 0, startW = 0, startH = 0

  if (fly) {
    const flyRect = fly.getBoundingClientRect()
    startX = flyRect.left
    startY = flyRect.top
    startW = flyRect.width
    startH = flyRect.height
  } else if (cardCoverImg) {
    const imgRect = cardCoverImg.getBoundingClientRect()
    startX = imgRect.left
    startY = imgRect.top
    startW = imgRect.width
    startH = imgRect.height
  }

  // Ensure fly exists
  if (!fly) {
    flyCover.value = {
      src: activeBook.value?.cover || '',
      x: startX, y: startY, w: startW, h: startH
    }
    if (cardCoverImg) cardCoverImg.style.opacity = '0'
    nextTick(() => doCloseFlyAnim(document.querySelector('.fly-cover') as HTMLElement, card, overlay, startX, startY))
  } else {
    if (cardCoverImg) cardCoverImg.style.opacity = '0'
    doCloseFlyAnim(fly, card, overlay, startX, startY)
  }
}

function doCloseFlyAnim(fly: HTMLElement, card: HTMLElement, overlay: HTMLElement | null, startX: number, startY: number) {
  if (!fly || !origCoverRect) { finishClose(); return }

  // 背景淡出（与图库一致）
  if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.45, ease: 'power2.inOut' })

  // 飞图飞回（与图库一致）
  gsap.to(fly, {
    x: origCoverRect.left - startX,
    y: origCoverRect.top - startY,
    width: origCoverRect.width,
    height: origCoverRect.height,
    borderRadius: 4,
    duration: 0.45,
    ease: 'expo.inOut',
    onComplete: () => {
      if (origCoverEl) origCoverEl.style.opacity = '1'
      requestAnimationFrame(() => {
        flyCover.value = null
        cardOpen.value = false
        activeBook.value = null
        document.body.style.overflow = ''
        origCoverEl = null
        origCoverRect = null
      })
    }
  })

  // 卡片消失
  gsap.to(card, { opacity: 0, y: 20, duration: 0.35, ease: 'power2.in' })
}

function finishClose() {
  if (origCoverEl) { origCoverEl.style.opacity = ''; origCoverEl = null }
  origCoverRect = null
  cardOpen.value = false
  activeBook.value = null
  flyCover.value = null
  document.body.style.overflow = ''
}

function readChapter(ch: any) {
  if (activeBook.value) {
    cardOpen.value = false
    document.body.style.overflow = ''
    router.push(`/library/${activeBook.value.id}/read/${ch.id}`)
  }
}

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

watch([kw, selectedTags], () => { displayCount.value = 12; nextTick(() => { animCards(); setupObserver() }) }, { deep: true })

onMounted(async () => {
  document.title = '藏书阁 — LOUXILOU'
  try { books.value = await getAllBooks() } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()

  gsap.fromTo('.pg-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.1 })

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
      <header class="pg-head">
        <span class="eyebrow">Library</span>
        <h1 class="pg-title">藏书阁</h1>
        <p class="pg-desc">探索经典文学与现代作品的数字图书馆</p>
      </header>

      <div class="shelf-wrap" v-if="!loading && featuredBooks.length">
        <div class="shelf-label">
          <span class="shelf-num">精选</span>
          <span class="shelf-hint">← 拖拽浏览 →</span>
        </div>
        <div ref="shelfRef" class="shelf"
          @mousedown="onShelfMouseDown" @mousemove="onShelfMouseMove" @mouseup="onShelfMouseUp" @mouseleave="onShelfMouseUp"
          @touchstart="onShelfTouchStart" @touchmove="onShelfTouchMove" @touchend="onShelfTouchEnd">
          <div v-for="b in featuredBooks" :key="b.id" class="shelf-book interactive" @click="openBook(b, $event)">
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

      <div class="flt">
        <!-- Desktop: inline search + tags -->
        <div class="flt-desktop">
          <div class="search">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="kw" type="text" placeholder="搜索书籍或作者…" class="search-in" />
            <button v-if="kw" class="search-x interactive" @click="kw = ''">×</button>
          </div>
          <div class="tags">
            <button class="tag-btn interactive" :class="{ on: selectedTags.length === 0 }" @click="clearTags">全部</button>
            <button v-for="t in BOOK_TAGS" :key="t.id" class="tag-btn interactive" :class="{ on: selectedTags.includes(t.id) }" @click="toggleTag(t.id)">{{ t.name }}</button>
          </div>
        </div>

        <!-- Mobile: search bar + selected tags display -->
        <div class="flt-mobile">
          <div class="search-mobile" @click="onSearchBarClick">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span class="search-mobile-text" v-if="!kw && selectedTags.length === 0">搜索或筛选书籍…</span>
            <span class="search-mobile-text" v-else-if="kw">{{ kw }}</span>
            <span class="search-mobile-text" v-else>已选 {{ selectedTags.length }} 个标签</span>
            <button v-if="kw || selectedTags.length" class="search-x interactive" @click.stop="kw = ''; clearTags()">×</button>
          </div>
          <div class="selected-tags" v-if="selectedTags.length > 0">
            <button v-for="tid in selectedTags" :key="tid" class="selected-tag interactive" @click="removeTag(tid)">
              {{ BOOK_TAGS.find(t => t.id === tid)?.name }}
              <span class="st-x">×</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile: search overlay -->
      <Teleport to="body">
        <div v-if="searchOverlay" class="search-overlay" @click.self="closeSearchOverlay">
          <div class="search-overlay-inner">
            <div class="search-overlay-bar">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                ref="searchInputRef"
                v-model="kw"
                type="text"
                placeholder="搜索书籍或作者…"
                class="search-overlay-input"
              />
              <button class="search-overlay-close interactive" @click="closeSearchOverlay">完成</button>
            </div>
            <div class="search-overlay-tags">
              <button class="tag-btn interactive" :class="{ on: selectedTags.length === 0 }" @click="clearTags">全部</button>
              <button v-for="t in BOOK_TAGS" :key="t.id" class="tag-btn interactive" :class="{ on: selectedTags.includes(t.id) }" @click="toggleTag(t.id)">{{ t.name }}</button>
            </div>
          </div>
        </div>
      </Teleport>

      <div v-if="loading" style="display:flex;justify-content:center;padding:4rem"><div class="loader"></div></div>
      <div v-else-if="filtered.length === 0" class="empty">没有找到匹配的书籍</div>

      <div v-else ref="gridRef" class="grid">
        <div v-for="b in displayed" :key="b.id" class="bk interactive" @click="openBook(b, $event)">
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

    <!-- Flying cover (positioned at original click location) -->
    <Teleport to="body">
      <div v-if="flyCover" class="fly-cover" :style="{ left: flyCover.x + 'px', top: flyCover.y + 'px', width: flyCover.w + 'px', height: flyCover.h + 'px' }">
        <img :src="flyCover.src" alt="" />
      </div>
    </Teleport>

    <!-- Card overlay -->
    <Teleport to="body">
        <div v-if="cardOpen" class="card-overlay" @click.self="closeCard" @wheel.prevent>
          <div class="book-card" v-if="activeBook" @wheel.stop>
            <button class="card-close interactive" @click="closeCard">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div class="card-top">
              <div class="card-cover">
                <img :src="activeBook.cover" :alt="activeBook.title" class="card-cover-img" />
              </div>
              <div class="card-info">
                <h2 class="card-title">{{ activeBook.title }}</h2>
                <p class="card-author">{{ activeBook.author }}</p>
                <div class="card-rule"></div>
                <p class="card-desc">{{ activeBook.description }}</p>
                <div class="card-tags" v-if="activeBook.tags?.length">
                  <span v-for="t in activeBook.tags" :key="t" class="card-tag">{{ t }}</span>
                </div>
                <div class="card-stat">
                  <span class="card-stat-num">{{ activeBook.chapters.length }}</span>
                  <span class="card-stat-label">卷</span>
                </div>
              </div>
            </div>

            <div class="card-chapters">
              <h3 class="card-ch-title">章节列表</h3>
              <div class="card-ch-list">
                <div v-for="ch in activeBook.chapters" :key="ch.id" class="card-ch-item interactive" @click="readChapter(ch)">
                  <img :src="ch.cover" :alt="ch.title" class="card-ch-thumb" loading="lazy" decoding="async" />
                  <div class="card-ch-info">
                    <h4 class="card-ch-name">{{ ch.title }}</h4>
                    <span class="card-ch-status" :class="ch.status === '已完结' ? 'done' : 'wip'">{{ ch.status }}</span>
                  </div>
                  <button class="card-ch-btn interactive" @click.stop="readChapter(ch)">阅读</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </Teleport>
  </div>
</template>

<style scoped>
.lib { position: relative; z-index: 1; padding: 2rem 0 6rem; }
.pg-head { text-align: center; margin-bottom: 3rem; opacity: 0; }
.eyebrow { font-family: var(--font-sans); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.3em; text-transform: uppercase; display: block; margin-bottom: 1rem; }
.pg-title { font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; letter-spacing: 0.06em; margin-bottom: 0.75rem; }
.pg-desc { font-size: 0.88rem; color: var(--ink-ghost); letter-spacing: 0.05em; }

.shelf-wrap { margin-bottom: 3rem; }
.shelf-label { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding: 0 0.5rem; }
.shelf-num { font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; color: var(--ink-dim); }
.shelf-hint { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ink-vanish); }
.shelf { display: flex; gap: 1.5rem; padding: 2rem 1rem; overflow-x: auto; overflow-y: hidden; cursor: grab; perspective: 800px; scrollbar-width: none; scroll-behavior: smooth; }
.shelf::-webkit-scrollbar { display: none; }
.shelf-shadow { height: 40px; background: linear-gradient(to bottom, rgba(var(--bg-rgb), 0) 0%, var(--bg) 100%); margin-top: -40px; pointer-events: none; }
.shelf-book { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; cursor: pointer; transition: transform 0.4s var(--ease); transform-style: preserve-3d; }
.shelf-book:hover { transform: translateY(-8px) scale(1.02); }
.shelf-cover { position: relative; width: 120px; aspect-ratio: 3/4; overflow: visible; transform-style: preserve-3d; transition: transform 0.4s var(--ease); }
.shelf-book:hover .shelf-cover { transform: rotateY(-8deg) rotateX(3deg); }
.shelf-cover img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: var(--r-xs); border: 1px solid var(--border); }
.shelf-spine { position: absolute; right: -6px; top: 0; width: 6px; height: 100%; background: linear-gradient(to right, rgba(80,70,55,0.9), rgba(50,45,35,0.95)); transform: rotateY(90deg); transform-origin: left center; border-radius: 0 var(--r-xs) var(--r-xs) 0; }
.shelf-edge { position: absolute; bottom: -4px; left: 0; width: 100%; height: 4px; background: linear-gradient(to bottom, rgba(60,55,45,0.8), rgba(40,38,30,0.9)); transform: rotateX(-90deg); transform-origin: top center; border-radius: 0 0 var(--r-xs) var(--r-xs); }
.shelf-title { font-family: var(--font-display); font-size: 0.72rem; font-weight: 600; color: var(--ink-dim); text-align: center; max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.shelf-book:hover .shelf-title { color: var(--gold); }

.flt { margin-bottom: 3rem; opacity: 0; }
.search { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1.1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-full); margin-bottom: 1rem; color: var(--ink-ghost); transition: border-color 0.3s; }
.search:focus-within { border-color: var(--border-hover); }
.search-in { flex: 1; background: none; border: none; outline: none; font-size: 0.88rem; color: var(--ink); font-family: var(--font-body); }
.search-in::placeholder { color: var(--ink-ghost); }
.search-x { font-size: 1.1rem; color: var(--ink-ghost); padding: 0 0.25rem; cursor: pointer; border: none; background: none; }
.search-x:hover { color: var(--ink); }
.tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.tag-btn { padding: 0.3rem 0.8rem; font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); background: none; border: 1px solid var(--border); border-radius: var(--r-full); transition: all 0.3s; cursor: pointer; }
.tag-btn:hover { color: var(--ink-dim); border-color: var(--border-hover); }
.tag-btn.on { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }
.flt-mobile { display: none; }

/* Search overlay */
.search-overlay {
  position: fixed; inset: 0; z-index: 10005;
  background: rgba(var(--bg-rgb), 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex; flex-direction: column; align-items: center;
  padding-top: 2rem;
}
.search-overlay-inner {
  width: 100%; max-width: 480px; padding: 0 1rem;
}
.search-overlay-bar {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--r-full);
  margin-bottom: 1.5rem;
  color: var(--ink-ghost);
}
.search-overlay-input {
  flex: 1; background: none; border: none; outline: none;
  font-size: 0.95rem; color: var(--ink); font-family: var(--font-body);
}
.search-overlay-input::placeholder { color: var(--ink-ghost); }
.search-overlay-close {
  font-family: var(--font-sans); font-size: 0.78rem; color: var(--gold);
  background: none; border: none; cursor: pointer; padding: 0.3rem 0.5rem;
}
.search-overlay-tags {
  display: flex; flex-wrap: wrap; gap: 0.4rem;
  justify-content: center;
}

/* Selected tags display */
.selected-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.5rem; }
.selected-tag {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.2rem 0.6rem; font-family: var(--font-sans); font-size: 0.68rem;
  color: var(--gold); background: var(--gold-dim); border: 1px solid var(--gold);
  border-radius: var(--r-full); cursor: pointer; transition: all 0.2s;
}
.selected-tag:hover { background: var(--gold); color: var(--bg); }
.st-x { font-size: 0.8rem; line-height: 1; }

/* Mobile search bar */
.search-mobile {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.65rem 1.1rem;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--r-full); cursor: pointer;
  color: var(--ink-ghost); transition: border-color 0.3s;
}
.search-mobile:hover { border-color: var(--border-hover); }
.search-mobile-text { flex: 1; font-size: 0.88rem; color: var(--ink-ghost); }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 2rem; margin-bottom: 2rem; }
.bk { cursor: pointer; opacity: 0; }
.bk.shown { opacity: 1; }
.bk:hover .bk-cover { transform: translateY(-6px); }
.bk:hover .bk-shine { opacity: 1; }
.bk-cover { position: relative; aspect-ratio: 3/4; overflow: hidden; border-radius: var(--r-xs); background: var(--bg-elevated); margin-bottom: 0.75rem; transition: transform 0.4s var(--ease); }
.bk-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bk-shine { position: absolute; inset: 0; background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%); opacity: 0; transition: opacity 0.4s; pointer-events: none; }
.bk-info { padding: 0 0.1rem; }
.bk-title { font-family: var(--font-display); font-size: 0.92rem; font-weight: 600; line-height: 1.35; margin-bottom: 0.15rem; }
.bk-author { font-family: var(--font-sans); font-size: 0.7rem; color: var(--ink-ghost); }
.sentinel { display: flex; justify-content: center; padding: 2rem; }
.empty { text-align: center; padding: 4rem; color: var(--ink-ghost); }

@media (max-width: 768px) {
  .pg-title { font-size: 2.5rem; }
  .shelf { gap: 0.75rem; padding: 1rem 0.25rem; }
  .shelf-cover { width: 80px; }
  .shelf-spine, .shelf-edge { display: none; }
  .shelf-hint { display: none; }
  .shelf-title { font-size: 0.65rem; max-width: 75px; }
  .flt-desktop { display: none; }
  .flt-mobile { display: block; }
  .grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem; }
}
</style>

<style>
/* Flying cover — fixed position, animated by GSAP */
.fly-cover {
  position: fixed;
  z-index: 10004;
  pointer-events: none;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.25);
  will-change: transform;
}
.fly-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Card overlay — 与图库一致 */
.card-overlay {
  position: fixed; inset: 0; z-index: 10003;
  background: rgba(var(--bg-rgb), 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.book-card {
  width: 640px; max-width: calc(100vw - 2rem);
  max-height: calc(100vh - 4rem);
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl);
  box-shadow: 0 24px 80px rgba(0,0,0,0.12);
  display: flex; flex-direction: column;
  overflow: hidden;
  position: relative;
  opacity: 0;
  will-change: transform, opacity;
}
.card-close {
  position: absolute; top: 1rem; right: 1rem; z-index: 10;
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  background: var(--bg-warm); border: 1px solid var(--border); border-radius: 50%;
  color: var(--ink-ghost); transition: all 0.3s; cursor: pointer;
}
.card-close:hover { color: var(--gold); border-color: var(--gold); }

.card-top { display: grid; grid-template-columns: 160px 1fr; gap: 2rem; padding: 2rem; flex-shrink: 0; }
.card-cover { overflow: hidden; border-radius: var(--r-sm); background: var(--bg-elevated); }
.card-cover-img { width: 100%; display: block; }
.card-info { display: flex; flex-direction: column; justify-content: center; }
.card-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.3rem; }
.card-author { font-size: 0.88rem; color: var(--ink-ghost); margin-bottom: 1rem; }
.card-rule { width: 40px; height: 1px; background: var(--gold); opacity: 0.5; margin-bottom: 1rem; }
.card-desc { font-size: 0.88rem; color: var(--ink-dim); line-height: 1.8; margin-bottom: 1rem; }
.card-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 1rem; }
.card-tag { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ink-ghost); padding: 0.1rem 0.5rem; background: var(--gold-dim); border-radius: var(--r-full); }
.card-stat { display: flex; align-items: baseline; gap: 0.25rem; }
.card-stat-num { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--gold); }
.card-stat-label { font-size: 0.78rem; color: var(--ink-ghost); }

.card-chapters {
  padding: 0 2rem 2rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.card-chapters::-webkit-scrollbar { display: none; }
.card-ch-title { font-family: var(--font-display); font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }
.card-ch-list { display: flex; flex-direction: column; gap: 0.5rem; }
.card-ch-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: var(--bg-warm); border: 1px solid var(--border); border-radius: var(--r-sm); cursor: pointer; transition: all 0.3s; }
.card-ch-item:hover { border-color: var(--border-hover); transform: translateX(4px); }
.card-ch-thumb { width: 40px; height: 54px; object-fit: cover; border-radius: var(--r-xs); border: 1px solid var(--border); flex-shrink: 0; }
.card-ch-info { flex: 1; min-width: 0; }
.card-ch-name { font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-ch-status { font-family: var(--font-sans); font-size: 0.6rem; padding: 0.1rem 0.4rem; border-radius: var(--r-full); font-weight: 500; }
.card-ch-status.done { background: rgba(122,158,126,0.12); color: #7a9e7e; }
.card-ch-status.wip { background: rgba(200,164,94,0.12); color: var(--gold); }
.card-ch-btn { padding: 0.3rem 0.75rem; font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; border-radius: var(--r-full); background: var(--gold); color: var(--bg); border: none; cursor: pointer; transition: all 0.3s; flex-shrink: 0; }
.card-ch-btn:hover { background: var(--gold-light); }


@media (max-width: 768px) {
  .card-top { grid-template-columns: 100px 1fr; gap: 1.25rem; padding: 1.25rem; }
  .card-title { font-size: 1.2rem; }
  .card-desc { font-size: 0.82rem; }
  .card-chapters { padding: 0 1.25rem 1.25rem; }
  .card-ch-item { padding: 0.6rem; }
  .card-ch-thumb { width: 32px; height: 44px; }
}
</style>
