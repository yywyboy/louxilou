<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getPost, getComments, addComment, toggleLike, hasUserLiked, getLikeCount, subscribeToComments, formatDate } from '../lib/blog'
import type { Post, Comment } from '../lib/blog'
import { gsap } from '../composables/useGsap'

declare const marked: any
const router = useRouter()
const route = useRoute()
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)
const liked = ref(false)
const likes = ref(0)
const cName = ref('')
const cBody = ref('')
const prog = ref(0)
let unsub: (() => void) | null = null

const html = computed(() => post.value?.content ? marked.parse(post.value.content) : '')
const catMap: Record<string, string> = { tech: '技术', life: '生活', reading: '读书', thoughts: '随想' }
function catName(c: string) { return catMap[c] || c || '随笔' }
function fmtDate(d: string) { const date = new Date(d), now = new Date(), ms = now.getTime() - date.getTime(), min = Math.floor(ms/60000), hr = Math.floor(ms/3600000), day = Math.floor(ms/86400000); if (min < 1) return '刚刚'; if (min < 60) return `${min}分钟前`; if (hr < 24) return `${hr}小时前`; if (day < 7) return `${day}天前`; return formatDate(d) }
function uid() { let u = localStorage.getItem('blog_user_id'); if (!u) { u = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('blog_user_id', u) } return u }
function onScroll() { const d = document.documentElement; prog.value = d.scrollHeight > d.clientHeight ? (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 : 0 }

async function load() {
  loading.value = true
  try { post.value = await getPost(route.params.id as string); if (post.value) { document.title = `${post.value.title} — LOUXILOU`; await Promise.all([loadComments(), loadLike()]); unsub = subscribeToComments(route.params.id as string, c => comments.value.push(c)) } } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()
  gsap.fromTo('.back', { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 })
  gsap.fromTo('.art-hd', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 })
  gsap.fromTo('.art-body', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.4 })
}

async function loadComments() { comments.value = await getComments(route.params.id as string) }
async function loadLike() { const u = uid(); liked.value = await hasUserLiked(route.params.id as string, u); likes.value = await getLikeCount(route.params.id as string) }
async function doLike() { const u = uid(); const s = await toggleLike(route.params.id as string, u); liked.value = s; likes.value += s ? 1 : -1 }
async function doComment() { if (!cName.value.trim() || !cBody.value.trim()) return; const c = await addComment(route.params.id as string, cName.value.trim(), cBody.value.trim()); if (c) { comments.value.push(c); cBody.value = '' } }
function goBack() { router.push('/') }

onMounted(() => { load(); window.addEventListener('scroll', onScroll, { passive: true }) })
onUnmounted(() => { unsub?.(); window.removeEventListener('scroll', onScroll); gsap.killTweensOf('*') })
</script>

<template>
  <div class="pd">
    <div class="prog" :style="{ width: prog + '%' }"></div>

    <div v-if="loading" style="display:flex;justify-content:center;padding:6rem"><div class="loader"></div></div>
    <div v-else-if="!post" class="err"><p>文章不存在</p><button class="cta-fill interactive" @click="goBack">返回首页</button></div>

    <article v-else class="art">
      <button class="back interactive" @click="goBack">
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回
      </button>

      <header class="art-hd">
        <div class="art-meta">
          <span class="m-cat">{{ catName(post.category) }}</span>
          <span class="m-sep">·</span>
          <span class="m-date">{{ formatDate(post.created_at) }}</span>
          <span class="m-sep">·</span>
          <span class="m-views">{{ post.view_count || 0 }} 阅读</span>
        </div>
        <h1 class="art-title">{{ post.title }}</h1>
        <div class="art-tags" v-if="post.tags?.length"><span v-for="t in post.tags" :key="t" class="tag">#{{ t }}</span></div>
        <div class="rule-wide" style="margin-top:2rem"></div>
      </header>

      <div v-if="post.cover" class="art-cover"><img :src="post.cover" :alt="post.title" /></div>

      <div class="art-body drop-cap" v-html="html"></div>

      <div class="art-actions">
        <button class="like interactive" :class="{ on: liked }" @click="doLike">
          <svg viewBox="0 0 24 24" width="17" height="17" :stroke="liked ? '#c8a45e' : 'currentColor'" stroke-width="2" :fill="liked ? '#c8a45e' : 'none'"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>{{ likes }}</span>
        </button>
      </div>

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
  </div>
</template>

