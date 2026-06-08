<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { getPhotos, CATEGORIES, getCategoryNames } from '../lib/gallery'
import type { Photo } from '../lib/gallery'
import { getR2Url } from '../lib/r2-utils'
import { gsap } from '../composables/useGsap'

const photos = ref<Photo[]>([])
const loading = ref(true)
const selIdx = ref<number>(-1)
const cats = ref<string[]>([])
const displayCount = ref(12)
const gridRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)
const allCats = [{ id: 'all', name: '全部' }, ...CATEGORIES]

// 存储点击位置
const originRect = ref<DOMRect | null>(null)
const clickedEl = ref<HTMLElement | null>(null)

const mapped = computed(() => photos.value.map((p, i) => ({
  ...p,
  src: getR2Url(`gallery/photos/${p.filename}`),
  alt: `Photo ${p.id}`,
  catNames: getCategoryNames(p.categories),
  idx: i + 1,
})))

const filtered = computed(() => {
  if (!cats.value.length) return mapped.value
  return mapped.value.filter(p => cats.value.some(c => p.categories.includes(c)))
})

const displayed = computed(() => filtered.value.slice(0, displayCount.value))
const hasMore = computed(() => displayCount.value < filtered.value.length)
const sel = computed(() => selIdx.value >= 0 ? filtered.value[selIdx.value] : null)

const catCounts = computed(() => {
  const counts: Record<string, number> = { all: mapped.value.length }
  CATEGORIES.forEach(c => {
    counts[c.id] = mapped.value.filter(p => p.categories.includes(c.id)).length
  })
  return counts
})

function toggle(id: string) {
  if (id === 'all') { cats.value = [] }
  else { const i = cats.value.indexOf(id); i === -1 ? cats.value.push(id) : cats.value.splice(i, 1) }
}

function open(idx: number, e: MouseEvent) {
  const phEl = (e.target as HTMLElement).closest('.ph') as HTMLElement
  if (!phEl) return

  const imgEl = phEl.querySelector('.ph-img') as HTMLElement
  if (!imgEl) return

  originRect.value = imgEl.getBoundingClientRect()
  clickedEl.value = phEl
  selIdx.value = idx
  document.body.style.overflow = 'hidden'

  // 隐藏原图
  phEl.style.visibility = 'hidden'

  nextTick(() => {
    const lb = document.querySelector('.lb') as HTMLElement
    const lbImg = document.querySelector('.lb-img') as HTMLElement
    const lbBar = document.querySelector('.lb-bar') as HTMLElement
    if (!lb || !lbImg || !originRect.value) return

    // 背景初始透明
    gsap.set(lb, { opacity: 0 })
    gsap.to(lb, { opacity: 1, duration: 0.35, ease: 'power2.out' })

    // 计算目标位置（屏幕中央）
    const targetRect = lbImg.getBoundingClientRect()
    const dx = originRect.value.left - targetRect.left
    const dy = originRect.value.top - targetRect.top
    const scaleX = originRect.value.width / targetRect.width
    const scaleY = originRect.value.height / targetRect.height

    // 图片从原位放大到中央
    gsap.set(lbImg, { x: dx, y: dy, scaleX, scaleY, borderRadius: '6px' })
    gsap.to(lbImg, {
      x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 0,
      duration: 0.5, ease: 'power3.out'
    })

    // 底部栏浮出
    if (lbBar) {
      gsap.set(lbBar, { y: 60, opacity: 0 })
      gsap.to(lbBar, { y: 0, opacity: 1, duration: 0.4, delay: 0.25, ease: 'power3.out' })
    }
  })
}

function close() {
  const lb = document.querySelector('.lb') as HTMLElement
  const lbImg = document.querySelector('.lb-img') as HTMLElement
  const lbBar = document.querySelector('.lb-bar') as HTMLElement

  if (!lb || !lbImg || !originRect.value) {
    doClose()
    return
  }

  const targetRect = lbImg.getBoundingClientRect()
  const dx = originRect.value.left - targetRect.left
  const dy = originRect.value.top - targetRect.top
  const scaleX = originRect.value.width / targetRect.width
  const scaleY = originRect.value.height / targetRect.height

  // 底部栏先消失
  if (lbBar) {
    gsap.to(lbBar, { y: 30, opacity: 0, duration: 0.2, ease: 'power2.in' })
  }

  // 背景淡出
  gsap.to(lb, { opacity: 0, duration: 0.4, delay: 0.15, ease: 'power2.in' })

  // 图片缩放回原位
  gsap.to(lbImg, {
    x: dx, y: dy, scaleX, scaleY, borderRadius: '6px',
    duration: 0.4, ease: 'power3.in',
    onComplete: doClose
  })
}

