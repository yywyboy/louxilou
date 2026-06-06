<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getPost, getPosts, getComments, addComment, toggleLike, hasUserLiked, getLikeCount, subscribeToComments, formatDate, toggleCommentLike, hasUserLikedComment, getCommentLikeCount } from '../lib/blog'
import type { Post, Comment } from '../lib/blog'
import { gsap } from '../composables/useGsap'
import { scrollTo as lenisScrollTo } from '../composables/useLenis'

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
const replyTo = ref<{ id: string; name: string } | null>(null)
const commentLikes = ref<Record<string, { liked: boolean; count: number }>>({})

// Nested comments
const nestedComments = computed(() => {
  const map = new Map<string, Comment[]>()
  comments.value.forEach(c => {
    const pid = c.parent_id || '_root'
    if (!map.has(pid)) map.set(pid, [])
    map.get(pid)!.push(c)
  })
  return map
})
const rootComments = computed(() => nestedComments.value.get('_root') || [])
function getReplies(parentId: string): Comment[] {
  return nestedComments.value.get(parentId) || []
}
const prog = ref(0)
const lightboxSrc = ref('')
const lightboxVisible = ref(false)
const showMobileToc = ref(false)
let unsub: (() => void) | null = null

interface TocItem { id: string; text: string; level: number }
const toc = ref<TocItem[]>([])
const activeTocId = ref('')

const readTime = computed(() => {
  if (!post.value?.content) return 0
  return Math.max(1, Math.ceil(post.value.content.replace(/[#*`\n\r]/g, '').length / 400))
})
const wordCount = computed(() => {
  if (!post.value?.content) return 0
  return post.value.content.replace(/[#*`\n\r]/g, '').length
})

const html = computed(() => {
  if (!post.value?.content) return ''
  let parsed = marked.parse(post.value.content)
  parsed = parsed.replace(/<h([1-3])>([\s\S]*?)<\/h\1>/g, (match: string, level: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '')
    return `<h${level} id="${id}">${inner}</h${level}>`
  })
  if (typeof hljs !== 'undefined') {
    parsed = parsed.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match: string, lang: string, code: string) => {
      try { return `<pre><code class="hljs language-${lang}">${hljs.highlight(decodeURIComponent(code), { language: lang }).value}</code></pre>` } catch { return match }
    })
  }
  return parsed
})

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
const relatedPosts = computed(() => {
  if (!allPosts.value.length || !post.value) return []
  return allPosts.value.filter(p => p.id !== post.value!.id && p.category === post.value!.category).slice(0, 3)
})

const jsonLd = computed(() => {
  if (!post.value) return ''
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', 'headline': post.value.title, 'description': post.value.summary || '', 'author': { '@type': 'Person', 'name': post.value.author_name || 'LOUXILOU' }, 'datePublished': post.value.created_at, 'dateModified': post.value.updated_at || post.value.created_at, 'publisher': { '@type': 'Person', 'name': 'LOUXILOU' }, 'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://louxilou.com.cn/blog/' + post.value.id } })
})

const catMap: Record<string, string> = { tech: '技术', life: '生活', reading: '读书', thoughts: '随想' }
function catName(c: string) { return catMap[c] || c || '随笔' }
function fmtDate(d: string) { const date = new Date(d), now = new Date(), ms = now.getTime() - date.getTime(), min = Math.floor(ms/60000), hr = Math.floor(ms/3600000), day = Math.floor(ms/86400000); if (min < 1) return '刚刚'; if (min < 60) return `${min}分钟前`; if (hr < 24) return `${hr}小时前`; if (day < 7) return `${day}天前`; return formatDate(d) }
function uid() { let u = localStorage.getItem('blog_user_id'); if (!u) { u = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('blog_user_id', u) } return u }

function onScroll() {
  const d = document.documentElement
  prog.value = d.scrollHeight > d.clientHeight ? (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 : 0
  const headings = document.querySelectorAll('.art-body h1, .art-body h2, .art-body h3')
  for (let i = headings.length - 1; i >= 0; i--) {
    if (headings[i].getBoundingClientRect().top <= 120) { activeTocId.value = headings[i].id; break }
  }
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) { lenisScrollTo(el.offsetTop - 80, { duration: 1.2 }) }
}

function shareToWeibo() { const url = encodeURIComponent(window.location.href); const text = encodeURIComponent(post.value?.title || ''); window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${text}`) }
function shareToTwitter() { const url = encodeURIComponent(window.location.href); const text = encodeURIComponent(post.value?.title || ''); window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`) }
function copyLink() { navigator.clipboard.writeText(window.location.href); alert('链接已复制') }

function onBodyClick(e: Event) {
  const target = e.target as HTMLElement
  if (target.tagName === 'IMG' && target.closest('.art-body')) {
    lightboxSrc.value = (target as HTMLImageElement).src
    lightboxVisible.value = true
    document.body.style.overflow = 'hidden'
  }
}
function closeLightbox() { lightboxVisible.value = false; document.body.style.overflow = '' }

async function load() {
  loading.value = true
  try {
    const [p, all] = await Promise.all([getPost(route.params.id as string), getPosts()])
    post.value = p; allPosts.value = all
    if (post.value) {
      document.title = `${post.value.title} — LOUXILOU`
      extractToc()
      await Promise.all([loadComments(), loadLike()])
      await loadCommentLikes()
      unsub = subscribeToComments(route.params.id as string, c => comments.value.push(c))
    }
  } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()
  document.querySelectorAll('.art-body h1, .art-body h2, .art-body h3').forEach(h => {
    const anchor = document.createElement('a')
    anchor.className = 'heading-anchor'
    anchor.href = '#' + h.id
    anchor.textContent = '#'
    anchor.onclick = (e) => { e.preventDefault(); scrollToHeading(h.id) }
    h.appendChild(anchor)
  })
  gsap.fromTo('.art-body', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.2 })
  gsap.fromTo('.sidebar', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 })
}

