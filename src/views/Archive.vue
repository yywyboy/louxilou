<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts } from '../lib/blog'
import type { Post } from '../lib/blog'
import { gsap } from '../composables/useGsap'

const router = useRouter()
const posts = ref<Post[]>([])
const loading = ref(true)

const catMap: Record<string, string> = { tech: '技术', life: '生活', reading: '读书', thoughts: '随想' }
function catName(c: string) { return catMap[c] || c || '随笔' }
function fmt(d: string) { if (!d) return ''; return new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }

// Group by year-month
const grouped = computed(() => {
  const groups: Record<string, Post[]> = {}
  posts.value.forEach(p => {
    const d = new Date(p.created_at)
    const key = `${d.getFullYear()}年${d.getMonth() + 1}月`
    if (!groups[key]) groups[key] = []
    groups[key].push(p)
  })
  return groups
})

function go(id: string) { router.push(`/blog/${id}`) }

onMounted(async () => {
  document.title = '归档 — LOUXILOU'
  try { posts.value = await getPosts() } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()
  gsap.fromTo('.pg-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.1 })
  gsap.fromTo('.archive-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 })
})
</script>

<template>
  <div class="archive">
    <div class="ctr">
      <header class="pg-head">
        <span class="eyebrow">Archive</span>
        <h1 class="pg-title">归档</h1>
        <p class="pg-desc">共 {{ posts.length }} 篇文章</p>
      </header>

      <div v-if="loading" style="display:flex;justify-content:center;padding:4rem"><div class="loader"></div></div>

      <div v-else class="archive-list">
        <section v-for="(items, month) in grouped" :key="month" class="archive-group">
          <h2 class="ag-title">{{ month }} <span class="ag-count">{{ items.length }} 篇</span></h2>
          <div class="ag-items">
            <article v-for="post in items" :key="post.id" class="ag-item interactive" @click="go(post.id)">
              <span class="ag-date">{{ new Date(post.created_at).getDate() }}日</span>
              <span class="ag-cat">{{ catName(post.category) }}</span>
              <h3 class="ag-post-title">{{ post.title }}</h3>
            </article>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archive { position: relative; z-index: 1; padding: 2rem 0 6rem; }
.pg-head { text-align: center; margin-bottom: 3rem; opacity: 0; }
.eyebrow { font-family: var(--font-sans); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.3em; text-transform: uppercase; display: block; margin-bottom: 1rem; }
.pg-title { font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; letter-spacing: 0.06em; margin-bottom: 0.75rem; }
.pg-desc { font-size: 0.88rem; color: var(--ink-ghost); letter-spacing: 0.05em; }

.archive-group { margin-bottom: 3rem; opacity: 0; }
.ag-title { font-family: var(--font-display); font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }
.ag-count { font-family: var(--font-mono); font-size: 0.7rem; color: var(--ink-ghost); font-weight: 400; }
.ag-items { display: flex; flex-direction: column; }
.ag-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border); cursor: pointer; transition: all 0.3s; }
.ag-item:hover { padding-left: 0.5rem; }
.ag-item:hover .ag-post-title { color: var(--gold); }
.ag-date { font-family: var(--font-mono); font-size: 0.7rem; color: var(--ink-vanish); min-width: 2.5rem; }
.ag-cat { font-family: var(--font-sans); font-size: 0.6rem; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; min-width: 3rem; }
.ag-post-title { font-family: var(--font-display); font-size: 1rem; font-weight: 500; transition: color 0.3s; }

@media (max-width: 768px) {
  .pg-title { font-size: 2.5rem; }
  .ag-item { gap: 0.5rem; }
  .ag-cat { display: none; }
}
</style>
