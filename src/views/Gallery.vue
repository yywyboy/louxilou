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

// 飞图动画状态
const flyImg = ref<{ src: string; x: number; y: number; w: number; h: number } | null>(null)
let origImgEl: HTMLElement | null = null
let origRect: DOMRect | null = null

// 标签轮播
const tagIdx = ref(0)
let tagTimer: ReturnType<typeof setInterval> | null = null

function startTagCycle() {
  tagIdx.value = 0
  if (tagTimer) clearInterval(tagTimer)
  tagTimer = setInterval(() => {
    if (sel.value && sel.value.catNames.length > 1) {
      tagIdx.value = (tagIdx.value + 1) % sel.value.catNames.length
    }
  }, 3000)
}

function stopTagCycle() {
  if (tagTimer) { clearInterval(tagTimer); tagTimer = null }
}

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
  const phEl = (e.currentTarget as HTMLElement).querySelector('.ph-img') as HTMLImageElement
  if (!phEl) return

  const rect = phEl.getBoundingClientRect()

  // 隐藏原图，存储原位
  origImgEl = phEl
  origRect = rect
  phEl.style.opacity = '0'

  // 设置飞图起点
  flyImg.value = {
    src: filtered.value[idx].src,
    x: rect.left, y: rect.top,
    w: rect.width, h: rect.height
  }

  selIdx.value = idx
  document.body.style.overflow = 'hidden'
  startTagCycle()

  nextTick(() => {
    const lb = document.querySelector('.lb') as HTMLElement
    const lbImg = document.querySelector('.lb-img') as HTMLImageElement
    const lbBar = document.querySelector('.lb-bar') as HTMLElement
    if (!lb || !lbImg) return

    // 背景淡入
    gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })

    // 隐藏 lightbox 图片，等飞图到位
    lbImg.style.opacity = '0'
    lbImg.style.transition = 'none'

    const targetRect = lbImg.getBoundingClientRect()

    // 飞图动画
    const fly = document.querySelector('.fly-img') as HTMLElement
    if (fly) {
      gsap.set(fly, { willChange: 'transform' })
      gsap.fromTo(fly, {
        x: 0, y: 0,
        width: rect.width, height: rect.height,
        opacity: 1, borderRadius: 6,
      }, {
        x: targetRect.left - rect.left,
        y: targetRect.top - rect.top,
        width: targetRect.width,
        height: targetRect.height,
        borderRadius: 0,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to(fly, { opacity: 0, duration: 0.15, ease: 'power1.out', onComplete: () => { flyImg.value = null } })
          lbImg.style.opacity = '1'
        }
      })
    }

    // 底部栏浮出
    if (lbBar) {
      gsap.set(lbBar, { y: 60, opacity: 0 })
      gsap.to(lbBar, { y: 0, opacity: 1, duration: 0.5, delay: 0.15, ease: 'back.out(1.2)' })
    }
  })
}

function close() {
  // 杀掉所有进行中的动画
  gsap.killTweensOf('.fly-img')
  gsap.killTweensOf('.lb')
  gsap.killTweensOf('.lb-img')
  gsap.killTweensOf('.lb-bar')

  const lb = document.querySelector('.lb') as HTMLElement
  const lbImg = document.querySelector('.lb-img') as HTMLImageElement
  const lbBar = document.querySelector('.lb-bar') as HTMLElement
  const fly = document.querySelector('.fly-img') as HTMLElement

  if (!origImgEl || !origRect) { finishClose(); return }

  let startX = 0, startY = 0, startW = 0, startH = 0

  if (fly) {
    // 飞图存在，用它的当前位置
    const flyRect = fly.getBoundingClientRect()
    startX = flyRect.left
    startY = flyRect.top
    startW = flyRect.width
    startH = flyRect.height
  } else if (lbImg) {
    // 飞图不存在，用 lightbox 图片位置
    const imgRect = lbImg.getBoundingClientRect()
    startX = imgRect.left
    startY = imgRect.top
    startW = imgRect.width
    startH = imgRect.height
  }

  // 确保飞图存在
  if (!fly) {
    flyImg.value = {
      src: sel.value?.src || '',
      x: startX, y: startY, w: startW, h: startH
    }
    nextTick(() => doCloseAnim(document.querySelector('.fly-img') as HTMLElement, startX, startY))
  } else {
    doCloseAnim(fly, startX, startY)
  }

  // 底部栏消失
  if (lbBar) gsap.to(lbBar, { y: 40, opacity: 0, duration: 0.25, ease: 'power2.in' })
  // 背景淡出
  if (lb) gsap.to(lb, { opacity: 0, duration: 0.45, ease: 'power2.inOut' })
}