async function loadComments() { comments.value = await getComments(route.params.id as string) }
async function loadLike() { const u = uid(); liked.value = await hasUserLiked(route.params.id as string, u); likes.value = await getLikeCount(route.params.id as string) }
async function doLike() { const u = uid(); const s = await toggleLike(route.params.id as string, u); liked.value = s; likes.value += s ? 1 : -1 }
async function doComment() {
  if (!cName.value.trim() || !cBody.value.trim()) return
  const c = await addComment(route.params.id as string, cName.value.trim(), cBody.value.trim(), undefined, replyTo.value?.id, replyTo.value?.name)
  if (c) { comments.value.push(c); cBody.value = ''; replyTo.value = null }
}
function startReply(id: string, name: string) { replyTo.value = { id, name }; nextTick(() => { document.querySelector('.cm-form textarea')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }) }
function cancelReply() { replyTo.value = null }

async function loadCommentLikes() {
  const userId = uid()
  for (const c of comments.value) {
    const [liked, count] = await Promise.all([hasUserLikedComment(c.id, userId), getCommentLikeCount(c.id)])
    commentLikes.value[c.id] = { liked, count }
  }
}
async function doCommentLike(commentId: string) {
  const userId = uid()
  const liked = await toggleCommentLike(commentId, userId)
  if (!commentLikes.value[commentId]) commentLikes.value[commentId] = { liked: false, count: 0 }
  commentLikes.value[commentId].liked = liked
  commentLikes.value[commentId].count += liked ? 1 : -1
}
function goBack() { router.push('/blog') }
function goPost(id: string) { router.push(`/blog/${id}`) }

onMounted(() => { load(); window.addEventListener('scroll', onScroll, { passive: true }); document.addEventListener('click', onBodyClick) })
onUnmounted(() => { unsub?.(); window.removeEventListener('scroll', onScroll); document.removeEventListener('click', onBodyClick) })
watch(() => route.params.id, () => { if (route.params.id) load() })
</script>

