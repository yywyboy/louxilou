<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts } from '../lib/blog'
import { getAllBooks } from '../lib/books'
import { getPhotos } from '../lib/gallery'
import type { Post } from '../lib/blog'
import type { Book } from '../lib/books'
import { gsap, ScrollTrigger, scrambleText, prefersReducedMotion } from '../composables/useGsap'
import { isDark } from '../composables/useTheme'

gsap.registerPlugin(ScrollTrigger)
const router = useRouter()
const reduced = prefersReducedMotion()
const posts = ref<Post[]>([])
const books = ref<Book[]>([])
const photos = ref<string[]>([])
const loading = ref(true)
const hoveredBook = ref<Book | null>(null)

// Post hover preview
const previewEl = ref<HTMLElement | null>(null)
const previewSrc = ref('')
const previewVisible = ref(false)

let homePreviewTween: gsap.core.Tween | null = null
function onPostEnter(post: Post, e: MouseEvent) {
  if (post.cover) {
    if (homePreviewTween) homePreviewTween.kill()
    previewSrc.value = post.cover
    previewVisible.value = true
    nextTick(() => {
      if (isDark.value && previewEl.value) {
        const img = previewEl.value.querySelector('img') as HTMLImageElement
        homePreviewTween = gsap.fromTo(previewEl.value, { opacity: 0, scale: 0.9, x: 20 }, { opacity: 1, scale: 1, x: 0, duration: 0.35, ease: 'power2.out' })
        if (img) gsap.fromTo(img, { filter: 'blur(10px)' }, { filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' })
      } else {
        homePreviewTween = gsap.fromTo('.post-bg-img', { opacity: 0 }, { opacity: 0.55, duration: 0.4, ease: 'power2.out' })
      }
    })
  }
}

function onPostMove(e: MouseEvent) {
  if (previewEl.value) {
    previewEl.value.style.left = (e.clientX + 20) + 'px'
    previewEl.value.style.top = (e.clientY - 100) + 'px'
  }
}

function onPostLeave() {
  if (homePreviewTween) homePreviewTween.kill()
  if (isDark.value && previewEl.value) {
    homePreviewTween = gsap.to(previewEl.value, { opacity: 0, scale: 0.9, duration: 0.2, ease: 'power2.in', onComplete: () => { previewVisible.value = false } })
  } else {
    homePreviewTween = gsap.to('.post-bg-img', { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => { previewVisible.value = false } })
  }
}

// Hero title mouse follow
function onTitleMove(e: MouseEvent) {
  const chars = document.querySelectorAll('.ht-char')
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const mx = (e.clientX - rect.left) / rect.width - 0.5
  const my = (e.clientY - rect.top) / rect.height - 0.5
  chars.forEach((ch, i) => {
    const factor = 1 + (i - 3.5) * 0.15
    gsap.to(ch, { x: mx * 20 * factor, y: my * 15 * factor, rotateY: mx * 8, rotateX: -my * 5, duration: 0.6, ease: 'power2.out' })
  })
}
function onTitleLeave() {
  document.querySelectorAll('.ht-char').forEach(ch => {
    gsap.to(ch, { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
  })
}

function goBlog(id: string) { router.push(`/blog/${id}`) }
function onBookEnter(book: Book, e: MouseEvent) {
  hoveredBook.value = book
  const cover = e.currentTarget as HTMLElement
  const hover = cover.closest('.showcase-hover') as HTMLElement
  if (hover) gsap.to(hover, { y: -15, duration: 0.4, ease: 'power2.out' })
}
function onBookLeave(e: MouseEvent) {
  hoveredBook.value = null
  const cover = e.currentTarget as HTMLElement
  const hover = cover.closest('.showcase-hover') as HTMLElement
  if (hover) gsap.to(hover, { y: 0, duration: 0.5, ease: 'power2.out' })
}
function fmt(d: string) { if (!d) return ''; return new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }

onMounted(async () => {
  
  document.title = 'LOUXILOU — 楼西楼'
  try {
    const [p, b, ph] = await Promise.all([getPosts(), getAllBooks(), getPhotos()])
    posts.value = p; books.value = b
    photos.value = ph.slice(0, 12).map(x => `/photos/${x.filename}`)
  } catch (e) { console.error(e) }
  loading.value = false
  await nextTick()

  if (reduced) return // Skip scroll animations for reduced motion

  // ===== HERO =====
  const heroEl = document.querySelector('.hero-pin') as HTMLElement
  if (heroEl) {
    const heroTl = gsap.timeline({
      scrollTrigger: { trigger: heroEl, start: 'top top', end: '+=2000', scrub: 1, pin: true }
    })
    heroTl
      .fromTo('.hero-img-0', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut' }, 0)
      .fromTo('.hero-img-1', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut' }, 0.1)
      .fromTo('.hero-img-2', { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut' }, 0.2)
      .fromTo('.hero-img-3', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut' }, 0.3)
      .fromTo('.hero-img-4', { clipPath: 'inset(50% 50% 50% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' }, 0.4)
      .to('.hero-images', { scale: 0.6, opacity: 0.3, filter: 'blur(8px)', duration: 1, ease: 'power2.inOut' }, 0.8)
      .to('.hero-content', { scale: 0.5, opacity: 0, y: -100, filter: 'blur(10px)', duration: 1, ease: 'power2.inOut' }, 0.8)
      .to('.hero-overlay', { opacity: 1, duration: 0.8 }, 0.8)
      .fromTo('.hero-statement', { opacity: 0, y: 80, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }, 1.5)

    // Title + subtitle letter-spacing: loose → tight as you scroll
    gsap.to('.hero-title', {
      letterSpacing: '0.05em',
      ease: 'none',
      scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 1 }
    })
    gsap.to('.hero-sub', {
      letterSpacing: '0.15em',
      ease: 'none',
      scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 1 }
    })
  }

  // ===== TEXT SCRAMBLE — hero title =====
  const heroTitle = document.querySelector('.hero-title')
  if (heroTitle) {
    scrambleText(heroTitle, 'LOUXILOU', { duration: 1.5, delay: 0.3 })
  }

  // ===== TEXT SCRAMBLE — section titles on scroll =====
  document.querySelectorAll('.scramble-title').forEach(el => {
    const text = el.textContent || ''
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => scrambleText(el as HTMLElement, text, { duration: 1 }),
      once: true,
    })
  })

  // ===== POSTS =====
  document.querySelectorAll('.post-item').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, x: i % 2 === 0 ? -40 : 40 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 1 } })
  })

  
  // ===== BREATHING SECTIONS =====
  document.querySelectorAll('.breath').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 50%', scrub: 1 } })
  })

  // ===== TEXT DRIFT — characters scatter on scroll =====
  const driftChars = document.querySelectorAll('.drift-char')
  if (driftChars.length) {
    driftChars.forEach((el, i) => {
      const dir = i < 4 ? -1 : 1
      const spread = 60 + (i - 3.5) * 20
      gsap.to(el, {
        x: dir * spread * (1 + Math.abs(i - 3.5) * 0.3),
        y: (Math.random() - 0.5) * 80,
        rotation: (Math.random() - 0.5) * 30,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: '.drift-section', start: 'top 40%', end: 'bottom 20%', scrub: 1 }
      })
    })
    gsap.fromTo('.drift-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.drift-section', start: 'top 60%' } })
  }

  // ===== BOOK SHOWCASE =====
  const showcaseEl = document.querySelector('.showcase-pin') as HTMLElement
  if (showcaseEl) {
    const wraps = showcaseEl.querySelectorAll('.showcase-book')
    const cards = showcaseEl.querySelectorAll('.showcase-card')
    const spines = showcaseEl.querySelectorAll('.showcase-spine')
    const infos = showcaseEl.querySelectorAll('.showcase-info')
    const photoEls = showcaseEl.querySelectorAll('.showcase-photo')
    const scene = showcaseEl.querySelector('.showcase-scene') as HTMLElement
    const brandEcho = showcaseEl.querySelector('.brand-echo') as HTMLElement
    const brandEcho2 = showcaseEl.querySelector('.brand-echo-2') as HTMLElement
    const labelBooks = showcaseEl.querySelector('.showcase-label-books') as HTMLElement
    const labelPhotos = showcaseEl.querySelector('.showcase-label-photos') as HTMLElement

    const tl = gsap.timeline({
      scrollTrigger: { trigger: showcaseEl, start: 'top top', end: '+=5000', scrub: 1, pin: true }
    })

    // Side labels
    tl.to(labelBooks, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.5)
    tl.to(labelBooks, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 3.3)
    tl.to(labelPhotos, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 4.2)

    // Stage 1: Books slide in
    wraps.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, x: 300 + i * 60 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, i * 0.08)
    })

    // Stage 2: Info fades, gather
    infos.forEach((el, i) => { tl.to(el, { opacity: 0, x: -20, duration: 0.4, ease: 'power2.in' }, 1.2 + i * 0.04) })
    wraps.forEach((el, i) => {
      tl.to(el, { x: (i - 3.5) * 80, y: 0, duration: 0.8, ease: 'power3.inOut' }, 1.5)
    })

    // Stage 3: 3D — disable hover on covers
    const covers = showcaseEl.querySelectorAll('.showcase-cover')
    tl.call(() => { covers.forEach(c => (c as HTMLElement).style.pointerEvents = 'none') }, [], 2.1)
    tl.to(scene, { rotateX: 25, rotateY: -5, duration: 1.5, ease: 'power2.inOut' }, 2.2)
    cards.forEach((el, i) => {
      tl.to(el, { rotateY: -15 + i * 4, rotateX: 8, z: 30 + i * 10, duration: 1, ease: 'power2.inOut' }, 2.2)
    })
    spines.forEach((el, i) => { tl.to(el, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 2.8 + i * 0.04) })

    // Brand echo during scatter
    tl.to(brandEcho, { opacity: 0.06, duration: 0.5, ease: 'power2.out' }, 3.4)
    tl.to(brandEcho, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 4.5)

    // Stage 4: Books scatter — keep covers disabled (they're disappearing anyway)
    tl.call(() => { hoveredBook.value = null }, [], 3.5)
    const scatter = [
      { x: -500, y: -250 }, { x: 500, y: -200 }, { x: -400, y: 300 }, { x: 450, y: 150 },
      { x: -300, y: -350 }, { x: 350, y: 300 }, { x: -450, y: 80 }, { x: 400, y: -300 }
    ]
    wraps.forEach((el, i) => {
      const s = scatter[i % scatter.length]
      tl.to(el, { x: s.x, y: s.y, opacity: 0, duration: 0.8, ease: 'power2.in' }, 3.5 + i * 0.04)
    })

    // Breath moment — brand flash between scatter and photos
    const breath = showcaseEl.querySelector('.showcase-breath') as HTMLElement
    tl.to(breath, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 4.0)
    tl.to(breath, { opacity: 0, duration: 0.6, ease: 'power2.in' }, 4.8)

    const entries = [
      { x: -600, y: -350, r: -20 }, { x: 600, y: -250, r: 15 }, { x: -500, y: 350, r: 25 },
      { x: 550, y: 250, r: -15 }, { x: -400, y: -450, r: 10 }, { x: 450, y: 400, r: -20 },
      { x: -600, y: 120, r: 30 }, { x: 600, y: -120, r: -25 }, { x: -300, y: 500, r: 15 },
      { x: 300, y: -500, r: -10 }, { x: -550, y: -60, r: 20 }, { x: 500, y: 60, r: -30 }
    ]
    photoEls.forEach((el, i) => {
      const e = entries[i % entries.length]
      tl.fromTo(el,
        { opacity: 0, x: e.x, y: e.y, rotation: e.r, scale: 0.3 },
        { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1, ease: 'power3.out' },
        4.8 + i * 0.07
      )
    })

    // Brand echo 2 during photo wall
    tl.to(brandEcho2, { opacity: 0.06, duration: 0.5, ease: 'power2.out' }, 4.5)
    tl.to(brandEcho2, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 5.8)

    tl.to(scene, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power2.inOut' }, 4.5)
  }

  // ===== FLIP COUNTERS =====
  document.querySelectorAll('.flip-counter').forEach(counter => {
    const digits = counter.querySelectorAll('.flip-digit')
    digits.forEach((digit, i) => {
      const finalVal = digit.textContent || '0'
      const delay = i * 0.15
      // Set initial state
      gsap.set(digit, { rotateX: -90, opacity: 0 })
      // Flip in on scroll
      gsap.to(digit, {
        rotateX: 0, opacity: 1,
        duration: 0.6, delay,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: counter as HTMLElement, start: 'top 85%' }
      })
    })
  })

  // ===== QUOTE — scroll typewriter =====
  const quoteEl = document.querySelector('.quote-text') as HTMLElement
  if (quoteEl) {
    const fullText = quoteEl.textContent || ''
    quoteEl.textContent = ''
    quoteEl.style.opacity = '1'
    let charIdx = 0

    ScrollTrigger.create({
      trigger: '.quote-block',
      start: 'top 70%',
      onEnter: () => {
        const typeInterval = setInterval(() => {
          if (charIdx < fullText.length) {
            quoteEl.textContent = fullText.slice(0, charIdx + 1)
            charIdx++
          } else {
            clearInterval(typeInterval)
          }
        }, 35)
      },
      once: true,
    })
  }

  gsap.fromTo('.quote-block cite', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.quote-block', start: 'top 60%' } })

  // ===== ENDING =====
  gsap.fromTo('.ending-line', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power3.inOut', scrollTrigger: { trigger: '.ending', start: 'top 75%' } })

  // SVG signature stroke draw — each letter sequentially
  const sigPaths = document.querySelectorAll('.sig-path')
  if (sigPaths.length) {
    let delay = 0
    sigPaths.forEach((p) => {
      const path = p as SVGPathElement
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.4 + len * 0.003,
        delay,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.ending', start: 'top 65%' }
      })
      delay += 0.15
    })
  }
  gsap.fromTo('.ending-title', { opacity: 0, scale: 0.85, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: '.ending', start: 'top 70%', end: 'top 30%', scrub: 1 } })
})

