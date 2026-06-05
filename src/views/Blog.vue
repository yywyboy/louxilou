<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts } from '../lib/blog'
import type { Post } from '../lib/blog'
import { gsap, ScrollTrigger } from '../composables/useGsap'

gsap.registerPlugin(ScrollTrigger)
const router = useRouter()
const posts = ref<Post[]>([])
const loading = ref(true)
const activeCat = ref('all')

const cats = [
  { id: 'all', name: '全部' },
  { id: 'tech', name: '技术' },
  { id: 'reading', name: '读书' },
  { id: 'life', name: '生活' },
]

const filtered = computed(() => {
  if (activeCat.value === 'all') return posts.value
  return posts.value.filter(p => p.category === activeCat.value)
})

function go(id: string) { router.push(`/blog/${id}`) }
function fmt(d: string) { if (!d) return ''; return new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }
function catName(c: string) { return cats.find(t => t.id === c)?.name || c || '随笔' }

onMounted(async () => {
  document.title = '博客 — LOUXILOU'
  try { posts.value = await getPosts() } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()

  gsap.fromTo('.pg-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.1 })
  gsap.fromTo('.cat-bar', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.4 })

  document.querySelectorAll('.post-card').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 60%', scrub: 1 }
      }
    )
  })
})
</script>

<template>
  <div class="blog">
    <div class="ctr">
      <!-- Header -->
      <header class="pg-head">
        <span class="eyebrow">Writing</span>
        <h1 class="pg-title">博客</h1>
        <p class="pg-desc">技术思考、读书笔记与生活感悟</p>
      </header>

      <!-- Categories -->
      <div class="cat-bar">
        <button v-for="c in cats" :key="c.id" class="cat-btn interactive"
          :class="{ on: activeCat === c.id }" @click="activeCat = c.id">{{ c.name }}</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" style="display:flex;justify-content:center;padding:4rem"><div class="loader"></div></div>
      <div v-else-if="filtered.length === 0" class="empty">暂无文章</div>

      <!-- Posts -->
      <div v-else class="post-list">
        <article v-for="(post, i) in filtered" :key="post.id" class="post-card interactive" @click="go(post.id)">
          <div class="pc-left">
            <span class="pc-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="pc-date">{{ fmt(post.created_at) }}</span>
          </div>
          <div class="pc-body">
            <span class="pc-cat">{{ catName(post.category) }}</span>
            <h2 class="pc-title">{{ post.title }}</h2>
            <p class="pc-summary">{{ post.summary || (post.content || '').substring(0, 120) }}…</p>
          </div>
          <span class="pc-arrow">→</span>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog { position: relative; z-index: 1; padding: 2rem 0 6rem; }

.pg-head { text-align: center; margin-bottom: 3rem; opacity: 0; }
.eyebrow { font-family: var(--font-sans); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.3em; text-transform: uppercase; display: block; margin-bottom: 1rem; }
.pg-title { font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; letter-spacing: 0.06em; margin-bottom: 0.75rem; }
.pg-desc { font-size: 0.88rem; color: var(--ink-ghost); letter-spacing: 0.05em; }

.cat-bar { display: flex; justify-content: center; gap: 0.4rem; margin-bottom: 3.5rem; opacity: 0; }
.cat-btn { padding: 0.4rem 1.2rem; font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); background: none; border: 1px solid var(--border); border-radius: 100px; transition: all 0.3s; }
.cat-btn:hover { color: var(--ink-dim); border-color: var(--border-hover); }
.cat-btn.on { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }

.post-list { display: flex; flex-direction: column; }
.post-card {
  display: grid;
  grid-template-columns: 100px 1fr 40px;
  gap: 2rem;
  align-items: start;
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.35s var(--ease);
}
.post-card:first-child { border-top: 1px solid var(--border); }
.post-card:hover { padding-left: 1rem; }
.post-card:hover .pc-title { color: var(--gold); }
.post-card:hover .pc-arrow { transform: translateX(6px); color: var(--gold); }

.pc-left { display: flex; flex-direction: column; gap: 0.5rem; }
.pc-num { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ink-vanish); }
.pc-date { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ink-ghost); white-space: nowrap; }

.pc-cat { font-family: var(--font-sans); font-size: 0.6rem; font-weight: 500; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 0.6rem; }
.pc-title { font-family: var(--font-display); font-size: 1.6rem; font-weight: 600; line-height: 1.35; margin-bottom: 0.6rem; transition: color 0.3s; letter-spacing: 0.01em; }
.pc-summary { font-size: 0.88rem; color: var(--ink-ghost); line-height: 1.8; max-width: 550px; }

.pc-arrow { font-size: 1.2rem; color: var(--ink-vanish); transition: all 0.3s var(--ease); justify-self: center; padding-top: 0.2rem; }

.empty { text-align: center; padding: 4rem; color: var(--ink-ghost); }

@media (max-width: 768px) {
  .pg-title { font-size: 2.5rem; }
  .post-card { grid-template-columns: 1fr; gap: 0.75rem; padding: 2rem 0; }
  .pc-left { flex-direction: row; gap: 1rem; }
  .pc-title { font-size: 1.3rem; }
  .pc-arrow { display: none; }
  .cat-bar { overflow-x: auto; flex-wrap: nowrap; justify-content: flex-start; padding-bottom: 0.5rem; }
  .cat-btn { white-space: nowrap; flex-shrink: 0; }
}
</style>