<template>
  <div class="pd">
    <component :is="'script'" type="application/ld+json" v-if="post">{{ jsonLd }}</component>
    <div class="prog" :style="{ width: prog + '%' }"></div>

    <div v-if="loading" style="display:flex;justify-content:center;padding:6rem"><div class="loader"></div></div>
    <div v-else-if="!post" class="err"><p>文章不存在</p><button class="cta-fill interactive" @click="goBack">返回首页</button></div>

    <template v-else>
    <div class="layout">
      <!-- LEFT: Article content -->
      <article class="art">
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

        <!-- Comments -->
        <section class="cm-sec">
          <h2 class="cm-title">评论 ({{ comments.length }})</h2>
          <div class="rule" style="margin-bottom:2rem"></div>
          <div class="cm-form" ref="cmFormRef">
            <div v-if="replyTo" class="reply-hint">
              <span>回复 @{{ replyTo.name }}</span>
              <button class="reply-cancel interactive" @click="cancelReply">×</button>
            </div>
            <input v-model="cName" type="text" placeholder="你的名字" class="fi" />
            <textarea v-model="cBody" :placeholder="replyTo ? `回复 @${replyTo.name}…` : '写下你的想法…'" class="ft" rows="3"></textarea>
            <button class="cta-fill interactive" @click="doComment">{{ replyTo ? '发布回复' : '发布评论' }}</button>
          </div>

          <!-- Comment list with nested replies -->
          <div class="cm-list">
            <template v-for="c in rootComments" :key="c.id">
              <div class="cm">
                <div class="cm-av">{{ c.user_avatar || c.user_name?.charAt(0) || '?' }}</div>
                <div class="cm-body">
                  <div class="cm-head"><span class="cm-name">{{ c.user_name }}</span><span class="cm-date">{{ fmtDate(c.created_at) }}</span></div>
                  <p class="cm-text">{{ c.content }}</p>
                  <div class="cm-actions">
                    <button class="cm-action interactive" @click="startReply(c.id, c.user_name)">回复</button>
                    <button class="cm-action interactive" :class="{ on: commentLikes[c.id]?.liked }" @click="doCommentLike(c.id)">
                      <svg viewBox="0 0 24 24" width="12" height="12" :stroke="commentLikes[c.id]?.liked ? '#c8a45e' : 'currentColor'" stroke-width="2" :fill="commentLikes[c.id]?.liked ? '#c8a45e' : 'none'"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      <span v-if="commentLikes[c.id]?.count">{{ commentLikes[c.id].count }}</span>
                    </button>
                  </div>
                </div>
              </div>
              <!-- Nested replies -->
              <div v-for="r in getReplies(c.id)" :key="r.id" class="cm cm-reply-item">
                <div class="cm-av cm-av-sm">{{ r.user_avatar || r.user_name?.charAt(0) || '?' }}</div>
                <div class="cm-body">
                  <div class="cm-head">
                    <span class="cm-name">{{ r.user_name }}</span>
                    <span v-if="r.reply_to_name" class="cm-reply-to">回复 @{{ r.reply_to_name }}</span>
                    <span class="cm-date">{{ fmtDate(r.created_at) }}</span>
                  </div>
                  <p class="cm-text">{{ r.content }}</p>
                  <div class="cm-actions">
                    <button class="cm-action interactive" @click="startReply(c.id, r.user_name)">回复</button>
                    <button class="cm-action interactive" :class="{ on: commentLikes[r.id]?.liked }" @click="doCommentLike(r.id)">
                      <svg viewBox="0 0 24 24" width="12" height="12" :stroke="commentLikes[r.id]?.liked ? '#c8a45e' : 'currentColor'" stroke-width="2" :fill="commentLikes[r.id]?.liked ? '#c8a45e' : 'none'"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      <span v-if="commentLikes[r.id]?.count">{{ commentLikes[r.id].count }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div v-if="!comments.length" class="no-cm"><p>还没有评论，来抢沙发吧</p></div>
        </section>
      </article>

      <!-- RIGHT: Sticky sidebar -->
      <aside class="sidebar">
        <div class="sidebar-inner">
          <!-- Back button -->
          <button class="back interactive" @click="goBack">
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            返回博客
          </button>

          <!-- TOC -->
          <div class="sb-section" v-if="toc.length > 1">
            <h3 class="sb-title">目录</h3>
            <ul class="toc-list">
              <li v-for="item in toc" :key="item.id" :class="'toc-l' + item.level">
                <a :href="'#' + item.id" @click.prevent="scrollToHeading(item.id)" :class="{ active: activeTocId === item.id }">{{ item.text }}</a>
              </li>
            </ul>
          </div>

          <!-- Actions: Like + Copy Link -->
          <div class="sb-section sb-actions">
            <button class="action-btn interactive" :class="{ on: liked }" @click="doLike">
              <svg viewBox="0 0 24 24" width="16" height="16" :stroke="liked ? '#c8a45e' : 'currentColor'" stroke-width="2" :fill="liked ? '#c8a45e' : 'none'"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span>{{ likes }}</span>
            </button>
            <button class="action-btn interactive" @click="copyLink" title="复制链接">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>复制链接</span>
            </button>
          </div>

          <!-- Article info -->
          <div class="sb-section sb-info">
            <div class="sb-info-row"><span class="sb-label">分类</span><span class="sb-value">{{ catName(post.category) }}</span></div>
            <div class="sb-info-row"><span class="sb-label">字数</span><span class="sb-value">{{ wordCount }}</span></div>
            <div class="sb-info-row"><span class="sb-label">阅读</span><span class="sb-value">约 {{ readTime }} 分钟</span></div>
            <div class="sb-info-row"><span class="sb-label">浏览</span><span class="sb-value">{{ post.view_count || 0 }} 次</span></div>
          </div>

          <!-- Related posts -->
          <div class="sb-section sb-related" v-if="relatedPosts.length">
            <h3 class="sb-title">相关文章</h3>
            <div class="sb-related-list">
              <a v-for="rp in relatedPosts" :key="rp.id" class="sb-related-item interactive" @click="goPost(rp.id)">
                <h4 class="sb-rp-title">{{ rp.title }}</h4>
                <span class="sb-rp-date">{{ formatDate(rp.created_at) }}</span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Mobile: floating bottom bar -->
    <div class="mobile-bar">
      <div class="mobile-bar-shell">
        <button class="mb-btn interactive" @click="goBack" title="返回">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <button class="mb-btn interactive" :class="{ on: liked }" @click="doLike" title="点赞">
          <svg viewBox="0 0 24 24" width="15" height="15" :stroke="liked ? '#c8a45e' : 'currentColor'" stroke-width="2" :fill="liked ? '#c8a45e' : 'none'"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span class="mb-count">{{ likes }}</span>
        </button>
        <button class="mb-btn interactive" @click="copyLink" title="复制链接">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button v-if="toc.length > 1" class="mb-btn interactive" :class="{ active: showMobileToc }" @click="showMobileToc = !showMobileToc" title="目录">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </button>
        <div class="mb-div"></div>
        <div class="mb-prog" @click="lenisScrollTo(0)" title="回到顶部">
          <svg width="26" height="26" viewBox="0 0 26 26">
            <circle cx="13" cy="13" r="10.5" fill="none" stroke="var(--border)" stroke-width="2" />
            <circle cx="13" cy="13" r="10.5" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" :stroke-dasharray="2 * Math.PI * 10.5" :stroke-dashoffset="2 * Math.PI * 10.5 * (1 - prog / 100)" transform="rotate(-90 13 13)" style="transition: stroke-dashoffset 0.1s linear" />
          </svg>
          <span class="mb-prog-num">{{ Math.round(prog) }}</span>
        </div>
      </div>

      <!-- TOC card popup -->
      <Transition name="toc-card">
        <div v-if="showMobileToc" class="toc-card-wrap">
          <div class="toc-card">
            <div class="toc-card-hd">
              <span class="toc-card-title">目录</span>
              <button class="toc-card-close interactive" @click="showMobileToc = false">×</button>
            </div>
            <div class="toc-card-body">
              <ul class="toc-card-list">
                <li v-for="item in toc" :key="item.id" :class="'toc-l' + item.level">
                  <a :href="'#' + item.id" @click.prevent="scrollToHeading(item.id); showMobileToc = false" :class="{ active: activeTocId === item.id }">{{ item.text }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    </template>

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
  </div>
</template>

<style scoped>
.pd { position: relative; z-index: 1; min-height: 100vh; }
.prog { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-light)); z-index: 1001; transition: width 0.1s; }