onUnmounted(() => { ScrollTrigger.getAll().forEach(t => t.kill());  })
</script>

<template>
  <div class="page">

    <!-- Post preview: small floating image (dark mode) -->
    <div v-if="previewVisible && isDark" ref="previewEl" class="post-preview" aria-hidden="true">
      <img :src="previewSrc" alt="" />
    </div>
    <!-- Post preview: full-screen background (light mode) -->
    <div v-if="previewVisible && !isDark" class="post-bg" aria-hidden="true">
      <img :src="previewSrc" class="post-bg-img" alt="" />
    </div>

    <!-- HERO -->
    <section class="hero-pin">
      <div class="hero-images">
        <div class="hero-img hero-img-0"><img src="/photos/photo (1).jpg" alt="" /></div>
        <div class="hero-img hero-img-1"><img src="/photos/photo (2).jpg" alt="" /></div>
        <div class="hero-img hero-img-2"><img src="/photos/photo (3).jpg" alt="" /></div>
        <div class="hero-img hero-img-3"><img src="/photos/photo (4).jpg" alt="" /></div>
        <div class="hero-img hero-img-4"><img src="/photos/photo (5).jpg" alt="" /></div>
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-year">二〇二六</span>
        <h1 class="hero-title" @mousemove="onTitleMove" @mouseleave="onTitleLeave">
          <span v-for="(ch, i) in 'LOUXILOU'.split('')" :key="i" class="ht-char" :data-i="i">{{ ch }}</span>
        </h1>
        <p class="hero-sub">文章 · 阅读 · 摄影</p>
      </div>
      <div class="hero-statement">
        <p>阅读的深度<br>生活的温度<br>思考的刻度<br>这些都能被<br>文字与图像<br>一一记录。</p>
      </div>
    </section>

    <!-- BREATH 1 -->
    <section class="breath">
      <p class="breath-text">文字是时间的切片，<br>每一篇都是一次停留。</p>
    </section>

    <!-- POSTS -->
    <section class="posts-section">
      <div class="section-label">
        <span class="label-num">01</span>
        <span class="label-text scramble-title">文章</span>
        <router-link to="/blog" class="label-link">查看全部 →</router-link>
      </div>
      <div class="posts-list">
        <article v-for="(post, i) in posts.slice(0, 5)" :key="post.id" class="post-item" @click="goBlog(post.id)" @mouseenter="onPostEnter(post, $event)" @mousemove="onPostMove" @mouseleave="onPostLeave()">
          <span class="pi-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="pi-body">
            <span class="pi-cat">{{ post.category || '随笔' }}</span>
            <h2 class="pi-title">{{ post.title }}</h2>
            <p class="pi-excerpt">{{ post.summary || (post.content || '').substring(0, 80) }}…</p>
          </div>
          <span class="pi-date">{{ fmt(post.created_at) }}</span>
        </article>
      </div>
    </section>

    <!-- BREATH 2 -->
    <section class="breath">
      <p class="breath-text">数字不会说话，<br>但它们记得一切。</p>
    </section>

    <!-- STATS — flip counter -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="flip-counter" :data-target="posts.length">
            <span class="flip-digit" v-for="(d, i) in String(posts.length).split('')" :key="'p'+i">{{ d }}</span>
          </div>
          <span class="stat-label">篇文章</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <div class="flip-counter" :data-target="books.length">
            <span class="flip-digit" v-for="(d, i) in String(books.length).split('')" :key="'b'+i">{{ d }}</span>
          </div>
          <span class="stat-label">本藏书</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <div class="flip-counter" :data-target="photos.length">
            <span class="flip-digit" v-for="(d, i) in String(photos.length).split('')" :key="'ph'+i">{{ d }}</span>
          </div>
          <span class="stat-label">张照片</span>
        </div>
      </div>
    </section>

    <!-- TEXT DRIFT — signature effect -->
    <section class="drift-section">
      <div class="drift-container">
        <span v-for="(ch, i) in 'LOUXILOU'.split('')" :key="i" class="drift-char" :data-i="i">{{ ch }}</span>
      </div>
      <p class="drift-sub">文章 · 阅读 · 摄影</p>
    </section>

    <!-- BREATH 3 -->
    <section class="breath">
      <p class="breath-text">书架上每一本书，<br>都是一段未完的对话。</p>
    </section>

    <!-- BOOK SHOWCASE -->
    <section class="showcase-pin">
      <div class="showcase-scene">
        <div class="showcase-label showcase-label-books">
          <span class="sl-num">02</span>
          <span class="sl-text">藏书阁</span>
          <router-link to="/library" class="sl-link">查看全部 →</router-link>
        </div>
        <div class="showcase-label showcase-label-photos">
          <span class="sl-num">03</span>
          <span class="sl-text">图库</span>
          <router-link to="/gallery" class="sl-link">查看全部 →</router-link>
        </div>

        <!-- Brand echoes -->
        <div class="brand-echo">LOUXILOU</div>
        <div class="brand-echo-2">LOUXILOU</div>
        <!-- Breath moment -->
        <div class="showcase-breath">
          <span class="breath-text">LOUXILOU</span>
        </div>

        <div v-for="(book, i) in books.slice(0, 8)" :key="book.id" class="showcase-book">
          <div class="showcase-hover">
            <div class="showcase-card">
              <div class="showcase-cover" @mouseenter="onBookEnter(book, $event)" @mouseleave="onBookLeave($event)">
                <img :src="book.cover" :alt="book.title" loading="lazy" decoding="async" />
              </div>
              <div class="showcase-spine"></div>
            </div>
          </div>
          <div class="showcase-info">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }}</p>
          </div>
        </div>
        <div class="showcase-wall">
          <div v-for="(src, i) in photos" :key="i" class="showcase-photo">
            <img :src="src" :alt="`Photo ${i+1}`" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>

      <!-- Book info panel -->
      <Transition name="info-panel">
        <div v-if="hoveredBook" class="book-info-panel">
          <div class="bip-content">
            <h3 class="bip-title">{{ hoveredBook.title }}</h3>
            <p class="bip-author">{{ hoveredBook.author }}</p>
            <p class="bip-desc">{{ hoveredBook.description }}</p>
          </div>
        </div>
      </Transition>
    </section>

    <!-- BREATH 4 -->
    <section class="breath">
      <p class="breath-text">有些句子，<br>值得用一个下午去记住。</p>
    </section>

    <!-- QUOTE — scroll typewriter -->
    <section class="quote-block">
      <blockquote class="quote-text">"多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。"</blockquote>
      <cite>— 百年孤独 · 加西亚·马尔克斯</cite>
    </section>

    <!-- ENDING — strong brand close with SVG handwriting -->
    <section class="ending">
      <div class="ending-line"></div>
      <h2 class="ending-title">楼西楼</h2>
      <!-- SVG calligraphic LOUXILOU — refined -->
      <svg class="ending-svg" viewBox="0 0 380 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- L -->
        <path class="sig-path" d="M 30 18 C 30 18, 30 62, 30 62 C 30 62, 52 62, 52 62" stroke="#9F353A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <!-- O -->
        <path class="sig-path" d="M 72 40 C 72 22, 96 16, 96 40 C 96 60, 72 64, 72 40 Z" stroke="#9F353A" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <!-- U -->
        <path class="sig-path" d="M 112 18 C 112 18, 112 50, 118 56 C 124 62, 136 62, 140 56 C 144 50, 144 18, 144 18" stroke="#9F353A" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <!-- X -->
        <path class="sig-path" d="M 158 18 C 158 18, 188 62, 188 62" stroke="#9F353A" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <path class="sig-path" d="M 188 18 C 188 18, 158 62, 158 62" stroke="#9F353A" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <!-- I -->
        <path class="sig-path" d="M 215 18 L 215 62" stroke="#9F353A" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <!-- L -->
        <path class="sig-path" d="M 238 18 C 238 18, 238 62, 238 62 C 238 62, 260 62, 260 62" stroke="#9F353A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <!-- O -->
        <path class="sig-path" d="M 280 40 C 280 22, 304 16, 304 40 C 304 60, 280 64, 280 40 Z" stroke="#9F353A" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <!-- U -->
        <path class="sig-path" d="M 320 18 C 320 18, 320 50, 326 56 C 332 62, 344 62, 348 56 C 352 50, 352 18, 352 18" stroke="#9F353A" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <!-- flourish underline -->
        <path class="sig-path" d="M 25 72 C 100 80, 280 80, 355 72" stroke="#9F353A" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.35" />
      </svg>
    </section>

  </div>
