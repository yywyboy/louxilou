<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts } from '../lib/blog'
import type { Post } from '../lib/blog'
import { gsap } from '../composables/useGsap'

const router = useRouter()
const posts = ref<Post[]>([])
const loading = ref(true)
const searchQuery = ref('')

const catMap: Record<string, string> = { tech: '技术', life: '生活', reading: '读书', thoughts: '随想' }
function catName(c: string) { return catMap[c] || c || '随笔' }

const filtered = computed(() => {
  if (!searchQuery.value.trim()) return posts.value
  const q = searchQuery.value.toLowerCase()
  return posts.value.filter(p =>
    p.title.toLowerCase().includes(q) ||
    (p.summary || '').toLowerCase().includes(q) ||
    (p.tags || []).some(t => t.toLowerCase().includes(q))
  )
})

// Group by year-month
const grouped = computed(() => {
  const groups: Record<string, Post[]> = {}
  filtered.value.forEach(p => {
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
  gsap.fromTo('.search-bar', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 })
  gsap.fromTo('.archive-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.4 })
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

      <!-- Search -->
      <div class="search-bar">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQuery" type="text" placeholder="搜索文章标题、摘要或标签…" class="search-input" />
        <button v-if="searchQuery" class="search-clear interactive" @click="searchQuery = ''">×</button>
      </div>

      <div v-if="loading" style="display:flex;justify-content:center;padding:4rem"><div class="loader"></div></div>

      <div v-else-if="filtered.length === 0" class="empty">
        {{ searchQuery ? '没有找到匹配的文章' : '暂无文章' }}
      </div>

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
.pg-head { text-align: center; margin-bottom: 2rem; opacity: 0; }
.eyebrow { font-family: var(--font-sans); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.3em; text-transform: uppercase; display: block; margin-bottom: 1rem; }
.pg-title { font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; letter-spacing: 0.06em; margin-bottom: 0.75rem; }
.pg-desc { font-size: 0.88rem; color: var(--ink-ghost); letter-spacing: 0.05em; }

/* Search */
.search-bar {
  display: flex; align-items: center; gap: 0.75rem;
  max-width: 480px; margin: 0 auto 2.5rem;
  padding: 0.65rem 1rem;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--r-full);
  color: var(--ink-ghost);
  opacity: 0;
}
.search-input {
  flex: 1; background: none; border: none; outline: none;
  font-size: 0.88rem; color: var(--ink); font-family: var(--font-body);
}
.search-input::placeholder { color: var(--ink-vanish); }
.search-clear {
  background: none; border: none; color: var(--ink-ghost);
  font-size: 1.1rem; cursor: pointer; padding: 0 0.2rem;
  transition: color 0.2s;
}
.search-clear:hover { color: var(--ink); }

.empty { text-align: center; padding: 4rem; color: var(--ink-ghost); }

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
  .search-bar { margin-bottom: 2rem; }
  .ag-item { gap: 0.5rem; }
  .ag-cat { display: none; }
}
</style>