function doClose() {
  // 恢复原图可见
  if (clickedEl.value) {
    clickedEl.value.style.visibility = ''
  }
  selIdx.value = -1
  document.body.style.overflow = ''
  originRect.value = null
  clickedEl.value = null
}

function prev() {
  if (selIdx.value > 0) {
    selIdx.value--
    nextTick(() => {
      const lbImg = document.querySelector('.lb-img') as HTMLElement
      if (lbImg) gsap.fromTo(lbImg, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power3.out' })
    })
  }
}

function next() {
  if (selIdx.value < filtered.value.length - 1) {
    selIdx.value++
    nextTick(() => {
      const lbImg = document.querySelector('.lb-img') as HTMLElement
      if (lbImg) gsap.fromTo(lbImg, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power3.out' })
    })
  }
}

function onKey(e: KeyboardEvent) {
  if (!sel.value) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

function animPhotos() {
  if (!gridRef.value) return
  const cards = gridRef.value.querySelectorAll('.ph:not(.shown)')
  if (!cards.length) return
  gsap.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: 'power3.out', onComplete: () => cards.forEach(c => c.classList.add('shown')) })
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

watch(cats, () => {
  displayCount.value = 12
  nextTick(() => {
    if (gridRef.value) gridRef.value.querySelectorAll('.ph').forEach(c => c.classList.add('shown'))
    setupObserver()
  })
})

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
          @click="toggle(c.id)">
          {{ c.name }}
          <span class="cat-count">{{ catCounts[c.id] || 0 }}</span>
        </button>
      </div>

      <div v-if="loading" class="skeleton-grid">
        <div v-for="i in 9" :key="i" class="skeleton-card"><div class="skeleton-img"></div></div>
      </div>

      <div v-else-if="filtered.length === 0" class="empty">没有找到匹配的图片</div>

      <div v-else ref="gridRef" class="grid">
        <div v-for="(p, i) in displayed" :key="p.id" class="ph interactive shown" @click="open(i, $event)">
          <div class="ph-placeholder">
            <img :src="p.src" :alt="p.alt" loading="lazy" class="ph-img" />
          </div>
          <div class="ph-over">
            <span v-for="cn in p.catNames" :key="cn" class="ph-cat">{{ cn }}</span>
          </div>
        </div>
      </div>

      <div ref="sentinelRef" class="sentinel" v-if="hasMore"><div class="loader"></div></div>

      <div v-if="!loading && filtered.length > 0" class="counter">共 {{ filtered.length }} 张图片</div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="sel" class="lb" @click.self="close">
        <div class="lb-body" @click.self="close">
          <img :src="sel.src" :alt="sel.alt" class="lb-img" decoding="async" />
        </div>

        <div class="lb-bar">
          <div class="lb-bar-shell">
            <button class="lb-btn interactive" @click="close" title="关闭">
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div class="lb-div"></div>
            <button class="lb-btn interactive" @click.stop="prev" :disabled="selIdx <= 0" title="上一张">
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button class="lb-btn interactive" @click.stop="next" :disabled="selIdx >= filtered.length - 1" title="下一张">
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <div class="lb-div"></div>
            <span class="lb-num">#{{ sel.idx }}</span>
            <div class="lb-cats">
              <span v-for="cn in sel.catNames" :key="cn" class="lb-cat">{{ cn }}</span>
            </div>
            <div class="lb-div"></div>
            <span class="lb-counter">{{ selIdx + 1 }} / {{ filtered.length }}</span>
          </div>
        </div>
      </div>
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
.cat-btn { padding: 0.35rem 1rem; font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); background: none; border: 1px solid var(--border); border-radius: var(--r-full); transition: all 0.3s; display: flex; align-items: center; gap: 0.4rem; }
.cat-btn:hover { color: var(--ink-dim); border-color: var(--border-hover); }
.cat-btn.on { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }
.cat-count { font-family: var(--font-mono); font-size: 0.6rem; opacity: 0.6; }

.skeleton-grid { columns: 3; column-gap: 0.5rem; }
.skeleton-card { break-inside: avoid; margin-bottom: 0.5rem; }
.skeleton-img {
  width: 100%; height: 200px;
  background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-warm) 50%, var(--bg-elevated) 75%);
  background-size: 200% 100%; animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: var(--r-xs);
}
@keyframes skeleton-pulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.grid { columns: 3; column-gap: 0.5rem; margin-bottom: 2rem; }