</template>

<style scoped>
.page { position: relative; z-index: 1; }

/* HERO */
.hero-pin { position: relative; height: 100vh; overflow: hidden; }
.hero-images { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0; }
.hero-img { overflow: hidden; }
.hero-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.hero-img-0 { grid-column: 1; grid-row: 1; }
.hero-img-1 { grid-column: 2; grid-row: 1; }
.hero-img-2 { grid-column: 3; grid-row: 1; }
.hero-img-3 { grid-column: 1 / 3; grid-row: 2; }
.hero-img-4 { grid-column: 3; grid-row: 2; }
.hero-overlay { position: absolute; inset: 0; background: rgba(var(--bg-rgb), 0.65); opacity: 0.6; z-index: 1; }
.hero-content { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.hero-year { font-family: var(--font-body); font-size: 0.75rem; color: var(--gold); letter-spacing: 0.6em; margin-bottom: 2rem; }
.hero-title { font-family: var(--font-display); font-size: clamp(4rem, 14vw, 10rem); font-weight: 900; letter-spacing: 0.3em; color: var(--ink); line-height: 0.85; margin-bottom: 1.5rem; perspective: 800px; }
.ht-char { display: inline-block; will-change: transform; }
.hero-sub { font-family: var(--font-body); font-size: 0.85rem; color: var(--ink-dim); letter-spacing: 0.8em; }
.hero-statement { position: absolute; inset: 0; z-index: 3; display: flex; align-items: center; justify-content: center; text-align: center; opacity: 0; }
.hero-statement p { font-family: var(--font-display); font-size: clamp(1.5rem, 3.5vw, 2.8rem); font-weight: 300; font-style: italic; color: var(--ink); line-height: 2; letter-spacing: 0.08em; max-width: 500px; }

/* SECTION LABEL */
.section-label { display: flex; align-items: baseline; gap: 1rem; padding: 0 2.5rem; margin-bottom: 3rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
.label-num { font-family: var(--font-mono); font-size: 0.6rem; color: var(--gold); letter-spacing: 0.1em; }
.label-text { font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; letter-spacing: 0.05em; }
.label-link { margin-left: auto; font-family: var(--font-sans); font-size: 0.7rem; color: var(--ink-ghost); text-decoration: none; letter-spacing: 0.04em; transition: color 0.3s; }
.label-link:hover { color: var(--gold); }

/* POST HOVER PREVIEW */
.post-preview {
  position: fixed;
  z-index: 10000;
  width: 200px;
  height: 140px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border);
  pointer-events: none;
  box-shadow: 0 8px 30px var(--shadow-deep);
}
.post-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* POSTS */
.posts-section { padding: 6rem 0; }
.posts-list { display: flex; flex-direction: column; }
.post-item { display: flex; align-items: flex-start; gap: 2rem; padding: 2rem 2.5rem; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.3s; }
.post-item:first-child { border-top: 1px solid var(--border); }
.post-item:hover { background: var(--gold-dim); }
.pi-num { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ink-vanish); flex-shrink: 0; padding-top: 0.3rem; min-width: 2rem; }
.pi-body { flex: 1; min-width: 0; }
.pi-cat { font-family: var(--font-sans); font-size: 0.6rem; font-weight: 500; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 0.5rem; }
.pi-title { font-family: var(--font-display); font-size: 1.4rem; font-weight: 600; line-height: 1.4; margin-bottom: 0.4rem; transition: color 0.3s; }
.post-item:hover .pi-title { color: var(--gold); }
.pi-excerpt { font-size: 0.82rem; color: var(--ink-ghost); line-height: 1.7; }
.pi-date { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ink-vanish); flex-shrink: 0; padding-top: 0.3rem; }

