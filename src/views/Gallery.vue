<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { getPhotos, CATEGORIES, getCategoryNames } from '../lib/gallery'
import type { Photo } from '../lib/gallery'
import { gsap } from '../composables/useGsap'

const photos = ref<Photo[]>([])
const loading = ref(true)
const sel = ref<any>(null)
const cats = ref<string[]>([])
const page = ref(1)
const size = 15
const gridRef = ref<HTMLElement | null>(null)
const allCats = [{ id: 'all', name: '全部' }, ...CATEGORIES]

const mapped = computed(() => photos.value.map(p => ({ ...p, src: `/photos/${p.filename}`, alt: `Photo ${p.id}`, catNames: getCategoryNames(p.categories) })))
const shown = computed(() => { if (!cats.value.length) return mapped.value; return mapped.value.filter(p => cats.value.every(c => p.categories.includes(c))) })
const total = computed(() => Math.max(1, Math.ceil(shown.value.length / size)))
const paged = computed(() => { const s = (page.value - 1) * size; return shown.value.slice(s, s + size) })
const pages = computed(() => { const t = total.value, c = page.value, p: number[] = []; for (let i = Math.max(1, c - 2); i <= Math.min(t, c + 2); i++) p.push(i); return p })

function toggle(id: string) { if (id === 'all') { cats.value = [] } else { const i = cats.value.indexOf(id); i === -1 ? cats.value.push(id) : cats.value.splice(i, 1) } }
const selIdx = computed(() => sel.value ? paged.value.findIndex((p: any) => p.id === sel.value.id) : -1)
function open(p: any) { sel.value = p; document.body.style.overflow = 'hidden'; nextTick(() => gsap.fromTo('.lb-img', { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' })) }
function close() { gsap.to('.lb-img', { scale: 0.95, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => { sel.value = null; document.body.style.overflow = '' } }) }
function lbPrev() { if (selIdx.value > 0) { sel.value = paged.value[selIdx.value - 1]; nextTick(() => gsap.fromTo('.lb-img', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' })) } }
function lbNext() { if (selIdx.value < paged.value.length - 1) { sel.value = paged.value[selIdx.value + 1]; nextTick(() => gsap.fromTo('.lb-img', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' })) } }
function onKey(e: KeyboardEvent) { if (!sel.value) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') lbPrev(); if (e.key === 'ArrowRight') lbNext() }
function animPhotos() { if (!gridRef.value) return; const c = gridRef.value.querySelectorAll('.ph'); gsap.fromTo(c, { opacity: 0, y: 30, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05, ease: 'power3.out' }) }

watch(cats, () => { page.value = 1; nextTick(animPhotos) })
watch(page, () => nextTick(animPhotos))

onMounted(async () => {
  document.title = '图库 — LOUXILOU'
  try { photos.value = await getPhotos() } catch (e) { console.error(e) }
  loading.value = false; document.addEventListener('keydown', onKey)
  await nextTick()
  gsap.fromTo('.pg-head', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 })
  gsap.fromTo('.cat-bar', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 })
  animPhotos()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
  gsap.killTweensOf('*')
})
</script>

<template>
  <div class="gal">
    <div class="ctr">
      <div class="pg-head">
        <span class="sec-num">图库</span>
        <h1 class="pg-title">Gallery</h1>
        <p class="pg-desc">精选图片，记录美好瞬间</p>
        <div class="rule-center"></div>
      </div>

      <div class="cat-bar">
        <button v-for="c in allCats" :key="c.id" class="cat-btn interactive"
          :class="{ on: c.id === 'all' ? cats.length === 0 : cats.includes(c.id) }"
          @click="toggle(c.id)">{{ c.name }}</button>
      </div>

      <div v-if="loading" style="display:flex;justify-content:center;padding:4rem"><div class="loader"></div></div>
      <div v-else-if="shown.length === 0" class="empty">没有找到匹配的图片</div>
      <div v-else ref="gridRef" class="masonry">
        <div v-for="p in paged" :key="p.id" class="ph interactive" @click="open(p)">
          <div class="ph-wrap"><img :src="p.src" :alt="p.alt" loading="lazy" class="ph-img" />
            <div class="ph-over"><span v-for="cn in p.catNames" :key="cn" class="ph-cat">{{ cn }}</span></div>
          </div>
        </div>
      </div>

      <div v-if="total > 1" class="pag">
        <button class="pg-btn interactive" :disabled="page === 1" @click="page--">‹</button>
        <button v-for="p in pages" :key="p" class="pg-btn interactive" :class="{ on: p === page }" @click="page = p">{{ p }}</button>
        <button class="pg-btn interactive" :disabled="page === total" @click="page++">›</button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="sel" class="lb" @click.self="close">
        <button class="lb-x interactive" @click="close">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <button v-if="selIdx > 0" class="lb-arrow lb-prev interactive" @click="lbPrev">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button v-if="selIdx < paged.length - 1" class="lb-arrow lb-next interactive" @click="lbNext">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 6 15 12 9 18"/></svg>
        </button>

        <div class="lb-body">
          <img :src="sel.src" :alt="sel.alt" class="lb-img" />
          <div class="lb-info">
            <div class="lb-cats"><span v-for="cn in sel.catNames" :key="cn" class="lb-cat">{{ cn }}</span></div>
            <span class="lb-counter">{{ selIdx + 1 }} / {{ paged.length }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.gal { position: relative; z-index: 1; padding: 2rem 0 4rem; }
.pg-head { text-align: center; margin-bottom: 2.5rem; opacity: 0; }
.sec-num { font-family: var(--font-mono); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; }
.pg-title { font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; letter-spacing: 0.04em; margin: 0.5rem 0; }
.pg-desc { font-size: 0.85rem; color: var(--ink-ghost); }
.cat-bar { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.35rem; margin-bottom: 2.5rem; opacity: 0; }
.cat-btn { padding: 0.35rem 1rem; font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); background: none; border: 1px solid var(--border); border-radius: 100px; transition: all 0.3s; }
.cat-btn:hover { color: var(--ink-dim); border-color: var(--border-hover); }
.cat-btn.on { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }
.masonry { columns: 3; column-gap: 0.75rem; margin-bottom: 3rem; }
.ph { break-inside: avoid; margin-bottom: 0.75rem; border-radius: 3px; overflow: hidden; cursor: pointer; transition: all 0.4s var(--ease); }
.ph:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
.ph-wrap { position: relative; overflow: hidden; }
.ph-img { width: 100%; height: auto; display: block; transition: transform 0.6s var(--ease); }
.ph:hover .ph-img { transform: scale(1.04); }
.ph-over { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,7,6,0.7) 0%, transparent 50%); opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end; padding: 0.75rem; gap: 0.35rem; }
.ph:hover .ph-over { opacity: 1; }
.ph-cat { padding: 0.15rem 0.5rem; background: rgba(200,164,94,0.15); backdrop-filter: blur(8px); border-radius: 100px; font-family: var(--font-sans); font-size: 0.65rem; color: var(--gold-light); }
.pag { display: flex; justify-content: center; gap: 0.35rem; }
.pg-btn { min-width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; background: none; border: 1px solid var(--border); border-radius: 3px; font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-ghost); transition: all 0.3s; }
.pg-btn:hover:not(:disabled) { color: var(--ink); border-color: var(--border-hover); }
.pg-btn.on { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }
.pg-btn:disabled { opacity: 0.2; cursor: not-allowed; }
.lb { position: fixed; inset: 0; z-index: 10000; background: rgba(8,7,6,0.94); backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; padding: 2rem; }
.lb-x { position: absolute; top: 1.5rem; right: 1.5rem; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(200,164,94,0.08); border-radius: 50%; color: var(--ink-dim); transition: all 0.3s; z-index: 10; }
.lb-x:hover { background: rgba(200,164,94,0.15); color: var(--ink); transform: rotate(90deg); }
.lb-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: rgba(200,164,94,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 50%; color: var(--ink-ghost); transition: all 0.3s; z-index: 10; }
.lb-arrow:hover { background: rgba(200,164,94,0.15); color: var(--ink); border-color: rgba(255,255,255,0.12); }
.lb-prev { left: 1.5rem; }
.lb-next { right: 1.5rem; }
.lb-body { max-width: 90vw; max-height: 85vh; display: flex; flex-direction: column; align-items: center; gap: 0; }
.lb-img { max-width: 100%; max-height: 78vh; object-fit: contain; border-radius: 4px; border: 1px solid rgba(255,255,255,0.04); }
.lb-info { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 100%; padding: 0.75rem 0.25rem 0; }
.lb-cats { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.lb-cat { padding: 0.25rem 0.8rem; background: rgba(200,164,94,0.1); border: 1px solid rgba(200,164,94,0.15); border-radius: 100px; font-family: var(--font-sans); font-size: 0.72rem; color: var(--gold-light); }
.lb-counter { font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-ghost); letter-spacing: 0.05em; flex-shrink: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.empty { text-align: center; padding: 4rem; color: var(--ink-ghost); }
@media (max-width: 1024px) { .masonry { columns: 2; } }
@media (max-width: 768px) { .pg-title { font-size: 2rem; } .masonry { columns: 2; column-gap: 0.5rem; } .ph { margin-bottom: 0.5rem; } .cat-bar { overflow-x: auto; flex-wrap: nowrap; justify-content: flex-start; padding-bottom: 0.5rem; } .cat-btn { white-space: nowrap; flex-shrink: 0; } .lb { padding: 1rem; } .lb-arrow { width: 36px; height: 36px; } .lb-prev { left: 0.5rem; } .lb-next { right: 0.5rem; } .lb-x { top: 0.75rem; right: 0.75rem; } }
</style>