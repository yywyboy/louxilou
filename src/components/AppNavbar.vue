<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  hidden: boolean
  theme: 'light' | 'dark'
  isReader: boolean
}>()
const emit = defineEmits<{
  toggleTheme: []
  logoClick: []
}>()

const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)

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

function onLogoClick() {
  emit('logoClick')
  router.push('/')
}
</script>

<template>
  <nav v-if="!isReader" class="nav" :class="{ hidden }">
    <div class="nav-shell">
      <router-link to="/" class="nav-brand interactive" @click.prevent="onLogoClick">
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
      <button class="theme-toggle interactive" @click="emit('toggleTheme')" :title="theme === 'light' ? '切换暗色' : '切换亮色'">
        <svg v-if="theme === 'light'" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg v-else viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
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
        <button class="mob-link" @click="emit('toggleTheme')" style="border:none;cursor:pointer;width:100%;text-align:left">
          <span class="mob-num">☀</span>
          {{ theme === 'light' ? '切换暗色' : '切换亮色' }}
        </button>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; height: var(--nav-h); transition: transform 0.4s var(--ease); }
.nav.hidden { transform: translateY(-100%); }
.nav-shell { max-width: 1200px; margin: 0 auto; padding: 0 2rem; height: 100%; display: flex; align-items: center; justify-content: space-between; }
.nav-brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
.logo-glyph { font-family: var(--font-display); font-size: 1.5rem; font-weight: 900; color: var(--gold); }
.logo-text { font-family: var(--font-sans); font-size: 0.7rem; letter-spacing: 0.25em; color: var(--ink-dim); text-transform: uppercase; }
.nav-links { display: flex; gap: 0.25rem; }
.nav-link { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.75rem; text-decoration: none; font-size: 0.82rem; color: var(--ink-dim); border-radius: var(--r-sm); transition: all 0.25s; }
.nav-link:hover { color: var(--ink); }
.nav-link.active { color: var(--gold); }
.link-num { font-family: var(--font-mono); font-size: 0.6rem; opacity: 0.5; }
.link-name { font-family: var(--font-body); }
.theme-toggle { background: none; border: none; color: var(--ink-dim); cursor: pointer; padding: 0.4rem; border-radius: var(--r-sm); transition: color 0.25s; display: flex; align-items: center; }
.theme-toggle:hover { color: var(--ink); }
.nav-burger { display: none; background: none; border: none; cursor: pointer; width: 28px; height: 20px; position: relative; flex-direction: column; justify-content: center; gap: 6px; }
.nav-burger span { display: block; width: 100%; height: 1.5px; background: var(--ink); transition: all 0.3s; }
.nav-burger.open span:first-child { transform: rotate(45deg) translate(3px, 3px); }
.nav-burger.open span:last-child { transform: rotate(-45deg) translate(3px, -3px); }
.nav-mobile { display: none; }
@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-burger { display: flex; }
  .nav-mobile { position: absolute; top: var(--nav-h); left: 0; right: 0; background: var(--bg-card); border-bottom: 1px solid var(--border); padding: 1rem 2rem; display: flex; flex-direction: column; gap: 0.25rem; }
  .mob-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0; text-decoration: none; color: var(--ink); font-size: 0.9rem; font-family: var(--font-body); }
  .mob-num { font-family: var(--font-mono); font-size: 0.65rem; color: var(--ink-ghost); width: 1.5rem; }
}
.mob-enter-active, .mob-leave-active { transition: all 0.3s var(--ease); }
.mob-enter-from, .mob-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
