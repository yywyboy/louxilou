<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts } from '../lib/blog'
import { getAllBooks } from '../lib/books'
import { getPhotos } from '../lib/gallery'
import type { Post } from '../lib/blog'
import type { Book } from '../lib/books'
import type { Photo } from '../lib/gallery'
import { gsap, ScrollTrigger } from '../composables/useGsap'

gsap.registerPlugin(ScrollTrigger)
const router = useRouter()
const posts = ref<Post[]>([])
const books = ref<Book[]>([])
const photos = ref<Photo[]>([])
const loading = ref(true)

function goBlog(id: string) { router.push(`/blog/${id}`) }
function goBook(id: string) { router.push(`/library/${id}`) }
function fmt(d: string) { if (!d) return ''; return new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }

const recentPosts = ref<Post[]>([])
const recentBooks = ref<Book[]>([])
const recentPhotos = ref<string[]>([])

onMounted(async () => {
  document.title = 'LOUXILOU — 楼西楼'
  try {
    const [p, b, ph] = await Promise.all([getPosts(), getAllBooks(), getPhotos()])
    posts.value = p; books.value = b; photos.value = ph
    recentPosts.value = p.slice(0, 4)
    recentBooks.value = b.slice(0, 8)
    recentPhotos.value = ph.slice(0, 6).map(x => `/photos/${x.filename}`)
  } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()

  // HERO
  const tl = gsap.timeline({ delay: 0.15 })
  tl.fromTo('.hero-line', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power3.inOut' })
    .fromTo('.hero-title', { opacity: 0, y: 50, clipPath: 'inset(100% 0% 0% 0%)' }, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.out' }, '-=0.5')
    .fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .fromTo('.hero-desc', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .fromTo('.hero-nav a', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }, '-=0.2')

  gsap.to('.hero-glow', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })

  // REVEAL
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
  })

  // POST ROWS
  gsap.fromTo('.post-row', { opacity: 0, x: -25 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.posts-sec', start: 'top 80%' } })

  // BOOK CARDS
  gsap.fromTo('.book-card', { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: '.books-sec', start: 'top 80%' } })

  // PHOTO CARDS
  gsap.fromTo('.photo-card', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.photos-sec', start: 'top 80%' } })

  // MARQUEE
  gsap.to('.marquee-inner', { x: '-50%', ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 1 } })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
  gsap.killTweensOf('*')
})
</script>