/* STATS */
.stats-section { padding: 6rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stats-grid { display: flex; justify-content: center; align-items: center; gap: 3rem; }
.stat-item { text-align: center; }
.stat-sep { width: 1px; height: 50px; background: var(--border); }
.flip-counter { display: flex; justify-content: center; gap: 0.1em; margin-bottom: 0.5rem; perspective: 600px; }
.flip-digit { font-family: var(--font-display); font-size: 3.5rem; font-weight: 900; color: var(--gold); line-height: 1; display: inline-block; transform-origin: center bottom; }
.stat-label { font-family: var(--font-sans); font-size: 0.7rem; color: var(--ink-ghost); letter-spacing: 0.08em; }

/* TEXT DRIFT */
.drift-section {
  padding: 10rem 0;
  text-align: center;
  overflow: hidden;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.drift-container {
  display: flex;
  justify-content: center;
  gap: 0;
  perspective: 800px;
}
.drift-char {
  font-family: var(--font-display);
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--ink);
  display: inline-block;
  transition: color 0.3s;
}
.drift-sub {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--gold);
  letter-spacing: 0.4em;
  margin-top: 2rem;
  opacity: 0;
}

/* SHOWCASE */
.showcase-pin { height: 100vh; overflow: hidden; display: flex; align-items: center; justify-content: center; perspective: 1200px; }
.showcase-scene { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; transform-style: preserve-3d; }
.showcase-label { position: absolute; left: 2.5rem; z-index: 10; display: flex; flex-direction: column; gap: 0.3rem; opacity: 0; }
.showcase-label-books { top: 50%; transform: translateY(-50%); }
.showcase-label-photos { top: 50%; transform: translateY(-50%); }
.sl-num { font-family: var(--font-mono); font-size: 0.55rem; color: var(--gold); letter-spacing: 0.1em; }
.sl-text { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; letter-spacing: 0.04em; }
.sl-link { font-family: var(--font-sans); font-size: 0.65rem; color: var(--ink-ghost); text-decoration: none; letter-spacing: 0.04em; transition: color 0.3s; margin-top: 0.3rem; }
.sl-link:hover { color: var(--gold); }