/* Two-column layout */
.layout { display: grid; grid-template-columns: 1fr 280px; gap: 3rem; max-width: 1100px; margin: 0 auto; padding: 2rem 2rem 4rem; align-items: start; }

/* Left: Article */
.art { min-width: 0; }
.art-hd { margin-bottom: 2rem; }
.art-meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; font-size: 0.78rem; color: var(--ink-ghost); flex-wrap: wrap; }
.m-cat { color: var(--gold); font-family: var(--font-sans); font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; font-size: 0.68rem; }
.m-sep { opacity: 0.3; }
.m-time { font-family: var(--font-mono); font-size: 0.7rem; }
.art-title { font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.35; margin-bottom: 1rem; }
.art-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.tag { font-family: var(--font-sans); font-size: 0.7rem; color: var(--ink-ghost); padding: 0.12rem 0.5rem; background: var(--gold-dim); border-radius: var(--r-full); }
.art-cover { margin-bottom: 2rem; border-radius: var(--r-xs); overflow: hidden; border: 1px solid var(--border); }
.art-cover img { width: 100%; display: block; }
.art-body { font-size: 1.05rem; line-height: 2.1; color: var(--ink); margin-bottom: 3rem; overflow-wrap: break-word; font-weight: 300; letter-spacing: 0.01em; }
.art-body :deep(h1) { font-family: var(--font-display); font-size: 1.7rem; margin: 3rem 0 1.2rem; font-weight: 700; scroll-margin-top: 80px; }
.art-body :deep(h2) { font-family: var(--font-display); font-size: 1.4rem; margin: 2.5rem 0 1rem; font-weight: 600; scroll-margin-top: 80px; }
.art-body :deep(h3) { font-family: var(--font-display); font-size: 1.15rem; margin: 2rem 0 0.8rem; font-weight: 600; scroll-margin-top: 80px; }
.art-body :deep(p) { margin: 0 0 1.5rem; }
.art-body :deep(strong) { font-weight: 600; }
.art-body :deep(code) { background: var(--gold-dim); padding: 0.1rem 0.4rem; border-radius: var(--r-full); font-family: var(--font-mono); font-size: 0.85em; }
.art-body :deep(pre) { background: var(--bg-warm); border: 1px solid var(--border); border-radius: var(--r-xs); padding: 1.25rem; overflow-x: auto; margin: 1.5rem 0; }
.art-body :deep(pre code) { background: none; padding: 0; font-size: 0.85rem; line-height: 1.7; }
.art-body :deep(a) { color: var(--gold); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.3s; }
.art-body :deep(a:hover) { border-bottom-color: var(--gold); }
.art-body :deep(blockquote) { border-left: 3px solid var(--gold); margin: 2rem 0; padding: 1rem 1.5rem; color: var(--ink-dim); font-style: italic; background: var(--gold-dim); border-radius: 0 4px 4px 0; }
.art-body :deep(ul), .art-body :deep(ol) { margin: 1rem 0; padding-left: 1.5rem; }
.art-body :deep(li) { margin: 0.3rem 0; }
.art-body :deep(img) { max-width: 100%; border-radius: var(--r-xs); margin: 1.5rem 0; cursor: pointer; transition: transform 0.3s; }
.art-body :deep(img:hover) { transform: scale(1.01); }
.art-body :deep(table) { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
.art-body :deep(th), .art-body :deep(td) { padding: 0.55rem 0.85rem; border: 1px solid var(--border); text-align: left; }
.art-body :deep(th) { background: var(--gold-dim); font-weight: 600; }
.art-body :deep(.heading-anchor) { color: var(--ink-vanish); margin-left: 0.5rem; font-size: 0.8em; opacity: 0; transition: opacity 0.3s; text-decoration: none; }
.art-body :deep(h1:hover .heading-anchor), .art-body :deep(h2:hover .heading-anchor), .art-body :deep(h3:hover .heading-anchor) { opacity: 1; }

/* Right: Sidebar */
.sidebar { position: sticky; top: 100px; }
.sidebar-inner { display: flex; flex-direction: column; gap: 1.5rem; }
.sb-section { padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-sm); }
.sb-title { font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--ink-dim); letter-spacing: 0.04em; }

