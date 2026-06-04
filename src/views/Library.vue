<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
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
const page = ref(1)
const size = 12
const gridRef = ref<HTMLElement | null>(null)

const filtered = computed(() => {
  let r = books.value
  if (kw.value) { const k = kw.value.toLowerCase(); r = r.filter(b => b.title.toLowerCase().includes(k) || b.author.toLowerCase().includes(k)) }
  if (tag.value !== 'all') r = r.filter(b => b.tags?.includes(tag.value))
  return r
})
const total = computed(() => Math.max(1, Math.ceil(filtered.value.length / size)))
const paged = computed(() => { const s = (page.value - 1) * size; return filtered.value.slice(s, s + size) })
const pages = computed(() => { const t = total.value, c = page.value, p: number[] = []; for (let i = Math.max(1, c - 2); i <= Math.min(t, c + 2); i++) p.push(i); return p })

function go(id: string) { router.push(`/library/${id}`) }
function animCards() { if (!gridRef.value) return; const c = gridRef.value.querySelectorAll('.bk'); gsap.fromTo(c, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' }) }

watch([kw, tag], () => { page.value = 1; nextTick(animCards) })
watch(page, () => nextTick(animCards))

onMounted(async () => {
  document.title = '藏书阁 — LOUXILOU'
  try { books.value = await getAllBooks() } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()
  gsap.fromTo('.pg-head', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 })
  gsap.fromTo('.flt', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 })
  animCards()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
  gsap.killTweensOf('*')
})
</script>

<template>
  <div class="lib">
    <div class="ctr">
      <div class="pg-head">
        <span class="sec-num">藏书阁</span>
        <h1 class="pg-title">Library</h1>
        <p class="pg-desc">探索经典文学与现代作品的数字图书馆</p>
        <div class="rule-center"></div>
      </div>

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

      <div v-if="loading" style="display:flex;justify-content:center;padding:4rem"><div class="loader"></div></div>
      <div v-else-if="filtered.length === 0" class="empty">没有找到匹配的书籍</div>
      <div v-else ref="gridRef" class="grid">
        <div v-for="b in paged" :key="b.id" class="bk interactive" @click="go(b.id)">
          <div class="bk-cover"><img :src="b.cover" :alt="b.title" loading="lazy" /><div class="bk-over"><span>查看详情</span></div></div>
          <h3 class="bk-title">{{ b.title }}</h3>
          <p class="bk-author">{{ b.author }}</p>
        </div>
      </div>

      <div v-if="total > 1" class="pag">
        <button class="pg-btn interactive" :disabled="page === 1" @click="page--">‹</button>
        <button v-for="p in pages" :key="p" class="pg-btn interactive" :class="{ on: p === page }" @click="page = p">{{ p }}</button>
        <button class="pg-btn interactive" :disabled="page === total" @click="page++">›</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lib { position: relative; z-index: 1; padding: 2rem 0 4rem; }
.pg-head { text-align: center; margin-bottom: 3rem; opacity: 0; }
.sec-num { font-family: var(--font-mono); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; }
.pg-title { font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; letter-spacing: 0.04em; margin: 0.5rem 0; }
.pg-desc { font-size: 0.85rem; color: var(--ink-ghost); }
.flt { margin-bottom: 2.5rem; opacity: 0; }
.search { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1.1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 4px; margin-bottom: 1rem; color: var(--ink-ghost); transition: border-color 0.3s; }
.search:focus-within { border-color: var(--border-hover); }
.search-in { flex: 1; background: none; border: none; outline: none; font-size: 0.88rem; color: var(--ink); font-family: var(--font-body); }
.search-in::placeholder { color: var(--ink-ghost); }
.search-x { font-size: 1.1rem; color: var(--ink-ghost); padding: 0 0.25rem; }
.search-x:hover { color: var(--ink); }
.tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.tag-btn { padding: 0.3rem 0.8rem; font-family: var(--font-sans); font-size: 0.72rem; font-weight: 400; color: var(--ink-ghost); background: none; border: 1px solid var(--border); border-radius: 3px; transition: all 0.3s; letter-spacing: 0.03em; }
.tag-btn:hover { color: var(--ink-dim); border-color: var(--border-hover); }
.tag-btn.on { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1.75rem; margin-bottom: 3rem; }
.bk { cursor: pointer; transition: all 0.4s var(--ease); opacity: 0; }
.bk:hover { transform: translateY(-8px); }
.bk-cover { position: relative; aspect-ratio: 3/4; overflow: hidden; border-radius: 3px; border: 1px solid var(--border); margin-bottom: 0.7rem; }
.bk-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease); }
.bk:hover .bk-cover img { transform: scale(1.06); }
.bk-over { position: absolute; inset: 0; background: rgba(8,7,6,0.7); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
.bk-over span { padding: 0.35rem 0.9rem; background: var(--gold); color: var(--bg); font-family: var(--font-sans); font-size: 0.72rem; font-weight: 500; transform: translateY(8px); transition: transform 0.3s var(--ease); }
.bk:hover .bk-over { opacity: 1; }
.bk:hover .bk-over span { transform: translateY(0); }
.bk-title { font-family: var(--font-display); font-size: 0.92rem; font-weight: 600; line-height: 1.4; margin-bottom: 0.15rem; }
.bk-author { font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); }
.pag { display: flex; justify-content: center; gap: 0.35rem; }
.pg-btn { min-width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; background: none; border: 1px solid var(--border); border-radius: 3px; font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-ghost); transition: all 0.3s; }
.pg-btn:hover:not(:disabled) { color: var(--ink); border-color: var(--border-hover); }
.pg-btn.on { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }
.pg-btn:disabled { opacity: 0.2; cursor: not-allowed; }
.empty { text-align: center; padding: 4rem; color: var(--ink-ghost); font-size: 0.88rem; }
@media (max-width: 768px) { .pg-title { font-size: 2rem; } .grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem; } .tags { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 0.5rem; -webkit-overflow-scrolling: touch; } .tag-btn { white-space: nowrap; flex-shrink: 0; } }
</style>