function doCloseAnim(fly: HTMLElement, startX: number, startY: number) {
  if (!fly || !origRect) { finishClose(); return }

  gsap.to(fly, {
    x: origRect.left - startX,
    y: origRect.top - startY,
    width: origRect.width,
    height: origRect.height,
    borderRadius: 6,
    duration: 0.45,
    ease: 'expo.inOut',
    onComplete: () => {
      if (origImgEl) origImgEl.style.opacity = '1'
      requestAnimationFrame(() => {
        flyImg.value = null
        selIdx.value = -1
        document.body.style.overflow = ''
        origImgEl = null
        origRect = null
      })
    }
  })
}

function finishClose() {
  if (origImgEl) origImgEl.style.opacity = '1'
  flyImg.value = null
  selIdx.value = -1
  document.body.style.overflow = ''
  origImgEl = null
  origRect = null
  stopTagCycle()
}

function prev() {
  if (selIdx.value > 0) {
    selIdx.value--
    nextTick(() => {
      const lbImg = document.querySelector('.lb-img') as HTMLElement
      if (lbImg) {
        gsap.fromTo(lbImg,
          { x: 80, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }
        )
      }
    })
  }
}

function next() {
  if (selIdx.value < filtered.value.length - 1) {
    selIdx.value++
    nextTick(() => {
      const lbImg = document.querySelector('.lb-img') as HTMLElement
      if (lbImg) {
        gsap.fromTo(lbImg,
          { x: -80, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }
        )
      }
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
        <router-link to="/friends-gallery" class="friends-link interactive">查看朋友的图 →</router-link>
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
      <div v-if="sel" class="lb">
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
              <Transition name="tag-slide" mode="out-in">
                <span :key="tagIdx" class="lb-cat">{{ sel.catNames[tagIdx] }}</span>
              </Transition>
            </div>
            <div class="lb-div"></div>
            <span class="lb-counter">{{ selIdx + 1 }} / {{ filtered.length }}</span>
          </div>
        </div>
      </div>

      <!-- 飞图（独立元素，覆盖在最上层） -->
      <div v-if="flyImg" class="fly-img" :style="{ left: flyImg.x + 'px', top: flyImg.y + 'px', width: flyImg.w + 'px', height: flyImg.h + 'px' }">
        <img :src="flyImg.src" class="fly-img-inner" />
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
.friends-link { font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); text-decoration: none; letter-spacing: 0.04em; transition: color 0.3s; display: inline-block; margin-top: 0.75rem; cursor: pointer; }
.friends-link:hover { color: var(--gold); }

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

.ph-placeholder { background: var(--bg-elevated); line-height: 0; }

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
  .cat-bar { flex-wrap: wrap; justify-content: center; gap: 0.35rem; margin-bottom: 2rem; }
  .cat-btn { padding: 0.3rem 0.7rem; font-size: 0.68rem; }
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
.lb-img { max-width: 90vw; max-height: 80vh; object-fit: contain; }

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

/* 标签轮播动画 */
.tag-slide-enter-active { transition: all 0.3s ease-out; }
.tag-slide-leave-active { transition: all 0.2s ease-in; }
.tag-slide-enter-from { opacity: 0; transform: translateY(8px); }
.tag-slide-leave-to { opacity: 0; transform: translateY(-8px); }

/* 飞图 */
.fly-img {
  position: fixed; z-index: 10002; pointer-events: none;
  overflow: hidden;
}
.fly-img-inner {
  width: 100%; height: 100%; object-fit: cover; display: block;
}

@media (max-width: 768px) {
  .lb-bar-shell { padding: 0 0.6rem; }
}
</style>