.ph {
  break-inside: avoid; margin-bottom: 0.5rem; position: relative;
  overflow: hidden; border-radius: var(--r-xs); cursor: pointer;
  opacity: 0; transition: transform 0.4s var(--ease);
}
.ph.shown { opacity: 1; }
.ph:hover { z-index: 2; transform: scale(1.01); }

.ph-placeholder { background: var(--bg-elevated); min-height: 100px; }

.ph-img {
  width: 100%; height: auto; display: block;
  transition: transform 0.5s var(--ease), filter 0.4s;
}
.ph:hover .ph-img { transform: scale(1.04); filter: brightness(1.08); }

.ph-over {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(var(--bg-rgb),0.6) 0%, transparent 40%);
  opacity: 0; transition: opacity 0.3s;
  display: flex; align-items: flex-end; padding: 0.6rem; gap: 0.3rem;
}
.ph:hover .ph-over { opacity: 1; }
.ph-cat {
  padding: 0.12rem 0.45rem; background: rgba(159,53,58,0.2);
  backdrop-filter: blur(6px); border-radius: var(--r-full);
  font-family: var(--font-sans); font-size: 0.6rem; color: var(--gold-light);
}

.sentinel { display: flex; justify-content: center; padding: 2rem; }
.counter { text-align: center; font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-ghost); padding: 1rem 0; }
.empty { text-align: center; padding: 4rem; color: var(--ink-ghost); }

@media (max-width: 768px) {
  .pg-title { font-size: 2.5rem; }
  .grid { columns: 2; column-gap: 0.3rem; }
  .ph { margin-bottom: 0.3rem; }
  .skeleton-grid { columns: 2; }
  .cat-bar { overflow-x: auto; flex-wrap: nowrap; justify-content: flex-start; padding-bottom: 0.5rem; -webkit-overflow-scrolling: touch; }
  .cat-btn { white-space: nowrap; flex-shrink: 0; padding: 0.3rem 0.8rem; }
}
</style>

<style>
/* Lightbox — global */
.lb {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(var(--bg-rgb),0.97);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.lb-body {
  flex: 1; display: flex; align-items: center; justify-content: center;
  width: 100%; min-height: 0; padding: 2rem;
}
.lb-img { max-width: 90vw; max-height: 80vh; object-fit: contain; will-change: transform; }

.lb-bar {
  position: fixed; bottom: 0.75rem; left: 50%; transform: translateX(-50%);
  z-index: 10001;
}
.lb-bar-shell {
  display: flex; align-items: center; height: 48px; padding: 0 0.8rem;
  background: var(--bg-card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border); border-radius: var(--r-full);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08); gap: 0;
}
.lb-btn {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; background: none; border: none;
  color: var(--ink-ghost); transition: color 0.2s; cursor: pointer;
  border-radius: 50%; flex-shrink: 0;
}
.lb-btn:hover { color: var(--gold); }
.lb-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.lb-div { width: 1px; height: 20px; background: var(--border); margin: 0 0.4rem; flex-shrink: 0; }
.lb-num { font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-ghost); padding: 0 0.3rem; }
.lb-cats { display: flex; gap: 0.3rem; padding: 0 0.3rem; }
.lb-cat {
  padding: 0.15rem 0.5rem; background: var(--gold-dim); border-radius: var(--r-full);
  font-family: var(--font-sans); font-size: 0.65rem; color: var(--gold);
}
.lb-counter { font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-ghost); white-space: nowrap; }

@media (max-width: 768px) {
  .lb-bar-shell { padding: 0 0.6rem; }
}
</style>
