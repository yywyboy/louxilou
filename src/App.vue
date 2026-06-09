<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { gsap, initMagnetic, prefersReducedMotion } from './composables/useGsap'
import { scrollTo as lenisScrollTo } from './composables/useLenis'
import { updateThemeState } from './composables/useTheme'
import { useAuth } from './composables/useAuth'
import AuthModal from './components/AuthModal.vue'
import UserProfile from './components/UserProfile.vue'

const route = useRoute()
const router = useRouter()
const isReader = computed(() => route.name === 'BookReader')
const loaded = ref(false)
const showLoader = ref(true)
const scrollY = ref(0)
const scrollProgress = ref(0)
const navHidden = ref(false)
const lastScroll = ref(0)
const mobileOpen = ref(false)

// Theme toggle
const theme = ref<'light' | 'dark'>('light')
const { user, loading: authLoading, getDisplayName } = useAuth()
const showAuthModal = ref(false)
const showProfile = ref(false)

// 新用户通过魔法链接登录后，如果没有用户名，自动弹出个人中心设置
watch(() => user.value, (u) => {
  if (u && !u.user_metadata?.username) {
    showProfile.value = true
  }
})

function applyTheme(t: 'light' | 'dark') {
  const r = document.documentElement.style
  if (t === 'light') {
    r.setProperty('--bg', '#f5f0e8')
    r.setProperty('--bg-warm', '#ece6dc')
    r.setProperty('--bg-card', '#faf7f2')
    r.setProperty('--bg-elevated', '#e8e2d8')
    r.setProperty('--bg-rgb', '245, 240, 232')
    r.setProperty('--ink', '#2a2520')
    r.setProperty('--ink-dim', '#706860')
    r.setProperty('--ink-ghost', '#a09888')
    r.setProperty('--ink-vanish', '#c8c0b0')
    r.setProperty('--gold-light', '#b83d44')
    r.setProperty('--gold-dim', 'rgba(159, 53, 58, 0.08)')
    r.setProperty('--gold-glow', 'rgba(159, 53, 58, 0.2)')
    r.setProperty('--border', 'rgba(0, 0, 0, 0.06)')
    r.setProperty('--border-hover', 'rgba(0, 0, 0, 0.12)')
  } else {
    r.setProperty('--bg', '#0a0a0a')
    r.setProperty('--bg-warm', '#111111')
    r.setProperty('--bg-card', '#161616')
    r.setProperty('--bg-elevated', '#1c1c1c')
    r.setProperty('--bg-rgb', '10, 10, 10')
    r.setProperty('--ink', '#e8e8e8')
    r.setProperty('--ink-dim', '#999999')
    r.setProperty('--ink-ghost', '#555555')
    r.setProperty('--ink-vanish', '#2a2a2a')
    r.setProperty('--gold-light', '#c4454c')
    r.setProperty('--gold-dim', 'rgba(159, 53, 58, 0.12)')
    r.setProperty('--gold-glow', 'rgba(159, 53, 58, 0.3)')
    r.setProperty('--border', 'rgba(255, 255, 255, 0.06)')
    r.setProperty('--border-hover', 'rgba(255, 255, 255, 0.14)')
  }
  theme.value = t
  localStorage.setItem('theme', t)
  updateThemeState(t === 'dark')
}

const themeOverlay = ref<HTMLElement | null>(null)

let isSwitching = false
function toggleTheme() {
  if (isSwitching || !themeOverlay.value) return
  isSwitching = true

  const newTheme = theme.value === 'light' ? 'dark' : 'light'
  const overlay = themeOverlay.value

  // Cover screen instantly with OLD theme color
  overlay.style.background = theme.value === 'dark' ? '#0a0a0a' : '#f5f0e8'
  overlay.style.clipPath = 'circle(150% at 50% 50%)'
  overlay.style.opacity = '1'
  overlay.style.display = 'block'

  // Switch theme under cover
  applyTheme(newTheme)

  // Change overlay to NEW theme color, then shrink from edges to center
  overlay.style.background = newTheme === 'dark' ? '#0a0a0a' : '#f5f0e8'

  // Shrink: edges close in toward center, revealing new theme from center outward
  gsap.to(overlay, {
    clipPath: 'circle(0% at 50% 50%)',
    duration: 0.7,
    ease: 'power3.inOut',
    onComplete: () => {
      overlay.style.display = 'none'
      overlay.style.clipPath = ''
      isSwitching = false
    }
  })
}

