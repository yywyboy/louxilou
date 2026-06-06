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
</script>

<template>
  <div class="rd">
    <div class="prog" :style="{ width: prog + '%' }"></div>
    <header class="rd-hd">
      <button class="rb interactive" @click="goBack" title="返回">
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <div class="rd-center"><h2>{{ bookTitle }}</h2><p>{{ chTitle }}</p></div>
      <div class="rd-acts">
        <button class="rb interactive" :class="{ on: trans }" @click="toggleTrans" title="翻译">译</button>
        <button class="rb interactive" @click="adjFs(-1)">A-</button>
        <button class="rb interactive" @click="adjFs(1)">A+</button>
        <button class="rb rb-g interactive" @click.stop="showNav = !showNav" title="目录">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </header>

    <main class="rd-body" :style="{ fontSize: fs + 'px' }" @click="showNav = false">
      <div v-if="err" class="err">{{ err }}</div>
      <div v-else class="rd-text">
        <div v-for="(p, i) in visParas" :key="i" class="pw">
          <p class="pp">{{ p }}</p>
          <p v-if="trans && transMap[i]" class="pt">{{ transMap[i] }}</p>
          <p v-if="trans && transSet.has(i)" class="pl">翻译中…</p>
        </div>
        <div v-if="visCount < paras.length" ref="loadRef" class="lm"><div class="loader" style="width:18px;height:18px"></div></div>
      </div>
    </main>

    <!-- Chapter nav — dropdown below header -->
    <Transition name="sp">
      <div v-if="showNav" class="qn" @click.self="showNav = false">
        <div class="qn-panel">
          <div class="qn-hd"><h3>章节导航</h3><button class="rb interactive" @click="showNav = false">✕</button></div>
          <div class="qn-list">
            <button v-for="(c, i) in chs" :key="c.id" class="qn-item interactive" :class="{ on: i === idx }" @click="goTo(i)">{{ c.title }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.rd { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }
.prog { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-light)); z-index: 1001; transition: width 0.1s; }
.rd-hd {
  display: flex; align-items: center; justify-content: space-between;
  position: fixed; top: 1rem; left: 1.5rem; right: 1.5rem;
  z-index: 100;
  height: 52px;
  max-width: 900px;
  margin: 0 auto;
  left: 50%; right: auto;
  transform: translateX(-50%);
  width: calc(100% - 3rem);
  padding: 0 0.5rem 0 1.25rem;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  box-shadow: 0 4px 30px rgba(0,0,0,0.4);
}
.rd-center { text-align: center; flex: 1; padding: 0 1rem; }
.rd-center h2 { font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rd-center p { font-size: 0.68rem; color: var(--ink-ghost); margin: 0; }
.rd-acts { display: flex; gap: 0.35rem; align-items: center; }
.rb { min-width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: none; border: 1px solid var(--border); border-radius: var(--r-full); color: var(--ink-ghost); font-family: var(--font-sans); font-size: 0.72rem; font-weight: 500; transition: all 0.3s; }
.rb:hover { color: var(--ink); border-color: var(--border-hover); }
.rb.on { background: var(--gold); border-color: var(--gold); color: var(--bg); }
.rb-g { background: var(--gold); border-color: var(--gold); color: var(--bg); }
.rb-g:hover { background: var(--gold-light); }
.rd-body { flex: 1; padding: 2rem; padding-top: 80px; padding-bottom: 70px; max-width: 660px; margin: 0 auto; width: 100%; line-height: 2; }
.err { text-align: center; padding: 4rem; color: var(--ink-ghost); }
.pw { margin-bottom: 1.5rem; }
.pp { margin: 0 0 0.35rem 0; text-indent: 2em; }
.pt { margin: 0; text-indent: 2em; color: var(--gold); font-size: 0.88em; opacity: 0.65; border-left: 2px solid var(--gold-dim); padding-left: 0.75rem; margin-left: 2em; line-height: 1.8; }
.pl { margin: 0; text-indent: 2em; color: var(--ink-ghost); font-size: 0.82em; font-style: italic; margin-left: 2em; }
.lm { display: flex; justify-content: center; padding: 2rem; }
.qn {
  position: fixed; inset: 0; z-index: 10001;
  background: rgba(var(--bg-rgb),0.6);
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: calc(var(--nav-h) + 1rem);
}
.qn-panel {
  width: 320px; max-height: calc(100vh - var(--nav-h) - 2rem);
  display: flex; flex-direction: column;
  background: var(--bg-warm);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  overflow: hidden;
  box-shadow: 0 12px 48px rgba(0,0,0,0.5);
}
.qn-hd { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); }
.qn-hd h3 { margin: 0; font-family: var(--font-display); font-size: 0.88rem; font-weight: 600; }
.qn-list { flex: 1; overflow-y: auto; }
.qn-item { display: block; width: 100%; padding: 0.6rem 1rem; text-align: left; background: none; border: none; border-bottom: 1px solid var(--border); cursor: pointer; font-size: 0.82rem; color: var(--ink-ghost); transition: all 0.2s; }
.qn-item:last-child { border-bottom: none; }
.qn-item:hover { background: var(--gold-dim); color: var(--ink); }
.qn-item.on { background: var(--gold-dim); color: var(--gold); font-weight: 600; }
.sp-enter-active { transition: all 0.3s var(--ease); }
.sp-leave-active { transition: all 0.2s var(--ease); }
.sp-enter-from, .sp-leave-to { opacity: 0; }
.sp-enter-from .qn-panel { transform: translateY(-10px); }
@media (max-width: 768px) {
  .rd-hd { padding: 0.5rem 0.75rem; top: 0; }
  .rd-center h2 { font-size: 0.78rem; }
  .rd-center p { display: none; }
  .rd-body { padding: 1rem; padding-top: 56px; padding-bottom: 80px; }
  .rd-ft { padding: 0.5rem 0.75rem; padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
  .rd-acts { gap: 0.25rem; }
  .rd-acts button { padding: 0.3rem 0.5rem; font-size: 0.7rem; }
  .qn { right: 0.5rem; width: 200px; }
  .rd-body p { font-size: calc(var(--fs, 18px) * 0.95); }
}
</style>