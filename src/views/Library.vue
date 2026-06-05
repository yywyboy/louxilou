<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAllBooks, type Book } from '../lib/books'
import { BOOK_TAGS } from '../data/books'
import { gsap, ScrollTrigger } from '../composables/useGsap'

gsap.registerPlugin(ScrollTrigger)
const router = useRouter()
const books = ref<Book[]>([])
const loading = ref(true)
const kw = ref('')
const tag = ref('all')
const displayCount = ref(12)
const gridRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)

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
  gsap.fromTo('.flt', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 })
  animCards()
  setupObserver()
})
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
            <img :src="b.cover" :alt="b.title" loading="lazy" />
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
  .grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.25rem; }
  .tags { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 0.5rem; }
  .tag-btn { white-space: nowrap; flex-shrink: 0; }
}
</style>