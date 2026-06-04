<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
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
function animCards() { nextTick(() => { const rows = document.querySelectorAll('.post-card'); if (rows.length) gsap.fromTo(rows, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }) }) }

watch(activeCat, animCards)

onMounted(async () => {
  document.title = '博客 — LOUXILOU'
  try { posts.value = await getPosts() } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()

  gsap.fromTo('.pg-head', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 })
  gsap.fromTo('.cat-bar', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 })

  const rows = document.querySelectorAll('.post-card')
  gsap.fromTo(rows, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.5 })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
  gsap.killTweensOf('*')
})
</script>

<template>
  <div class="blog">
    <div class="ctr">
      <div class="pg-head">
        <span class="sec-num">博客</span>
        <h1 class="pg-title">Blog</h1>
        <p class="pg-desc">技术思考、读书笔记与生活感悟</p>
        <div class="rule-center"></div>
      </div>

      <div class="cat-bar">
        <button v-for="c in cats" :key="c.id" class="cat-btn interactive"
          :class="{ on: activeCat === c.id }" @click="activeCat = c.id">{{ c.name }}</button>
      </div>

      <div v-if="loading" style="display:flex;justify-content:center;padding:4rem"><div class="loader"></div></div>
      <div v-else-if="filtered.length === 0" class="empty">暂无文章</div>

      <div v-else class="post-list">
        <article v-for="(post, i) in filtered" :key="post.id" class="post-card interactive" @click="go(post.id)">
          <div class="pc-head">
            <span class="pc-cat">{{ catName(post.category) }}</span>
            <span class="pc-date">{{ fmt(post.created_at) }}</span>
          </div>
          <h2 class="pc-title">{{ post.title }}</h2>
          <p class="pc-summary">{{ post.summary || (post.content || '').substring(0, 120) }}…</p>
          <div class="pc-foot">
            <span class="pc-tags" v-if="post.tags?.length">
              <span v-for="t in post.tags.slice(0, 3)" :key="t" class="pc-tag">#{{ t }}</span>
            </span>
            <span class="pc-read">阅读全文 →</span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog { position: relative; z-index: 1; padding: 2rem 0 6rem; }
.pg-head { text-align: center; margin-bottom: 2.5rem; opacity: 0; }
.sec-num { font-family: var(--font-mono); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; }
.pg-title { font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; letter-spacing: 0.04em; margin: 0.5rem 0; }
.pg-desc { font-size: 0.85rem; color: var(--ink-ghost); }

.cat-bar { display: flex; justify-content: center; gap: 0.4rem; margin-bottom: 3rem; opacity: 0; }
.cat-btn { padding: 0.35rem 1rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--ink-ghost); background: none; border: 1px solid var(--border); border-radius: 100px; transition: all 0.3s; }
.cat-btn:hover { color: var(--ink-dim); border-color: var(--border-hover); }
.cat-btn.on { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }

.post-list { display: flex; flex-direction: column; gap: 1.25rem; }
.post-card { padding: 2rem 2.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.35s var(--ease); opacity: 0; }
.post-card:hover { border-color: var(--border-hover); transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.25); }
.pc-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.pc-cat { font-family: var(--font-sans); font-size: 0.65rem; font-weight: 500; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; padding: 0.15rem 0.6rem; background: var(--gold-dim); border-radius: 3px; }
.pc-date { font-size: 0.72rem; color: var(--ink-ghost); }
.pc-title { font-family: var(--font-display); font-size: 1.35rem; font-weight: 600; line-height: 1.45; margin-bottom: 0.6rem; color: var(--ink); transition: color 0.3s; }
.post-card:hover .pc-title { color: var(--gold); }
.pc-summary { font-size: 0.88rem; color: var(--ink-ghost); line-height: 1.8; margin-bottom: 1.25rem; }
.pc-foot { display: flex; align-items: center; justify-content: space-between; }
.pc-tags { display: flex; gap: 0.4rem; }
.pc-tag { font-family: var(--font-sans); font-size: 0.65rem; color: var(--ink-vanish); }
.pc-read { font-family: var(--font-sans); font-size: 0.72rem; font-weight: 500; color: var(--ink-ghost); transition: color 0.3s; }
.post-card:hover .pc-read { color: var(--gold); }

.empty { text-align: center; padding: 4rem; color: var(--ink-ghost); }

@media (max-width: 768px) {
  .pg-title { font-size: 2rem; }
  .post-card { padding: 1.5rem; }
  .cat-bar { overflow-x: auto; flex-wrap: nowrap; justify-content: flex-start; padding-bottom: 0.5rem; }
  .cat-btn { white-space: nowrap; flex-shrink: 0; }
}
</style>