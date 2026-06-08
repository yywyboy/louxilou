<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBookByIdFromDB, type Book, type BookChapter } from '../lib/books'

const router = useRouter()
const route = useRoute()
const book = ref<Book | null>(null)
const chs = ref<BookChapter[]>([])
const idx = ref(0)
const content = ref('')
const err = ref('')
const fs = ref(18)
const showNav = ref(false)
const trans = ref(false)
const transMap = ref<Record<number, string>>({})
const transSet = ref(new Set<number>())
const prog = ref(0)
const BATCH = 100
const visCount = ref(BATCH)
const loadRef = ref<HTMLElement | null>(null)
let obs: IntersectionObserver | null = null

const bookTitle = computed(() => book.value?.title || '')
const chTitle = computed(() => chs.value[idx.value]?.title || '')
const total = computed(() => chs.value.length)
const paras = computed(() => content.value ? content.value.split(/[\n\r]+/).filter(p => p.trim()).map(p => p.trim()) : [])
const visParas = computed(() => paras.value.slice(0, visCount.value))

watch(paras, () => { visCount.value = BATCH; nextTick(setupObs) })

function setupObs() {
  if (obs) obs.disconnect()
  if (!loadRef.value) return
  obs = new IntersectionObserver(e => { if (e[0].isIntersecting && visCount.value < paras.value.length) visCount.value = Math.min(visCount.value + BATCH, paras.value.length) }, { rootMargin: '200px' })
  obs.observe(loadRef.value)
}