/* TOC */
.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-list li { margin: 0; }
.toc-list a { display: block; padding: 0.25rem 0.5rem; font-size: 0.78rem; color: var(--ink-ghost); text-decoration: none; border-radius: var(--r-xs); transition: all 0.2s; line-height: 1.5; border-left: 2px solid transparent; }
.toc-list a:hover { color: var(--gold); background: var(--gold-dim); }
.toc-list a.active { color: var(--gold); font-weight: 500; border-left-color: var(--gold); }
.toc-l2 { padding-left: 0.75rem; }
.toc-l3 { padding-left: 1.5rem; }

/* Actions */
.sb-actions { display: flex; flex-direction: column; gap: 0.5rem; }
.sb-action { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: 1px solid var(--border); border-radius: var(--r-sm); font-family: var(--font-sans); font-size: 0.75rem; color: var(--ink-ghost); transition: all 0.3s; cursor: pointer; }
.sb-action:hover { border-color: var(--gold); color: var(--gold); }
.sb-action.on { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }

/* Info */
.sb-info { display: flex; flex-direction: column; gap: 0.5rem; }
.sb-info-row { display: flex; justify-content: space-between; align-items: center; }
.sb-label { font-size: 0.72rem; color: var(--ink-ghost); }
.sb-value { font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-dim); }

