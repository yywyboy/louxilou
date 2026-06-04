<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'

const route = useRoute()
const isReader = computed(() => route.name === 'BookReader')
const loaded = ref(false)
const scrollY = ref(0)
const navHidden = ref(false)
const lastScroll = ref(0)
const mobileOpen = ref(false)

// Cursor
const ring = ref<HTMLElement | null>(null)
const dot = ref<HTMLElement | null>(null)
const hover = ref(false)
let cx = 0, cy = 0, tx = 0, ty = 0, raf: number

function tick() {
  cx += (tx - cx) * 0.1
  cy += (ty - cy) * 0.1
  if (ring.value) ring.value.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`
  if (dot.value) dot.value.style.transform = `translate(${tx - 3}px, ${ty - 3}px)`
  raf = requestAnimationFrame(tick)
}

function onMove(e: MouseEvent) { tx = e.clientX; ty = e.clientY }
function onOver(e: MouseEvent) { if ((e.target as HTMLElement).closest('a,button,.interactive')) hover.value = true }
function onOut() { hover.value = false }
function onScroll() {
  scrollY.value = window.scrollY
  navHidden.value = window.scrollY > lastScroll.value && window.scrollY > 80
  lastScroll.value = window.scrollY
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

// Page transitions - use CSS to avoid Vue 3 mode="out-in" + JS hooks bug

onMounted(() => {
  setTimeout(() => {
    loaded.value = true
    gsap.fromTo('.nav-brand', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 })
    gsap.fromTo('.nav-item', { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.3 })
  }, 50)

  if (window.innerWidth > 768) {
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
    <!-- Cursor -->
    <div class="cur-wrap">
      <div ref="ring" class="cur-ring" :class="{ hover }"></div>
      <div ref="dot" class="cur-dot" :class="{ hover }"></div>
    </div>

    <!-- Nav -->
    <nav v-if="!isReader" class="nav" :class="{ hidden: navHidden }">
      <div class="nav-shell">
        <router-link to="/" class="nav-logo interactive">
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

    <!-- Content -->
    <main class="main">
      <RouterView v-slot="{ Component, route: r }">
        <Transition name="page" mode="out-in">
          <div :key="r.path" class="page-wrap">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer v-if="!isReader" class="foot">
      <div class="foot-inner">
        <div class="foot-brand">
          <span class="foot-logo">LOUXILOU</span>
          <span class="foot-sub">藏书 · 写作 · 影像</span>
        </div>
        <div class="foot-rule"></div>
        <div class="foot-links">
          <a href="https://github.com/yywyboy" target="_blank" class="foot-link interactive">GitHub</a>
          <a href="https://space.bilibili.com/603244446" target="_blank" class="foot-link interactive">Bilibili</a>
        </div>
        <span class="foot-copy">© 2024</span>
      </div>
    </footer>
  </div>
</template>

<style>
/* ===== CURSOR ===== */
.cur-wrap { position: fixed; inset: 0; pointer-events: none; z-index: 99999; }
.cur-ring {
  position: fixed; top: 0; left: 0;
  width: 40px; height: 40px;
  border: 1px solid var(--gold);
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
  opacity: 0.35;
  transition: width 0.4s var(--ease), height 0.4s var(--ease), opacity 0.3s, border-color 0.3s;
}
.cur-ring.hover { width: 64px; height: 64px; opacity: 0.6; border-color: var(--gold-light); }
.cur-dot {
  position: fixed; top: 0; left: 0;
  width: 6px; height: 6px;
  background: var(--gold);
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
}

/* ===== NAV ===== */
.nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 1rem 1.5rem 0;
  transition: transform 0.5s var(--ease);
}
.nav.hidden { transform: translateY(calc(-100% - 2rem)); }

.nav-shell {
  max-width: 900px; margin: 0 auto;
  height: 52px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 0.5rem 0 1.25rem;
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 100px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.4);
}

.nav-logo {
  display: flex; align-items: center; gap: 0.6rem;
  text-decoration: none;
}
.logo-glyph {
  font-family: var(--font-body);
  font-size: 1.15rem; font-weight: 700;
  color: var(--gold);
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: var(--gold-dim);
  border-radius: 50%;
}
.logo-text {
  font-family: var(--font-display);
  font-size: 0.82rem; font-weight: 600;
  color: var(--ink);
  letter-spacing: 0.15em;
}

.nav-links { display: flex; gap: 0; }
.nav-link {
  position: relative;
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  text-decoration: none;
  transition: all 0.3s;
  border-radius: 100px;
}
.nav-link:hover { background: rgba(255,255,255,0.04); }
.nav-link.active { background: var(--gold-dim); }
.link-num {
  font-family: var(--font-mono);
  font-size: 0.58rem; font-weight: 300;
  color: var(--ink-vanish);
  transition: color 0.3s;
}
.nav-link.active .link-num { color: var(--gold); }
.link-name {
  font-family: var(--font-sans);
  font-size: 0.72rem; font-weight: 500;
  color: var(--ink-ghost);
  letter-spacing: 0.05em;
  transition: color 0.3s;
}
.nav-link:hover .link-name { color: var(--ink); }
.nav-link.active .link-name { color: var(--gold); }

.nav-burger {
  display: none; flex-direction: column; gap: 5px; padding: 10px 14px;
  border-radius: 100px;
  transition: background 0.3s;
}
.nav-burger:hover { background: rgba(255,255,255,0.04); }
.nav-burger span {
  display: block; width: 18px; height: 1.5px;
  background: var(--ink); transition: all 0.3s var(--ease); transform-origin: center;
}
.nav-burger.open span:first-child { transform: rotate(45deg) translate(2.5px, 2.5px); }
.nav-burger.open span:last-child { transform: rotate(-45deg) translate(2.5px, -2.5px); }

.nav-mobile {
  max-width: 900px; margin: 0.5rem auto 0;
  padding: 0.75rem;
  background: rgba(20, 20, 20, 0.92);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.4);
}
.mob-link {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.65rem 1rem;
  font-family: var(--font-sans); font-size: 0.82rem; font-weight: 500;
  color: var(--ink-dim); text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s;
}
.mob-link:hover { color: var(--gold); background: var(--gold-dim); }
.mob-num { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ink-vanish); }
.mob-enter-active, .mob-leave-active { transition: all 0.3s var(--ease); }
.mob-enter-from, .mob-leave-to { opacity: 0; transform: translateY(-8px) scale(0.98); }

/* ===== MAIN ===== */
.main { min-height: 100vh; padding-top: var(--nav-h); position: relative; z-index: 1; overflow: hidden; }
.page-wrap { width: 100%; }
.page-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.page-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.page-enter-from { opacity: 0; transform: translateY(20px); }
.page-leave-to { opacity: 0; transform: translateY(-12px); }

/* ===== FOOTER ===== */
.foot { border-top: 1px solid var(--border); margin-top: 8rem; }
.foot-inner {
  max-width: 1200px; margin: 0 auto; padding: 4rem 2.5rem;
  display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center;
}
.foot-brand { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
.foot-logo {
  font-family: var(--font-display); font-size: 1rem; font-weight: 700;
  letter-spacing: 0.2em; color: var(--gold);
}
.foot-sub { font-size: 0.72rem; color: var(--ink-ghost); letter-spacing: 0.25em; }
.foot-rule { width: 32px; height: 1px; background: var(--gold-dim); }
.foot-links { display: flex; gap: 2.5rem; }
.foot-link {
  font-family: var(--font-sans); font-size: 0.72rem;
  color: var(--ink-ghost); letter-spacing: 0.06em;
  text-transform: uppercase; transition: color 0.3s;
  position: relative;
}
.foot-link::after {
  content: ''; position: absolute; bottom: -3px; left: 0;
  width: 0; height: 1px; background: var(--gold); transition: width 0.3s var(--ease);
}
.foot-link:hover { color: var(--gold); }
.foot-link:hover::after { width: 100%; }
.foot-copy { font-size: 0.65rem; color: var(--ink-vanish); margin-top: 0.5rem; }

@media (max-width: 768px) {
  .nav { padding: 0.75rem 1rem 0; }
  .nav-shell { padding: 0 0.5rem 0 1rem; height: 48px; }
  .nav-links { display: none; }
  .nav-burger { display: flex; }
  .cur-wrap { display: none; }
  .foot-inner { padding: 3rem 1.25rem; }
}
</style>