// Cursor
const ring = ref<HTMLElement | null>(null)
const dot = ref<HTMLElement | null>(null)
const cursorLabel = ref('')
const hover = ref(false)
let cx = 0, cy = 0, tx = 0, ty = 0, raf: number

function tick() {
  cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1
  if (ring.value) ring.value.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`
  if (dot.value) dot.value.style.transform = `translate(${tx - 3}px, ${ty - 3}px)`
  raf = requestAnimationFrame(tick)
}

// Ink trail — tracked for cleanup
let lastInkX = 0, lastInkY = 0, inkDist = 0
const inkDots: HTMLElement[] = []

function spawnInk(x: number, y: number) {
  const dot = document.createElement('div')
  dot.className = 'ink-dot'
  dot.style.cssText = `left:${x}px;top:${y}px;`
  document.body.appendChild(dot)
  inkDots.push(dot)
  gsap.to(dot, { opacity: 0, scale: 2.5, duration: 1.2, ease: 'power2.out', onComplete: () => {
    dot.remove()
    const idx = inkDots.indexOf(dot)
    if (idx > -1) inkDots.splice(idx, 1)
  }})
}

function cleanupInkDots() {
  inkDots.forEach(dot => { gsap.killTweensOf(dot); dot.remove() })
  inkDots.length = 0
}

function onMove(e: MouseEvent) {
  tx = e.clientX; ty = e.clientY
  const dx = e.clientX - lastInkX, dy = e.clientY - lastInkY
  inkDist += Math.sqrt(dx * dx + dy * dy)
  if (inkDist > 40) {
    spawnInk(e.clientX, e.clientY)
    inkDist = 0
  }
  lastInkX = e.clientX; lastInkY = e.clientY
}
function onOver(e: MouseEvent) {
  const t = e.target as HTMLElement
  if (t.closest('a, button, .interactive')) { hover.value = true; cursorLabel.value = '' }
  else if (t.closest('img, .showcase-cover, .photo-cell, .ph-item')) { hover.value = true; cursorLabel.value = '查看' }
  else if (t.closest('.post-item, article')) { hover.value = true; cursorLabel.value = '阅读' }
  else { hover.value = false; cursorLabel.value = '' }
}
function onOut() { hover.value = false; cursorLabel.value = '' }

function onScroll() {
  scrollY.value = window.scrollY
  navHidden.value = window.scrollY > lastScroll.value && window.scrollY > 80
  lastScroll.value = window.scrollY
  const doc = document.documentElement
  const sh = doc.scrollHeight - doc.clientHeight
  scrollProgress.value = sh > 0 ? (doc.scrollTop / sh) * 100 : 0
}

// Easter egg — click logo 3 times
const logoClicks = ref(0)
const showEasterEgg = ref(false)
let logoTimer: ReturnType<typeof setTimeout>

function onLogoClick() {
  logoClicks.value++
  clearTimeout(logoTimer)
  logoTimer = setTimeout(() => { logoClicks.value = 0 }, 1500)
  if (logoClicks.value >= 3) {
    logoClicks.value = 0
    showEasterEgg.value = true
    gsap.fromTo('.easter-egg', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
  }
}

function closeEasterEgg() {
  gsap.to('.easter-egg', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in', onComplete: () => { showEasterEgg.value = false } })
}

const navItems = [
  { path: '/', name: '首页' },
  { path: '/blog', name: '博客' },
  { path: '/library', name: '藏书阁' },
  { path: '/gallery', name: '图库' },
]
const activeIdx = ref(0)
watch(() => route.path, (p) => {
  activeIdx.value = navItems.findIndex(i => i.path === '/' ? p === '/' : p.startsWith(i.path))
  if (activeIdx.value < 0) activeIdx.value = 0
  mobileOpen.value = false
}, { immediate: true })

// SVG circle progress
const circleR = 18
const circleC = 2 * Math.PI * circleR
const circleOffset = computed(() => circleC - (scrollProgress.value / 100) * circleC)


watch(() => route.path, () => { cleanupInkDots() })

onMounted(() => {
  
  // Init theme — 默认亮色，跟随系统偏好
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const initTheme = saved || (systemDark ? 'dark' : 'light')
  applyTheme(initTheme)

  // Listen for system theme changes (only if user hasn't set a preference)
  if (!saved) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      applyTheme(e.matches ? 'dark' : 'light')
    })
  }

  // Loading sequence — 等待页面资源加载完成
  if (prefersReducedMotion()) {
    showLoader.value = false; loaded.value = true
  } else {
    // 等待所有图片加载完成
    const waitForImages = () => {
      const images = document.querySelectorAll('img')
      const promises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise<void>(resolve => {
          img.onload = () => resolve()
          img.onerror = () => resolve()
        })
      })
      return Promise.all(promises)
    }

    // 最少显示 2.5 秒（保证动画完整），最多 5 秒
    const minTime = new Promise(r => setTimeout(r, 2500))
    const maxTime = new Promise(r => setTimeout(r, 5000))

    Promise.race([
      Promise.all([waitForImages(), minTime]),
      maxTime
    ]).then(() => {
      const loaderTl = gsap.timeline({
        onComplete: () => {
          showLoader.value = false; loaded.value = true
          gsap.fromTo('.nav-brand', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 })
          nextTick(() => {
            document.querySelectorAll('.nav-link').forEach(el => initMagnetic(el as HTMLElement, { strength: 0.2 }))
          })
        }
      })
      loaderTl
        .fromTo('.loader-char', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, 0)
        .to('.loader-char', { opacity: 0, y: -20, duration: 0.4, stagger: 0.03, ease: 'power2.in' }, 1.5)
        .to('.loader-screen', { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 2.0)
    })
  }

// Scroll color transitions removed — was overriding theme CSS variables

  if (window.innerWidth > 768 && !prefersReducedMotion()) {
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    tick()
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMove)
  document.removeEventListener('mouseover', onOver)
  document.removeEventListener('mouseout', onOut)
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="site grain" :class="{ loaded }">

    <!-- Theme switch overlay -->
    <div ref="themeOverlay" class="theme-overlay" aria-hidden="true"></div>



    <!-- LOADING SCREEN -->
    <div v-if="showLoader" class="loader-screen">
      <div class="loader-brand">
        <span v-for="(ch, i) in 'LOUXILOU'.split('')" :key="i" class="loader-char">{{ ch }}</span>
      </div>
    </div>

    <!-- CIRCULAR SCROLL PROGRESS — click to scroll to top -->
    <div v-if="!isReader" class="progress-ring interactive" @click="lenisScrollTo(0)" title="回到顶部">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" :r="circleR" fill="none" stroke="var(--border)" stroke-width="1.5" />
        <circle cx="22" cy="22" :r="circleR" fill="none" stroke="#9F353A" stroke-width="1.5"
          stroke-linecap="round" :stroke-dasharray="circleC" :stroke-dashoffset="circleOffset"
          transform="rotate(-90 22 22)" style="transition: stroke-dashoffset 0.1s linear" />
      </svg>
      <span class="progress-pct">{{ Math.round(scrollProgress) }}</span>
    </div>

    <!-- CONTEXTUAL CURSOR -->
    <div class="cur-wrap">
      <div ref="ring" class="cur-ring" :class="{ hover, label: cursorLabel }">
        <span v-if="cursorLabel" class="cur-label">{{ cursorLabel }}</span>
      </div>
      <div ref="dot" class="cur-dot" :class="{ hover }"></div>
    </div>

    <!-- NAV -->
    <nav v-if="!isReader" class="nav" :class="{ hidden: navHidden }">
      <div class="nav-shell">
        <router-link to="/" class="nav-brand interactive" @click.prevent="onLogoClick(); router.push('/')">
          <span class="logo-glyph">楼</span>
          <span class="logo-text">LOUXILOU</span>
        </router-link>
        <div class="nav-links">
          <router-link v-for="(item, i) in navItems" :key="item.path" :to="item.path"
            class="nav-link interactive" :class="{ active: activeIdx === i }">
            <span class="link-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="link-name">{{ item.name }}</span>
          </router-link>
        </div>
        <button class="theme-toggle interactive" @click="toggleTheme()" :title="theme === 'light' ? '切换暗色' : '切换亮色'">
          <svg v-if="theme === 'light'" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
        <div v-if="!authLoading" class="nav-user">
          <button v-if="user" class="user-btn interactive" @click="showProfile = true" :title="getDisplayName()">
            <span class="user-avatar">{{ getDisplayName().charAt(0).toUpperCase() }}</span>
          </button>
          <button v-else class="user-btn interactive" @click="showAuthModal = true" title="登录">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
        <button class="nav-burger" :class="{ open: mobileOpen }" @click="mobileOpen = !mobileOpen">
          <span></span><span></span>
        </button>
      </div>
      <Transition name="mob">
        <div v-if="mobileOpen" class="nav-mobile">
          <router-link v-for="(item, i) in navItems" :key="item.path" :to="item.path" class="mob-link">
            <span class="mob-num">{{ String(i + 1).padStart(2, '0') }}</span>
            {{ item.name }}
          </router-link>
        </div>
      </Transition>
    </nav>

    <!-- EASTER EGG -->
    <Transition name="egg">
      <div v-if="showEasterEgg" class="easter-egg" @click.self="closeEasterEgg">
        <div class="egg-card">
          <p class="egg-text">恭喜我的朋友！</p>
          <p class="egg-sub">你找到了我给你埋下的一个小彩蛋！<br>虽然我忘记了你的生日。。。<br>但还是祝你生日快乐！</p>
          <span class="egg-sig">— LOUXILOU</span>
        </div>
      </div>
    </Transition>

    <!-- CONTENT -->
    <main class="main">
      <RouterView v-slot="{ Component, route: r }">
        <Transition name="page" mode="out-in">
          <div :key="r.path" class="page-wrap">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </main>

    <!-- FOOTER -->
    <footer v-if="!isReader" class="foot">
      <div class="foot-inner">
        <div class="foot-brand">
          <span class="foot-logo">LOUXILOU</span>
          <span class="foot-sub">文章 · 阅读 · 摄影</span>
        </div>
        <div class="foot-rule"></div>
        <div class="foot-links">
          <a href="https://github.com/yywyboy" target="_blank" class="foot-link interactive">GitHub</a>
          <a href="https://space.bilibili.com/603244446" target="_blank" class="foot-link interactive">Bilibili</a>
          <router-link to="/friends" class="foot-link interactive">友链</router-link>
          <a href="/feed.xml" target="_blank" class="foot-link interactive">RSS</a>
        </div>
        <span class="foot-copy">© 2026</span>
      </div>
    </footer>

    <AuthModal :visible="showAuthModal" @close="showAuthModal = false" />
    <UserProfile :visible="showProfile" @close="showProfile = false" />
  </div>
</template>

<style>

/* 全局防止横向滚动 */
html, body { overflow-x: hidden; }

/* ===== THEME OVERLAY ===== */
.theme-overlay { position: fixed; inset: 0; z-index: 99990; pointer-events: none; display: none; opacity: 0; }

/* ===== LOADING SCREEN ===== */
.loader-screen { position: fixed; inset: 0; z-index: 99998; background: var(--bg); display: flex; align-items: center; justify-content: center; }
.loader-brand { display: flex; gap: 0; }
.loader-char { font-family: var(--font-display); font-size: clamp(2rem, 6vw, 4rem); font-weight: 900; letter-spacing: 0.12em; color: var(--gold); opacity: 0; }

/* ===== CIRCULAR PROGRESS ===== */
.progress-ring { position: fixed; bottom: 2rem; right: 2rem; z-index: 1000; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s; }
.progress-ring:hover { transform: scale(1.1); }
.progress-ring svg { position: absolute; top: 0; left: 0; }
@media (max-width: 900px) { .progress-ring { display: none; } }
.progress-pct { font-family: var(--font-mono); font-size: 0.55rem; color: var(--ink-ghost); letter-spacing: 0.05em; }

/* ===== CONTEXTUAL CURSOR ===== */
.cur-wrap { position: fixed; inset: 0; pointer-events: none; z-index: 99999; }
.cur-ring { position: fixed; top: 0; left: 0; width: 40px; height: 40px; border: 1px solid var(--gold); border-radius: 50%; pointer-events: none; opacity: 0.35; display: flex; align-items: center; justify-content: center; transition: width 0.4s var(--ease), height 0.4s var(--ease), opacity 0.3s, border-color 0.3s, border-radius 0.3s; }
.cur-ring.hover { width: 56px; height: 56px; opacity: 0.6; border-color: var(--gold-light); }
.cur-ring.label { width: 72px; height: 72px; border-radius: 50%; border-color: var(--gold); opacity: 0.5; }
.cur-label { font-family: var(--font-sans); font-size: 0.6rem; font-weight: 500; color: var(--gold); letter-spacing: 0.08em; white-space: nowrap; }
.cur-dot { position: fixed; top: 0; left: 0; width: 6px; height: 6px; background: var(--gold); border-radius: 50%; pointer-events: none; }

/* ===== INK TRAIL ===== */
.ink-dot {
  position: fixed;
  width: 4px; height: 4px;
  background: var(--gold);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  opacity: 0.25;
  transform: scale(1);
}

/* ===== EASTER EGG ===== */
.easter-egg {
  position: fixed; inset: 0; z-index: 99997;
  background: rgba(var(--bg-rgb),0.9);
  backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.egg-card {
  max-width: 420px; text-align: center; padding: 3rem;
}
.egg-text {
  font-family: var(--font-display);
  font-size: 1.3rem; font-weight: 600;
  color: var(--gold);
  margin-bottom: 1.5rem;
}
.egg-sub {
  font-size: 0.9rem; color: var(--ink-dim);
  line-height: 2; margin-bottom: 2rem;
}
.egg-sig {
  font-family: var(--font-display);
  font-size: 0.8rem; color: var(--ink-ghost);
  letter-spacing: 0.15em;
}
.egg-enter-active { transition: opacity 0.4s ease; }
.egg-leave-active { transition: opacity 0.3s ease; }
.egg-enter-from, .egg-leave-to { opacity: 0; }

/* ===== NAV ===== */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 1rem 1.5rem 0; transition: transform 0.5s var(--ease); }
.nav.hidden { transform: translateY(calc(-100% - 2rem)); }
.nav-shell { max-width: 900px; margin: 0 auto; height: 52px; display: flex; align-items: center; gap: 0.25rem; padding: 0 0.75rem; background: var(--bg-card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: var(--r-full); box-shadow: 0 4px 30px var(--shadow); }
.nav-brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; flex: 1; min-width: 0; }
.logo-glyph { font-family: var(--font-body); font-size: 1.15rem; font-weight: 700; color: var(--gold); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: var(--gold-dim); border-radius: 50%; }
.logo-text { font-family: var(--font-display); font-size: 0.82rem; font-weight: 600; color: var(--ink); letter-spacing: 0.15em; }
.nav-links { display: flex; gap: 0; }
.nav-link { position: relative; display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1.1rem; text-decoration: none; transition: all 0.3s; border-radius: var(--r-full); }
.nav-link:hover { background: var(--gold-dim); }
.nav-link.active { background: var(--gold-dim); }
.link-num { font-family: var(--font-mono); font-size: 0.58rem; font-weight: 300; color: var(--ink-vanish); transition: color 0.3s; }
.nav-link.active .link-num { color: var(--gold); }
.link-name { font-family: var(--font-sans); font-size: 0.72rem; font-weight: 500; color: var(--ink-ghost); letter-spacing: 0.05em; transition: color 0.3s; }
.nav-link:hover .link-name { color: var(--ink); }
.nav-link.active .link-name { color: var(--gold); }
.nav-burger { display: none; flex-direction: column; align-items: center; justify-content: center; gap: 4px; width: 36px; height: 36px; border-radius: 50%; transition: background 0.3s; }
.nav-burger:hover { background: var(--gold-dim); }
.nav-burger span { display: block; width: 16px; height: 1.5px; background: var(--ink); transition: all 0.3s var(--ease); transform-origin: center; }
.nav-burger.open span:first-child { transform: rotate(45deg) translate(2px, 2px); }
.nav-burger.open span:last-child { transform: rotate(-45deg) translate(2px, -2px); }
.theme-toggle { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; color: var(--ink-ghost); transition: all 0.3s; flex-shrink: 0; }
.theme-toggle:hover { color: var(--gold); background: var(--gold-dim); }

/* User button */
.nav-user { flex-shrink: 0; }
.user-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; color: var(--ink-ghost); transition: all 0.3s; cursor: pointer; background: none; border: none; }
.user-btn:hover { color: var(--gold); background: var(--gold-dim); }
.user-avatar { width: 26px; height: 26px; border-radius: 50%; background: var(--gold); color: #fff; display: flex; align-items: center; justify-content: center; font-family: var(--font-sans); font-size: 0.7rem; font-weight: 600; }
.nav-mobile { max-width: 900px; margin: 0.5rem auto 0; padding: 0.75rem; background: var(--bg-card); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: var(--r-xl); box-shadow: 0 4px 30px var(--shadow); }
.mob-link { display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1rem; font-family: var(--font-sans); font-size: 0.82rem; font-weight: 500; color: var(--ink-dim); text-decoration: none; border-radius: 10px; transition: all 0.3s; }
.mob-link:hover { color: var(--gold); background: var(--gold-dim); }
.mob-num { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ink-vanish); }
.mob-enter-active, .mob-leave-active { transition: all 0.3s var(--ease); }
.mob-enter-from, .mob-leave-to { opacity: 0; transform: translateY(-8px) scale(0.98); }

/* ===== MAIN ===== */
.main { min-height: 100vh; padding-top: var(--nav-h); position: relative; z-index: 1; }
.page-wrap { width: 100%; }
.page-enter-active { transition: opacity 0.4s ease, transform 0.4s ease, clip-path 0.5s ease; }
.page-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.page-enter-from { opacity: 0; transform: translateY(16px); clip-path: circle(0% at 50% 50%); }
.page-leave-to { opacity: 0; transform: translateY(-10px); }

/* ===== FOOTER ===== */
.foot { border-top: 1px solid var(--border); margin-top: 8rem; }
.foot-inner { max-width: 1200px; margin: 0 auto; padding: 4rem 2.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
.foot-brand { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
.foot-logo { font-family: var(--font-display); font-size: 1rem; font-weight: 700; letter-spacing: 0.2em; color: var(--gold); }
.foot-sub { font-size: 0.72rem; color: var(--ink-ghost); letter-spacing: 0.25em; }
.foot-rule { width: 32px; height: 1px; background: var(--gold-dim); }

/* ===== MOBILE NAV ===== */
@media (max-width: 768px) {
  .nav { padding: 0.5rem 0.75rem 0; }
  .nav-shell { padding: 0 0.5rem; height: 48px; gap: 0.25rem; }
  .nav-links { display: none; }
  .nav-burger { display: flex; }
  .cur-wrap { display: none; }
  .theme-toggle { width: 36px; height: 36px; }
  .logo-glyph { width: 28px; height: 28px; font-size: 1rem; }
  .logo-text { font-size: 0.75rem; }
  .foot-inner { padding: 3rem 1.25rem; }
}
.foot-links { display: flex; gap: 2.5rem; }
.foot-link { font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.3s; position: relative; text-decoration: none; }
.foot-link::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 0; height: 1px; background: var(--gold); transition: width 0.3s var(--ease); }
.foot-link:hover { color: var(--gold); }
.foot-link:hover::after { width: 100%; }
.foot-copy { font-size: 0.65rem; color: var(--ink-vanish); margin-top: 0.5rem; }



</style>