/* Prev/Next */
.post-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 3rem; }
.pn-item { padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xs); cursor: pointer; transition: all 0.3s; }
.pn-item:hover { border-color: var(--gold); }
.pn-next { text-align: right; }
.pn-label { font-family: var(--font-sans); font-size: 0.68rem; color: var(--ink-ghost); display: block; margin-bottom: 0.4rem; }
.pn-title { font-family: var(--font-display); font-size: 0.95rem; font-weight: 600; line-height: 1.4; }

/* Back button */
.back { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-sm); color: var(--ink-dim); font-family: var(--font-sans); font-size: 0.78rem; transition: all 0.3s; width: 100%; justify-content: center; }
.back:hover { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); }

/* Actions: Like + Copy */
.sb-actions { display: flex; gap: 0.5rem; }
.action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.55rem 0.75rem; background: none; border: 1px solid var(--border); border-radius: var(--r-sm); color: var(--ink-ghost); font-family: var(--font-sans); font-size: 0.75rem; transition: all 0.3s; cursor: pointer; }
.action-btn:hover { border-color: var(--gold); color: var(--gold); }
.action-btn.on { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }

/* Related posts in sidebar */
.sb-related-list { display: flex; flex-direction: column; gap: 0.5rem; }
.sb-related-item { display: block; padding: 0.6rem 0.75rem; border-radius: var(--r-xs); text-decoration: none; transition: all 0.2s; cursor: pointer; }
.sb-related-item:hover { background: var(--gold-dim); }
.sb-rp-title { font-family: var(--font-display); font-size: 0.82rem; font-weight: 600; margin-bottom: 0.15rem; line-height: 1.4; color: var(--ink); }
.sb-rp-date { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ink-vanish); }

/* Comments */
.cm-sec { margin-top: 2rem; }
.cm-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; letter-spacing: 0.04em; }
.cm-form { display: flex; flex-direction: column; gap: 0.65rem; padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xs); margin-bottom: 2rem; }
.fi, .ft { width: 100%; padding: 0.55rem 0.8rem; background: var(--bg-warm); border: 1px solid var(--border); border-radius: var(--r-sm); font-size: 0.85rem; color: var(--ink); font-family: var(--font-body); outline: none; transition: border-color 0.3s; }
.fi:focus, .ft:focus { border-color: var(--border-hover); }
.ft { resize: vertical; min-height: 60px; }
.cta-fill { display: inline-flex; align-items: center; justify-content: center; padding: 0.55rem 1.15rem; background: var(--gold); color: var(--bg); font-family: var(--font-sans); font-size: 0.78rem; font-weight: 500; border: none; border-radius: var(--r-full); cursor: pointer; transition: all 0.3s; align-self: flex-end; }
.cta-fill:hover { background: var(--gold-light); }
.cm-list { display: flex; flex-direction: column; gap: 0.6rem; }
.cm { display: flex; gap: 0.9rem; padding: 1.1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xs); }
.cm-av { width: 34px; height: 34px; background: linear-gradient(135deg, var(--gold-dim), var(--gold)); color: var(--bg); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.78rem; flex-shrink: 0; border-radius: 50%; }
.cm-body { flex: 1; }
.cm-head { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.35rem; }
.cm-name { font-weight: 600; font-size: 0.85rem; }
.cm-date { font-size: 0.68rem; color: var(--ink-ghost); }
.cm-text { margin: 0; font-size: 0.85rem; color: var(--ink-dim); line-height: 1.7; }
.cm-actions { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.3rem; }
.cm-action { display: flex; align-items: center; gap: 0.25rem; font-family: var(--font-sans); font-size: 0.68rem; color: var(--ink-ghost); background: none; border: none; padding: 0; cursor: pointer; transition: color 0.2s; }
.cm-action:hover { color: var(--gold); }
.cm-action.on { color: var(--gold); }
.cm-reply-item { margin-left: 2.5rem; background: var(--bg-warm); border-color: transparent; }
.cm-av-sm { width: 26px; height: 26px; font-size: 0.65rem; }
.cm-reply-to { font-size: 0.72rem; color: var(--gold); font-weight: 400; }
.reply-hint { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--gold-dim); border-radius: var(--r-xs); font-size: 0.78rem; color: var(--gold); }
.reply-cancel { background: none; border: none; color: var(--ink-ghost); font-size: 1.1rem; cursor: pointer; padding: 0 0.25rem; }
.reply-cancel:hover { color: var(--ink); }
.no-cm { text-align: center; padding: 2.5rem; color: var(--ink-ghost); }
.err { text-align: center; padding: 6rem 2rem; color: var(--ink-ghost); }