/* Brand echoes */
.brand-echo, .brand-echo-2 {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 900;
  letter-spacing: 0.2em;
  color: var(--gold);
  opacity: 0;
  pointer-events: none;
  z-index: 5;
}

.showcase-book { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; pointer-events: none; user-select: none; }
.showcase-hover { pointer-events: none; }
.showcase-card { position: relative; transform-style: preserve-3d; }
.showcase-cover { width: 160px; aspect-ratio: 3/4; overflow: hidden; border-radius: 2px; border: 1px solid var(--border); backface-visibility: hidden; pointer-events: auto; cursor: default; }
.showcase-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.showcase-spine { position: absolute; right: -8px; top: 0; width: 8px; height: 100%; background: linear-gradient(to right, rgba(60,50,40,0.8), rgba(40,35,28,0.95)); transform: rotateY(90deg); transform-origin: left center; opacity: 0; border-radius: 0 2px 2px 0; }
.showcase-info { text-align: center; opacity: 0; }
.showcase-info h3 { font-family: var(--font-display); font-size: 0.82rem; font-weight: 600; margin-bottom: 0.15rem; white-space: nowrap; }
.showcase-info p { font-family: var(--font-sans); font-size: 0.6rem; color: var(--ink-ghost); }
.showcase-wall { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(3, 1fr); gap: 0.3rem; padding: 2rem; pointer-events: none; }
.showcase-photo { overflow: hidden; border-radius: 2px; opacity: 0; }
.showcase-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* BOOK INFO PANEL */
.book-info-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 2.5rem 2.5rem 2rem;
  background: linear-gradient(to top, rgba(var(--bg-rgb),0.97) 0%, rgba(var(--bg-rgb),0.85) 70%, transparent 100%);
  backdrop-filter: blur(12px);
  pointer-events: none;
}
.bip-content { max-width: 650px; margin: 0 auto; text-align: center; }
.bip-title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin-bottom: 0.25rem; color: var(--gold); }
.bip-author { font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); margin-bottom: 0.6rem; letter-spacing: 0.06em; }
.bip-desc { font-size: 0.82rem; color: var(--ink-dim); line-height: 1.8; max-width: 480px; margin: 0 auto; }
.info-panel-enter-active { transition: all 0.35s var(--ease); }
.info-panel-leave-active { transition: all 0.25s var(--ease); }
.info-panel-enter-from { opacity: 0; transform: translateY(16px); }
.info-panel-leave-to { opacity: 0; transform: translateY(8px); }