<style scoped>
.pd { position: relative; z-index: 1; min-height: 100vh; }
.prog { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-light)); z-index: 1001; transition: width 0.1s; }
.art { max-width: 720px; margin: 0 auto; padding: 3rem 2rem 4rem; }
.back { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.8rem; background: none; border: 1px solid var(--border); border-radius: 3px; color: var(--ink-ghost); font-family: var(--font-sans); font-size: 0.75rem; margin-bottom: 2.5rem; transition: all 0.3s; opacity: 0; }
.back:hover { color: var(--ink); border-color: var(--border-hover); }
.art-hd { margin-bottom: 2.5rem; opacity: 0; }
.art-meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; font-size: 0.78rem; color: var(--ink-ghost); }
.m-cat { color: var(--gold); font-family: var(--font-sans); font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; font-size: 0.68rem; }
.m-sep { opacity: 0.3; }
.art-title { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.4rem); font-weight: 700; line-height: 1.35; margin-bottom: 1rem; }
.art-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.tag { font-family: var(--font-sans); font-size: 0.7rem; color: var(--ink-ghost); padding: 0.12rem 0.5rem; background: var(--gold-dim); border-radius: 2px; }
.art-cover { margin-bottom: 2.5rem; border-radius: 3px; overflow: hidden; border: 1px solid var(--border); }
.art-cover img { width: 100%; display: block; }
.art-body { font-size: 1.05rem; line-height: 2.1; color: var(--ink); margin-bottom: 3rem; overflow-wrap: break-word; opacity: 0; font-weight: 300; letter-spacing: 0.01em; }
.art-body :deep(h1) { font-family: var(--font-display); font-size: 1.7rem; margin: 3rem 0 1.2rem; font-weight: 700; letter-spacing: 0.01em; }
.art-body :deep(h2) { font-family: var(--font-display); font-size: 1.4rem; margin: 2.5rem 0 1rem; font-weight: 600; letter-spacing: 0.01em; }
.art-body :deep(h3) { font-family: var(--font-display); font-size: 1.15rem; margin: 2rem 0 0.8rem; font-weight: 600; }
.art-body :deep(p) { margin: 0 0 1.5rem; }
.art-body :deep(strong) { font-weight: 600; }
.art-body :deep(code) { background: var(--gold-dim); padding: 0.1rem 0.4rem; border-radius: 2px; font-family: var(--font-mono); font-size: 0.85em; }
.art-body :deep(pre) { background: var(--bg-warm); border: 1px solid var(--border); border-radius: 3px; padding: 1.25rem; overflow-x: auto; margin: 1.5rem 0; }
.art-body :deep(pre code) { background: none; padding: 0; font-size: 0.85rem; line-height: 1.7; }
.art-body :deep(a) { color: var(--gold); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.3s; }
.art-body :deep(a:hover) { border-bottom-color: var(--gold); }
.art-body :deep(blockquote) { border-left: 3px solid var(--gold); margin: 2rem 0; padding: 1rem 1.5rem; color: var(--ink-dim); font-style: italic; background: var(--gold-dim); border-radius: 0 4px 4px 0; }
.art-body :deep(ul), .art-body :deep(ol) { margin: 1rem 0; padding-left: 1.5rem; }
.art-body :deep(li) { margin: 0.3rem 0; }
.art-body :deep(img) { max-width: 100%; border-radius: 3px; margin: 1.5rem 0; }
.art-body :deep(table) { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
.art-body :deep(th), .art-body :deep(td) { padding: 0.55rem 0.85rem; border: 1px solid var(--border); text-align: left; }
.art-body :deep(th) { background: var(--gold-dim); font-weight: 600; }
.art-actions { display: flex; justify-content: center; padding: 2rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 3rem; }
.like { display: flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1.15rem; background: none; border: 1px solid var(--border); border-radius: 3px; font-size: 0.88rem; color: var(--ink-ghost); transition: all 0.3s; }
.like:hover { border-color: var(--gold-dim); color: var(--gold); }
.like.on { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }
.cm-sec { margin-top: 2rem; }
.cm-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; letter-spacing: 0.04em; }
.cm-form { display: flex; flex-direction: column; gap: 0.65rem; padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 4px; margin-bottom: 2rem; }
.fi, .ft { width: 100%; padding: 0.55rem 0.8rem; background: var(--bg-warm); border: 1px solid var(--border); border-radius: 3px; font-size: 0.85rem; color: var(--ink); font-family: var(--font-body); outline: none; transition: border-color 0.3s; }
.fi:focus, .ft:focus { border-color: var(--border-hover); }
.fi::placeholder, .ft::placeholder { color: var(--ink-ghost); }
.ft { resize: vertical; min-height: 60px; }
.cta-fill { display: inline-flex; align-items: center; justify-content: center; padding: 0.55rem 1.15rem; background: var(--gold); color: var(--bg); font-family: var(--font-sans); font-size: 0.78rem; font-weight: 500; border: none; border-radius: 3px; cursor: pointer; transition: all 0.3s; align-self: flex-end; }
.cta-fill:hover { background: var(--gold-light); transform: translateY(-1px); }
.cm-list { display: flex; flex-direction: column; gap: 0.6rem; }
.cm { display: flex; gap: 0.9rem; padding: 1.1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 4px; }
.cm-av { width: 34px; height: 34px; background: linear-gradient(135deg, var(--gold-dim), var(--gold)); color: var(--bg); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.78rem; flex-shrink: 0; border-radius: 50%; }
.cm-body { flex: 1; }
.cm-head { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.35rem; }
.cm-name { font-weight: 600; font-size: 0.85rem; }
.cm-date { font-size: 0.68rem; color: var(--ink-ghost); }
.cm-text { margin: 0; font-size: 0.85rem; color: var(--ink-dim); line-height: 1.7; }
.no-cm { text-align: center; padding: 2.5rem; color: var(--ink-ghost); font-size: 0.85rem; }
.err { text-align: center; padding: 6rem 2rem; color: var(--ink-ghost); }
.err p { margin-bottom: 2rem; }
@media (max-width: 768px) { .art { padding: 1rem; } .art-title { font-size: 1.5rem; } .art-meta { flex-wrap: wrap; } .cm { padding: 0.9rem; } .cm-av { width: 28px; height: 28px; font-size: 0.7rem; } }
</style>