function onScroll() { const d = document.documentElement; prog.value = d.scrollHeight > d.clientHeight ? (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 : 0 }
onUnmounted(() => { if (obs) obs.disconnect(); window.removeEventListener('scroll', onScroll) })
onMounted(() => { const s = localStorage.getItem('rf-sz'); if (s) fs.value = parseInt(s) || 18; loadCh(); window.addEventListener('scroll', onScroll, { passive: true }) })
watch(() => route.params, () => loadCh(), { deep: true })

function decode(buf: Uint8Array): string {
  const u = new TextDecoder('utf-8').decode(buf); const bad = (u.match(/�/g) || []).length; if (bad === 0) return u
  for (const enc of ['gb18030', 'gbk', 'gb2312', 'shift_jis', 'big5']) { try { const t = new TextDecoder(enc).decode(buf); if ((t.match(/�/g) || []).length < bad) return t } catch {} }
  return u
}

async function loadCh() {
  err.value = ''; content.value = ''
  const bid = route.params.bookId as string, cid = route.params.chapterId as string
  book.value = (await getBookByIdFromDB(bid)) ?? null
  if (!book.value) { err.value = '书籍不存在'; return }
  chs.value = book.value.chapters; idx.value = chs.value.findIndex(c => c.id === cid); if (idx.value === -1) idx.value = 0
  try { const r = await fetch(chs.value[idx.value].txtUrl); if (!r.ok) throw new Error(); content.value = decode(new Uint8Array(await r.arrayBuffer())); save() } catch { err.value = '无法加载章节内容' }
}

function save() { const bid = route.params.bookId as string; const cid = chs.value[idx.value]?.id; if (!bid || !cid) return; const p = JSON.parse(localStorage.getItem('rp') || '{}'); p[bid] = { chapterId: cid, title: chTitle.value, ts: Date.now() }; localStorage.setItem('rp', JSON.stringify(p)); localStorage.setItem('rf-sz', String(fs.value)) }
function goBack() { router.push(`/library/${route.params.bookId}`) }
function adjFs(d: number) { fs.value = Math.max(14, Math.min(22, fs.value + d)) }
function goChapter() { router.push(`/library/${route.params.bookId}/read/${chs.value[idx.value].id}`) }
function prev() { if (idx.value > 0) { idx.value--; goChapter() } }
function next() { if (idx.value < chs.value.length - 1) { idx.value++; goChapter() } }
function goTo(i: number) { idx.value = i; showNav.value = false; goChapter() }
function toggleTrans() { trans.value = !trans.value; if (trans.value) doTrans() }
function isEn(t: string) { const m = t.match(/[a-zA-Z]/g); return m ? m.length / t.length > 0.3 : false }
async function doTrans() { const ps = paras.value; for (let i = 0; i < ps.length && trans.value; i += 3) { const batch = []; for (let j = i; j < Math.min(i + 3, ps.length); j++) { if (!transMap.value[j] && !transSet.value.has(j) && isEn(ps[j])) batch.push(j) } if (!batch.length) continue; batch.forEach(x => transSet.value.add(x)); transSet.value = new Set(transSet.value); const res = await Promise.all(batch.map(x => trText(ps[x]))); batch.forEach((x, k) => { transMap.value[x] = res[k]; transSet.value.delete(x) }); transMap.value = { ...transMap.value }; transSet.value = new Set(transSet.value) } }
async function trText(t: string): Promise<string> { try { const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(t.slice(0, 300))}`); if (r.ok) { const d = await r.json(); if (d[0]) return d[0].map((s: string[]) => s[0]).join('') } } catch {} return '翻译失败' }

// SVG circle progress
const circleR = 14
const circleC = 2 * Math.PI * circleR
const circleOffset = computed(() => circleC - (prog.value / 100) * circleC)
</script>

<template>
  <div class="rd">
    <main class="rd-body" :style="{ fontSize: fs + 'px' }" @click="showNav = false">
      <div v-if="err" class="err">{{ err }}</div>
      <div v-else class="rd-text">
        <div class="rd-ch-header">
          <h1 class="rd-ch-title">{{ chTitle }}</h1>
        </div>
        <div v-for="(p, i) in visParas" :key="i" class="pw">
          <p class="pp">{{ p }}</p>
          <p v-if="trans && transMap[i]" class="pt">{{ transMap[i] }}</p>
          <p v-if="trans && transSet.has(i)" class="pl">翻译中…</p>
        </div>
        <div v-if="visCount < paras.length" ref="loadRef" class="lm"><div class="loader" style="width:18px;height:18px"></div></div>
      </div>
    </main>

    <!-- Bottom bar -->
    <div class="rd-bar">
      <div class="rd-bar-shell">
        <button class="mb-btn interactive" @click="goBack" title="返回">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <button class="mb-btn interactive" :class="{ on: trans }" @click="toggleTrans" title="翻译">
          <span class="mb-text">译</span>
        </button>
        <button class="mb-btn interactive" @click="adjFs(-1)" title="字号减">
          <span class="mb-text">A-</span>
        </button>
        <button class="mb-btn interactive" @click="adjFs(1)" title="字号加">
          <span class="mb-text">A+</span>
        </button>
        <button class="mb-btn interactive" @click.stop="showNav = !showNav" title="章节导航">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </button>
        <div class="mb-div"></div>
        <span class="mb-book-title">{{ bookTitle }}</span>
        <div class="mb-div"></div>
        <div class="mb-prog" @click="window.scrollTo({ top: 0, behavior: 'smooth' })" title="回到顶部">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12" fill="none" stroke="var(--border)" stroke-width="2" />
            <circle cx="14" cy="14" r="12" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" :stroke-dasharray="2 * Math.PI * 12" :stroke-dashoffset="2 * Math.PI * 12 * (1 - prog / 100)" transform="rotate(-90 14 14)" style="transition: stroke-dashoffset 0.1s linear" />
          </svg>
          <span class="mb-prog-num">{{ Math.round(prog) }}%</span>
        </div>
      </div>

      <!-- Chapter nav popup -->
      <Transition name="toc-card">
        <div v-if="showNav" class="toc-card-wrap">
          <div class="toc-card">
            <div class="toc-card-hd">
              <span class="toc-card-title">章节导航</span>
              <button class="toc-card-close interactive" @click="showNav = false">×</button>
            </div>
            <div class="toc-card-body">
              <ul class="toc-card-list">
                <li v-for="(c, i) in chs" :key="c.id">
                  <button class="toc-card-item interactive" :class="{ active: i === idx }" @click="goTo(i)">{{ c.title }}</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.rd { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }

.rd-body {
  flex: 1;
  padding: 2rem 2rem 6rem;
  max-width: 660px;
  margin: 0 auto;
  width: 100%;
  line-height: 2;
}

.rd-ch-header {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.rd-ch-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.err { text-align: center; padding: 4rem; color: var(--ink-ghost); }
.pw { margin-bottom: 1.5rem; }
.pp { margin: 0 0 0.35rem 0; text-indent: 2em; }
.pt { margin: 0; text-indent: 2em; color: var(--gold); font-size: 0.88em; opacity: 0.65; border-left: 2px solid var(--gold-dim); padding-left: 0.75rem; margin-left: 2em; line-height: 1.8; }
.pl { margin: 0; text-indent: 2em; color: var(--ink-ghost); font-size: 0.82em; font-style: italic; margin-left: 2em; }
.lm { display: flex; justify-content: center; padding: 2rem; }

/* Bottom bar */
.rd-bar {
  position: fixed;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  width: auto;
}

.rd-bar-shell {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 0.6rem;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  gap: 0;
}

.mb-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  color: var(--ink-ghost);
  transition: color 0.2s;
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
}

.mb-btn:hover, .mb-btn.on { color: var(--gold); }

.mb-text {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 500;
}

.mb-div {
  width: 1px;
  height: 20px;
  background: var(--border);
  margin: 0 0.2rem;
  flex-shrink: 0;
}

.mb-book-title {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--ink-dim);
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0.3rem;
}

.mb-prog {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
}

.mb-prog-num {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 0.45rem;
  color: var(--ink-ghost);
}

/* Chapter nav popup */
.toc-card-wrap {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  z-index: 10;
}

.toc-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  overflow: hidden;
  width: 320px;
  max-height: 50vh;
}

.toc-card-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.toc-card-title {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink);
}

.toc-card-close {
  background: none;
  border: none;
  color: var(--ink-ghost);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0 0.2rem;
  line-height: 1;
  transition: color 0.2s;
}

.toc-card-close:hover { color: var(--ink); }

.toc-card-body {
  max-height: 40vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.toc-card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-card-item {
  display: block;
  width: 100%;
  padding: 0.6rem 1rem;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  font-size: 0.82rem;
  color: var(--ink-ghost);
  transition: all 0.2s;
}

.toc-card-item:last-child { border-bottom: none; }
.toc-card-item:hover { background: var(--gold-dim); color: var(--ink); }
.toc-card-item.active { background: var(--gold-dim); color: var(--gold); font-weight: 600; }

.toc-card-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.toc-card-leave-active { transition: all 0.2s ease; }
.toc-card-enter-from { opacity: 0; transform: translateY(8px); }
.toc-card-leave-to { opacity: 0; transform: translateY(8px); }

@media (max-width: 768px) {
  .rd-body { padding: 1rem 1rem 5rem; }
  .rd-ch-title { font-size: 1.2rem; }
  .mb-book-title { max-width: 80px; font-size: 0.65rem; }
  .toc-card { width: 280px; }
}
</style>