/* QUOTE */
.quote-block { padding: 10rem 2rem; text-align: center; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.quote-block blockquote { font-family: var(--font-display); font-size: clamp(1.3rem, 3vw, 2.2rem); font-weight: 300; font-style: italic; color: var(--ink-dim); line-height: 2; letter-spacing: 0.06em; max-width: 550px; margin: 0 auto 2rem; }
.quote-block cite { font-family: var(--font-sans); font-size: 0.7rem; color: var(--ink-ghost); letter-spacing: 0.15em; font-style: normal; }

/* SHOWCASE BREATH MOMENT */
.showcase-breath {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 20;
  pointer-events: none;
}
.breath-text {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  letter-spacing: 0.2em;
  color: var(--gold);
  opacity: 0.5;
}

/* ENDING — strong brand close */
.ending {
  padding: 12rem 2rem 6rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.ending-line {
  width: 60px;
  height: 1px;
  background: var(--gold);
  opacity: 0.4;
}
.ending-svg {
  width: 300px;
  height: auto;
  margin: 1.5rem auto;
  overflow: visible;
  display: block;
}
.ending-title {
  font-family: var(--font-body);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  color: var(--ink);
  letter-spacing: 0.15em;
  opacity: 0;
}


/* BREATHING SECTIONS */
.breath {
  padding: 10rem 2rem;
  text-align: center;
  opacity: 0;
}
.breath-text {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
  font-weight: 300;
  font-style: italic;
  color: var(--ink-dim);
  line-height: 2.2;
  letter-spacing: 0.05em;
  max-width: 400px;
  margin: 0 auto;
}


/* Post full-screen background preview (light mode) */
.post-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.post-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.06;
  filter: blur(30px) saturate(0.5);
}

@media (max-width: 768px) {
  .hero-title { font-size: clamp(3rem, 12vw, 5rem); }
  .hero-statement p { font-size: 1.3rem; }
  .post-item { padding: 1.5rem; gap: 1rem; }
  .pi-num, .pi-date { display: none; }
  .post-preview { display: none; }
  .post-bg { display: none; }
  .stats-grid { gap: 2rem; }
  .stat-val { font-size: 2.5rem; }
  .stat-sep { height: 30px; }
  .showcase-cover { width: 100px; }
  .showcase-spine { display: none; }
  .showcase-wall { grid-template-columns: repeat(3, 1fr); padding: 1rem; }
  .showcase-label { left: 1rem; }
  .brand-echo, .brand-echo-2 { font-size: clamp(2rem, 8vw, 4rem); }
  .quote-block { padding: 6rem 2rem; }
  .section-label { padding: 0 1.25rem; }
  .ending { padding: 8rem 2rem 4rem; }
  .ending-title { font-size: clamp(2.5rem, 10vw, 4rem); }
  .breath { padding: 6rem 1.5rem; }
  .breath-text { font-size: 1rem; }
}
</style>