<template>
  <div class="home">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg"><div class="hero-glow"></div></div>
      <div class="hero-content">
        <div class="hero-line"></div>
        <h1 class="hero-title">LOUXILOU</h1>
        <p class="hero-sub">藏书 · 写作 · 影像</p>
        <p class="hero-desc">在文字与图像之间，记录阅读的深度、生活的温度、思考的刻度。</p>
        <div class="hero-nav">
          <router-link to="/blog" class="hero-link interactive"><span class="hl-num">01</span><span class="hl-name">博客</span><span class="hl-arrow">→</span></router-link>
          <router-link to="/library" class="hero-link interactive"><span class="hl-num">02</span><span class="hl-name">藏书阁</span><span class="hl-arrow">→</span></router-link>
          <router-link to="/gallery" class="hero-link interactive"><span class="hl-num">03</span><span class="hl-name">图库</span><span class="hl-arrow">→</span></router-link>
        </div>
      </div>
    </section>

    <!-- MARQUEE -->
    <div class="marquee">
      <div class="marquee-inner">
        <span v-for="n in 10" :key="n" class="mq-text">LOUXILOU — 藏书 · 写作 · 影像 —&nbsp;</span>
      </div>
    </div>

    <!-- LATEST POSTS -->
    <section class="posts-sec">
      <div class="ctr">
        <div class="sec-head reveal">
          <div class="sec-head-row"><span class="sec-num">01</span><h2 class="sec-title">最新文章</h2></div>
          <router-link to="/blog" class="sec-more interactive">查看全部 →</router-link>
          <div class="rule"></div>
        </div>
        <div v-if="loading" style="display:flex;justify-content:center;padding:3rem"><div class="loader"></div></div>
        <div v-else class="posts-list">
          <article v-for="(post, i) in recentPosts" :key="post.id" class="post-row interactive" @click="goBlog(post.id)">
            <span class="post-idx">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="post-body">
              <div class="post-meta"><span class="post-cat">{{ post.category || '随笔' }}</span><span class="post-date">{{ fmt(post.created_at) }}</span></div>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.summary || (post.content || '').substring(0, 100) }}…</p>
            </div>
            <span class="post-arrow">→</span>
          </article>
        </div>
      </div>
    </section>

    <!-- BOOKS PREVIEW -->
    <section class="books-sec">
      <div class="ctr">
        <div class="sec-head reveal">
          <div class="sec-head-row"><span class="sec-num">02</span><h2 class="sec-title">藏书阁</h2></div>
          <router-link to="/library" class="sec-more interactive">查看全部 →</router-link>
          <div class="rule"></div>
        </div>
        <div class="books-scroll">
          <div v-for="book in recentBooks" :key="book.id" class="book-card interactive" @click="goBook(book.id)">
            <div class="bk-cover"><img :src="book.cover" :alt="book.title" loading="lazy" /></div>
            <h4 class="bk-title">{{ book.title }}</h4>
            <p class="bk-author">{{ book.author }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PHOTOS PREVIEW -->
    <section class="photos-sec">
      <div class="ctr">
        <div class="sec-head reveal">
          <div class="sec-head-row"><span class="sec-num">03</span><h2 class="sec-title">图库</h2></div>
          <router-link to="/gallery" class="sec-more interactive">查看全部 →</router-link>
          <div class="rule"></div>
        </div>
        <div class="photos-grid">
          <div v-for="(src, i) in recentPhotos" :key="i" class="photo-card">
            <img :src="src" :alt="`Photo ${i+1}`" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="about-sec">
      <div class="ctr">
        <div class="about-grid">
          <div class="about-left reveal">
            <span class="sec-num">04</span>
            <h2 class="sec-title">关于</h2>
            <div class="rule"></div>
          </div>
          <div class="about-right reveal">
            <p class="about-text">一个热爱阅读与写作的人。在这里记录经典文学的阅读笔记、技术思考与生活感悟。每一本书都是一次远行，每一篇文章都是一段回响。</p>
            <div class="about-stats">
              <div class="stat"><span class="stat-val">{{ posts.length }}</span><span class="stat-lbl">篇文章</span></div>
              <div class="stat"><span class="stat-val">{{ books.length }}</span><span class="stat-lbl">本藏书</span></div>
              <div class="stat"><span class="stat-val">{{ photos.length }}</span><span class="stat-lbl">张照片</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.home { position: relative; z-index: 1; }

/* HERO */
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; z-index: 0; }
.hero-glow { position: absolute; inset: -30%; background: radial-gradient(ellipse at 30% 40%, rgba(159,53,58,0.1) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(159,53,58,0.05) 0%, transparent 50%); }
.hero-content { position: relative; z-index: 1; text-align: center; padding: 2rem; max-width: 700px; }
.hero-line { width: 60px; height: 1px; background: var(--gold); margin: 0 auto 2.5rem; transform-origin: center; }
.hero-title { font-family: var(--font-display); font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900; letter-spacing: 0.1em; color: var(--ink); margin-bottom: 1rem; line-height: 1; opacity: 0; }
.hero-sub { font-family: var(--font-body); font-size: 0.85rem; color: var(--gold); letter-spacing: 0.5em; margin-bottom: 1.5rem; opacity: 0; }
.hero-desc { font-family: var(--font-body); font-size: 0.95rem; color: var(--ink-dim); line-height: 2; max-width: 420px; margin: 0 auto 3rem; opacity: 0; }
.hero-nav { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; opacity: 0; }
.hero-link { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1.25rem; border: 1px solid var(--border); border-radius: 4px; text-decoration: none; transition: all 0.35s var(--ease); }
.hero-link:hover { border-color: var(--gold); background: var(--gold-dim); }
.hl-num { font-family: var(--font-mono); font-size: 0.6rem; color: var(--gold); }
.hl-name { font-family: var(--font-sans); font-size: 0.78rem; font-weight: 500; color: var(--ink); letter-spacing: 0.05em; }
.hl-arrow { font-size: 0.8rem; color: var(--ink-ghost); transition: transform 0.3s var(--ease); }
.hero-link:hover .hl-arrow { transform: translateX(4px); color: var(--gold); }

