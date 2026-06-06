<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getPost, getPosts, getComments, addComment, toggleLike, hasUserLiked, getLikeCount, subscribeToComments, formatDate } from '../lib/blog'
import type { Post, Comment } from '../lib/blog'
import { gsap } from '../composables/useGsap'

declare const marked: any
declare const hljs: any
const router = useRouter()
const route = useRoute()
const post = ref<Post | null>(null)
const allPosts = ref<Post[]>([])
const comments = ref<Comment[]>([])
const loading = ref(true)
const liked = ref(false)
const likes = ref(0)
const cName = ref('')
const cBody = ref('')
const prog = ref(0)
const showToc = ref(false)
const showScrollTop = ref(false)
const lightboxSrc = ref('')
const lightboxVisible = ref(false)
let unsub: (() => void) | null = null

// TOC
interface TocItem { id: string; text: string; level: number }
const toc = ref<TocItem[]>([])
const activeTocId = ref('')

// Reading time
const readTime = computed(() => {
  if (!post.value?.content) return 0
  const chars = post.value.content.replace(/[#*`\n\r]/g, '').length
  return Math.max(1, Math.ceil(chars / 400))
})

// Word count
const wordCount = computed(() => {
  if (!post.value?.content) return 0
  return post.value.content.replace(/[#*`\n\r]/g, '').length
})

// Parse markdown with heading IDs
const html = computed(() => {
  if (!post.value?.content) return ''
  let content = post.value.content
  // Add IDs to headings for TOC and anchor links
  content = content.replace(/^(#{1,3})\s+(.+)$/gm, (match: string, hashes: string, text: string) => {
    const id = text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '')
    return `${hashes} ${text} {#${id}}`
  })
  let parsed = marked.parse(content)
  // Highlight code blocks
  if (typeof hljs !== 'undefined') {
    parsed = parsed.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match: string, lang: string, code: string) => {
      try {
        const highlighted = hljs.highlight(decodeURIComponent(code), { language: lang }).value
        return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`
      } catch { return match }
    })
  }
  return parsed
})

// Extract TOC from content
function extractToc() {
  if (!post.value?.content) return
  const headings: TocItem[] = []
  const regex = /^(#{1,3})\s+(.+)$/gm
  let match
  while ((match = regex.exec(post.value.content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '')
    headings.push({ id, text, level })
  }
  toc.value = headings
}

// Previous/Next posts
const prevPost = computed(() => {
  if (!allPosts.value.length || !post.value) return null
  const idx = allPosts.value.findIndex(p => p.id === post.value!.id)
  return idx < allPosts.value.length - 1 ? allPosts.value[idx + 1] : null
})
const nextPost = computed(() => {
  if (!allPosts.value.length || !post.value) return null
  const idx = allPosts.value.findIndex(p => p.id === post.value!.id)
  return idx > 0 ? allPosts.value[idx - 1] : null
})

// Related posts (same category, excluding current)
const relatedPosts = computed(() => {
  if (!allPosts.value.length || !post.value) return []
  return allPosts.value
    .filter(p => p.id !== post.value!.id && p.category === post.value!.category)
    .slice(0, 3)
})

const jsonLd = computed(() => {
  if (!post.value) return ''
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.value.title,
    'description': post.value.summary || '',
    'author': { '@type': 'Person', 'name': post.value.author_name || 'LOUXILOU' },
    'datePublished': post.value.created_at,
    'dateModified': post.value.updated_at || post.value.created_at,
    'publisher': { '@type': 'Person', 'name': 'LOUXILOU' },
    'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://louxilou.com.cn/blog/' + post.value.id }
  })
})

const catMap: Record<string, string> = { tech: '技术', life: '生活', reading: '读书', thoughts: '随想' }
function catName(c: string) { return catMap[c] || c || '随笔' }
function fmtDate(d: string) { const date = new Date(d), now = new Date(), ms = now.getTime() - date.getTime(), min = Math.floor(ms/60000), hr = Math.floor(ms/3600000), day = Math.floor(ms/86400000); if (min < 1) return '刚刚'; if (min < 60) return `${min}分钟前`; if (hr < 24) return `${hr}小时前`; if (day < 7) return `${day}天前`; return formatDate(d) }
function uid() { let u = localStorage.getItem('blog_user_id'); if (!u) { u = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('blog_user_id', u) } return u }

function onScroll() {
  const d = document.documentElement
  prog.value = d.scrollHeight > d.clientHeight ? (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 : 0
  showScrollTop.value = d.scrollTop > 500

  // Update active TOC item
  const headings = document.querySelectorAll('.art-body h1, .art-body h2, .art-body h3')
  for (let i = headings.length - 1; i >= 0; i--) {
    if (headings[i].getBoundingClientRect().top <= 120) {
      activeTocId.value = headings[i].id
      break
    }
  }
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    showToc.value = false
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Share
function shareToWeibo() {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value?.title || '')
  window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${text}`)
}
function shareToTwitter() {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value?.title || '')
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`)
}
function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  alert('链接已复制')
}

// Image lightbox
function onBodyClick(e: Event) {
  const target = e.target as HTMLElement
  if (target.tagName === 'IMG' && target.closest('.art-body')) {
    lightboxSrc.value = (target as HTMLImageElement).src
    lightboxVisible.value = true
    document.body.style.overflow = 'hidden'
  }
}
function closeLightbox() {
  lightboxVisible.value = false
  document.body.style.overflow = ''
}

async function load() {
  loading.value = true
  try {
    const [p, all] = await Promise.all([getPost(route.params.id as string), getPosts()])
    post.value = p
    allPosts.value = all
    if (post.value) {
      document.title = `${post.value.title} — LOUXILOU`
      extractToc()
      await Promise.all([loadComments(), loadLike()])
      unsub = subscribeToComments(route.params.id as string, c => comments.value.push(c))
    }
  } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()
  // Add anchor links to headings
  document.querySelectorAll('.art-body h1, .art-body h2, .art-body h3').forEach(h => {
    const anchor = document.createElement('a')
    anchor.className = 'heading-anchor'
    anchor.href = '#' + h.id
    anchor.textContent = '#'
    anchor.onclick = (e) => { e.preventDefault(); scrollToHeading(h.id) }
    h.appendChild(anchor)
  })
  gsap.fromTo('.back', { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 })
  gsap.fromTo('.art-hd', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 })
  gsap.fromTo('.art-body', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.4 })
}

async function loadComments() { comments.value = await getComments(route.params.id as string) }
async function loadLike() { const u = uid(); liked.value = await hasUserLiked(route.params.id as string, u); likes.value = await getLikeCount(route.params.id as string) }
async function doLike() { const u = uid(); const s = await toggleLike(route.params.id as string, u); liked.value = s; likes.value += s ? 1 : -1 }
async function doComment() { if (!cName.value.trim() || !cBody.value.trim()) return; const c = await addComment(route.params.id as string, cName.value.trim(), cBody.value.trim()); if (c) { comments.value.push(c); cBody.value = '' } }
function goBack() { router.push('/blog') }
function goPost(id: string) { router.push(`/blog/${id}`) }

onMounted(() => { load(); window.addEventListener('scroll', onScroll, { passive: true }); document.addEventListener('click', onBodyClick) })
onUnmounted(() => { unsub?.(); window.removeEventListener('scroll', onScroll); document.removeEventListener('click', onBodyClick); gsap.killTweensOf('*') })

watch(() => route.params.id, () => { if (route.params.id) load() })
</script>

<template>
  <div class="pd">
    <component :is="'script'" type="application/ld+json" v-if="post">{{ jsonLd }}</component>
    <div class="prog" :style="{ width: prog + '%' }"></div>

    <!-- TOC toggle (desktop) -->
    <button v-if="toc.length > 2" class="toc-toggle interactive" @click="showToc = !showToc" :class="{ active: showToc }" title="目录">
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
    </button>

    <!-- TOC panel -->
    <Transition name="toc">
      <nav v-if="showToc && toc.length" class="toc-panel">
        <h3 class="toc-heading">目录</h3>
        <ul class="toc-list">
          <li v-for="item in toc" :key="item.id" :class="'toc-l' + item.level">
            <a :href="'#' + item.id" @click.prevent="scrollToHeading(item.id)" :class="{ active: activeTocId === item.id }">{{ item.text }}</a>
          </li>
        </ul>
      </nav>
    </Transition>

    <div v-if="loading" style="display:flex;justify-content:center;padding:6rem"><div class="loader"></div></div>
    <div v-else-if="!post" class="err"><p>文章不存在</p><button class="cta-fill interactive" @click="goBack">返回首页</button></div>

    <article v-else class="art">
      <button class="back interactive" @click="goBack">
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回博客
      </button>

      <header class="art-hd">
        <div class="art-meta">
          <span class="m-cat">{{ catName(post.category) }}</span>
          <span class="m-sep">·</span>
          <span class="m-date">{{ formatDate(post.created_at) }}</span>
          <span class="m-sep">·</span>
          <span class="m-views">{{ post.view_count || 0 }} 阅读</span>
          <span class="m-sep">·</span>
          <span class="m-time">约 {{ readTime }} 分钟 · {{ wordCount }} 字</span>
        </div>
        <h1 class="art-title">{{ post.title }}</h1>
        <div class="art-tags" v-if="post.tags?.length"><span v-for="t in post.tags" :key="t" class="tag">#{{ t }}</span></div>
        <div class="rule-wide" style="margin-top:2rem"></div>
      </header>

      <div v-if="post.cover" class="art-cover"><img :src="post.cover" :alt="post.title" decoding="async" /></div>

      <div class="art-body drop-cap" v-html="html"></div>

      <!-- Share buttons -->
      <div class="share-bar">
        <span class="share-label">分享</span>
        <button class="share-btn interactive" @click="shareToWeibo" title="分享到微博">微博</button>
        <button class="share-btn interactive" @click="shareToTwitter" title="分享到 Twitter">Twitter</button>
        <button class="share-btn interactive" @click="copyLink" title="复制链接">复制链接</button>
      </div>

      <!-- Like -->
      <div class="art-actions">
        <button class="like interactive" :class="{ on: liked }" @click="doLike">
          <svg viewBox="0 0 24 24" width="17" height="17" :stroke="liked ? '#c8a45e' : 'currentColor'" stroke-width="2" :fill="liked ? '#c8a45e' : 'none'"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>{{ likes }}</span>
        </button>
      </div>

      <!-- Previous/Next -->
      <nav class="post-nav" v-if="prevPost || nextPost">
        <div class="pn-item pn-prev" v-if="prevPost" @click="goPost(prevPost.id)">
          <span class="pn-label">← 上一篇</span>
          <h3 class="pn-title">{{ prevPost.title }}</h3>
        </div>
        <div class="pn-item pn-next" v-if="nextPost" @click="goPost(nextPost.id)">
          <span class="pn-label">下一篇 →</span>
          <h3 class="pn-title">{{ nextPost.title }}</h3>
        </div>
      </nav>

      <!-- Related posts -->
      <section class="related" v-if="relatedPosts.length">
        <h2 class="related-title">相关文章</h2>
        <div class="rule" style="margin-bottom:1.5rem"></div>
        <div class="related-grid">
          <article v-for="rp in relatedPosts" :key="rp.id" class="related-card interactive" @click="goPost(rp.id)">
            <h3 class="rc-title">{{ rp.title }}</h3>
            <p class="rc-summary">{{ rp.summary || '' }}</p>
            <span class="rc-date">{{ formatDate(rp.created_at) }}</span>
          </article>
        </div>
      </section>

      <!-- Comments -->
      <section class="cm-sec">
        <h2 class="cm-title">评论 ({{ comments.length }})</h2>
        <div class="rule" style="margin-bottom:2rem"></div>

        <div class="cm-form">
          <input v-model="cName" type="text" placeholder="你的名字" class="fi" />
          <textarea v-model="cBody" placeholder="写下你的想法…" class="ft" rows="3"></textarea>
          <button class="cta-fill interactive" @click="doComment">发布评论</button>
        </div>

        <div class="cm-list">
          <div v-for="c in comments" :key="c.id" class="cm">
            <div class="cm-av">{{ c.user_avatar || c.user_name?.charAt(0) || '?' }}</div>
            <div class="cm-body">
              <div class="cm-head"><span class="cm-name">{{ c.user_name }}</span><span class="cm-date">{{ fmtDate(c.created_at) }}</span></div>
              <p class="cm-text">{{ c.content }}</p>
            </div>
          </div>
        </div>

        <div v-if="!comments.length" class="no-cm"><p>还没有评论，来抢沙发吧</p></div>
      </section>
    </article>

    <!-- Image lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightboxVisible" class="lb" @click.self="closeLightbox">
          <button class="lb-close interactive" @click="closeLightbox">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img :src="lightboxSrc" class="lb-img" alt="" />
        </div>
      </Transition>
    </Teleport>

    <!-- Scroll to top -->
    <Transition name="fade">
      <button v-if="showScrollTop" class="scroll-top interactive" @click="scrollToTop" title="回到顶部">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.pd { position: relative; z-index: 1; min-height: 100vh; }
.prog { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-light)); z-index: 1001; transition: width 0.1s; }
.art { max-width: 720px; margin: 0 auto; padding: 3rem 2rem 4rem; }
.back { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.5rem 1.2rem; background: var(--bg-card); border: 1px solid var(--border-hover); border-radius: 100px; color: var(--ink-dim); font-family: var(--font-sans); font-size: 0.82rem; margin-bottom: 2.5rem; transition: all 0.3s; opacity: 0; }
.back:hover { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }
.art-hd { margin-bottom: 2.5rem; opacity: 0; }
.art-meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; font-size: 0.78rem; color: var(--ink-ghost); flex-wrap: wrap; }
.m-cat { color: var(--gold); font-family: var(--font-sans); font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; font-size: 0.68rem; }
.m-sep { opacity: 0.3; }
.m-time { font-family: var(--font-mono); font-size: 0.7rem; }
.art-title { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.4rem); font-weight: 700; line-height: 1.35; margin-bottom: 1rem; }
.art-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.tag { font-family: var(--font-sans); font-size: 0.7rem; color: var(--ink-ghost); padding: 0.12rem 0.5rem; background: var(--gold-dim); border-radius: 100px; }
.art-cover { margin-bottom: 2.5rem; border-radius: 3px; overflow: hidden; border: 1px solid var(--border); }
.art-cover img { width: 100%; display: block; }
.art-body { font-size: 1.05rem; line-height: 2.1; color: var(--ink); margin-bottom: 3rem; overflow-wrap: break-word; opacity: 0; font-weight: 300; letter-spacing: 0.01em; }
.art-body :deep(h1) { font-family: var(--font-display); font-size: 1.7rem; margin: 3rem 0 1.2rem; font-weight: 700; letter-spacing: 0.01em; scroll-margin-top: 80px; }
.art-body :deep(h2) { font-family: var(--font-display); font-size: 1.4rem; margin: 2.5rem 0 1rem; font-weight: 600; letter-spacing: 0.01em; scroll-margin-top: 80px; }
.art-body :deep(h3) { font-family: var(--font-display); font-size: 1.15rem; margin: 2rem 0 0.8rem; font-weight: 600; scroll-margin-top: 80px; }
.art-body :deep(p) { margin: 0 0 1.5rem; }
.art-body :deep(strong) { font-weight: 600; }
.art-body :deep(code) { background: var(--gold-dim); padding: 0.1rem 0.4rem; border-radius: 100px; font-family: var(--font-mono); font-size: 0.85em; }
.art-body :deep(pre) { background: var(--bg-warm); border: 1px solid var(--border); border-radius: 3px; padding: 1.25rem; overflow-x: auto; margin: 1.5rem 0; }
.art-body :deep(pre code) { background: none; padding: 0; font-size: 0.85rem; line-height: 1.7; }
.art-body :deep(a) { color: var(--gold); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.3s; }
.art-body :deep(a:hover) { border-bottom-color: var(--gold); }
.art-body :deep(blockquote) { border-left: 3px solid var(--gold); margin: 2rem 0; padding: 1rem 1.5rem; color: var(--ink-dim); font-style: italic; background: var(--gold-dim); border-radius: 0 4px 4px 0; }
.art-body :deep(ul), .art-body :deep(ol) { margin: 1rem 0; padding-left: 1.5rem; }
.art-body :deep(li) { margin: 0.3rem 0; }
.art-body :deep(img) { max-width: 100%; border-radius: 3px; margin: 1.5rem 0; cursor: pointer; transition: transform 0.3s; }
.art-body :deep(img:hover) { transform: scale(1.01); }
.art-body :deep(table) { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
.art-body :deep(th), .art-body :deep(td) { padding: 0.55rem 0.85rem; border: 1px solid var(--border); text-align: left; }
.art-body :deep(th) { background: var(--gold-dim); font-weight: 600; }

/* Heading anchor links */
.art-body :deep(.heading-anchor) { color: var(--ink-vanish); margin-left: 0.5rem; font-size: 0.8em; opacity: 0; transition: opacity 0.3s; text-decoration: none; }
.art-body :deep(h1:hover .heading-anchor),
.art-body :deep(h2:hover .heading-anchor),
.art-body :deep(h3:hover .heading-anchor) { opacity: 1; }

/* Share bar */
.share-bar { display: flex; align-items: center; gap: 0.75rem; padding: 1.5rem 0; border-top: 1px solid var(--border); margin-bottom: 1.5rem; }
.share-label { font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); }
.share-btn { padding: 0.35rem 0.85rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 100px; font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-dim); transition: all 0.3s; }
.share-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }

/* Like */
.art-actions { display: flex; justify-content: center; padding: 2rem 0; border-bottom: 1px solid var(--border); margin-bottom: 3rem; }
.like { display: flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1.15rem; background: none; border: 1px solid var(--border); border-radius: 100px; font-size: 0.88rem; color: var(--ink-ghost); transition: all 0.3s; }
.like:hover { border-color: var(--gold-dim); color: var(--gold); }
.like.on { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }

/* Previous/Next navigation */
.post-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 3rem; }
.pn-item { padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; transition: all 0.3s; }
.pn-item:hover { border-color: var(--gold); }
.pn-next { text-align: right; }
.pn-label { font-family: var(--font-sans); font-size: 0.68rem; color: var(--ink-ghost); display: block; margin-bottom: 0.4rem; }
.pn-title { font-family: var(--font-display); font-size: 0.95rem; font-weight: 600; line-height: 1.4; color: var(--ink); }

/* Related posts */
.related { margin-bottom: 3rem; }
.related-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; letter-spacing: 0.04em; }
.related-grid { display: flex; flex-direction: column; gap: 0.75rem; }
.related-card { padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; transition: all 0.3s; }
.related-card:hover { border-color: var(--gold); }
.rc-title { font-family: var(--font-display); font-size: 1rem; font-weight: 600; margin-bottom: 0.3rem; }
.rc-summary { font-size: 0.82rem; color: var(--ink-ghost); margin-bottom: 0.3rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rc-date { font-family: var(--font-mono); font-size: 0.65rem; color: var(--ink-vanish); }

/* Comments */
.cm-sec { margin-top: 2rem; }
.cm-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; letter-spacing: 0.04em; }
.cm-form { display: flex; flex-direction: column; gap: 0.65rem; padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 3px; margin-bottom: 2rem; }
.fi, .ft { width: 100%; padding: 0.55rem 0.8rem; background: var(--bg-warm); border: 1px solid var(--border); border-radius: 100px; font-size: 0.85rem; color: var(--ink); font-family: var(--font-body); outline: none; transition: border-color 0.3s; }
.fi:focus, .ft:focus { border-color: var(--border-hover); }
.fi::placeholder, .ft::placeholder { color: var(--ink-ghost); }
.ft { resize: vertical; min-height: 60px; }
.cta-fill { display: inline-flex; align-items: center; justify-content: center; padding: 0.55rem 1.15rem; background: var(--gold); color: var(--bg); font-family: var(--font-sans); font-size: 0.78rem; font-weight: 500; border: none; border-radius: 100px; cursor: pointer; transition: all 0.3s; align-self: flex-end; }
.cta-fill:hover { background: var(--gold-light); transform: translateY(-1px); }
.cm-list { display: flex; flex-direction: column; gap: 0.6rem; }
.cm { display: flex; gap: 0.9rem; padding: 1.1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 3px; }
.cm-av { width: 34px; height: 34px; background: linear-gradient(135deg, var(--gold-dim), var(--gold)); color: var(--bg); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.78rem; flex-shrink: 0; border-radius: 50%; }
.cm-body { flex: 1; }
.cm-head { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.35rem; }
.cm-name { font-weight: 600; font-size: 0.85rem; }
.cm-date { font-size: 0.68rem; color: var(--ink-ghost); }
.cm-text { margin: 0; font-size: 0.85rem; color: var(--ink-dim); line-height: 1.7; }
.no-cm { text-align: center; padding: 2.5rem; color: var(--ink-ghost); font-size: 0.85rem; }
.err { text-align: center; padding: 6rem 2rem; color: var(--ink-ghost); }
.err p { margin-bottom: 2rem; }

/* TOC */
.toc-toggle { position: fixed; top: 100px; right: 2rem; z-index: 100; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--bg-card); border: 1px solid var(--border); border-radius: 50%; color: var(--ink-ghost); transition: all 0.3s; }
.toc-toggle:hover, .toc-toggle.active { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }
.toc-panel { position: fixed; top: 150px; right: 2rem; z-index: 99; width: 240px; max-height: 60vh; overflow-y: auto; background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.toc-heading { font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--ink-dim); }
.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-list li { margin: 0; }
.toc-list a { display: block; padding: 0.3rem 0.5rem; font-size: 0.78rem; color: var(--ink-ghost); text-decoration: none; border-radius: 4px; transition: all 0.2s; line-height: 1.5; }
.toc-list a:hover { color: var(--gold); background: var(--gold-dim); }
.toc-list a.active { color: var(--gold); font-weight: 500; }
.toc-l2 { padding-left: 1rem; }
.toc-l3 { padding-left: 2rem; }
.toc-enter-active, .toc-leave-active { transition: all 0.3s var(--ease); }
.toc-enter-from, .toc-leave-to { opacity: 0; transform: translateX(10px); }

/* Scroll to top */
.scroll-top { position: fixed; bottom: 2rem; right: 2rem; z-index: 100; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--bg-card); border: 1px solid var(--border); border-radius: 50%; color: var(--ink-ghost); transition: all 0.3s; }
.scroll-top:hover { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }

/* Lightbox */
.lb { position: fixed; inset: 0; z-index: 10000; background: rgba(var(--bg-rgb),0.95); display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
.lb-img { max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 4px; }
.lb-close { position: absolute; top: 1.5rem; right: 1.5rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--bg-card); border: 1px solid var(--border); border-radius: 50%; color: var(--ink-ghost); transition: all 0.3s; cursor: pointer; }
.lb-close:hover { color: var(--gold); border-color: var(--gold); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .art { padding: 1rem; }
  .art-title { font-size: 1.5rem; }
  .art-meta { flex-wrap: wrap; gap: 0.3rem; }
  .cm { padding: 0.9rem; }
  .cm-av { width: 28px; height: 28px; font-size: 0.7rem; }
  .post-nav { grid-template-columns: 1fr; }
  .pn-next { text-align: left; }
  .toc-toggle { right: 1rem; top: 80px; width: 36px; height: 36px; }
  .toc-panel { right: 1rem; width: 200px; top: 130px; }
  .scroll-top { right: 1rem; bottom: 1rem; width: 36px; height: 36px; }
  .share-bar { flex-wrap: wrap; }
}
</style>
