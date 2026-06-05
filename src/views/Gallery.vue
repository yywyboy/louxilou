<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { getPhotos, CATEGORIES, getCategoryNames } from '../lib/gallery'
import type { Photo } from '../lib/gallery'
import { gsap, ScrollTrigger } from '../composables/useGsap'

gsap.registerPlugin(ScrollTrigger)
const photos = ref<Photo[]>([])
const loading = ref(true)
const sel = ref<any>(null)
const cats = ref<string[]>([])
const displayCount = ref(12)
const gridRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)
const allCats = [{ id: 'all', name: '全部' }, ...CATEGORIES]

const mapped = computed(() => photos.value.map((p, i) => ({ ...p, src: `/photos/${p.filename}`, alt: `Photo ${p.id}`, catNames: getCategoryNames(p.categories), idx: i + 1 })))
const filtered = computed(() => { if (!cats.value.length) return mapped.value; return mapped.value.filter(p => cats.value.every(c => p.categories.includes(c))) })
const displayed = computed(() => filtered.value.slice(0, displayCount.value))
const hasMore = computed(() => displayCount.value < filtered.value.length)

function toggle(id: string) { if (id === 'all') { cats.value = [] } else { const i = cats.value.indexOf(id); i === -1 ? cats.value.push(id) : cats.value.splice(i, 1) } }

function open(p: any) {
  sel.value = p
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    gsap.fromTo('.lb-img', { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' })
    gsap.fromTo('.lb-meta', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.2, ease: 'power3.out' })
  })
}

function close() {
  gsap.to('.lb-img', { scale: 0.95, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => { sel.value = null; document.body.style.overflow = '' } })
}

function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && sel.value) close() }

function animPhotos() {
  if (!gridRef.value) return
  const cards = gridRef.value.querySelectorAll('.ph:not(.shown)')
  gsap.fromTo(cards, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', onComplete: () => cards.forEach(c => c.classList.add('shown')) })
}

function loadMore() { if (hasMore.value) displayCount.value = Math.min(displayCount.value + 12, filtered.value.length) }

let observer: IntersectionObserver | null = null
function setupObserver() {
  if (observer) observer.disconnect()
  if (!sentinelRef.value) return
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore.value) { loadMore(); nextTick(animPhotos) }
  }, { rootMargin: '200px' })
  observer.observe(sentinelRef.value)
}

watch(cats, () => { displayCount.value = 12; nextTick(() => { animPhotos(); setupObserver() }) })

onMounted(async () => {
  document.title = '图库 — LOUXILOU'
  try { photos.value = await getPhotos() } catch (e) { console.error(e) }
  loading.value = false
  document.addEventListener('keydown', onKey)
  await nextTick()
  gsap.fromTo('.pg-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.1 })
  gsap.fromTo('.cat-bar', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.4 })
  animPhotos()
  setupObserver()
})

onUnmounted(() => { document.removeEventListener('keydown', onKey); if (observer) observer.disconnect() })
</script>

<template>
  <div class="gal">
    <div class="ctr">
      <header class="pg-head">
        <span class="eyebrow">Photography</span>
        <h1 class="pg-title">图库</h1>
        <p class="pg-desc">精选图片，记录美好瞬间</p>
      </header>

      <div class="cat-bar">
        <button v-for="c in allCats" :key="c.id" class="cat-btn interactive"
          :class="{ on: c.id === 'all' ? cats.length === 0 : cats.includes(c.id) }"
          @click="toggle(c.id)">{{ c.name }}</button>
      </div>

      <div v-if="loading" style="display:flex;justify-content:center;padding:4rem"><div class="loader"></div></div>
      <div v-else-if="filtered.length === 0" class="empty">没有找到匹配的图片</div>

      <div v-else ref="gridRef" class="grid">
        <div v-for="p in displayed" :key="p.id" class="ph interactive" @click="open(p)">
          <img :src="p.src" :alt="p.alt" loading="lazy" class="ph-img" />
          <div class="ph-over">
            <span v-for="cn in p.catNames" :key="cn" class="ph-cat">{{ cn }}</span>
          </div>
        </div>
      </div>

      <div ref="sentinelRef" class="sentinel" v-if="hasMore"><div class="loader"></div></div>
    </div>

    <!-- Lightbox — teleported to body -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="sel" class="lb" @click.self="close">
          <button class="lb-close interactive" @click="close">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            <span>关闭</span>
          </button>
          <div class="lb-body">
            <img :src="sel.src" :alt="sel.alt" class="lb-img" />
          </div>
          <div class="lb-meta">
            <div class="lb-info">
              <span class="lb-num">#{{ sel.idx }}</span>
              <div class="lb-cats">
                <span v-for="cn in sel.catNames" :key="cn" class="lb-cat">{{ cn }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.gal { position: relative; z-index: 1; padding: 2rem 0 6rem; }

.pg-head { text-align: center; margin-bottom: 3rem; opacity: 0; }
.eyebrow { font-family: var(--font-sans); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.3em; text-transform: uppercase; display: block; margin-bottom: 1rem; }
.pg-title { font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; letter-spacing: 0.06em; margin-bottom: 0.75rem; }
.pg-desc { font-size: 0.88rem; color: var(--ink-ghost); letter-spacing: 0.05em; }

.cat-bar { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem; margin-bottom: 3rem; opacity: 0; }
.cat-btn { padding: 0.35rem 1rem; font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); background: none; border: 1px solid var(--border); border-radius: 100px; transition: all 0.3s; }
.cat-btn:hover { color: var(--ink-dim); border-color: var(--border-hover); }
.cat-btn.on { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }

/* Grid — masonry with natural aspect ratios */
.grid {
  columns: 3;
  column-gap: 0.5rem;
  margin-bottom: 2rem;
}

.ph {
  break-inside: avoid;
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  cursor: pointer;
  opacity: 0;
  transition: transform 0.4s var(--ease);
}
.ph.shown { opacity: 1; }
.ph:hover { z-index: 2; transform: scale(1.01); }

.ph-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s var(--ease), filter 0.4s;
}
.ph:hover .ph-img { transform: scale(1.04); filter: brightness(1.08); }

.ph-over {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(8,7,6,0.6) 0%, transparent 40%);
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  align-items: flex-end;
  padding: 0.6rem;
  gap: 0.3rem;
}
.ph:hover .ph-over { opacity: 1; }
.ph-cat {
  padding: 0.12rem 0.45rem;
  background: rgba(159,53,58,0.2);
  backdrop-filter: blur(6px);
  border-radius: 100px;
  font-family: var(--font-sans);
  font-size: 0.6rem;
  color: var(--gold-light);
}

.sentinel { display: flex; justify-content: center; padding: 2rem; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.empty { text-align: center; padding: 4rem; color: var(--ink-ghost); }

@media (max-width: 768px) {
  .pg-title { font-size: 2.5rem; }
  .grid { columns: 2; column-gap: 0.35rem; }
  .ph { margin-bottom: 0.35rem; }
  .cat-bar { overflow-x: auto; flex-wrap: nowrap; justify-content: flex-start; padding-bottom: 0.5rem; }
  .cat-btn { white-space: nowrap; flex-shrink: 0; }
  .lb-meta { flex-direction: column; gap: 1rem; align-items: stretch; }
  .lb-close { justify-content: center; }
}
</style>

<style>
/* Lightbox — global (teleported outside scoped component) */
.lb {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(6,6,6,0.97);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 2rem;
}
.lb-body { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; min-height: 0; }
.lb-img { max-width: 90vw; max-height: 80vh; object-fit: contain; }
.lb-meta { width: 100%; max-width: 90vw; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 0 0; }
.lb-info { display: flex; align-items: center; gap: 1rem; }
.lb-num { font-family: var(--font-mono); font-size: 0.7rem; color: var(--ink-ghost); }
.lb-cats { display: flex; gap: 0.4rem; }
.lb-cat { padding: 0.2rem 0.7rem; background: rgba(159,53,58,0.12); border-radius: 100px; font-family: var(--font-sans); font-size: 0.68rem; color: var(--gold-light); }
.lb-close {
  position: absolute; top: 1.5rem; left: 1.5rem;
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  color: var(--ink-dim);
  font-family: var(--font-sans); font-size: 0.75rem;
  transition: all 0.3s; z-index: 10;
  cursor: pointer;
}
.lb-close:hover { background: rgba(159,53,58,0.15); border-color: var(--gold); color: var(--gold); }

@media (max-width: 768px) {
  .lb-meta { flex-direction: column; gap: 1rem; align-items: stretch; }
  .lb-close { justify-content: center; }
}
</style>