/* Lightbox */
.lb { position: fixed; inset: 0; z-index: 10000; background: rgba(var(--bg-rgb),0.95); display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
.lb-img { max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: var(--r-xs); }
.lb-close { position: absolute; top: 1.5rem; right: 1.5rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--bg-card); border: 1px solid var(--border); border-radius: 50%; color: var(--ink-ghost); transition: all 0.3s; cursor: pointer; }
.lb-close:hover { color: var(--gold); border-color: var(--gold); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Mobile bottom bar (hidden on desktop) */
.mobile-bar { display: none; }

/* TOC card */
.toc-card-wrap { position: absolute; bottom: calc(100% + 0.5rem); left: 0; right: 0; z-index: 10; }
.toc-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl); box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden; }
.toc-card-hd { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem 0.4rem; }
.toc-card-title { font-family: var(--font-display); font-size: 0.8rem; font-weight: 600; color: var(--ink-dim); }
.toc-card-close { background: none; border: none; color: var(--ink-ghost); font-size: 1.1rem; cursor: pointer; padding: 0 0.2rem; line-height: 1; }
.toc-card-close:hover { color: var(--ink); }
.toc-card-body { max-height: 40vh; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 0 0.75rem 0.6rem; }
.toc-card-list { list-style: none; padding: 0; margin: 0; }
.toc-card-list li { margin: 0; }
.toc-card-list a { display: block; padding: 0.45rem 0.75rem; font-size: 0.82rem; color: var(--ink-ghost); text-decoration: none; border-radius: var(--r-md); transition: all 0.2s; line-height: 1.4; word-break: break-all; white-space: normal; }
.toc-card-list a:hover { color: var(--gold); background: var(--gold-dim); }
.toc-card-list a.active { color: var(--gold); font-weight: 500; background: var(--gold-dim); }
.toc-card-list .toc-l2 { padding-left: 1.5rem; }
.toc-card-list .toc-l3 { padding-left: 2.5rem; }
.toc-card-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.toc-card-leave-active { transition: all 0.2s ease; }
.toc-card-enter-from { opacity: 0; transform: translateY(8px); }
.toc-card-leave-to { opacity: 0; transform: translateY(8px); }

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; gap: 0; padding: 0.75rem 1rem 5rem; }
  .sidebar { display: none; }

  /* Floating bottom bar */
  .mobile-bar { display: block; position: fixed; bottom: 0.75rem; left: 50%; transform: translateX(-50%); z-index: 1001; width: auto; }
  .mobile-bar-shell { display: flex; align-items: center; height: 48px; padding: 0 0.6rem; background: var(--bg-card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: var(--r-full); box-shadow: 0 4px 20px rgba(0,0,0,0.08); gap: 0; }
  .mb-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: none; border: none; color: var(--ink-ghost); transition: color 0.2s; cursor: pointer; border-radius: 50%; flex-shrink: 0; }
  .mb-btn:hover, .mb-btn.on, .mb-btn.active { color: var(--gold); }
  .mb-count { font-family: var(--font-mono); font-size: 0.6rem; margin-left: 0.15rem; }
  .mb-div { width: 1px; height: 20px; background: var(--border); margin: 0 0.2rem; flex-shrink: 0; }
  .mb-prog { position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; width: 36px; height: 36px; }
  .mb-prog-num { position: absolute; font-family: var(--font-mono); font-size: 0.45rem; color: var(--ink-ghost); }

  /* Article */
  .art-title { font-size: 1.5rem; }
  .art-body { font-size: 1rem; line-height: 2; }
  .art-body :deep(h1) { font-size: 1.4rem; }
  .art-body :deep(h2) { font-size: 1.2rem; }
  .post-nav { grid-template-columns: 1fr; }
  .pn-next { text-align: left; }
  .cm-reply-item { margin-left: 1.5rem; }
  .cm { padding: 0.85rem; }
}
</style>
