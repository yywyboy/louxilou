<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBookByIdFromDB, type Book, type BookChapter } from '../lib/books'
import { gsap } from '../composables/useGsap'

const router = useRouter()
const route = useRoute()
const book = ref<Book | null>(null)
const lastRead = ref<{ chapterId: string; title: string } | null>(null)
const jsonLd = computed(() => {
  if (!book.value) return ''
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Book',
    'name': book.value.title,
    'author': { '@type': 'Person', 'name': book.value.author },
    'description': book.value.description,
    'url': 'https://louxilou.com.cn/library/' + book.value.id,
    'numberOfPages': book.value.chapters.length
  })
})


onMounted(async () => {
  const id = route.params.id as string
  book.value = (await getBookByIdFromDB(id)) || null
  if (book.value) document.title = `${book.value.title} — LOUXILOU`
  const prog = JSON.parse(localStorage.getItem('reader-progress') || '{}')
  if (prog[id]) lastRead.value = prog[id]
  await nextTick()
  gsap.fromTo('.back', { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 })
  gsap.fromTo('.bk-cover', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 })
  gsap.fromTo('.bk-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 })
  gsap.fromTo('.bk-author', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.4 })
  gsap.fromTo('.bk-desc', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.5 })
  const ch = document.querySelectorAll('.ch-item')
  gsap.fromTo(ch, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.6 })
})

onUnmounted(() => { gsap.killTweensOf('*') })

function goBack() { router.push('/library') }
function readCh(ch: BookChapter) { router.push(`/library/${route.params.id}/read/${ch.id}`) }
function cont() { if (lastRead.value) router.push(`/library/${route.params.id}/read/${lastRead.value.chapterId}`) }
</script>

<template>
  <div class="bd">
    <component :is="'script'" type="application/ld+json" v-if="book">{{ jsonLd }}</component>
    <div v-if="!book" style="display:flex;justify-content:center;padding:6rem"><div class="loader"></div></div>
    <template v-else>
      <button class="back interactive" @click="goBack">
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回藏书阁
      </button>

      <div class="hero">
        <div class="hero-cover"><img :src="book.cover" :alt="book.title" class="bk-cover" decoding="async" /></div>
        <div class="hero-info">
          <h1 class="bk-title">{{ book.title }}</h1>
          <p class="bk-author">{{ book.author }}</p>
          <div class="rule"></div>
          <p class="bk-desc">{{ book.description }}</p>
          <div class="bk-stat"><span class="stat-n">{{ book.chapters.length }}</span><span class="stat-l">卷</span></div>
          <button v-if="lastRead" class="cta-fill interactive" @click="cont">
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            继续阅读：{{ lastRead.title }}
          </button>
        </div>
      </div>

      <div class="ch-sec">
        <h2 class="sec-title">章节列表</h2>
        <div class="rule" style="margin-bottom:2rem"></div>
        <div class="ch-list">
          <div v-for="ch in book.chapters" :key="ch.id" class="ch-item interactive" @click="readCh(ch)">
            <img :src="ch.cover" :alt="ch.title" class="ch-thumb" loading="lazy" decoding="async" />
            <div class="ch-info"><h3 class="ch-title">{{ ch.title }}</h3><span class="ch-status" :class="ch.status === '已完结' ? 'done' : 'wip'">{{ ch.status }}</span></div>
            <div class="ch-acts">
              <button class="act-r interactive" @click.stop="readCh(ch)">阅读</button>
              <a :href="ch.txtUrl" download class="act-d interactive" @click.stop>下载</a>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.bd { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 2rem; }
.back { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.5rem 1.2rem; background: var(--bg-card); border: 1px solid var(--border-hover); border-radius: 100px; color: var(--ink-dim); font-family: var(--font-sans); font-size: 0.82rem; margin-bottom: 2.5rem; transition: all 0.3s; opacity: 0; }
.back:hover { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }
.hero { display: grid; grid-template-columns: 220px 1fr; gap: 3rem; margin-bottom: 4rem; }
.hero-cover { position: relative; }
.bk-cover { width: 100%; border-radius: 3px; border: 1px solid var(--border); opacity: 0; }
.bk-title { font-family: var(--font-display); font-size: 2rem; font-weight: 700; margin-bottom: 0.4rem; letter-spacing: 0.02em; opacity: 0; }
.bk-author { font-size: 0.9rem; color: var(--ink-ghost); opacity: 0; }
.bk-desc { font-size: 0.88rem; color: var(--ink-dim); line-height: 2; margin-bottom: 1.5rem; opacity: 0; }
.bk-stat { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 1.5rem; }
.stat-n { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--gold); }
.stat-l { font-size: 0.78rem; color: var(--ink-ghost); }
.cta-fill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.5rem; background: var(--gold); color: var(--bg); font-family: var(--font-sans); font-size: 0.78rem; font-weight: 500; transition: all 0.35s var(--ease); }
.cta-fill:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 24px var(--gold-glow); }
.ch-sec { margin-bottom: 2rem; }
.sec-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; letter-spacing: 0.04em; }
.ch-list { display: flex; flex-direction: column; gap: 0.6rem; }
.ch-item { display: flex; align-items: center; gap: 1.25rem; padding: 0.9rem 1.1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.3s var(--ease); opacity: 0; }
.ch-item:hover { border-color: var(--border-hover); transform: translateX(4px); }
.ch-thumb { width: 44px; height: 60px; object-fit: cover; border-radius: 3px; border: 1px solid var(--border); flex-shrink: 0; }
.ch-info { flex: 1; min-width: 0; }
.ch-title { font-family: var(--font-display); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ch-status { font-family: var(--font-sans); font-size: 0.65rem; padding: 0.12rem 0.45rem; border-radius: 100px; font-weight: 500; }
.ch-status.done { background: rgba(122,158,126,0.12); color: #7a9e7e; }
.ch-status.wip { background: rgba(200,164,94,0.12); color: var(--gold); }
.ch-acts { display: flex; gap: 0.4rem; flex-shrink: 0; }
.act-r, .act-d { padding: 0.3rem 0.75rem; font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; border-radius: 100px; transition: all 0.3s; text-decoration: none; border: none; cursor: pointer; }
.act-r { background: var(--gold); color: var(--bg); }
.act-r:hover { background: var(--gold-light); }
.act-d { background: none; color: var(--ink-ghost); border: 1px solid var(--border); }
.act-d:hover { color: var(--ink); border-color: var(--border-hover); }
@media (max-width: 768px) { .bd { padding: 1rem; } .hero { grid-template-columns: 1fr; gap: 2rem; text-align: center; } .hero-cover { max-width: 160px; margin: 0 auto; } .bk-title { font-size: 1.5rem; } .ch-acts { flex-direction: column; } }
</style>