/* MARQUEE */
.marquee { overflow: hidden; padding: 1.25rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.marquee-inner { display: flex; width: max-content; }
.mq-text { font-family: var(--font-display); font-size: clamp(0.9rem, 2vw, 1.4rem); font-weight: 300; font-style: italic; color: var(--ink-vanish); white-space: nowrap; letter-spacing: 0.05em; }

/* SECTION HEAD */
.sec-head { margin-bottom: 2.5rem; display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 1.5rem; }
.sec-head-row { display: flex; align-items: baseline; gap: 0.75rem; }
.sec-num { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 300; color: var(--gold); letter-spacing: 0.1em; }
.sec-title { font-family: var(--font-display); font-size: 1.4rem; font-weight: 600; letter-spacing: 0.04em; }
.sec-more { font-family: var(--font-sans); font-size: 0.72rem; font-weight: 500; color: var(--ink-ghost); text-decoration: none; letter-spacing: 0.04em; transition: color 0.3s; margin-left: auto; }
.sec-more:hover { color: var(--gold); }
.rule { width: 100%; height: 1px; background: var(--border); margin-top: 1rem; }

/* POSTS */
.posts-sec { padding: 5rem 0; }
.posts-list { display: flex; flex-direction: column; }
.post-row { display: flex; align-items: flex-start; gap: 1.5rem; padding: 1.5rem 0; border-bottom: 1px solid var(--border); cursor: pointer; transition: all 0.3s var(--ease); }
.post-row:first-child { border-top: 1px solid var(--border); }
.post-row:hover { padding-left: 0.75rem; }
.post-row:hover .post-title { color: var(--gold); }
.post-row:hover .post-arrow { transform: translateX(4px); color: var(--gold); }
.post-idx { font-family: var(--font-mono); font-size: 0.65rem; font-weight: 300; color: var(--ink-vanish); flex-shrink: 0; padding-top: 0.25rem; min-width: 1.8rem; }
.post-body { flex: 1; min-width: 0; }
.post-meta { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem; }
.post-cat { font-family: var(--font-sans); font-size: 0.6rem; font-weight: 500; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; }
.post-date { font-size: 0.65rem; color: var(--ink-ghost); }
.post-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; line-height: 1.45; margin-bottom: 0.35rem; transition: color 0.3s; }
.post-excerpt { font-size: 0.8rem; color: var(--ink-ghost); line-height: 1.7; }
.post-arrow { font-size: 1rem; color: var(--ink-vanish); flex-shrink: 0; padding-top: 0.15rem; transition: all 0.3s var(--ease); }

/* BOOKS */
.books-sec { padding: 5rem 0; border-top: 1px solid var(--border); }
.books-scroll { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
.book-card { cursor: pointer; transition: all 0.35s var(--ease); }
.book-card:hover { transform: translateY(-6px); }
.bk-cover { aspect-ratio: 3/4; overflow: hidden; border-radius: 3px; border: 1px solid var(--border); margin-bottom: 0.6rem; }
.bk-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s var(--ease); }
.book-card:hover .bk-cover img { transform: scale(1.05); }
.bk-title { font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.15rem; line-height: 1.3; }
.bk-author { font-family: var(--font-sans); font-size: 0.68rem; color: var(--ink-ghost); }

/* PHOTOS */
.photos-sec { padding: 5rem 0; border-top: 1px solid var(--border); }
.photos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.photo-card { border-radius: 3px; overflow: hidden; transition: all 0.35s var(--ease); }
.photo-card:hover { transform: scale(1.02); }
.photo-card img { width: 100%; height: 200px; object-fit: cover; display: block; }

/* ABOUT */
.about-sec { padding: 5rem 0; border-top: 1px solid var(--border); }
.about-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; align-items: start; }
.about-text { font-size: 0.95rem; color: var(--ink-dim); line-height: 2.2; margin-bottom: 2rem; }
.about-stats { display: flex; gap: 2.5rem; }
.stat { display: flex; flex-direction: column; gap: 0.15rem; }
.stat-val { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--gold); line-height: 1; }
.stat-lbl { font-family: var(--font-sans); font-size: 0.65rem; color: var(--ink-ghost); letter-spacing: 0.06em; }

@media (max-width: 768px) {
  .hero-content { padding: 1rem; }
  .hero-nav { flex-direction: column; align-items: center; }
  .hero-link { width: 100%; justify-content: center; }
  .sec-head { flex-direction: column; gap: 0.5rem; }
  .sec-more { margin-left: 0; }
  .post-row { gap: 1rem; }
  .post-idx, .post-arrow { display: none; }
  .books-scroll { grid-template-columns: repeat(2, 1fr); }
  .photos-grid { grid-template-columns: repeat(2, 1fr); }
  .about-grid { grid-template-columns: 1fr; gap: 2rem; }
}
</style>